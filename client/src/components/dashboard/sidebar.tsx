import { Button } from "@/components/ui/button";
import {
  LayoutDashboardIcon,
  LogOutIcon,
  CalendarIcon,
  ListTodoIcon,
  UsersIcon,
} from "lucide-react";
import { useLocation } from "wouter";

interface SidebarProps {
  onLogout: () => void;
}

export function Sidebar({ onLogout }: SidebarProps) {
  const [location, setLocation] = useLocation();

  return (
    <div className="w-64 border-r bg-card p-6">
      <div className="flex flex-col h-full">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold mb-4">Task Manager</h2>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => setLocation("/")}
          >
            <LayoutDashboardIcon className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => setLocation("/tasks")}
          >
            <ListTodoIcon className="mr-2 h-4 w-4" />
            Tasks
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => setLocation("/calendar")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendar
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => setLocation("/teams")}
          >
            <UsersIcon className="mr-2 h-4 w-4" />
            Teams
          </Button>
        </div>
        <div className="mt-auto">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={onLogout}
          >
            <LogOutIcon className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}