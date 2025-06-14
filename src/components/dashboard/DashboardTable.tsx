
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ArrowLeft,
  Plus
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardTableProps {
  section: string;
  onBack: () => void;
  onToolStart: (toolName: string, data?: any) => void;
}

export const DashboardTable = ({ section, onBack, onToolStart }: DashboardTableProps) => {
  const { user } = useAuth();

  const { data: tableData, isLoading, refetch } = useQuery({
    queryKey: ['dashboard-table', section, user?.id],
    queryFn: async () => {
      if (!user) return { items: [], title: '', columns: [] };

      switch (section) {
        case 'ideas':
          const { data: ideas } = await supabase
            .from('business_ideas')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          
          return {
            title: 'AI Business Ideas',
            items: ideas || [],
            columns: ['ID', 'Idea Name', 'Industry', 'Created Date', 'Status', 'Actions']
          };

        case 'plans':
          const { data: plans } = await supabase
            .from('business_plans')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          
          return {
            title: 'Business Plans',
            items: plans || [],
            columns: ['ID', 'Plan Title', 'Based on Idea', 'Created', 'Status', 'Actions']
          };

        case 'launch':
          const { data: assets } = await supabase
            .from('launch_assets')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          
          return {
            title: 'Launch Toolkit',
            items: assets || [],
            columns: ['ID', 'Business Name', 'Assets', 'Created Date', 'Status', 'Actions']
          };

        case 'tasks':
          const { data: tasks } = await supabase
            .from('user_tasks')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          
          return {
            title: 'Tasks',
            items: tasks || [],
            columns: ['Task ID', 'Description', 'Due Date', 'Priority', 'Status', 'Actions']
          };

        case 'history':
          const { data: history } = await supabase
            .from('prompt_history')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          
          return {
            title: 'Prompt History',
            items: history || [],
            columns: ['Prompt ID', 'Tool Used', 'Summary', 'Date', 'Status', 'Actions']
          };

        default:
          return { items: [], title: 'Resources', columns: [] };
      }
    },
    enabled: !!user
  });

  const deleteItem = async (itemId: string) => {
    if (!user) return;

    const tableMap = {
      'ideas': 'business_ideas',
      'plans': 'business_plans', 
      'launch': 'launch_assets',
      'tasks': 'user_tasks',
      'history': 'prompt_history'
    };

    const tableName = tableMap[section as keyof typeof tableMap];
    if (tableName) {
      await supabase
        .from(tableName)
        .delete()
        .eq('id', itemId)
        .eq('user_id', user.id);
      
      refetch();
    }
  };

  const getToolName = () => {
    const toolMap = {
      'ideas': 'idea-generator',
      'plans': 'business-plan',
      'launch': 'launch-toolkit',
      'tasks': 'tasks',
      'history': 'prompt-history'
    };
    return toolMap[section as keyof typeof toolMap] || section;
  };

  const renderRowData = (item: any, index: number) => {
    const formatDate = (date: string) => new Date(date).toLocaleDateString();
    const itemId = `#${(index + 1).toString().padStart(3, '0')}`;

    switch (section) {
      case 'ideas':
        return (
          <>
            <TableCell className="font-mono text-sm">{itemId}</TableCell>
            <TableCell className="font-medium">{item.title}</TableCell>
            <TableCell><Badge variant="outline">Startup</Badge></TableCell>
            <TableCell>{formatDate(item.created_at)}</TableCell>
            <TableCell><Badge variant="secondary">New</Badge></TableCell>
          </>
        );

      case 'plans':
        return (
          <>
            <TableCell className="font-mono text-sm">#{(index + 201).toString()}</TableCell>
            <TableCell className="font-medium">{item.business_name}</TableCell>
            <TableCell>{item.business_name}</TableCell>
            <TableCell>{formatDate(item.created_at)}</TableCell>
            <TableCell><Badge variant="default">Complete</Badge></TableCell>
          </>
        );

      case 'launch':
        return (
          <>
            <TableCell className="font-mono text-sm">#{(index + 301).toString()}</TableCell>
            <TableCell className="font-medium">{item.business_name}</TableCell>
            <TableCell><Badge variant="outline">Logo, Colors, Name</Badge></TableCell>
            <TableCell>{formatDate(item.created_at)}</TableCell>
            <TableCell><Badge variant="default">Ready</Badge></TableCell>
          </>
        );

      case 'tasks':
        return (
          <>
            <TableCell className="font-mono text-sm">T-{(index + 1).toString().padStart(2, '0')}</TableCell>
            <TableCell className="font-medium">{item.title}</TableCell>
            <TableCell>{item.due_date ? formatDate(item.due_date) : 'No date'}</TableCell>
            <TableCell><Badge variant={item.priority === 'high' ? 'destructive' : 'outline'}>{item.priority}</Badge></TableCell>
            <TableCell><Badge variant={item.completed ? 'default' : 'secondary'}>{item.completed ? 'Complete' : 'Pending'}</Badge></TableCell>
          </>
        );

      case 'history':
        return (
          <>
            <TableCell className="font-mono text-sm">#{(index + 9001).toString()}</TableCell>
            <TableCell className="font-medium">{item.tool_name}</TableCell>
            <TableCell className="max-w-xs truncate">{item.prompt.substring(0, 50)}...</TableCell>
            <TableCell>{formatDate(item.created_at)}</TableCell>
            <TableCell><Badge variant="outline">Completed</Badge></TableCell>
          </>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="text-gray-600">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button and Create Button */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="text-gray-600">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <Button 
          onClick={() => onToolStart(getToolName())}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New
        </Button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-navy-900">{tableData?.title}</h2>
              <p className="text-sm text-gray-500 mt-1">{tableData?.items.length || 0} items found</p>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                {tableData?.columns.map((column) => (
                  <TableHead key={column} className="font-medium text-gray-700">
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData?.items && tableData.items.length > 0 ? (
                tableData.items.map((item, index) => (
                  <TableRow key={item.id} className="hover:bg-gray-50/50">
                    {renderRowData(item, index)}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white">
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer text-red-600"
                            onClick={() => deleteItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={tableData?.columns.length || 6} className="text-center py-12">
                    <div className="text-gray-500">
                      <p className="text-lg font-medium mb-2">No {tableData?.title?.toLowerCase()} yet</p>
                      <p className="text-sm mb-4">Get started by creating your first item</p>
                      <Button 
                        onClick={() => onToolStart(getToolName())}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Item
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
