-- Lock down SECURITY DEFINER functions: only the trigger / RLS engine should call them
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Validation trigger for inquiries (length limits)
CREATE OR REPLACE FUNCTION public.validate_inquiry()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF length(coalesce(NEW.sender_name,'')) < 2 OR length(NEW.sender_name) > 80 THEN
    RAISE EXCEPTION 'sender_name length invalid';
  END IF;
  IF length(coalesce(NEW.message,'')) < 3 OR length(NEW.message) > 2000 THEN
    RAISE EXCEPTION 'message length invalid';
  END IF;
  IF NEW.sender_phone IS NOT NULL AND length(NEW.sender_phone) > 30 THEN
    RAISE EXCEPTION 'sender_phone too long';
  END IF;
  -- Force safe defaults regardless of client input
  NEW.status := 'new';
  NEW.reply := NULL;
  RETURN NEW;
END;
$$;

CREATE TRIGGER inquiries_validate BEFORE INSERT ON public.inquiries
FOR EACH ROW EXECUTE FUNCTION public.validate_inquiry();

-- Validation trigger for quiz_results
CREATE OR REPLACE FUNCTION public.validate_quiz_result()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF length(coalesce(NEW.student_name,'')) < 2 OR length(NEW.student_name) > 80 THEN
    RAISE EXCEPTION 'student_name length invalid';
  END IF;
  IF length(coalesce(NEW.parent_phone,'')) < 5 OR length(NEW.parent_phone) > 30 THEN
    RAISE EXCEPTION 'parent_phone invalid';
  END IF;
  IF NEW.score < 0 OR NEW.total < 1 OR NEW.score > NEW.total THEN
    RAISE EXCEPTION 'score/total invalid';
  END IF;
  -- quiz must exist
  IF NEW.quiz_id IS NULL OR NOT EXISTS (SELECT 1 FROM public.quizzes WHERE id = NEW.quiz_id) THEN
    RAISE EXCEPTION 'quiz_id invalid';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER quiz_results_validate BEFORE INSERT ON public.quiz_results
FOR EACH ROW EXECUTE FUNCTION public.validate_quiz_result();