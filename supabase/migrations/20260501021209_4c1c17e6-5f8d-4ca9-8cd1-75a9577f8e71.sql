-- Pin search_path on validation functions
CREATE OR REPLACE FUNCTION public.validate_inquiry()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
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
  NEW.status := 'new';
  NEW.reply := NULL;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_quiz_result()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
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
  IF NEW.quiz_id IS NULL OR NOT EXISTS (SELECT 1 FROM public.quizzes WHERE id = NEW.quiz_id) THEN
    RAISE EXCEPTION 'quiz_id invalid';
  END IF;
  RETURN NEW;
END;
$$;

-- Tighten public INSERT policies: enforce minimum field presence at policy level too
DROP POLICY "public submit inquiries" ON public.inquiries;
CREATE POLICY "public submit inquiries" ON public.inquiries FOR INSERT
  WITH CHECK (length(sender_name) >= 2 AND length(message) >= 3);

DROP POLICY "public submit results" ON public.quiz_results;
CREATE POLICY "public submit results" ON public.quiz_results FOR INSERT
  WITH CHECK (length(student_name) >= 2 AND quiz_id IS NOT NULL AND total > 0 AND score >= 0 AND score <= total);