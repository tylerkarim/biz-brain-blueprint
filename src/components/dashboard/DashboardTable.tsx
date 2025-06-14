import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Eye, Edit, Trash2, ArrowLeft, Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
interface DashboardTableProps {
  section: string;
  onBack: () => void;
  onToolStart: (toolName: string, data?: any) => void;
}
type TableName = 'business_ideas' | 'business_plans' | 'launch_assets' | 'user_tasks' | 'prompt_history';
export const DashboardTable = ({
  section,
  onBack,
  onToolStart
}: DashboardTableProps) => {
  const {
    user
  } = useAuth();
  const {
    data: tableData,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['dashboard-table', section, user?.id],
    queryFn: async () => {
      if (!user) return {
        items: [],
        title: '',
        columns: []
      };
      switch (section) {
        case 'ideas':
          const {
            data: ideas
          } = await supabase.from('business_ideas' as TableName).select('*').eq('user_id', user.id).order('created_at', {
            ascending: false
          });
          return {
            title: 'AI Business Ideas',
            items: ideas || [],
            columns: ['ID', 'Name', 'Industry', 'Date', 'Status', 'Actions']
          };
        case 'plans':
          const {
            data: plans
          } = await supabase.from('business_plans' as TableName).select('*').eq('user_id', user.id).order('created_at', {
            ascending: false
          });
          return {
            title: 'Business Plans',
            items: plans || [],
            columns: ['ID', 'Name', 'Based on', 'Date', 'Status', 'Actions']
          };
        case 'launch':
          const {
            data: assets
          } = await supabase.from('launch_assets' as TableName).select('*').eq('user_id', user.id).order('created_at', {
            ascending: false
          });
          return {
            title: 'Launch Toolkit',
            items: assets || [],
            columns: ['ID', 'Business Name', 'Assets', 'Date', 'Status', 'Actions']
          };
        case 'tasks':
          const {
            data: tasks
          } = await supabase.from('user_tasks' as TableName).select('*').eq('user_id', user.id).order('created_at', {
            ascending: false
          });
          return {
            title: 'Tasks',
            items: tasks || [],
            columns: ['ID', 'Description', 'Due Date', 'Priority', 'Status', 'Actions']
          };
        case 'history':
          const {
            data: history
          } = await supabase.from('prompt_history' as TableName).select('*').eq('user_id', user.id).order('created_at', {
            ascending: false
          });
          return {
            title: 'Prompt History',
            items: history || [],
            columns: ['ID', 'Tool', 'Summary', 'Date', 'Status', 'Actions']
          };
        default:
          return {
            items: [],
            title: 'Resources',
            columns: []
          };
      }
    },
    enabled: !!user
  });
  const deleteItem = async (itemId: string) => {
    if (!user) return;
    const tableMap: Record<string, TableName> = {
      'ideas': 'business_ideas',
      'plans': 'business_plans',
      'launch': 'launch_assets',
      'tasks': 'user_tasks',
      'history': 'prompt_history'
    };
    const tableName = tableMap[section];
    if (tableName) {
      await supabase.from(tableName).delete().eq('id', itemId).eq('user_id', user.id);
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
  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const renderMobileCard = (item: any, index: number) => {
    const itemId = `#${(index + 1).toString().padStart(3, '0')}`;
    return <Card key={item.id} className="p-4 mb-4 border shadow-sm">
        <div className="flex justify-between items-start mb-3">
          <span className="font-mono text-xs text-gray-500">{itemId}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg z-50">
              <DropdownMenuItem className="cursor-pointer text-sm">
                <Eye className="h-4 w-4 mr-2" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-sm text-red-600" onClick={() => deleteItem(item.id)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {section === 'ideas' && <div className="space-y-2">
            <h3 className="font-medium text-sm">{item.title}</h3>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">Startup</Badge>
              <span className="text-xs text-gray-600">{formatDate(item.created_at)}</span>
            </div>
            <Badge variant="secondary" className="text-xs">New</Badge>
          </div>}

        {section === 'plans' && <div className="space-y-2">
            <h3 className="font-medium text-sm">{item.business_name}</h3>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Based on: {item.business_name}</span>
              <span className="text-xs text-gray-600">{formatDate(item.created_at)}</span>
            </div>
            <Badge className="text-xs bg-green-100 text-green-700 hover:bg-green-100">Complete</Badge>
          </div>}

        {section === 'launch' && <div className="space-y-2">
            <h3 className="font-medium text-sm">{item.business_name}</h3>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">Logo, Colors</Badge>
              <span className="text-xs text-gray-600">{formatDate(item.created_at)}</span>
            </div>
            <Badge className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-100">Ready</Badge>
          </div>}

        {section === 'tasks' && <div className="space-y-2">
            <h3 className="font-medium text-sm">{item.title}</h3>
            <div className="flex items-center justify-between">
              <Badge variant={item.priority === 'high' ? 'destructive' : 'outline'} className="text-xs">
                {item.priority}
              </Badge>
              <span className="text-xs text-gray-600">{item.due_date ? formatDate(item.due_date) : '-'}</span>
            </div>
            <Badge className={`text-xs ${item.completed ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-700 hover:bg-gray-100'}`}>
              {item.completed ? 'Complete' : 'Pending'}
            </Badge>
          </div>}

        {section === 'history' && <div className="space-y-2">
            <h3 className="font-medium text-sm">{item.tool_name}</h3>
            <p className="text-xs text-gray-600 truncate">{item.prompt.substring(0, 60)}...</p>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">Completed</Badge>
              <span className="text-xs text-gray-600">{formatDate(item.created_at)}</span>
            </div>
          </div>}
      </Card>;
  };
  const renderRowData = (item: any, index: number) => {
    const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    const itemId = `#${(index + 1).toString().padStart(3, '0')}`;
    switch (section) {
      case 'ideas':
        return <>
            <TableCell className="font-mono text-xs text-gray-500">{itemId}</TableCell>
            <TableCell className="font-medium text-sm">{item.title}</TableCell>
            <TableCell><Badge variant="outline" className="text-xs">Startup</Badge></TableCell>
            <TableCell className="text-sm text-gray-600">{formatDate(item.created_at)}</TableCell>
            <TableCell><Badge variant="secondary" className="text-xs">New</Badge></TableCell>
          </>;
      case 'plans':
        return <>
            <TableCell className="font-mono text-xs text-gray-500">{itemId}</TableCell>
            <TableCell className="font-medium text-sm">{item.business_name}</TableCell>
            <TableCell className="text-sm text-gray-600">{item.business_name}</TableCell>
            <TableCell className="text-sm text-gray-600">{formatDate(item.created_at)}</TableCell>
            <TableCell><Badge className="text-xs bg-green-100 text-green-700 hover:bg-green-100">Complete</Badge></TableCell>
          </>;
      case 'launch':
        return <>
            <TableCell className="font-mono text-xs text-gray-500">{itemId}</TableCell>
            <TableCell className="font-medium text-sm">{item.business_name}</TableCell>
            <TableCell><Badge variant="outline" className="text-xs">Logo, Colors</Badge></TableCell>
            <TableCell className="text-sm text-gray-600">{formatDate(item.created_at)}</TableCell>
            <TableCell><Badge className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-100">Ready</Badge></TableCell>
          </>;
      case 'tasks':
        return <>
            <TableCell className="font-mono text-xs text-gray-500">{itemId}</TableCell>
            <TableCell className="font-medium text-sm">{item.title}</TableCell>
            <TableCell className="text-sm text-gray-600">{item.due_date ? formatDate(item.due_date) : '-'}</TableCell>
            <TableCell>
              <Badge variant={item.priority === 'high' ? 'destructive' : 'outline'} className="text-xs">
                {item.priority}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge className={`text-xs ${item.completed ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-700 hover:bg-gray-100'}`}>
                {item.completed ? 'Complete' : 'Pending'}
              </Badge>
            </TableCell>
          </>;
      case 'history':
        return <>
            <TableCell className="font-mono text-xs text-gray-500">{itemId}</TableCell>
            <TableCell className="font-medium text-sm">{item.tool_name}</TableCell>
            <TableCell className="max-w-xs truncate text-sm text-gray-600">{item.prompt.substring(0, 40)}...</TableCell>
            <TableCell className="text-sm text-gray-600">{formatDate(item.created_at)}</TableCell>
            <TableCell><Badge variant="outline" className="text-xs">Completed</Badge></TableCell>
          </>;
      default:
        return null;
    }
  };
  if (isLoading) {
    return <div className="p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-96 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>;
  }
  return <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-gray-600 hover:text-gray-900 p-1">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg md:text-xl font-medium text-gray-900">{tableData?.title}</h1>
              <p className="text-sm text-gray-500">{tableData?.items.length || 0} items found</p>
            </div>
          </div>
          
        </div>

        {/* Mobile Card View */}
        <div className="block md:hidden">
          {tableData?.items && tableData.items.length > 0 ? tableData.items.map((item, index) => renderMobileCard(item, index)) : <Card className="p-8 text-center">
              <div className="text-gray-500">
                <p className="text-sm font-medium mb-1">No {tableData?.title?.toLowerCase()} yet</p>
                <p className="text-xs text-gray-400 mb-4">Get started by creating your first item</p>
                <Button size="sm" onClick={() => onToolStart(getToolName())} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-1" />
                  Create First Item
                </Button>
              </div>
            </Card>}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b border-gray-200">
                  {tableData?.columns.map(column => <TableHead key={column} className="font-medium text-gray-700 text-xs uppercase tracking-wide py-3 px-4 whitespace-nowrap">
                      {column}
                    </TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData?.items && tableData.items.length > 0 ? tableData.items.map((item, index) => <TableRow key={item.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                      {renderRowData(item, index)}
                      <TableCell className="px-4 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg z-50">
                            <DropdownMenuItem className="cursor-pointer text-sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-sm">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-sm text-red-600" onClick={() => deleteItem(item.id)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>) : <TableRow>
                    <TableCell colSpan={tableData?.columns.length || 6} className="text-center py-12">
                      <div className="text-gray-500">
                        <p className="text-sm font-medium mb-1">No {tableData?.title?.toLowerCase()} yet</p>
                        <p className="text-xs text-gray-400 mb-4">Get started by creating your first item</p>
                        <Button size="sm" onClick={() => onToolStart(getToolName())} className="bg-blue-600 hover:bg-blue-700 text-white">
                          <Plus className="h-4 w-4 mr-1" />
                          Create First Item
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>;
};