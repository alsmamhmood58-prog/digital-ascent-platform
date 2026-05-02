-- Roles enum + table
CREATE TYPE public.app_role AS ENUM ('admin', 'teacher');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

-- Security definer function (avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Domain tables
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  grade TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  student_content TEXT NOT NULL DEFAULT '',
  parent_guide TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'general',
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  category TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE SET NULL,
  quiz_title TEXT NOT NULL,
  score INT NOT NULL,
  total INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name TEXT NOT NULL,
  sender_phone TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  reply TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- profiles: users see/update their own
CREATE POLICY "own profile select" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- user_roles: users can see their own roles; only admins manage
CREATE POLICY "own roles select" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "admin roles all" ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- students: admin only
CREATE POLICY "admin students all" ON public.students FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- lessons: public read, admin write
CREATE POLICY "public read lessons" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "admin write lessons" ON public.lessons FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin update lessons" ON public.lessons FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin delete lessons" ON public.lessons FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- quizzes: public read, admin write
CREATE POLICY "public read quizzes" ON public.quizzes FOR SELECT USING (true);
CREATE POLICY "admin write quizzes" ON public.quizzes FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin update quizzes" ON public.quizzes FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin delete quizzes" ON public.quizzes FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- quiz_results: anyone can submit, only admin reads
CREATE POLICY "public submit results" ON public.quiz_results FOR INSERT WITH CHECK (true);
CREATE POLICY "admin read results" ON public.quiz_results FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin delete results" ON public.quiz_results FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- inquiries: anyone submits, admin reads/updates
CREATE POLICY "public submit inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "admin read inquiries" ON public.inquiries FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin update inquiries" ON public.inquiries FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin delete inquiries" ON public.inquiries FOR DELETE USING (public.has_role(auth.uid(), 'admin'));