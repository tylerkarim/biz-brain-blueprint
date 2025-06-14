
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

export const IdeasTable = () => {
  const { user } = useAuth();
  const [selectedIdea, setSelectedIdea] = useState<any>(null);

  const { data: ideas, refetch } = useQuery({
    queryKey: ['business-ideas', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data } = await supabase
        .from('business_ideas')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      return data || [];
    },
    enabled: !!user
  });

  const handleDelete = async (id: string) => {
    if (!user) return;

    await supabase
      .from('business_ideas')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    refetch();
  };

  const getStatusBadge = (idea: any) => {
    // Simple status logic - you can enhance this
    if (idea.difficulty === 'easy') return <Badge variant="default">New</Badge>;
    if (idea.difficulty === 'medium') return <Badge variant="secondary">Drafted</Badge>;
    return <Badge variant="outline">Complex</Badge>;
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#ID</TableHead>
            <TableHead>Idea Name</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ideas?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                No business ideas yet. Generate your first idea above!
              </TableCell>
            </TableRow>
          ) : (
            ideas?.map((idea, index) => (
              <TableRow key={idea.id}>
                <TableCell>#{(index + 1).toString().padStart(3, '0')}</TableCell>
                <TableCell className="font-medium">{idea.title}</TableCell>
                <TableCell>{idea.market_size || 'General'}</TableCell>
                <TableCell>
                  {new Date(idea.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>{getStatusBadge(idea)}</TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => setSelectedIdea(idea)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleDelete(idea.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {selectedIdea && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="font-semibold mb-2">{selectedIdea.title}</h3>
          <p className="text-gray-700 mb-2">{selectedIdea.description}</p>
          <div className="flex space-x-4 text-sm text-gray-600">
            {selectedIdea.market_size && <span>Market: {selectedIdea.market_size}</span>}
            {selectedIdea.difficulty && <span>Difficulty: {selectedIdea.difficulty}</span>}
            {selectedIdea.time_to_market && <span>Time to Market: {selectedIdea.time_to_market}</span>}
          </div>
          <Button 
            className="mt-3" 
            size="sm"
            onClick={() => setSelectedIdea(null)}
          >
            Close
          </Button>
        </div>
      )}
    </div>
  );
};
