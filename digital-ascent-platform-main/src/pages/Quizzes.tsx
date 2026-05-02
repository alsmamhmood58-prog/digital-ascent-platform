import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Trophy, RotateCcw, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

type Question = { question: string; options: string[]; correctIndex: number };
type Quiz = { id: string; title: string; category: string; questions: Question[] };

const studentSchema = z.object({
  name: z.string().trim().min(2, "الاسم قصير").max(80),
  phone: z.string().trim().min(5, "رقم غير صحيح").max(30),
});

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState<"list" | "intro" | "play" | "done">("list");
  const [active, setActive] = useState<Quiz | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    supabase.from("quizzes").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setQuizzes((data as any) || []);
      setLoading(false);
    });
  }, []);

  const startQuiz = (q: Quiz) => {
    setActive(q);
    setStage("intro");
    setIdx(0);
    setAnswers([]);
    setSelected(null);
    setScore(0);
  };

  const beginPlay = () => {
    const parsed = studentSchema.safeParse({ name, phone });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setStage("play");
  };

  const submitAnswer = () => {
    if (selected === null || !active) return;
    const correct = active.questions[idx].correctIndex;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    if (selected === correct) setScore((s) => s + 1);
    setSelected(null);
    if (idx + 1 >= active.questions.length) {
      finalize(newAnswers);
    } else {
      setIdx(idx + 1);
    }
  };

  const finalize = async (finalAnswers: number[]) => {
    if (!active) return;
    const finalScore = finalAnswers.reduce(
      (acc, a, i) => acc + (a === active.questions[i].correctIndex ? 1 : 0),
      0
    );
    await supabase.from("quiz_results").insert({
      student_name: name,
      parent_phone: phone,
      quiz_id: active.id,
      quiz_title: active.title,
      score: finalScore,
      total: active.questions.length,
    });
    setScore(finalScore);
    setStage("done");
  };

  const reset = () => {
    setStage("list");
    setActive(null);
    setName("");
    setPhone("");
  };

  if (loading) return <div className="container py-20 text-center text-muted-foreground">جارٍ التحميل…</div>;

  if (stage === "list") {
    return (
      <div className="container py-12">
        <header className="text-center mb-10 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-soft text-accent-foreground text-sm mb-4">
            <Sparkles className="w-4 h-4" /> الاختبارات التفاعلية
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gradient-royal mb-3">اختبري معرفتك</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">نتائج فورية، تغذية راجعة بصرية، وتجربة آمنة.</p>
        </header>
        {quizzes.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Sparkles className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">لا توجد اختبارات بعد.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((q) => (
              <article key={q.id} className="glass-card p-6 hover-lift">
                <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center text-accent-foreground mb-4 shadow-gold">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-secondary">{q.category}</span>
                <h3 className="text-xl font-bold my-2">{q.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{q.questions.length} أسئلة</p>
                <Button onClick={() => startQuiz(q)} className="w-full gradient-royal text-primary-foreground">
                  ابدئي الاختبار
                </Button>
              </article>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (stage === "intro" && active) {
    return (
      <div className="container py-16 max-w-xl">
        <div className="glass-card p-8 animate-scale-in">
          <h2 className="text-2xl font-bold text-gradient-royal mb-2">{active.title}</h2>
          <p className="text-muted-foreground mb-6">قبل البدء، أدخلي بياناتك لحفظ نتيجتك.</p>
          <div className="space-y-4">
            <div>
              <Label htmlFor="n">اسم الطالبة</Label>
              <Input id="n" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
            </div>
            <div>
              <Label htmlFor="p">رقم ولي الأمر</Label>
              <Input id="p" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" maxLength={30} />
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <Button onClick={beginPlay} className="flex-1 gradient-royal text-primary-foreground">ابدئي الآن</Button>
            <Button variant="outline" onClick={reset}>عودة</Button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "play" && active) {
    const q = active.questions[idx];
    const progress = ((idx) / active.questions.length) * 100;
    return (
      <div className="container py-12 max-w-2xl">
        <div className="glass-card p-8 animate-fade-up">
          <div className="flex justify-between mb-2 text-sm text-muted-foreground">
            <span>سؤال {idx + 1} من {active.questions.length}</span>
            <span>{active.title}</span>
          </div>
          <Progress value={progress} className="mb-6" />
          <h2 className="text-2xl font-bold mb-6 leading-relaxed">{q.question}</h2>
          <RadioGroup value={selected?.toString()} onValueChange={(v) => setSelected(parseInt(v))}>
            {q.options.map((opt, i) => (
              <Label
                key={i}
                htmlFor={`opt-${i}`}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selected === i ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                }`}
              >
                <RadioGroupItem value={i.toString()} id={`opt-${i}`} />
                <span className="text-base">{opt}</span>
              </Label>
            ))}
          </RadioGroup>
          <Button onClick={submitAnswer} disabled={selected === null} className="w-full mt-6 gradient-royal text-primary-foreground">
            {idx + 1 === active.questions.length ? "إنهاء" : "التالي"}
          </Button>
        </div>
      </div>
    );
  }

  if (stage === "done" && active) {
    const pct = Math.round((score / active.questions.length) * 100);
    const great = pct >= 70;
    return (
      <div className="container py-16 max-w-xl">
        <div className="glass-card p-10 text-center animate-scale-in">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 ${great ? "gradient-gold shadow-gold" : "bg-secondary"}`}>
            <Trophy className={`w-10 h-10 ${great ? "text-accent-foreground" : "text-muted-foreground"}`} />
          </div>
          <h2 className="text-3xl font-bold mb-2">{great ? "أحسنتِ!" : "نتيجة جيدة"}</h2>
          <p className="text-muted-foreground mb-6">حصلتِ على {score} من {active.questions.length}</p>
          <div className="text-6xl font-bold text-gradient-gold mb-6">{pct}%</div>

          <div className="text-right space-y-2 mb-6">
            {active.questions.map((q, i) => {
              const ok = answers[i] === q.correctIndex;
              return (
                <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-secondary/50">
                  {ok ? <CheckCircle2 className="w-5 h-5 text-success mt-0.5" /> : <XCircle className="w-5 h-5 text-destructive mt-0.5" />}
                  <div className="flex-1 text-sm">
                    <div className="font-medium">{q.question}</div>
                    {!ok && <div className="text-muted-foreground mt-1">الإجابة الصحيحة: {q.options[q.correctIndex]}</div>}
                  </div>
                </div>
              );
            })}
          </div>

          <Button onClick={reset} className="gradient-royal text-primary-foreground">
            <RotateCcw className="ml-1 w-4 h-4" /> العودة للاختبارات
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
