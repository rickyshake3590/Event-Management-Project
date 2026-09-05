import clsx from "clsx";

export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="mb-6 flex items-center" aria-label="Progress">
      {steps.map((step, i) => {
        const status = i < current ? "complete" : i === current ? "current" : "upcoming";
        return (
          <li key={step} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={clsx(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                  status === "complete" && "bg-primary-600 text-white",
                  status === "current" && "border-2 border-primary-600 text-primary-700 dark:text-primary-300",
                  status === "upcoming" && "border-2 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500"
                )}
                aria-current={status === "current" ? "step" : undefined}
              >
                {status === "complete" ? "✓" : i + 1}
              </div>
              <span
                className={clsx(
                  "text-xs font-medium",
                  status === "upcoming" ? "text-gray-400 dark:text-gray-500" : "text-gray-700 dark:text-gray-300"
                )}
              >
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={clsx(
                  "mx-2 h-0.5 flex-1",
                  i < current ? "bg-primary-600" : "bg-gray-200 dark:bg-gray-700"
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
