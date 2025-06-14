
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
    const { 
      businessName, 
      businessType, 
      targetCustomer, 
      brandVibe, 
      styleInspiration, 
      colorPreferences 
    } = await req.json();
    
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

    // Create a detailed, personalized prompt
    const prompt = `You are a senior brand strategist and creative director. Create a comprehensive, unique launch toolkit for a new business with these specific details:

BUSINESS CONTEXT:
- Business Name: "${businessName}"
- Business Type: "${businessType}"
- Target Customer: "${targetCustomer}"
- Brand Vibe: "${brandVibe}"
- Style Inspiration: "${styleInspiration || 'Open to creative suggestions'}"
- Color Preferences: "${colorPreferences || 'Suggest colors that match the brand vibe'}"

CRITICAL REQUIREMENTS:
1. Generate completely UNIQUE and PERSONALIZED content - no generic responses
2. Base all suggestions on the specific business type and target customer
3. Ensure name alternatives are directly relevant to the industry and brand vibe
4. Create color palettes that specifically match the stated brand personality
5. Design taglines that reflect the unique value proposition of this business type
6. Make logo concepts specific to the industry and target audience

Generate a comprehensive brand package with:

1. BUSINESS NAME ALTERNATIVES (5 unique options):
   - Must be specifically relevant to "${businessType}" industry
   - Should appeal to "${targetCustomer}"
   - Reflect the "${brandVibe}" personality
   - Include realistic domain assessment (.com availability)
   - Provide specific rationale for each name choice

2. LOGO CONCEPTS (3 detailed descriptions):
   - Design concepts that match "${businessType}" industry standards
   - Visual elements that appeal to "${targetCustomer}"
   - Style that embodies "${brandVibe}"
   - Specific typography and iconography recommendations
   - How each concept represents the business uniquely

3. BRAND COLOR PALETTE (4-5 colors with HEX codes):
   - Colors specifically chosen for "${brandVibe}" personality
   - Appropriate for "${businessType}" industry
   - Appeals to "${targetCustomer}" demographic
   - Include primary, secondary, accent colors
   - Detailed usage guidelines for each color

4. TAGLINE OPTIONS (3 unique variations):
   - Directly relevant to "${businessType}"
   - Speaks to "${targetCustomer}" needs/desires
   - Reflects "${brandVibe}" personality
   - Under 6 words each
   - Memorable and unique to this business

5. BRAND VOICE DESCRIPTION:
   - Tone that matches "${brandVibe}"
   - Communication style for "${targetCustomer}"
   - Specific personality traits
   - Content approach and messaging guidelines

IMPORTANT: Every suggestion must be tailored to this specific business. Avoid generic options like "Pro", "Hub", "Build Better", or default color schemes. Be creative and industry-specific.

Respond with valid JSON only in this exact format:
{
  "nameAlternatives": [
    {
      "name": "specific_name",
      "domain": "domain.com",
      "available": true/false,
      "rationale": "detailed explanation"
    }
  ],
  "logoIdeas": [
    {
      "concept": "detailed concept description",
      "style": "style category",
      "elements": "specific design elements"
    }
  ],
  "brandColors": [
    {
      "name": "Color Name",
      "hex": "#HEXCODE",
      "usage": "specific usage guidelines"
    }
  ],
  "taglines": ["tagline1", "tagline2", "tagline3"],
  "brandVoice": {
    "tone": "specific tone description",
    "style": "communication style details"
  }
}`;

    console.log('Generating launch toolkit with prompt:', {
      businessName,
      businessType,
      targetCustomer,
      brandVibe
    });

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
            content: 'You are a world-class brand strategist who creates unique, personalized brand identities. Always respond with valid JSON only. Never use generic or template responses. Each output must be completely tailored to the specific business details provided.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.9, // Increased for more creativity and uniqueness
        max_tokens: 2000,
      }),
    });

    const openaiData = await openaiResponse.json();
    console.log('OpenAI response received');
    
    let launchAssets;
    
    try {
      const content = openaiData.choices[0].message.content;
      console.log('Raw OpenAI content:', content);
      launchAssets = JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse OpenAI response:', e);
      // Fallback with personalized content based on inputs
      launchAssets = {
        nameAlternatives: [
          { 
            name: `${businessName}${businessType.includes('tech') ? 'Tech' : businessType.includes('eco') ? 'Green' : 'Pro'}`, 
            domain: `${businessName.toLowerCase()}pro.com`, 
            available: true, 
            rationale: `Professional variant for ${businessType} targeting ${targetCustomer}` 
          },
          { 
            name: `${businessName}${brandVibe.includes('luxury') ? 'Elite' : brandVibe.includes('fun') ? 'Hub' : 'Co'}`, 
            domain: `${businessName.toLowerCase()}hub.com`, 
            available: false, 
            rationale: `Reflects ${brandVibe} personality for ${targetCustomer}` 
          }
        ],
        logoIdeas: [
          { 
            concept: `${brandVibe} design with ${businessType} industry elements`, 
            style: brandVibe.includes('luxury') ? 'Elegant' : brandVibe.includes('fun') ? 'Playful' : 'Professional', 
            elements: `Typography and icons that appeal to ${targetCustomer}` 
          },
          { 
            concept: `Modern interpretation of ${businessType} with ${brandVibe} aesthetic`, 
            style: "Contemporary", 
            elements: `Clean design reflecting ${styleInspiration || 'modern trends'}` 
          }
        ],
        brandColors: [
          { 
            name: "Primary Brand", 
            hex: colorPreferences.includes('blue') ? "#2563EB" : brandVibe.includes('eco') ? "#059669" : "#DC2626", 
            usage: `Main brand color for ${businessType}` 
          },
          { 
            name: "Secondary", 
            hex: "#64748B", 
            usage: `Supporting color for ${targetCustomer} appeal` 
          },
          { 
            name: "Accent", 
            hex: "#F59E0B", 
            usage: "Highlights and call-to-action elements" 
          }
        ],
        taglines: [
          businessType.includes('tech') ? "Innovate Forward" : businessType.includes('eco') ? "Sustainably Yours" : "Excellence Delivered",
          brandVibe.includes('luxury') ? "Refined Excellence" : brandVibe.includes('fun') ? "Joy Delivered" : "Your Success Partner",
          `For ${targetCustomer.split(' ')[0]} Leaders`
        ],
        brandVoice: { 
          tone: `${brandVibe} and ${targetCustomer}-focused`, 
          style: `Communication style tailored for ${businessType} industry` 
        }
      };
    }

    // Save launch assets to database
    const { data: savedAssets } = await supabase.from('launch_assets').insert({
      user_id: user.id,
      business_name: businessName,
      industry: businessType,
      logo_concepts: launchAssets.logoIdeas,
      name_suggestions: launchAssets.nameAlternatives,
      brand_colors: launchAssets.brandColors
    }).select().single();

    // Save to prompt history
    await supabase.from('prompt_history').insert({
      user_id: user.id,
      tool_name: 'launch-toolkit',
      prompt: `Business: ${businessName}, Type: ${businessType}, Customer: ${targetCustomer}, Vibe: ${brandVibe}`,
      response: JSON.stringify(launchAssets)
    });

    console.log('Launch toolkit generated and saved successfully');

    return new Response(JSON.stringify({ ...launchAssets, id: savedAssets?.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-launch-toolkit:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
