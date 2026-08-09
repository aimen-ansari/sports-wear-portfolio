export type InquiryStatus = "new" | "read" | "replied" | "archived";

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductRow = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  sku: string;
  short_description: string;
  description: string;
  material: string;
  available_sizes: string[];
  available_colors: string[];
  features: string[];
  customization_options: string[];
  image_urls: string[];
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductWithCategory = ProductRow & {
  categories: Pick<CategoryRow, "id" | "name" | "slug" | "is_active"> | null;
};

export type InquiryRow = {
  id: string;
  full_name: string;
  company_name: string;
  email: string;
  phone: string | null;
  country: string | null;
  product_id: string | null;
  product_name: string | null;
  product_sku: string | null;
  product_page_url: string | null;
  product_category: string | null;
  estimated_quantity: string | null;
  customization_requirements: string | null;
  message: string;
  reference_file_url: string | null;
  notification_status: "pending" | "sent" | "failed";
  notification_error: string | null;
  status: InquiryStatus;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: CategoryRow;
        Insert: Omit<CategoryRow, "created_at" | "updated_at"> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<CategoryRow, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      products: {
        Row: ProductRow;
        Insert: Omit<ProductRow, "created_at" | "updated_at"> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<ProductRow, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      inquiries: {
        Row: InquiryRow;
        Insert: Omit<InquiryRow, "created_at" | "updated_at"> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<InquiryRow, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      admin_users: {
        Row: { id: string; user_id: string; email: string; created_at: string };
        Insert: { id?: string; user_id: string; email: string; created_at?: string };
        Update: never;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
      consume_inquiry_rate_limit: { Args: { p_key: string }; Returns: boolean };
    };
    Enums: { inquiry_status: InquiryStatus };
    CompositeTypes: Record<string, never>;
  };
};
