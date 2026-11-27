from pydantic import BaseModel


class RecentInteraction(BaseModel):
    id: str
    customer_id: str
    customer_name: str
    title: str | None
    type: str
    interaction_date: str


class NegativeSentimentAlert(BaseModel):
    interaction_id: str
    customer_id: str
    customer_name: str
    summary: str | None


class SentimentTrendPoint(BaseModel):
    week: str
    positive: int = 0
    neutral: int = 0
    negative: int = 0


class DashboardOut(BaseModel):
    total_customers: int
    total_interactions: int
    customers_by_status: dict[str, int]
    interactions_by_type: dict[str, int]
    sentiment_breakdown: dict[str, int]
    recent_interactions: list[RecentInteraction]
    negative_sentiment_alerts: list[NegativeSentimentAlert]
    sentiment_trend: list[SentimentTrendPoint]
    customer_count_change_pct: float | None = None
    interaction_count_change_pct: float | None = None
