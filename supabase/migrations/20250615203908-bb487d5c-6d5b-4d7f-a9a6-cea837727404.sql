
-- This function creates a new row in the public.usuarios table
-- whenever a new user signs up in auth.users.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.usuarios (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$;

-- This trigger calls the function after a new user is inserted into auth.users.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Remove the redundant password column from the public.usuarios table
-- as it is now securely managed by Supabase Auth.
ALTER TABLE public.usuarios
DROP COLUMN IF EXISTS senha;
