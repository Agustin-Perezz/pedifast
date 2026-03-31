export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.4';
  };
  public: {
    Tables: {
      accessory_groups: {
        Row: {
          id: number;
          is_required: boolean;
          name: string;
          selection_mode: string;
          shop_item_id: number;
          sort_order: number;
        };
        Insert: {
          id?: number;
          is_required?: boolean;
          name: string;
          selection_mode: string;
          shop_item_id: number;
          sort_order?: number;
        };
        Update: {
          id?: number;
          is_required?: boolean;
          name?: string;
          selection_mode?: string;
          shop_item_id?: number;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'accessory_groups_shop_item_id_fkey';
            columns: ['shop_item_id'];
            isOneToOne: false;
            referencedRelation: 'shop_items';
            referencedColumns: ['id'];
          }
        ];
      };
      accessory_options: {
        Row: {
          group_id: number;
          id: number;
          name: string;
          price_delta: number;
          sort_order: number;
        };
        Insert: {
          group_id: number;
          id?: number;
          name: string;
          price_delta?: number;
          sort_order?: number;
        };
        Update: {
          group_id?: number;
          id?: number;
          name?: string;
          price_delta?: number;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'accessory_options_group_id_fkey';
            columns: ['group_id'];
            isOneToOne: false;
            referencedRelation: 'accessory_groups';
            referencedColumns: ['id'];
          }
        ];
      };
      orders: {
        Row: {
          address: string | null;
          created_at: string;
          customer_name: string;
          customer_phone: string | null;
          delivery_cost: number;
          delivery_method: string;
          external_reference: string;
          id: number;
          items: Json;
          notes: string | null;
          payment_method: string;
          payment_status: string;
          shop_id: number;
          status: string;
          total: number;
          updated_at: string;
        };
        Insert: {
          address?: string | null;
          created_at?: string;
          customer_name: string;
          customer_phone?: string | null;
          delivery_cost?: number;
          delivery_method: string;
          external_reference: string;
          id?: never;
          items: Json;
          notes?: string | null;
          payment_method: string;
          payment_status?: string;
          shop_id: number;
          status?: string;
          total: number;
          updated_at?: string;
        };
        Update: {
          address?: string | null;
          created_at?: string;
          customer_name?: string;
          customer_phone?: string | null;
          delivery_cost?: number;
          delivery_method?: string;
          external_reference?: string;
          id?: never;
          items?: Json;
          notes?: string | null;
          payment_method?: string;
          payment_status?: string;
          shop_id?: number;
          status?: string;
          total?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'orders_shop_id_fkey';
            columns: ['shop_id'];
            isOneToOne: false;
            referencedRelation: 'shops';
            referencedColumns: ['id'];
          }
        ];
      };
      shop_items: {
        Row: {
          category: Database['public']['Enums']['shop_item_category'];
          created_at: string;
          description: string | null;
          id: number;
          images: string[];
          name: string;
          price: number;
          shop_id: number;
          updated_at: string;
        };
        Insert: {
          category: Database['public']['Enums']['shop_item_category'];
          created_at?: string;
          description?: string | null;
          id?: never;
          images?: string[];
          name: string;
          price: number;
          shop_id: number;
          updated_at?: string;
        };
        Update: {
          category?: Database['public']['Enums']['shop_item_category'];
          created_at?: string;
          description?: string | null;
          id?: never;
          images?: string[];
          name?: string;
          price?: number;
          shop_id?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'shop_items_shop_id_fkey';
            columns: ['shop_id'];
            isOneToOne: false;
            referencedRelation: 'shops';
            referencedColumns: ['id'];
          }
        ];
      };
      shops: {
        Row: {
          address: string;
          connected_at: string | null;
          created_at: string;
          dashboard_pin_hash: string | null;
          delivery_price: number | null;
          display_name: string | null;
          id: number;
          lat: number;
          lng: number;
          logo_url: string | null;
          mp_access_token: string | null;
          mp_public_key: string | null;
          mp_refresh_token: string | null;
          mp_token_expires_at: string | null;
          mp_user_id: string | null;
          open_hours: string | null;
          order_flow: string;
          portrait_url: string | null;
          price_per_km: number;
          shop_name: string;
          updated_at: string;
          whatsapp_phone: string;
        };
        Insert: {
          address: string;
          connected_at?: string | null;
          created_at?: string;
          dashboard_pin_hash?: string | null;
          delivery_price?: number | null;
          display_name?: string | null;
          id?: never;
          lat?: number;
          lng?: number;
          logo_url?: string | null;
          mp_access_token?: string | null;
          mp_public_key?: string | null;
          mp_refresh_token?: string | null;
          mp_token_expires_at?: string | null;
          mp_user_id?: string | null;
          open_hours?: string | null;
          order_flow?: string;
          portrait_url?: string | null;
          price_per_km?: number;
          shop_name: string;
          updated_at?: string;
          whatsapp_phone: string;
        };
        Update: {
          address?: string;
          connected_at?: string | null;
          created_at?: string;
          dashboard_pin_hash?: string | null;
          delivery_price?: number | null;
          display_name?: string | null;
          id?: never;
          lat?: number;
          lng?: number;
          logo_url?: string | null;
          mp_access_token?: string | null;
          mp_public_key?: string | null;
          mp_refresh_token?: string | null;
          mp_token_expires_at?: string | null;
          mp_user_id?: string | null;
          open_hours?: string | null;
          order_flow?: string;
          portrait_url?: string | null;
          price_per_km?: number;
          shop_name?: string;
          updated_at?: string;
          whatsapp_phone?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      shop_item_category:
        | 'pizzas'
        | 'hamburguesas'
        | 'empanadas'
        | 'sandwiches'
        | 'ensaladas'
        | 'papas'
        | 'milanesas'
        | 'bebidas';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      shop_item_category: [
        'pizzas',
        'hamburguesas',
        'empanadas',
        'sandwiches',
        'ensaladas',
        'papas',
        'milanesas',
        'bebidas'
      ]
    }
  }
} as const;
