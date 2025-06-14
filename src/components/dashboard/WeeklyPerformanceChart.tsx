
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { format, subDays, startOfWeek, endOfWeek, eachWeekOfInterval, subWeeks } from "date-fns";

const chartConfig = {
  ideas: {
    label: "Ideas",
    color: "#3B82F6",
  },
  plans: {
    label: "Plans",
    color: "#10B981",
  },
  assets: {
    label: "Assets",
    color: "#8B5CF6",
  },
  tasks: {
    label: "Tasks",
    color: "#F59E0B",
  },
};

export const WeeklyPerformanceChart = () => {
  const { user } = useAuth();

  const { data: weeklyData, isLoading } = useQuery({
    queryKey: ['weekly-performance', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get last 8 weeks of data
      const endDate = new Date();
      const startDate = subWeeks(endDate, 7);
      
      const weeks = eachWeekOfInterval({ start: startDate, end: endDate });

      const weeklyStats = await Promise.all(
        weeks.map(async (weekStart) => {
          const weekEnd = endOfWeek(weekStart);
          const weekStartStr = weekStart.toISOString();
          const weekEndStr = weekEnd.toISOString();

          const [ideas, plans, assets, tasks] = await Promise.all([
            supabase
              .from('business_ideas')
              .select('id', { count: 'exact' })
              .eq('user_id', user.id)
              .gte('created_at', weekStartStr)
              .lte('created_at', weekEndStr),
            supabase
              .from('business_plans')
              .select('id', { count: 'exact' })
              .eq('user_id', user.id)
              .gte('created_at', weekStartStr)
              .lte('created_at', weekEndStr),
            supabase
              .from('launch_assets')
              .select('id', { count: 'exact' })
              .eq('user_id', user.id)
              .gte('created_at', weekStartStr)
              .lte('created_at', weekEndStr),
            supabase
              .from('user_tasks')
              .select('id', { count: 'exact' })
              .eq('user_id', user.id)
              .gte('created_at', weekStartStr)
              .lte('created_at', weekEndStr)
          ]);

          return {
            week: format(weekStart, 'MMM dd'),
            ideas: ideas.count || 0,
            plans: plans.count || 0,
            assets: assets.count || 0,
            tasks: tasks.count || 0,
            total: (ideas.count || 0) + (plans.count || 0) + (assets.count || 0) + (tasks.count || 0)
          };
        })
      );

      return weeklyStats;
    },
    enabled: !!user
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-medium text-gray-900 mb-1">Weekly Performance</h2>
        <p className="text-sm text-gray-600">Your activity across all tools over the past 8 weeks</p>
      </div>
      
      <ChartContainer config={chartConfig} className="h-64 md:h-80">
        <AreaChart data={weeklyData}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="week" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            className="text-xs"
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            className="text-xs"
          />
          <ChartTooltip 
            content={<ChartTooltipContent />}
            labelStyle={{ color: '#374151', fontWeight: 500 }}
          />
          <Area 
            type="monotone" 
            dataKey="total" 
            stroke="#3B82F6" 
            strokeWidth={2}
            fill="url(#colorTotal)"
            fillOpacity={1}
          />
        </AreaChart>
      </ChartContainer>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
        {Object.entries(chartConfig).map(([key, config]) => (
          <div key={key} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: config.color }}
            ></div>
            <span className="text-xs font-medium text-gray-600">{config.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
