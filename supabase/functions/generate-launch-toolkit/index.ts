
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
    const { businessName, industry } = await req.json();
    
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

    const prompt = `Generate launch toolkit assets for a ${industry} business named "${businessName}":

    1. Logo Ideas (3 concepts):
       - Creative concept descriptions
       - Style recommendations
    
    2. Business Name Alternatives (5 suggestions):
       - Alternative names with domain availability status
       - Brief explanation for each name
    
    3. Brand Color Palette (3-4 colors):
       - Color names and hex codes
       - Usage recommendations
    
    Format as JSON with: logoIdeas, nameIdeas, brandColors arrays`;

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
            content: 'You are a brand designer who creates comprehensive launch toolkits. Always respond with valid JSON.'
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
    let launchAssets;
    
    try {
      launchAssets = JSON.parse(openaiData.choices[0].message.content);
    } catch (e) {
      launchAssets = {
        logoIdeas: [
          { concept: "Modern geometric design with bold typography", style: "Minimalist" },
          { concept: "Circular emblem with industry-specific iconography", style: "Professional" },
          { concept: "Abstract lettermark with dynamic elements", style: "Creative" }
        ],
        nameIdeas: [
          { name: businessName + "Pro", domain: businessName.toLowerCase() + "pro.com", available: true },
          { name: businessName + "Hub", domain: businessName.toLowerCase() + "hub.com", available: false },
          { name: businessName + "Labs", domain: businessName.toLowerCase() + "labs.com", available: true }
        ],
        brandColors: [
          { name: "Primary Blue", hex: "#3F82F9", usage: "Main brand color" },
          { name: "Deep Navy", hex: "#0F172A", usage: "Text and headers" },
          { name: "Light Gray", hex: "#F8FAFC", usage: "Backgrounds" }
        ]
      };
    }

    // Save launch assets to database
    const { data: savedAssets } = await supabase.from('launch_assets').insert({
      user_id: user.id,
      business_name: businessName,
      industry,
      logo_concepts: launchAssets.logoIdeas,
      name_suggestions: launchAssets.nameIdeas,
      brand_colors: launchAssets.brandColors
    }).select().single();

    // Save to prompt history
    await supabase.from('prompt_history').insert({
      user_id: user.id,
      tool_name: 'launch-toolkit',
      prompt: `Business: ${businessName}, Industry: ${industry}`,
      response: JSON.stringify(launchAssets)
    });

    return new Response(JSON.stringify({ ...launchAssets, id: savedAssets.id }), {
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
