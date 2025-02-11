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
  LineChart,
  Line,
} from "recharts";
import { format, startOfWeek, addDays, differenceInDays, subDays } from "date-fns";

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

  // Calculate completion trends (last 30 days)
  const completionTrends = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), i);
    const completedTasks = tasks.filter(task => {
      if (!task.completed || !task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return format(taskDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
    }).length;
    return {
      date: format(date, "MMM dd"),
      completed: completedTasks,
    };
  }).reverse();

  // Calculate average completion time by priority
  type PriorityTimes = {
    high: number;
    medium: number;
    low: number;
  };

  const avgCompletionTime: PriorityTimes = {
    high: 0,
    medium: 0,
    low: 0,
  };

  const counts: PriorityTimes = {
    high: 0,
    medium: 0,
    low: 0,
  };

  tasks.forEach(task => {
    if (task.completed && task.dueDate && task.priority in avgCompletionTime) {
      const priority = task.priority as keyof PriorityTimes;
      const completionTime = differenceInDays(
        new Date(),
        new Date(task.dueDate)
      );
      avgCompletionTime[priority] += Math.abs(completionTime);
      counts[priority]++;
    }
  });

  (Object.keys(avgCompletionTime) as Array<keyof PriorityTimes>).forEach(priority => {
    if (counts[priority] > 0) {
      avgCompletionTime[priority] = Math.round(
        avgCompletionTime[priority] / counts[priority]
      );
    }
  });

  const completionTimeData = Object.entries(avgCompletionTime).map(
    ([priority, days]) => ({
      priority,
      days: days || 0,
    })
  );

  const COLORS = ["#EF4444", "#F59E0B", "#10B981"];

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

      <Card>
        <CardHeader>
          <CardTitle>30-Day Completion Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={completionTrends}>
                <XAxis 
                  dataKey="date" 
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  interval={2}
                />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#3B82F6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Average Completion Time by Priority</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completionTimeData}>
                <XAxis dataKey="priority" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="days">
                  {completionTimeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}