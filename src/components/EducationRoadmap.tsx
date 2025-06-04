
import { EducationItem } from "@/types";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CheckCircle, Circle } from "lucide-react";

interface EducationRoadmapProps {
  items: EducationItem[];
  showProgress?: boolean;
}

export function EducationRoadmap({ items, showProgress = true }: EducationRoadmapProps) {
  const categories = [...new Set(items.map(item => item.category))];

  return (
    <div className="space-y-8 animate-fade-in">
      {categories.map(category => (
        <div key={category} className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">{category}</h3>
          <div className="space-y-4">
            {items
              .filter(item => item.category === category)
              .map(item => (
                <div key={item.id} className="glass-card p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {item.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-grow space-y-2">
                      <h4 className="font-medium text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      {showProgress && !item.completed && (
                        <ProgressBar 
                          label="Progress" 
                          value={item.progress} 
                          showPercentage={true}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
