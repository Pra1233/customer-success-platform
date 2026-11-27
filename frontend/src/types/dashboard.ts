export interface RecentInteraction {
  id: string;
  customer_id: string;
  customer_name: string;
  title: string | null;
  type: string;
  interaction_date: string;
}

export interface NegativeSentimentAlert {
  interaction_id: string;
  customer_id: string;
  customer_name: string;
  summary: string | null;
}

export interface SentimentTrendPoint {
  week: string;
  positive: number;
  neutral: number;
  negative: number;
}

export interface Dashboard {
  total_customers: number;
  total_interactions: number;
  customers_by_status: Record<string, number>;
  interactions_by_type: Record<string, number>;
  sentiment_breakdown: Record<string, number>;
  recent_interactions: RecentInteraction[];
  negative_sentiment_alerts: NegativeSentimentAlert[];
  sentiment_trend: SentimentTrendPoint[];
  customer_count_change_pct: number | null;
  interaction_count_change_pct: number | null;
}
