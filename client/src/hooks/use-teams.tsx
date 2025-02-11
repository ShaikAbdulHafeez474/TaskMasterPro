import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Team, InsertTeam } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useTeams() {
  const { toast } = useToast();

  const { data: teams = [], isLoading } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  const createTeamMutation = useMutation({
    mutationFn: async (team: InsertTeam) => {
      const res = await apiRequest("POST", "/api/teams", team);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      toast({
        title: "Team created",
        description: "Your team has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create team",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTeamMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/teams/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      toast({
        title: "Team deleted",
        description: "The team has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete team",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    teams,
    isLoading,
    createTeam: createTeamMutation.mutate,
    deleteTeam: deleteTeamMutation.mutate,
  };
}
