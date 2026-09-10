import { useEffect, useRef } from "react";
import { formatDateTime } from "@/utils/format";
import type { EventRecord } from "@/types";

interface CommentHistoryProps {
  event: EventRecord;
}

export function CommentHistory({ event }: CommentHistoryProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [event.comments]);

  if (event.comments.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-4 text-center text-sm text-gray-500 dark:text-gray-400">
        No comments yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Comment History</h3>
      <div className="max-h-96 overflow-y-auto space-y-3">
        {event.comments.map((comment) => (
          <div
            key={comment.id}
            className={`rounded-lg border p-3 ${
              comment.type === "clarification"
                ? "border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-l-yellow-500"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            }`}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {comment.authorName}
                </span>
                <span className="rounded-full bg-gray-200 dark:bg-gray-700 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-400">
                  {comment.authorRole}
                </span>
                {comment.type === "clarification" && (
                  <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">
                    Clarification Request
                  </span>
                )}
              </div>
              <span
                className="text-xs text-gray-500 dark:text-gray-400 hover:underline cursor-help"
                title={formatDateTime(comment.timestamp)}
              >
                {getRelativeTime(comment.timestamp)}
              </span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">{comment.message}</p>
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
}

function getRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
