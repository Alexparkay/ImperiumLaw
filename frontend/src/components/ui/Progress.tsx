import * as React from "react";
import { cn } from "../../lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  indicatorClassName?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, indicatorClassName, ...props }, ref) => {
    // Ensure the value is between 0 and max
    const clampedValue = Math.max(0, Math.min(value, max));
    const percentage = (clampedValue / max) * 100;

    return (
      <div
        ref={ref}
        className={cn("relative h-2 w-full overflow-hidden rounded-full bg-gray-800", className)}
        {...props}
      >
        <div
          className={cn("h-full w-full flex-1 bg-blue-600 transition-all", indicatorClassName)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  }
);

Progress.displayName = "Progress";

export { Progress }; 