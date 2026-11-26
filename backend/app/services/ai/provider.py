import json
import logging
import threading
from abc import ABC, abstractmethod

import httpx
from pydantic import ValidationError

from app.core.config import settings
from app.core.exceptions import ExternalServiceError
from app.schemas.insight import GeneratedInsight
from app.services.ai.prompts import INVALID_JSON_RETRY_PROMPT, build_insight_messages

logger = logging.getLogger(__name__)

_http_client = httpx.Client(
    timeout=settings.ai_request_timeout_seconds,
    limits=httpx.Limits(
        max_connections=settings.ai_max_concurrent_requests,
        max_keepalive_connections=settings.ai_max_concurrent_requests,
    ),
)


class AIProvider(ABC):
    @abstractmethod
    def generate(self, notes: str) -> GeneratedInsight:
        raise NotImplementedError


class OpenAIProvider(AIProvider):
    _semaphore = threading.BoundedSemaphore(settings.ai_max_concurrent_requests)

    def generate(self, notes: str) -> GeneratedInsight:
        if not settings.ai_api_key or settings.ai_api_key in ("sk-your-key-here", ""):
            raise ExternalServiceError("AI provider is not configured (missing API key)")

        if not self._semaphore.acquire(timeout=settings.ai_semaphore_timeout_seconds):
            raise ExternalServiceError("AI provider is busy, please try again shortly")

        try:
            return self._generate_with_retries(notes)
        finally:
            self._semaphore.release()

    def _generate_with_retries(self, notes: str) -> GeneratedInsight:
        messages = build_insight_messages(notes)

        last_error: Exception | None = None
        for attempt in range(1, settings.ai_max_attempts + 1):
            try:
                raw_content = self._call_api(messages)
                return self._parse(raw_content)
            except (json.JSONDecodeError, ValidationError) as exc:
                last_error = exc
                logger.warning("AI response failed to parse on attempt %s: %s", attempt, exc)
                messages.append({"role": "user", "content": INVALID_JSON_RETRY_PROMPT})
            except httpx.HTTPError as exc:
                logger.error("AI provider request failed: %s", exc)
                raise ExternalServiceError("AI provider request failed") from exc

        raise ExternalServiceError(
            f"AI provider returned unparsable output after {settings.ai_max_attempts} attempts"
        ) from last_error

    def _call_api(self, messages: list[dict]) -> str:
        response = _http_client.post(
            settings.ai_api_base_url,
            headers={"Authorization": f"Bearer {settings.ai_api_key}"},
            json={
                "model": settings.ai_model_name,
                "messages": messages,
                "temperature": 0.2,
                "response_format": {"type": "json_object"},
            },
        )
        response.raise_for_status()
        body = response.json()
        return body["choices"][0]["message"]["content"]

    @staticmethod
    def _parse(raw_content: str) -> GeneratedInsight:
        data = json.loads(raw_content)
        return GeneratedInsight.model_validate(data)
