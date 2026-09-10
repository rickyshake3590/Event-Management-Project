import { formatDateTime } from "@/utils/format";
import type { EventRecord } from "@/types";

interface ClarificationIndicatorProps {
  event: EventRecord;
}

export function ClarificationIndicator({ event }: ClarificationIndicatorProps) {
  if (!event.requestingClarification) {
    return null;
  }

  const clarificationComment = event.comments.find((c) => c.type === "clarification");
  const clarificationDate = clarificationComment
    ? new Date(clarificationComment.timestamp).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "earlier";

  return (
    <div className="mb-4 inline-block rounded-full bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1.5 text-sm font-medium text-yellow-800 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/40 cursor-help transition-colors"
      title={`You requested a clarification on ${clarificationDate}. The Organiser will review and respond.`}>
      ⏳ Awaiting Organiser's Response
    </div>
  );
}
