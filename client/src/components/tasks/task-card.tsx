import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CalendarIcon,
  Trash2Icon,
  AlertCircle,
  AlertTriangle,
  Info,
} from "lucide-react";
import { format } from "date-fns";
import { Task } from "@shared/schema";
import { useTasks } from "@/hooks/use-tasks";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
}

type PriorityIconMap = {
  low: JSX.Element;
  medium: JSX.Element;
  high: JSX.Element;
}

export function TaskCard({ task }: TaskCardProps) {
  const { updateTask, deleteTask } = useTasks();

  const priorityIcons: PriorityIconMap = {
    low: <Info className="h-4 w-4 text-blue-500" />,
    medium: <AlertCircle className="h-4 w-4 text-yellow-500" />,
    high: <AlertTriangle className="h-4 w-4 text-red-500" />,
  };

  const priorityIcon = priorityIcons[task.priority as keyof PriorityIconMap];

  return (
    <Card
      className={cn(
        "transition-opacity",
        task.completed && "opacity-60"
      )}
    >
      <CardContent className="pt-6">
        <div className="flex items-start gap-2">
          <Checkbox
            checked={task.completed || false}
            onCheckedChange={(checked) =>
              updateTask({
                id: task.id,
                completed: checked === true,
              })
            }
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3
                className={cn(
                  "font-medium",
                  task.completed && "line-through"
                )}
              >
                {task.title}
              </h3>
              {priorityIcon}
            </div>
            {task.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {task.description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {task.dueDate ? (
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(new Date(task.dueDate), "PPP")}
          </div>
        ) : (
          <span />
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => deleteTask(task.id)}
        >
          <Trash2Icon className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}