
-- Create tables for storing user-generated content from OpenAI tools

-- Table for AI-generated business ideas
CREATE TABLE public.business_ideas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  market_size TEXT,
  difficulty TEXT,
  time_to_market TEXT,
  skills_input TEXT,
  interests_input TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for business plans
CREATE TABLE public.business_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  business_name TEXT NOT NULL,
  industry TEXT,
  target_market TEXT,
  problem TEXT,
  solution TEXT,
  revenue_model TEXT,
  competition TEXT,
  plan_content JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for launch toolkit assets
CREATE TABLE public.launch_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  business_name TEXT NOT NULL,
  industry TEXT,
  logo_concepts JSONB,
  name_suggestions JSONB,
  brand_colors JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for user tasks
CREATE TABLE public.user_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  priority TEXT DEFAULT 'medium',
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for prompt history
CREATE TABLE public.prompt_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  tool_name TEXT NOT NULL,
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.business_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.launch_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for business_ideas
CREATE POLICY "Users can view their own business ideas" 
  ON public.business_ideas FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own business ideas" 
  ON public.business_ideas FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own business ideas" 
  ON public.business_ideas FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own business ideas" 
  ON public.business_ideas FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for business_plans
CREATE POLICY "Users can view their own business plans" 
  ON public.business_plans FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own business plans" 
  ON public.business_plans FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own business plans" 
  ON public.business_plans FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own business plans" 
  ON public.business_plans FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for launch_assets
CREATE POLICY "Users can view their own launch assets" 
  ON public.launch_assets FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own launch assets" 
  ON public.launch_assets FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own launch assets" 
  ON public.launch_assets FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own launch assets" 
  ON public.launch_assets FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for user_tasks
CREATE POLICY "Users can view their own tasks" 
  ON public.user_tasks FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tasks" 
  ON public.user_tasks FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" 
  ON public.user_tasks FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" 
  ON public.user_tasks FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for prompt_history
CREATE POLICY "Users can view their own prompt history" 
  ON public.prompt_history FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own prompt history" 
  ON public.prompt_history FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prompt history" 
  ON public.prompt_history FOR DELETE 
  USING (auth.uid() = user_id);
