
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Search, Calendar, Tag, RefreshCw } from "lucide-react";

const PromptHistory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTool, setSelectedTool] = useState("all");
  const { user } = useAuth();

  const { data: promptHistory, isLoading } = useQuery({
    queryKey: ['prompt-history', user?.id, searchQuery, selectedTool],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from('prompt_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (selectedTool !== 'all') {
        query = query.eq('tool_name', selectedTool);
      }

      if (searchQuery) {
        query = query.or(`prompt.ilike.%${searchQuery}%,response.ilike.%${searchQuery}%`);
      }

      const { data } = await query;
      return data || [];
    },
    enabled: !!user
  });

  const { data: toolCounts } = useQuery({
    queryKey: ['tool-counts', user?.id],
    queryFn: async () => {
      if (!user) return {};
      
      const { data } = await supabase
        .from('prompt_history')
        .select('tool_name')
        .eq('user_id', user.id);
      
      const counts = data?.reduce((acc, item) => {
        acc[item.tool_name] = (acc[item.tool_name] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};
      
      return counts;
    },
    enabled: !!user
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getToolColor = (toolName: string) => {
    const colors = {
      'idea-generator': 'bg-blue-100 text-blue-800',
      'business-plan': 'bg-green-100 text-green-800',
      'launch-toolkit': 'bg-purple-100 text-purple-800',
      'tasks': 'bg-orange-100 text-orange-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors[toolName as keyof typeof colors] || colors.default;
  };

  const tools = Object.keys(toolCounts || {});

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-24 pb-16 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-navy-900 mb-4">Prompt History</h1>
            <p className="text-xl text-gray-600">View and manage all your AI interactions</p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search prompts and responses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedTool === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTool('all')}
              >
                All Tools
              </Button>
              {tools.map((tool) => (
                <Button
                  key={tool}
                  variant={selectedTool === tool ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTool(tool)}
                >
                  {tool.replace('-', ' ').toUpperCase()} ({toolCounts?.[tool] || 0})
                </Button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading prompt history...</p>
            </div>
          ) : promptHistory && promptHistory.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No prompts found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || selectedTool !== 'all' 
                  ? "Try adjusting your search or filter criteria" 
                  : "Start using AI tools to see your prompt history here"}
              </p>
              <Button onClick={() => {
                setSearchQuery("");
                setSelectedTool("all");
              }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {promptHistory?.map((item) => (
                <Card key={item.id} className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Badge className={getToolColor(item.tool_name)}>
                        {item.tool_name.replace('-', ' ').toUpperCase()}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(item.created_at)}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Re-run
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Prompt:</h4>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm">
                        {item.prompt}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Response:</h4>
                      <div className="text-gray-700 bg-blue-50 p-3 rounded-lg text-sm max-h-40 overflow-y-auto">
                        {typeof item.response === 'string' 
                          ? item.response 
                          : JSON.stringify(item.response, null, 2)}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PromptHistory;
