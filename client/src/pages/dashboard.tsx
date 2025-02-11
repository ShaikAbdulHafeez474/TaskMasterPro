import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Stats } from "@/components/dashboard/stats";
import { TaskList } from "@/components/tasks/task-list";
import { TaskForm } from "@/components/tasks/task-form";
import { CalendarView } from "@/components/dashboard/calendar-view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Dashboard() {
  const { user, logoutMutation } = useAuth();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar onLogout={() => logoutMutation.mutate()} />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user?.username}!</h1>
          <Button onClick={() => setIsTaskFormOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>

        <Stats className="mb-8" />

        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>
          <TabsContent value="list">
            <TaskList />
          </TabsContent>
          <TabsContent value="calendar">
            <CalendarView />
          </TabsContent>
        </Tabs>

        <Dialog open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <TaskForm onSuccess={() => setIsTaskFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
