
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
    const { businessName, brandFeeling, colorPreferences } = await req.json();
    
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

    const prompt = `You are a senior brand designer and naming strategist. Create a comprehensive launch toolkit for "${businessName}" with the following requirements:

BRAND INPUTS:
- Business Name: ${businessName}
- Desired Brand Feeling: ${brandFeeling}
- Color Preferences: ${colorPreferences}

Generate a complete brand package with:

1. Business Name Alternatives (5 options):
   - Creative variations that capture the brand feeling
   - Include domain availability assessment
   - Brief rationale for each name

2. Logo Concepts (3 detailed descriptions):
   - Visual style that matches brand feeling
   - Specific design elements and typography
   - How it represents the business

3. Brand Color Palette (4-5 colors):
   - Primary, secondary, accent colors
   - HEX codes for each
   - Usage guidelines (text, backgrounds, highlights)

4. Tagline Options (3 options):
   - Memorable phrases under 6 words
   - Capture the brand essence

5. Brand Voice Description:
   - Tone and personality
   - Communication style

Format as JSON with: nameAlternatives, logoIdeas, brandColors, taglines, brandVoice arrays/objects`;

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
            content: 'You are a senior brand designer who creates comprehensive launch toolkits. Always respond with valid JSON only.'
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
        nameAlternatives: [
          { name: businessName + "Pro", domain: businessName.toLowerCase() + "pro.com", available: true, rationale: "Professional variant" },
          { name: businessName + "Hub", domain: businessName.toLowerCase() + "hub.com", available: false, rationale: "Central platform concept" }
        ],
        logoIdeas: [
          { concept: "Modern geometric design with bold typography", style: "Minimalist", elements: "Clean lines, sans-serif font" },
          { concept: "Circular emblem with industry iconography", style: "Professional", elements: "Icon within circle, balanced layout" }
        ],
        brandColors: [
          { name: "Primary Blue", hex: "#3F82F9", usage: "Main brand color, buttons, links" },
          { name: "Deep Navy", hex: "#0F172A", usage: "Text and headers" },
          { name: "Light Gray", hex: "#F8FAFC", usage: "Backgrounds and subtle elements" }
        ],
        taglines: ["Build Better", "Innovate Forward", "Create Impact"],
        brandVoice: { tone: "Professional yet approachable", style: "Clear, confident, helpful" }
      };
    }

    // Save launch assets to database
    const { data: savedAssets } = await supabase.from('launch_assets').insert({
      user_id: user.id,
      business_name: businessName,
      industry: brandFeeling,
      logo_concepts: launchAssets.logoIdeas,
      name_suggestions: launchAssets.nameAlternatives,
      brand_colors: launchAssets.brandColors
    }).select().single();

    // Save to prompt history
    await supabase.from('prompt_history').insert({
      user_id: user.id,
      tool_name: 'launch-toolkit',
      prompt: `Business: ${businessName}, Feeling: ${brandFeeling}, Colors: ${colorPreferences}`,
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
