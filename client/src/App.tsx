import { Switch, Route } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from '@/components/ui/toaster';
import NotFound from '@/pages/not-found';
import Dashboard from '@/pages/dashboard';
import AuthPage from '@/pages/auth-page';
import { AuthProvider } from '@/hooks/use-auth';
import { ProtectedRoute } from "@/lib/protected-route";
import { TaskList } from "./components/tasks/task-list";

import { TeamList } from "./components/teams/team-list";
import { Router } from "wouter";

import { CalendarView } from "./components/dashboard/calendar-view";

function RouterComponent() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={Dashboard} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
      <ProtectedRoute path="/tasks" component={TaskList} />
      <ProtectedRoute path="/calendar" component={CalendarView} />
      <ProtectedRoute path="/teams" component={TeamList} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router base="/">
        <RouterComponent />
          </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
