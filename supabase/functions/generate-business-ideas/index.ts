
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
    const { skills, problems, industries } = await req.json();
    
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

    const businessCoachPrompt = `You are a senior business strategist and startup incubator partner. A entrepreneur has shared their background with you, and you need to generate 4 high-potential startup ideas that match their profile.

ENTREPRENEUR PROFILE:
- Skills/Expertise: ${skills}
- Problems they want to solve: ${problems}
- Industry interests: ${industries}

As their business cofounder, provide 4 startup ideas that are:
1. Realistic and achievable given their skills
2. Address real market needs
3. Have clear monetization paths
4. Leverage their unique advantages

For each idea, provide exactly this structure:
{
  "name": "Concise, memorable business name",
  "description": "2-sentence elevator pitch",
  "problem": "Specific problem this solves",
  "solution": "How your approach solves it uniquely", 
  "targetAudience": "Detailed customer profile",
  "monetization": "Clear revenue model with pricing",
  "whyMatch": "Why this perfectly fits their skills and interests"
}

Return as a JSON array of 4 ideas. Be specific, actionable, and focus on real business opportunities that could generate $100K+ ARR within 18 months.`;

    console.log('Sending request to OpenAI with prompt:', businessCoachPrompt);

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
            content: 'You are a senior business strategist and startup incubator partner. Respond only with valid JSON arrays.' 
          },
          { role: 'user', content: businessCoachPrompt }
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;
    
    console.log('OpenAI response:', generatedContent);

    let ideas;
    try {
      ideas = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      throw new Error('Invalid response format from AI');
    }

    // Save ideas to database
    const savedIdeas = [];
    for (const idea of ideas) {
      const { data: savedIdea, error } = await supabaseClient
        .from('business_ideas')
        .insert({
          user_id: user.user.id,
          title: idea.name,
          description: idea.description,
          difficulty: 'Medium',
          market_size: 'Medium',
          time_to_market: '6-12 months',
          skills_input: skills,
          interests_input: `${problems} | ${industries}`,
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving idea:', error);
      } else {
        savedIdeas.push({
          id: savedIdea.id,
          name: idea.name,
          description: idea.description,
          problem: idea.problem,
          solution: idea.solution,
          targetAudience: idea.targetAudience,
          monetization: idea.monetization,
          whyMatch: idea.whyMatch,
          created_at: savedIdea.created_at
        });
      }
    }

    // Save to prompt history
    await supabaseClient
      .from('prompt_history')
      .insert({
        user_id: user.user.id,
        tool_name: 'idea-generator',
        prompt: `Skills: ${skills} | Problems: ${problems} | Industries: ${industries}`,
        response: JSON.stringify(ideas),
      });

    return new Response(JSON.stringify({ ideas: savedIdeas }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-business-ideas function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
