
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { weeklyGoal, availableHours, focusType } = await req.json();
    
    const authHeader = req.headers.get('Authorization')!;
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return new Response('OpenAI API key not configured', { status: 500, headers: corsHeaders });
    }

    const prompt = `You are a senior business productivity coach and strategic advisor. Create a weekly action plan for an entrepreneur.

WEEKLY GOAL CONTEXT:
- Primary Goal: ${weeklyGoal}
- Available Time: ${availableHours} hours this week
- Focus Type: ${focusType} (strategy vs execution)

As their business advisor, generate 5-7 specific, actionable tasks that will move them closer to their goal. Each task should be:

1. Achievable within their time constraints
2. Directly tied to their weekly goal
3. Prioritized by impact and urgency
4. Specific enough to be completed without ambiguity

For each task, provide:
- Clear, actionable title
- Brief description explaining why it matters
- Estimated time investment
- Priority level (high/medium/low)
- Specific due date within this week
- Success criteria or deliverable

Focus on ${focusType === 'strategy' ? 'strategic planning, research, and decision-making tasks' : 'hands-on execution, building, and implementation tasks'}.

Format as JSON array with objects containing: title, description, estimatedHours, priority, dueDate (YYYY-MM-DD), successCriteria`;

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a senior business productivity coach who creates actionable weekly plans. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    });

    const openaiData = await openaiResponse.json();
    let tasks;
    
    try {
      tasks = JSON.parse(openaiData.choices[0].message.content);
    } catch (e) {
      // Fallback if JSON parsing fails
      tasks = [
        {
          title: "Define target customer persona",
          description: "Research and create detailed profiles of your ideal customers",
          estimatedHours: 3,
          priority: "high",
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          successCriteria: "Complete customer persona document with demographics, pain points, and behavior patterns"
        },
        {
          title: "Create MVP prototype",
          description: "Build a basic version of your product to test with early users",
          estimatedHours: 8,
          priority: "high",
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          successCriteria: "Working prototype that demonstrates core functionality"
        }
      ];
    }

    // Save tasks to database
    const savedTasks = [];
    for (const task of tasks) {
      const { data: savedTask, error } = await supabase.from('user_tasks').insert({
        user_id: user.id,
        title: task.title,
        description: `${task.description} | Time: ${task.estimatedHours}h | Success: ${task.successCriteria}`,
        priority: task.priority,
        due_date: task.dueDate,
        completed: false
      }).select().single();

      if (!error) {
        savedTasks.push(savedTask);
      }
    }

    // Save to prompt history
    await supabase.from('prompt_history').insert({
      user_id: user.id,
      tool_name: 'tasks',
      prompt: `Goal: ${weeklyGoal}, Hours: ${availableHours}, Focus: ${focusType}`,
      response: JSON.stringify(tasks)
    });

    return new Response(JSON.stringify({ tasks: savedTasks }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
