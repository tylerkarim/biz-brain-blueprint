export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      business_ideas: {
        Row: {
          created_at: string
          description: string
          difficulty: string | null
          id: string
          interests_input: string | null
          market_size: string | null
          skills_input: string | null
          time_to_market: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          difficulty?: string | null
          id?: string
          interests_input?: string | null
          market_size?: string | null
          skills_input?: string | null
          time_to_market?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          difficulty?: string | null
          id?: string
          interests_input?: string | null
          market_size?: string | null
          skills_input?: string | null
          time_to_market?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      business_plans: {
        Row: {
          business_name: string
          competition: string | null
          created_at: string
          id: string
          industry: string | null
          plan_content: Json | null
          problem: string | null
          revenue_model: string | null
          solution: string | null
          target_market: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          business_name: string
          competition?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          plan_content?: Json | null
          problem?: string | null
          revenue_model?: string | null
          solution?: string | null
          target_market?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          business_name?: string
          competition?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          plan_content?: Json | null
          problem?: string | null
          revenue_model?: string | null
          solution?: string | null
          target_market?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      launch_assets: {
        Row: {
          brand_colors: Json | null
          business_name: string
          created_at: string
          id: string
          industry: string | null
          logo_concepts: Json | null
          name_suggestions: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          brand_colors?: Json | null
          business_name: string
          created_at?: string
          id?: string
          industry?: string | null
          logo_concepts?: Json | null
          name_suggestions?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          brand_colors?: Json | null
          business_name?: string
          created_at?: string
          id?: string
          industry?: string | null
          logo_concepts?: Json | null
          name_suggestions?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      prompt_history: {
        Row: {
          created_at: string
          id: string
          prompt: string
          response: string
          tool_name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          prompt: string
          response: string
          tool_name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          prompt?: string
          response?: string
          tool_name?: string
          user_id?: string
        }
        Relationships: []
      }
      user_tasks: {
        Row: {
          completed: boolean | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
