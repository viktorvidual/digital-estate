export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      masks: {
        Row: {
          created_at: string
          error_message: string | null
          id: number
          mask_id: string | null
          status: string | null
          url: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: number
          mask_id?: string | null
          status?: string | null
          url?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: number
          mask_id?: string | null
          status?: string | null
          url?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      prices: {
        Row: {
          created_at: string
          id: number
          monthlyBgn: number | null
          monthlyEur: number | null
          name: string | null
          photos: number | null
          stripeMonthlyPriceId: string | null
          stripeYearlyPriceId: string | null
          subtitle: string | null
          yearlyBgn: number | null
          yearlyEur: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          monthlyBgn?: number | null
          monthlyEur?: number | null
          name?: string | null
          photos?: number | null
          stripeMonthlyPriceId?: string | null
          stripeYearlyPriceId?: string | null
          subtitle?: string | null
          yearlyBgn?: number | null
          yearlyEur?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          monthlyBgn?: number | null
          monthlyEur?: number | null
          name?: string | null
          photos?: number | null
          stripeMonthlyPriceId?: string | null
          stripeYearlyPriceId?: string | null
          subtitle?: string | null
          yearlyBgn?: number | null
          yearlyEur?: number | null
        }
        Relationships: []
      }
      renders: {
        Row: {
          base_variation_status: string | null
          created_at: string
          dimensions: string | null
          file_path: string | null
          id: number
          render_id: string | null
          url: string | null
          user_id: string
        }
        Insert: {
          base_variation_status?: string | null
          created_at?: string
          dimensions?: string | null
          file_path?: string | null
          id?: number
          render_id?: string | null
          url?: string | null
          user_id: string
        }
        Update: {
          base_variation_status?: string | null
          created_at?: string
          dimensions?: string | null
          file_path?: string | null
          id?: number
          render_id?: string | null
          url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string | null
          id: number
          image_count: number | null
          stripe_customer_id: string
          stripe_plan_description: string | null
          stripe_plan_interval: string | null
          stripe_plan_name: string
          stripe_subscription_expire_at: string | null
          stripe_subscription_id: string | null
          stripe_subscription_status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          image_count?: number | null
          stripe_customer_id?: string
          stripe_plan_description?: string | null
          stripe_plan_interval?: string | null
          stripe_plan_name?: string
          stripe_subscription_expire_at?: string | null
          stripe_subscription_id?: string | null
          stripe_subscription_status?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          image_count?: number | null
          stripe_customer_id?: string
          stripe_plan_description?: string | null
          stripe_plan_interval?: string | null
          stripe_plan_name?: string
          stripe_subscription_expire_at?: string | null
          stripe_subscription_id?: string | null
          stripe_subscription_status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      variations: {
        Row: {
          base_variation_id: string | null
          created_at: string
          error_message: string | null
          file_path: string | null
          id: number
          is_base: boolean | null
          render_id: string | null
          room_type: string | null
          status: string | null
          style: string | null
          url: string | null
          user_id: string
          variation_id: string
        }
        Insert: {
          base_variation_id?: string | null
          created_at?: string
          error_message?: string | null
          file_path?: string | null
          id?: number
          is_base?: boolean | null
          render_id?: string | null
          room_type?: string | null
          status?: string | null
          style?: string | null
          url?: string | null
          user_id: string
          variation_id: string
        }
        Update: {
          base_variation_id?: string | null
          created_at?: string
          error_message?: string | null
          file_path?: string | null
          id?: number
          is_base?: boolean | null
          render_id?: string | null
          room_type?: string | null
          status?: string | null
          style?: string | null
          url?: string | null
          user_id?: string
          variation_id?: string
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
