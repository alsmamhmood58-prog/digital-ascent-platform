import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BookOpen, Users, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type Lesson = {
  id: string;
  title: string;
  student_content: string;
  parent_guide: string;
  category: string;
  image_url: string | null;
};

export default function Lessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Lesson | null>(null);

  useEffect(() => {
    supabase
      .from("lessons")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setLessons(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container py-12">
      <header className="text-center mb-10 animate-fade-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-soft text-accent-foreground text-sm mb-4">
          <BookOpen className="w-4 h-4" />
          مكتبة الدروس
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gradient-royal mb-3">الدروس التفاعلية</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          لكل درسٍ مساران: واجهةٌ تُلهم الطالبة، ودليلُ دعمٍ يُرافق ولي الأمر.
        </p>
      </header>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-72 rounded-2xl" />)}
        </div>
      ) : lessons.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((l) => (
            <Dialog key={l.id} onOpenChange={(o) => o && setActive(l)}>
              <DialogTrigger asChild>
                <article className="glass-card overflow-hidden hover-lift cursor-pointer text-right group">
                  <div className="aspect-video bg-gradient-soft relative overflow-hidden">
                    {l.image_url ? (
                      <img src={l.image_url} alt={l.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Sparkles className="w-16 h-16 text-accent/60" />
                      </div>
                    )}
                    <span className="absolute top-3 right-3 px-3 py-1 text-xs rounded-full glass">
                      {l.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{l.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {l.student_content?.slice(0, 120)}...
                    </p>
                    <Button variant="ghost" className="mt-3 px-0 text-primary">افتحي الدرس →</Button>
                  </div>
                </article>
              </DialogTrigger>
              {active && active.id === l.id && (
                <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto" dir="rtl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl text-gradient-royal">{active.title}</DialogTitle>
                  </DialogHeader>
                  <Tabs defaultValue="student" className="mt-4">
                    <TabsList className="grid grid-cols-2 w-full">
                      <TabsTrigger value="student"><BookOpen className="ml-1 w-4 h-4" /> عرض الطالبة</TabsTrigger>
                      <TabsTrigger value="parent"><Users className="ml-1 w-4 h-4" /> دليل ولي الأمر</TabsTrigger>
                    </TabsList>
                    <TabsContent value="student" className="prose prose-slate max-w-none mt-6 leading-loose whitespace-pre-wrap">
                      {active.student_content}
                    </TabsContent>
                    <TabsContent value="parent" className="prose prose-slate max-w-none mt-6 leading-loose whitespace-pre-wrap">
                      <div className="p-4 rounded-xl bg-accent-soft text-accent-foreground mb-4">
                        <strong>عزيزي ولي الأمر:</strong> هذا الدليل لمساعدتك في مرافقة ابنتك خلال هذا الدرس.
                      </div>
                      {active.parent_guide || "لم يُضف دليل بعد."}
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              )}
            </Dialog>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="glass-card p-12 text-center">
      <BookOpen className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
      <h3 className="text-xl font-bold mb-2">لا توجد دروس بعد</h3>
      <p className="text-muted-foreground">ستُضاف الدروس قريباً بإذن الله.</p>
    </div>
  );
}
