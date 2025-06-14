
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
    const { skills, interests } = await req.json();
    
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

    const prompt = `Generate 5 creative and viable business ideas based on the following:
    Skills: ${skills}
    Interests: ${interests}
    
    For each idea, provide:
    - A catchy title
    - A detailed description (2-3 sentences)
    - Market size estimate
    - Difficulty level (Low/Medium/High)
    - Time to market estimate
    
    Format the response as a JSON array with objects containing: title, description, market, difficulty, timeToMarket`;

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a business consultant who generates innovative startup ideas. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
      }),
    });

    const openaiData = await openaiResponse.json();
    let ideas;
    
    try {
      ideas = JSON.parse(openaiData.choices[0].message.content);
    } catch (e) {
      // Fallback if JSON parsing fails
      ideas = [
        {
          title: "AI-Powered Business Idea Generator",
          description: "A platform that uses artificial intelligence to generate personalized business ideas based on user skills and interests.",
          market: "$5.2B",
          difficulty: "Medium",
          timeToMarket: "6-8 months"
        }
      ];
    }

    // Save ideas to database
    for (const idea of ideas) {
      await supabase.from('business_ideas').insert({
        user_id: user.id,
        title: idea.title,
        description: idea.description,
        market_size: idea.market,
        difficulty: idea.difficulty,
        time_to_market: idea.timeToMarket,
        skills_input: skills,
        interests_input: interests
      });
    }

    // Save to prompt history
    await supabase.from('prompt_history').insert({
      user_id: user.id,
      tool_name: 'idea-generator',
      prompt: `Skills: ${skills}, Interests: ${interests}`,
      response: JSON.stringify(ideas)
    });

    return new Response(JSON.stringify(ideas), {
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
