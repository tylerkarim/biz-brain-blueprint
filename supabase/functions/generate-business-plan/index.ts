
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { targetCustomer, uniqueAdvantage, solutionDetails, revenueChannels, ideaContext } = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: user } = await supabaseClient.auth.getUser(token);

    if (!user.user) {
      throw new Error('Unauthorized');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const businessPlanPrompt = `You are a senior business consultant working with a startup founder. Create a comprehensive business plan based on their inputs.

BUSINESS CONTEXT:
${ideaContext ? `Base Idea: ${ideaContext.name} - ${ideaContext.description}` : ''}

FOUNDER'S INPUTS:
- Target Customer: ${targetCustomer}
- Unique Advantage: ${uniqueAdvantage}
- Solution Details: ${solutionDetails}
- Revenue Channels: ${revenueChannels}

Create a professional business plan with these sections:

{
  "Executive Summary": "2-paragraph overview of the business opportunity and strategy",
  "Problem Statement": "Clear definition of the market problem and its impact",
  "Solution Overview": "Detailed explanation of your solution and how it works",
  "Market Analysis": "Target market size, trends, and customer segments",
  "Competitive Landscape": "Key competitors and your differentiation strategy",
  "Business Model": "Revenue streams, pricing strategy, and unit economics",
  "Go-to-Market Strategy": "Customer acquisition plan and marketing approach",
  "Operations Plan": "Key resources, partnerships, and operational requirements",
  "Financial Projections": "Revenue forecasts and key financial assumptions for Year 1-3",
  "Risk Assessment": "Primary risks and mitigation strategies"
}

Make this investor-ready and actionable. Include specific numbers, timelines, and concrete next steps. Focus on validating assumptions and building a sustainable business.`;

    console.log('Generating business plan with prompt:', businessPlanPrompt);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a senior business consultant. Create detailed, professional business plans. Respond with valid JSON only.' 
          },
          { role: 'user', content: businessPlanPrompt }
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;
    
    console.log('OpenAI business plan response:', generatedContent);

    let plan;
    try {
      plan = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      throw new Error('Invalid response format from AI');
    }

    // Save business plan to database
    const { data: savedPlan, error } = await supabaseClient
      .from('business_plans')
      .insert({
        user_id: user.user.id,
        business_name: ideaContext?.name || 'New Business',
        target_market: targetCustomer,
        problem: plan['Problem Statement'] || '',
        solution: solutionDetails,
        revenue_model: revenueChannels,
        plan_content: plan,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving business plan:', error);
    }

    // Save to prompt history
    await supabaseClient
      .from('prompt_history')
      .insert({
        user_id: user.user.id,
        tool_name: 'business-plan',
        prompt: `Customer: ${targetCustomer} | Advantage: ${uniqueAdvantage} | Solution: ${solutionDetails} | Revenue: ${revenueChannels}`,
        response: JSON.stringify(plan),
      });

    return new Response(JSON.stringify({ plan }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-business-plan function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
