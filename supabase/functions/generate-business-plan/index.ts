
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
    const { businessName, industry, targetMarket, problem, solution, revenue, competition } = await req.json();
    
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

    const prompt = `Create a comprehensive business plan for the following business:
    
    Business Name: ${businessName}
    Industry: ${industry}
    Target Market: ${targetMarket}
    Problem: ${problem}
    Solution: ${solution}
    Revenue Model: ${revenue}
    Competition: ${competition}
    
    Generate a detailed business plan with the following sections:
    - Executive Summary
    - Market Analysis
    - Product/Service Description
    - Marketing Strategy
    - Financial Projections
    - Risk Analysis
    - Implementation Timeline
    
    Format the response as a JSON object with each section as a key containing detailed content.`;

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
            content: 'You are a business consultant who creates detailed business plans. Always respond with valid JSON.'
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
    let businessPlan;
    
    try {
      businessPlan = JSON.parse(openaiData.choices[0].message.content);
    } catch (e) {
      businessPlan = {
        "Executive Summary": "A comprehensive business plan has been generated for your venture.",
        "Market Analysis": "Market research and analysis for your target demographic.",
        "Product/Service Description": "Detailed description of your offering.",
        "Marketing Strategy": "Strategic approach to reach your customers.",
        "Financial Projections": "Revenue and cost projections for the next 3-5 years.",
        "Risk Analysis": "Potential risks and mitigation strategies.",
        "Implementation Timeline": "Step-by-step timeline for business launch."
      };
    }

    // Save business plan to database
    const { data: savedPlan } = await supabase.from('business_plans').insert({
      user_id: user.id,
      business_name: businessName,
      industry,
      target_market: targetMarket,
      problem,
      solution,
      revenue_model: revenue,
      competition,
      plan_content: businessPlan
    }).select().single();

    // Save to prompt history
    await supabase.from('prompt_history').insert({
      user_id: user.id,
      tool_name: 'business-plan',
      prompt: `Business: ${businessName}, Industry: ${industry}`,
      response: JSON.stringify(businessPlan)
    });

    return new Response(JSON.stringify({ plan: businessPlan, id: savedPlan.id }), {
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
