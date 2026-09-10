import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { EventRecord, User } from "@/types";

interface ClarificationRequestFormProps {
  event: EventRecord;
  currentUser: User;
  onSubmit: (message: string) => void;
}

export function ClarificationRequestForm({
  event,
  currentUser,
  onSubmit,
}: ClarificationRequestFormProps) {
  const [messageText, setMessageText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isAssignedCoordinator =
    currentUser.role === "coordinator" && event.coordinatorId === currentUser.id;
  const isTerminalStatus = ["cancelled", "completed", "rejected"].includes(
    event.status
  );
  const canShowForm = isAssignedCoordinator && !isTerminalStatus;

  if (!canShowForm) {
    return null;
  }

  const trimmedMessage = messageText.trim();
  const isValid = trimmedMessage.length > 0;
  const charCount = messageText.length;
  const maxChars = 200;

  const handleSubmit = async () => {
    if (!isValid) {
      setErrorMessage("Cannot submit empty message.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      onSubmit(trimmedMessage);
      setMessageText("");
    } catch {
      setErrorMessage("Failed to submit clarification request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= maxChars) {
      setMessageText(text);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
      <h3 className="mb-3 font-semibold text-gray-900 dark:text-gray-100">
        Request Clarification or Amendment
      </h3>

      <textarea
        value={messageText}
        onChange={handleTextChange}
        placeholder="What information do you need clarified?"
        className="mb-2 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        rows={4}
      />

      <div className="mb-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{charCount}/{maxChars} characters</span>
      </div>

      {errorMessage && (
        <div className="mb-3 text-sm text-danger-600 dark:text-danger-400">
          ⚠ {errorMessage}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          onClick={handleSubmit}
          disabled={!isValid || isSubmitting}
          className={isSubmitting ? "opacity-50" : ""}
        >
          {isSubmitting ? "Sending..." : "Send Request"}
        </Button>
      </div>
    </div>
  );
}
