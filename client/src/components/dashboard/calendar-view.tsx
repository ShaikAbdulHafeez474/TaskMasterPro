import { Card } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { useTasks } from '@/hooks/use-tasks';
import { addDays } from "date-fns";
import { useState } from "react";

export function CalendarView() {
  const { tasks } = useTasks();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const tasksForSelectedDate = selectedDate
    ? tasks.filter((task) => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        return (
          taskDate.getDate() === selectedDate.getDate() &&
          taskDate.getMonth() === selectedDate.getMonth() &&
          taskDate.getFullYear() === selectedDate.getFullYear()
        );
      })
    : [];

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_300px]">
      <Card className="p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
        />
      </Card>
      <Card className="p-4">
        <h3 className="font-semibold mb-4">
          Tasks for{" "}
          {selectedDate?.toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </h3>
        <div className="space-y-2">
          {tasksForSelectedDate.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No tasks scheduled for this day
            </p>
          ) : (
            tasksForSelectedDate.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-2 text-sm"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    task.priority === "high"
                      ? "bg-red-500"
                      : task.priority === "medium"
                      ? "bg-yellow-500"
                      : "bg-blue-500"
                  }`}
                />
                <span
                  className={
                    task.completed ? "line-through text-muted-foreground" : ""
                  }
                >
                  {task.title}
                </span>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
