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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bar_cabinet: {
        Row: {
          added_at: string | null
          brand: string | null
          ingredient_id: number
          notes: string | null
          quantity_ml: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          added_at?: string | null
          brand?: string | null
          ingredient_id: number
          notes?: string | null
          quantity_ml?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          added_at?: string | null
          brand?: string | null
          ingredient_id?: number
          notes?: string | null
          quantity_ml?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bar_cabinet_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
      cocktail_ingredients: {
        Row: {
          amount_ml: number
          cocktail_id: number
          display_order: number | null
          id: number
          ingredient_id: number
          is_optional: boolean | null
          notes: string | null
          unit: string | null
        }
        Insert: {
          amount_ml: number
          cocktail_id: number
          display_order?: number | null
          id?: number
          ingredient_id: number
          is_optional?: boolean | null
          notes?: string | null
          unit?: string | null
        }
        Update: {
          amount_ml?: number
          cocktail_id?: number
          display_order?: number | null
          id?: number
          ingredient_id?: number
          is_optional?: boolean | null
          notes?: string | null
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cocktail_ingredients_cocktail_id_fkey"
            columns: ["cocktail_id"]
            isOneToOne: false
            referencedRelation: "cocktails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cocktail_ingredients_cocktail_id_fkey"
            columns: ["cocktail_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_suggestions"
            referencedColumns: ["cocktail_id"]
          },
          {
            foreignKeyName: "cocktail_ingredients_cocktail_id_fkey"
            columns: ["cocktail_id"]
            isOneToOne: false
            referencedRelation: "v_cocktails_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cocktail_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
      cocktail_tags: {
        Row: {
          cocktail_id: number
          tag: string
        }
        Insert: {
          cocktail_id: number
          tag: string
        }
        Update: {
          cocktail_id?: number
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "cocktail_tags_cocktail_id_fkey"
            columns: ["cocktail_id"]
            isOneToOne: false
            referencedRelation: "cocktails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cocktail_tags_cocktail_id_fkey"
            columns: ["cocktail_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_suggestions"
            referencedColumns: ["cocktail_id"]
          },
          {
            foreignKeyName: "cocktail_tags_cocktail_id_fkey"
            columns: ["cocktail_id"]
            isOneToOne: false
            referencedRelation: "v_cocktails_full"
            referencedColumns: ["id"]
          },
        ]
      }
      cocktail_variants: {
        Row: {
          change_notes: string | null
          created_at: string | null
          description: string | null
          id: number
          name: string
          parent_id: number
        }
        Insert: {
          change_notes?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          parent_id: number
        }
        Update: {
          change_notes?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          parent_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "cocktail_variants_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "cocktails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cocktail_variants_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_suggestions"
            referencedColumns: ["cocktail_id"]
          },
          {
            foreignKeyName: "cocktail_variants_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "v_cocktails_full"
            referencedColumns: ["id"]
          },
        ]
      }
      cocktails: {
        Row: {
          abv: number | null
          avg_rating: number | null
          calories: number | null
          category: string
          color_hex: string | null
          created_at: string | null
          description: string | null
          difficulty: Database["public"]["Enums"]["difficulty"] | null
          garnish: string | null
          glass_type: Database["public"]["Enums"]["glass_type"]
          gradient_css: string | null
          id: number
          is_alcoholic: boolean | null
          is_published: boolean | null
          is_seasonal: boolean | null
          method: string | null
          name: string
          name_en: string | null
          origin: string | null
          rating_count: number | null
          season_theme: Database["public"]["Enums"]["app_theme"] | null
          slug: string | null
          time_minutes: number | null
          updated_at: string | null
          view_count: number | null
          year_created: number | null
        }
        Insert: {
          abv?: number | null
          avg_rating?: number | null
          calories?: number | null
          category: string
          color_hex?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty"] | null
          garnish?: string | null
          glass_type: Database["public"]["Enums"]["glass_type"]
          gradient_css?: string | null
          id?: number
          is_alcoholic?: boolean | null
          is_published?: boolean | null
          is_seasonal?: boolean | null
          method?: string | null
          name: string
          name_en?: string | null
          origin?: string | null
          rating_count?: number | null
          season_theme?: Database["public"]["Enums"]["app_theme"] | null
          slug?: string | null
          time_minutes?: number | null
          updated_at?: string | null
          view_count?: number | null
          year_created?: number | null
        }
        Update: {
          abv?: number | null
          avg_rating?: number | null
          calories?: number | null
          category?: string
          color_hex?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty"] | null
          garnish?: string | null
          glass_type?: Database["public"]["Enums"]["glass_type"]
          gradient_css?: string | null
          id?: number
          is_alcoholic?: boolean | null
          is_published?: boolean | null
          is_seasonal?: boolean | null
          method?: string | null
          name?: string
          name_en?: string | null
          origin?: string | null
          rating_count?: number | null
          season_theme?: Database["public"]["Enums"]["app_theme"] | null
          slug?: string | null
          time_minutes?: number | null
          updated_at?: string | null
          view_count?: number | null
          year_created?: number | null
        }
        Relationships: []
      }
      custom_cocktail_layers: {
        Row: {
          amount_ml: number
          color_hex: string | null
          custom_cocktail_id: string
          custom_name: string | null
          display_order: number | null
          id: number
          ingredient_id: number | null
        }
        Insert: {
          amount_ml: number
          color_hex?: string | null
          custom_cocktail_id: string
          custom_name?: string | null
          display_order?: number | null
          id?: number
          ingredient_id?: number | null
        }
        Update: {
          amount_ml?: number
          color_hex?: string | null
          custom_cocktail_id?: string
          custom_name?: string | null
          display_order?: number | null
          id?: number
          ingredient_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "custom_cocktail_layers_custom_cocktail_id_fkey"
            columns: ["custom_cocktail_id"]
            isOneToOne: false
            referencedRelation: "custom_cocktails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custom_cocktail_layers_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_cocktails: {
        Row: {
          abv: number | null
          calories: number | null
          created_at: string | null
          description: string | null
          garnish: string | null
          glass_type: Database["public"]["Enums"]["glass_type"]
          ice_type: string | null
          id: string
          is_public: boolean | null
          name: string
          salt_rim: boolean | null
          share_token: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          abv?: number | null
          calories?: number | null
          created_at?: string | null
          description?: string | null
          garnish?: string | null
          glass_type: Database["public"]["Enums"]["glass_type"]
          ice_type?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          salt_rim?: boolean | null
          share_token?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          abv?: number | null
          calories?: number | null
          created_at?: string | null
          description?: string | null
          garnish?: string | null
          glass_type?: Database["public"]["Enums"]["glass_type"]
          ice_type?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          salt_rim?: boolean | null
          share_token?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          cocktail_id: number
          created_at: string | null
          user_id: string
        }
        Insert: {
          cocktail_id: number
          created_at?: string | null
          user_id: string
        }
        Update: {
          cocktail_id?: number
          created_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_cocktail_id_fkey"
            columns: ["cocktail_id"]
            isOneToOne: false
            referencedRelation: "cocktails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_cocktail_id_fkey"
            columns: ["cocktail_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_suggestions"
            referencedColumns: ["cocktail_id"]
          },
          {
            foreignKeyName: "favorites_cocktail_id_fkey"
            columns: ["cocktail_id"]
            isOneToOne: false
            referencedRelation: "v_cocktails_full"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredients: {
        Row: {
          abv: number | null
          calories_per_ml: number | null
          category: Database["public"]["Enums"]["ing_category"]
          color_hex: string
          color_opacity: number | null
          created_at: string | null
          description: string | null
          flavor_notes: string[] | null
          id: number
          is_alcoholic: boolean | null
          is_effervescent: boolean | null
          name: string
          name_en: string | null
          origin: string | null
          slug: string | null
          updated_at: string | null
          year_created: number | null
        }
        Insert: {
          abv?: number | null
          calories_per_ml?: number | null
          category: Database["public"]["Enums"]["ing_category"]
          color_hex?: string
          color_opacity?: number | null
          created_at?: string | null
          description?: string | null
          flavor_notes?: string[] | null
          id?: number
          is_alcoholic?: boolean | null
          is_effervescent?: boolean | null
          name: string
          name_en?: string | null
          origin?: string | null
          slug?: string | null
          updated_at?: string | null
          year_created?: number | null
        }
        Update: {
          abv?: number | null
          calories_per_ml?: number | null
          category?: Database["public"]["Enums"]["ing_category"]
          color_hex?: string
          color_opacity?: number | null
          created_at?: string | null
          description?: string | null
          flavor_notes?: string[] | null
          id?: number
          is_alcoholic?: boolean | null
          is_effervescent?: boolean | null
          name?: string
          name_en?: string | null
          origin?: string | null
          slug?: string | null
          updated_at?: string | null
          year_created?: number | null
        }
        Relationships: []
      }
      professional_profiles: {
        Row: {
          address: string | null
          business_name: string
          business_type: Database["public"]["Enums"]["business_type"]
          city: string | null
          country: string | null
          created_at: string | null
          instagram: string | null
          is_verified: boolean | null
          staff_count: number | null
          tier: Database["public"]["Enums"]["account_tier"] | null
          user_id: string
          website: string | null
        }
        Insert: {
          address?: string | null
          business_name: string
          business_type: Database["public"]["Enums"]["business_type"]
          city?: string | null
          country?: string | null
          created_at?: string | null
          instagram?: string | null
          is_verified?: boolean | null
          staff_count?: number | null
          tier?: Database["public"]["Enums"]["account_tier"] | null
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string | null
          business_name?: string
          business_type?: Database["public"]["Enums"]["business_type"]
          city?: string | null
          country?: string | null
          created_at?: string | null
          instagram?: string | null
          is_verified?: boolean | null
          staff_count?: number | null
          tier?: Database["public"]["Enums"]["account_tier"] | null
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      ratings: {
        Row: {
          cocktail_id: number
          created_at: string | null
          review: string | null
          stars: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cocktail_id: number
          created_at?: string | null
          review?: string | null
          stars: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cocktail_id?: number
          created_at?: string | null
          review?: string | null
          stars?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ratings_cocktail_id_fkey"
            columns: ["cocktail_id"]
            isOneToOne: false
            referencedRelation: "cocktails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_cocktail_id_fkey"
            columns: ["cocktail_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_suggestions"
            referencedColumns: ["cocktail_id"]
          },
          {
            foreignKeyName: "ratings_cocktail_id_fkey"
            columns: ["cocktail_id"]
            isOneToOne: false
            referencedRelation: "v_cocktails_full"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          age_verified: boolean
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string
          id: string
          preferred_theme: Database["public"]["Enums"]["app_theme"] | null
          tier: Database["public"]["Enums"]["account_tier"]
          updated_at: string
          username: string
        }
        Insert: {
          age_verified?: boolean
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name: string
          id: string
          preferred_theme?: Database["public"]["Enums"]["app_theme"] | null
          tier?: Database["public"]["Enums"]["account_tier"]
          updated_at?: string
          username: string
        }
        Update: {
          age_verified?: boolean
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string
          id?: string
          preferred_theme?: Database["public"]["Enums"]["app_theme"] | null
          tier?: Database["public"]["Enums"]["account_tier"]
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      view_history: {
        Row: {
          cocktail_id: number
          user_id: string
          viewed_at: string | null
        }
        Insert: {
          cocktail_id: number
          user_id: string
          viewed_at?: string | null
        }
        Update: {
          cocktail_id?: number
          user_id?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "view_history_cocktail_id_fkey"
            columns: ["cocktail_id"]
            isOneToOne: false
            referencedRelation: "cocktails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "view_history_cocktail_id_fkey"
            columns: ["cocktail_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_suggestions"
            referencedColumns: ["cocktail_id"]
          },
          {
            foreignKeyName: "view_history_cocktail_id_fkey"
            columns: ["cocktail_id"]
            isOneToOne: false
            referencedRelation: "v_cocktails_full"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      v_cabinet_suggestions: {
        Row: {
          abv: number | null
          cocktail_id: number | null
          completeness_pct: number | null
          difficulty: Database["public"]["Enums"]["difficulty"] | null
          glass_type: Database["public"]["Enums"]["glass_type"] | null
          name: string | null
          owned_ingredients: number | null
          total_ingredients: number | null
          user_id: string | null
        }
        Relationships: []
      }
      v_cocktails_full: {
        Row: {
          abv: number | null
          avg_rating: number | null
          calories: number | null
          category: string | null
          color_hex: string | null
          created_at: string | null
          description: string | null
          difficulty: Database["public"]["Enums"]["difficulty"] | null
          garnish: string | null
          glass_type: Database["public"]["Enums"]["glass_type"] | null
          gradient_css: string | null
          id: number | null
          ingredients: Json | null
          is_alcoholic: boolean | null
          is_published: boolean | null
          is_seasonal: boolean | null
          method: string | null
          name: string | null
          name_en: string | null
          origin: string | null
          rating_count: number | null
          season_theme: Database["public"]["Enums"]["app_theme"] | null
          slug: string | null
          tags: string[] | null
          time_minutes: number | null
          updated_at: string | null
          view_count: number | null
          year_created: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      increment_view_count: {
        Args: { p_cocktail_id: number }
        Returns: undefined
      }
      search_cocktails: {
        Args: {
          p_category?: string
          p_difficulty?: Database["public"]["Enums"]["difficulty"]
          p_glass?: Database["public"]["Enums"]["glass_type"]
          p_limit?: number
          p_max_abv?: number
          p_min_abv?: number
          p_offset?: number
          q: string
        }
        Returns: {
          abv: number | null
          avg_rating: number | null
          calories: number | null
          category: string
          color_hex: string | null
          created_at: string | null
          description: string | null
          difficulty: Database["public"]["Enums"]["difficulty"] | null
          garnish: string | null
          glass_type: Database["public"]["Enums"]["glass_type"]
          gradient_css: string | null
          id: number
          is_alcoholic: boolean | null
          is_published: boolean | null
          is_seasonal: boolean | null
          method: string | null
          name: string
          name_en: string | null
          origin: string | null
          rating_count: number | null
          season_theme: Database["public"]["Enums"]["app_theme"] | null
          slug: string | null
          time_minutes: number | null
          updated_at: string | null
          view_count: number | null
          year_created: number | null
        }[]
        SetofOptions: {
          from: "*"
          to: "cocktails"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      unaccent: { Args: { "": string }; Returns: string }
    }
    Enums: {
      account_tier: "free" | "pro" | "professional" | "enterprise"
      app_theme:
        | "night"
        | "day"
        | "summer"
        | "winter"
        | "halloween"
        | "christmas"
      business_type: "bar" | "restaurant" | "hotel" | "catering" | "private"
      difficulty: "easy" | "medium" | "hard"
      glass_type:
        | "martini"
        | "highball"
        | "oldfashioned"
        | "wine"
        | "coupe"
        | "margarita"
      ing_category:
        | "Bitter"
        | "Gin"
        | "Vodka"
        | "Rum"
        | "Tequila"
        | "Whisky"
        | "Vino"
        | "Liquori"
        | "Succhi"
        | "Sciroppi"
        | "Soft Drinks"
        | "Altro"
        | "Erbe"
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
    Enums: {
      account_tier: ["free", "pro", "professional", "enterprise"],
      app_theme: ["night", "day", "summer", "winter", "halloween", "christmas"],
      business_type: ["bar", "restaurant", "hotel", "catering", "private"],
      difficulty: ["easy", "medium", "hard"],
      glass_type: [
        "martini",
        "highball",
        "oldfashioned",
        "wine",
        "coupe",
        "margarita",
      ],
      ing_category: [
        "Bitter",
        "Gin",
        "Vodka",
        "Rum",
        "Tequila",
        "Whisky",
        "Vino",
        "Liquori",
        "Succhi",
        "Sciroppi",
        "Soft Drinks",
        "Altro",
        "Erbe",
      ],
    },
  },
} as const
