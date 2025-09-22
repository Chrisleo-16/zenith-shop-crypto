-- Add points column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS points integer DEFAULT 0;

-- Create user_payments table to track payments for each user
CREATE TABLE IF NOT EXISTS public.user_payments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  product_id uuid REFERENCES products(id),
  product_name text,
  status text NOT NULL DEFAULT 'pending',
  payment_method text,
  transaction_hash text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create user_products table to track user's purchased/interacted products
CREATE TABLE IF NOT EXISTS public.user_products (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  payment_id uuid REFERENCES user_payments(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'purchased',
  quantity integer DEFAULT 1,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create bonus_milestones table for reward system
CREATE TABLE IF NOT EXISTS public.bonus_milestones (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  points_required integer NOT NULL,
  reward_title text NOT NULL,
  reward_description text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Insert default bonus milestones
INSERT INTO public.bonus_milestones (points_required, reward_title, reward_description) VALUES
(100, 'Bronze Member', '5% discount on next purchase'),
(500, 'Silver Member', '10% discount + free shipping'),
(1000, 'Gold Member', '15% discount + exclusive products'),
(2500, 'Platinum Member', '20% discount + priority support')
ON CONFLICT DO NOTHING;

-- Enable RLS on new tables
ALTER TABLE public.user_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bonus_milestones ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_payments
CREATE POLICY "Users can view their own payments" 
ON public.user_payments 
FOR SELECT 
USING (auth.uid() IN (SELECT user_id FROM profiles WHERE user_id = user_payments.user_id));

CREATE POLICY "Users can insert their own payments" 
ON public.user_payments 
FOR INSERT 
WITH CHECK (auth.uid() IN (SELECT user_id FROM profiles WHERE user_id = user_payments.user_id));

CREATE POLICY "Users can update their own payments" 
ON public.user_payments 
FOR UPDATE 
USING (auth.uid() IN (SELECT user_id FROM profiles WHERE user_id = user_payments.user_id));

CREATE POLICY "Admins can manage all payments" 
ON public.user_payments 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for user_products
CREATE POLICY "Users can view their own products" 
ON public.user_products 
FOR SELECT 
USING (auth.uid() IN (SELECT user_id FROM profiles WHERE user_id = user_products.user_id));

CREATE POLICY "Users can insert their own products" 
ON public.user_products 
FOR INSERT 
WITH CHECK (auth.uid() IN (SELECT user_id FROM profiles WHERE user_id = user_products.user_id));

CREATE POLICY "Admins can manage all user products" 
ON public.user_products 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for bonus_milestones
CREATE POLICY "Anyone can view bonus milestones" 
ON public.bonus_milestones 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage bonus milestones" 
ON public.bonus_milestones 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create triggers for updated_at
CREATE TRIGGER update_user_payments_updated_at
BEFORE UPDATE ON public.user_payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to award points based on payment
CREATE OR REPLACE FUNCTION public.award_points_for_payment()
RETURNS TRIGGER AS $$
BEGIN
  -- Award 1 point per dollar spent when payment is completed
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    UPDATE public.profiles 
    SET points = points + FLOOR(NEW.amount)
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for automatic points awarding
CREATE TRIGGER award_points_on_payment_completion
AFTER UPDATE ON public.user_payments
FOR EACH ROW
EXECUTE FUNCTION public.award_points_for_payment();