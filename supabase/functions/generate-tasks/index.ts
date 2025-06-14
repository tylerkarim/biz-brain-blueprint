
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
    const { businessGoal, timeframe } = await req.json();
    
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

    const prompt = `Generate 5-8 specific, actionable tasks for a ${timeframe} to help achieve this business goal: "${businessGoal}"

    For each task, provide:
    - A clear, actionable title
    - A brief description (1-2 sentences)
    - Priority level (high/medium/low)
    - Estimated due date within the ${timeframe}
    
    Focus on practical, achievable tasks that move the business forward.
    
    Format the response as a JSON array with objects containing: title, description, priority, dueDate (YYYY-MM-DD format)`;

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
            content: 'You are a business productivity coach who creates actionable task lists. Always respond with valid JSON.'
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
          priority: "high",
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        {
          title: "Create MVP prototype",
          description: "Build a basic version of your product to test with early users",
          priority: "high",
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      ];
    }

    // Save tasks to database
    for (const task of tasks) {
      await supabase.from('user_tasks').insert({
        user_id: user.id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        due_date: task.dueDate,
        completed: false
      });
    }

    // Save to prompt history
    await supabase.from('prompt_history').insert({
      user_id: user.id,
      tool_name: 'tasks',
      prompt: `Goal: ${businessGoal}, Timeframe: ${timeframe}`,
      response: JSON.stringify(tasks)
    });

    return new Response(JSON.stringify(tasks), {
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
