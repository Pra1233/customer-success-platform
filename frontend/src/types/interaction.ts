import type { Sentiment } from "@/types/insight";

export type InteractionType = "call" | "email" | "meeting";

export interface Interaction {
  id: string;
  customer_id: string;
  created_by: string;
  title: string | null;
  type: InteractionType;
  notes: string;
  interaction_date: string;
  created_at: string;
  updated_at: string;
  customer_name: string | null;
  customer_company: string | null;
  sentiment: Sentiment | null;
}

export interface InteractionCreatePayload {
  customer_id: string;
  title?: string;
  type: InteractionType;
  notes: string;
  interaction_date: string;
}

export type InteractionUpdatePayload = Partial<
  Omit<InteractionCreatePayload, "customer_id">
>;

export interface InteractionFilters {
  customer_id?: string;
  type?: InteractionType;
  sentiment?: Sentiment;
  search?: string;
  date_from?: string;
  date_to?: string;
  offset?: number;
  limit?: number;
}
