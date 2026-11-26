export type Sentiment = "positive" | "neutral" | "negative";
export type InsightStatus = "processing" | "success" | "failed";

export interface ActionItem {
  title: string;
  description: string | null;
  status: string;
  due_date: string | null;
}

export interface Risk {
  title: string;
  severity: string;
  description: string | null;
}

export interface Insight {
  id: string;
  interaction_id: string;
  summary: string | null;
  sentiment: Sentiment | null;
  action_items: ActionItem[] | null;
  risks: Risk[] | null;
  status: InsightStatus;
  error_message: string | null;
  model_name: string | null;
  created_at: string;
}
