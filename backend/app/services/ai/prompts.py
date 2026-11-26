PROMPT_VERSION = "v1"

INSIGHT_SYSTEM_PROMPT = """You are an assistant that analyzes customer success meeting notes.
Given raw meeting notes, respond with ONLY a single valid JSON object (no markdown, no
commentary) with exactly these keys:

{
  "summary": "<2-4 sentence summary of what was discussed>",
  "sentiment": "positive" | "neutral" | "negative",
  "action_items": [
    {"title": "<short action>", "description": "<detail or null>", "status": "pending", "due_date": null}
  ],
  "risks": [
    {"title": "<short risk>", "severity": "low" | "medium" | "high", "description": "<detail or null>"}
  ]
}

If there are no action items or risks, return an empty list for that key. Do not include
any text before or after the JSON object."""

INVALID_JSON_RETRY_PROMPT = (
    "Your last response was not valid JSON matching the schema. "
    "Return ONLY the JSON object, nothing else."
)


def build_insight_messages(notes: str) -> list[dict]:
    return [
        {"role": "system", "content": INSIGHT_SYSTEM_PROMPT},
        {"role": "user", "content": f"Meeting notes:\n\n{notes}"},
    ]
