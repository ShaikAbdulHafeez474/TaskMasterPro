import { useTeams } from "@/hooks/use-teams";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TeamForm } from "./team-form";

export function TeamList() {
  const { teams, isLoading, deleteTeam } = useTeams();
  const [isTeamFormOpen, setIsTeamFormOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Teams</h2>
        <Button onClick={() => setIsTeamFormOpen(true)}>Create Team</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <Card key={team.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {team.name}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTeam(team.id)}
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {team.description}
              </p>
              <div className="flex items-center mt-4 text-sm text-muted-foreground">
                <UsersIcon className="h-4 w-4 mr-1" />
                <span>Members</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {teams.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No teams found. Create one to get started!
        </div>
      )}

      <Dialog open={isTeamFormOpen} onOpenChange={setIsTeamFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Team</DialogTitle>
          </DialogHeader>
          <TeamForm onSuccess={() => setIsTeamFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
