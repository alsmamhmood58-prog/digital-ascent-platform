import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";

type Question = { question: string; options: string[]; correctIndex: number };
type Quiz = { id: string; title: string; category: string; questions: Question[] };

export default function AdminQuizzes() {
  const [items, setItems] = useState<Quiz[]>([]);
  const [editing, setEditing] = useState<Partial<Quiz> | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("quizzes").select("*").order("created_at", { ascending: false });
    setItems((data as any) || []);
  };
  useEffect(() => { load(); }, []);

  const newQ = (): Question => ({ question: "", options: ["", ""], correctIndex: 0 });

  const updateQ = (i: number, patch: Partial<Question>) => {
    const qs = [...(editing?.questions || [])];
    qs[i] = { ...qs[i], ...patch };
    setEditing({ ...editing, questions: qs });
  };

  const save = async () => {
    if (!editing?.title) return toast.error("العنوان مطلوب");
    if (!editing?.questions?.length) return toast.error("أضيفي سؤالاً واحداً على الأقل");
    for (const q of editing.questions) {
      if (!q.question || q.options.length < 2 || q.options.some((o) => !o.trim())) {
        return toast.error("كل سؤال يجب أن يحتوي على نص وخيارين على الأقل");
      }
    }
    const payload = {
      title: editing.title,
      category: editing.category || "general",
      questions: editing.questions as any,
    };
    const { error } = editing.id
      ? await supabase.from("quizzes").update(payload).eq("id", editing.id)
      : await supabase.from("quizzes").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("تم الحفظ"); setOpen(false); setEditing(null); load();
  };

  const del = async (id: string) => {
    if (!confirm("حذف الاختبار؟")) return;
    const { error } = await supabase.from("quizzes").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("تم الحذف"); load();
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gradient-royal">الاختبارات</h1>
          <p className="text-muted-foreground">صمّمي اختبارات تفاعلية متعددة الخيارات.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing({ questions: [newQ()] })} className="gradient-royal text-primary-foreground">
              <Plus className="ml-1 w-4 h-4" /> اختبار جديد
            </Button>
          </DialogTrigger>
          <DialogContent dir="rtl" className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing?.id ? "تعديل اختبار" : "اختبار جديد"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>العنوان</Label><Input value={editing?.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
                <div><Label>التصنيف</Label><Input value={editing?.category || ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} /></div>
              </div>
              <div className="space-y-3">
                {(editing?.questions || []).map((q, i) => (
                  <div key={i} className="border rounded-xl p-4 space-y-2 bg-secondary/30">
                    <div className="flex justify-between items-center">
                      <Label>سؤال {i + 1}</Label>
                      <Button size="icon" variant="ghost" onClick={() => setEditing({ ...editing, questions: editing!.questions!.filter((_, j) => j !== i) })}><X className="w-4 h-4" /></Button>
                    </div>
                    <Input value={q.question} onChange={(e) => updateQ(i, { question: e.target.value })} placeholder="نص السؤال" />
                    {q.options.map((opt, oi) => (
                      <div key={oi} className="flex gap-2 items-center">
                        <input type="radio" checked={q.correctIndex === oi} onChange={() => updateQ(i, { correctIndex: oi })} className="w-4 h-4" />
                        <Input value={opt} onChange={(e) => {
                          const opts = [...q.options]; opts[oi] = e.target.value;
                          updateQ(i, { options: opts });
                        }} placeholder={`خيار ${oi + 1}`} />
                        {q.options.length > 2 && (
                          <Button size="icon" variant="ghost" onClick={() => {
                            const opts = q.options.filter((_, j) => j !== oi);
                            updateQ(i, { options: opts, correctIndex: Math.min(q.correctIndex, opts.length - 1) });
                          }}><X className="w-4 h-4" /></Button>
                        )}
                      </div>
                    ))}
                    <Button size="sm" variant="outline" onClick={() => updateQ(i, { options: [...q.options, ""] })}>+ خيار</Button>
                  </div>
                ))}
                <Button variant="outline" onClick={() => setEditing({ ...editing, questions: [...(editing?.questions || []), newQ()] })}>+ إضافة سؤال</Button>
              </div>
            </div>
            <DialogFooter><Button onClick={save} className="gradient-royal text-primary-foreground">حفظ</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.length === 0 ? (
          <div className="glass-card p-10 text-center text-muted-foreground col-span-full">لا توجد اختبارات</div>
        ) : items.map((q) => (
          <div key={q.id} className="glass-card p-5">
            <div className="text-xs text-accent mb-1">{q.category}</div>
            <h3 className="font-bold mb-2">{q.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{q.questions.length} أسئلة</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => { setEditing(q); setOpen(true); }}><Pencil className="w-3 h-3 ml-1" /> تعديل</Button>
              <Button size="sm" variant="ghost" onClick={() => del(q.id)}><Trash2 className="w-3 h-3 text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
