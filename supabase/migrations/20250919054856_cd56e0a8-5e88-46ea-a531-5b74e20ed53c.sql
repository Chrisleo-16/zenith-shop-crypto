-- Create products table
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0),
  category text NOT NULL,
  image_url text,
  stock_quantity integer NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for products
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage products" 
ON public.products 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create product categories table
CREATE TABLE public.product_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on product categories
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for product categories
CREATE POLICY "Categories are viewable by everyone" 
ON public.product_categories 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage categories" 
ON public.product_categories 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Create storage policies for product images
CREATE POLICY "Product images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'product-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update product images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'product-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete product images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'product-images' AND has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for products updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default product categories
INSERT INTO public.product_categories (name, description) VALUES
  ('Technology', 'Electronic devices and gadgets'),
  ('Fashion', 'Clothing, accessories, and style items'),
  ('Home & Lifestyle', 'Home decor and lifestyle products'),
  ('Sports & Fitness', 'Sports equipment and fitness gear'),
  ('Books & Media', 'Books, movies, and entertainment media');

-- Add USDT to crypto configuration if it doesn't exist
INSERT INTO public.crypto_config (currency_symbol, currency_name, wallet_address, is_active, min_confirmation) 
SELECT 'USDT', 'Tether USD', 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', true, 6
WHERE NOT EXISTS (SELECT 1 FROM public.crypto_config WHERE currency_symbol = 'USDT');

-- Update audit_action enum to include product management actions
ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'product_add';
ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'product_update';
ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'product_delete';
ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'product_restock';
ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'crypto_add';