
import json
import logging

import redis

logger = logging.getLogger(__name__)


class CacheService:
    DASHBOARD_KEY_PREFIX = "dashboard"

    def __init__(self, client: redis.Redis) -> None:
        self._client = client

    def get_json(self, key: str) -> dict | list | None:
        try:
            raw = self._client.get(key)
        except redis.RedisError as exc:
            logger.warning("Redis GET failed for key=%s: %s", key, exc)
            return None
        if raw is None:
            return None
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            logger.warning("Corrupt cache value for key=%s, ignoring", key)
            return None

    def set_json(self, key: str, value: dict | list, *, ttl_seconds: int) -> None:
        try:
            self._client.set(key, json.dumps(value), ex=ttl_seconds)
        except redis.RedisError as exc:
            logger.warning("Redis SET failed for key=%s: %s", key, exc)

    def delete(self, *keys: str) -> None:
        if not keys:
            return
        try:
            self._client.delete(*keys)
        except redis.RedisError as exc:
            logger.warning("Redis DELETE failed for keys=%s: %s", keys, exc)

    def dashboard_key(self, owner_id: str | None) -> str:
        return f"{self.DASHBOARD_KEY_PREFIX}:{owner_id or 'all'}"

    def invalidate_dashboard(self, owner_id: str) -> None:

        self.delete(self.dashboard_key(owner_id), self.dashboard_key(None))
