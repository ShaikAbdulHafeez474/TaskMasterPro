import { useTasks } from "@/hooks/use-tasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { format, startOfWeek, addDays } from "date-fns";

export function TaskAnalytics() {
  const { tasks } = useTasks();

  // Calculate priority distribution
  const priorityData = [
    { name: "High", value: tasks.filter(t => t.priority === "high").length },
    { name: "Medium", value: tasks.filter(t => t.priority === "medium").length },
    { name: "Low", value: tasks.filter(t => t.priority === "low").length },
  ];

  // Calculate completion rate
  const completionData = [
    { name: "Completed", value: tasks.filter(t => t.completed).length },
    { name: "Pending", value: tasks.filter(t => !t.completed).length },
  ];

  // Calculate weekly task distribution
  const startOfCurrentWeek = startOfWeek(new Date());
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startOfCurrentWeek, i);
    return {
      name: format(date, "EEE"),
      tasks: tasks.filter(task => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        return format(taskDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
      }).length,
    };
  });

  const COLORS = ["#10B981", "#F59E0B", "#EF4444"];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Task Priority Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {priorityData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Task Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tasks" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
