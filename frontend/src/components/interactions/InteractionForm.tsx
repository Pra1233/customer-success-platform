"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import type { Interaction, InteractionCreatePayload, InteractionType } from "@/types/interaction";

interface InteractionFormProps {
  mode: "create" | "edit";
  customerId?: string;
  initial?: Interaction;
  isSubmitting: boolean;
  onSubmit: (payload: InteractionCreatePayload) => void;
}

const TYPE_OPTIONS: InteractionType[] = ["call", "email", "meeting"];

function toLocalDatetimeInput(iso?: string): string {
  const date = iso ? new Date(iso) : new Date();
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export function InteractionForm({
  mode,
  customerId,
  initial,
  isSubmitting,
  onSubmit,
}: InteractionFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [type, setType] = useState<InteractionType>(initial?.type ?? "call");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [interactionDate, setInteractionDate] = useState(
    toLocalDatetimeInput(initial?.interaction_date)
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({
      customer_id: customerId ?? initial!.customer_id,
      title: title || undefined,
      type,
      notes,
      interaction_date: new Date(interactionDate).toISOString(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input id="title" label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Select
        id="type"
        label="Type"
        className="capitalize"
        value={type}
        onChange={(e) => setType(e.target.value as InteractionType)}
        required
      >
        {TYPE_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </Select>
      <Input
        id="interaction_date"
        label="Date"
        type="datetime-local"
        value={interactionDate}
        onChange={(e) => setInteractionDate(e.target.value)}
        required
      />
      <Textarea
        id="notes"
        label="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={6}
        required
        placeholder="What was discussed in this meeting/call/email..."
      />
      <Button type="submit" isLoading={isSubmitting}>
        {mode === "create" ? "Log interaction" : "Save changes"}
      </Button>
    </form>
  );
}
