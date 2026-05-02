import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, BookOpen, Sparkles, TrendingUp, MessageSquare } from "lucide-react";

type Stats = {
  students: number;
  lessons: number;
  quizzes: number;
  results: number;
  avgScore: number;
  inquiries: number;
};

export default function AdminOverview() {
  const [s, setS] = useState<Stats | null>(null);

  useEffect(() => {
    (async () => {
      const [students, lessons, quizzes, results, inquiries] = await Promise.all([
        supabase.from("students").select("*", { count: "exact", head: true }),
        supabase.from("lessons").select("*", { count: "exact", head: true }),
        supabase.from("quizzes").select("*", { count: "exact", head: true }),
        supabase.from("quiz_results").select("score, total"),
        supabase.from("inquiries").select("*", { count: "exact", head: true }),
      ]);
      const rows = results.data || [];
      const avg = rows.length
        ? Math.round((rows.reduce((a, r) => a + (r.score / r.total) * 100, 0) / rows.length))
        : 0;
      setS({
        students: students.count || 0,
        lessons: lessons.count || 0,
        quizzes: quizzes.count || 0,
        results: rows.length,
        avgScore: avg,
        inquiries: inquiries.count || 0,
      });
    })();
  }, []);

  if (!s) return <div className="text-muted-foreground">جارٍ التحميل…</div>;

  const cards = [
    { label: "الطالبات", value: s.students, icon: Users, color: "gradient-royal" },
    { label: "الدروس", value: s.lessons, icon: BookOpen, color: "gradient-gold" },
    { label: "الاختبارات", value: s.quizzes, icon: Sparkles, color: "gradient-royal" },
    { label: "نتائج مُسجَّلة", value: s.results, icon: TrendingUp, color: "gradient-gold" },
    { label: "متوسط النتائج", value: `${s.avgScore}%`, icon: TrendingUp, color: "gradient-royal" },
    { label: "استفسارات", value: s.inquiries, icon: MessageSquare, color: "gradient-gold" },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gradient-royal">نظرة عامة</h1>
        <p className="text-muted-foreground">ملخّص شامل لنشاط المنصة.</p>
      </header>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c) => (
          <div key={c.label} className="glass-card p-6 hover-lift">
            <div className={`w-12 h-12 rounded-xl ${c.color} flex items-center justify-center mb-4`}>
              <c.icon className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="text-3xl font-bold">{c.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
