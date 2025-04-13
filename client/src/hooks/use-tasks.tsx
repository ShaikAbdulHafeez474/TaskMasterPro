import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Task, InsertTask } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useTasks() {
  const { toast } = useToast();

  // ✅ Ensure the tasks are fetched correctly
  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/tasks");
      return res.json();
    },
  });

  // ✅ Ensure dueDate is formatted properly
  const createTaskMutation = useMutation({
    mutationFn: async (task: InsertTask) => {
      const formattedTask = {
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null, // Convert to ISO string
      };
      const res = await apiRequest("POST", "/api/tasks", formattedTask);
      return res.json();
    },
    onSuccess: () => {
      console.log("Task created! Refetching tasks...");
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] }); // Ensure UI updates
      toast({
        title: "Task created",
        description: "Your task has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create task",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Task> & { id: number }) => {
      const formattedUpdates = {
        ...updates,
        dueDate: updates.dueDate ? new Date(updates.dueDate).toISOString() : null, // Convert to ISO
      };
      const res = await apiRequest("PATCH", `/api/tasks/${id}`, formattedUpdates);
      return res.json();
    },
    onSuccess: () => {
      console.log("Task updated! Refetching tasks...");
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update task",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/tasks/${id}`);
    },
    onSuccess: () => {
      console.log("Task deleted! Refetching tasks...");
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete task",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    tasks,
    isLoading,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
  };
}
