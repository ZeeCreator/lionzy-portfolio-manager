
import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  label: string;
  value: number;
  color?: string;
  showPercentage?: boolean;
}

export function ProgressBar({ label, value, color = "primary", showPercentage = true }: ProgressBarProps) {
  return (
    <div className="space-y-2 animate-fade-in">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {showPercentage && (
          <span className="text-sm text-muted-foreground">{value}%</span>
        )}
      </div>
      <Progress value={value} className="h-2" />
    </div>
  );
}
