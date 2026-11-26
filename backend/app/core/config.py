from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    environment: str = "development"

    database_url: str
    redis_url: str
    dashboard_cache_ttl_seconds: int = 60

    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    ai_provider: str = "openai"
    ai_api_key: str | None = None
    ai_model_name: str = "gpt-4o-mini"
    ai_api_base_url: str = "https://api.openai.com/v1/chat/completions"
    ai_max_concurrent_requests: int = 5
    ai_semaphore_timeout_seconds: float = 10.0
    ai_request_timeout_seconds: float = 30.0
    ai_max_attempts: int = 2

    frontend_origin: str = "http://localhost:3000"

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=False, extra="ignore")


settings = Settings()
