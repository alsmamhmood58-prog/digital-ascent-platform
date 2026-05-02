import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Lesson = { id: string; title: string; student_content: string; parent_guide: string; category: string; image_url: string | null };

export default function AdminLessons() {
  const [items, setItems] = useState<Lesson[]>([]);
  const [editing, setEditing] = useState<Partial<Lesson> | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("lessons").select("*").order("created_at", { ascending: false });
    setItems(data || []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.title) { toast.error("العنوان مطلوب"); return; }
    const payload = {
      title: editing.title,
      student_content: editing.student_content || "",
      parent_guide: editing.parent_guide || "",
      category: editing.category || "general",
      image_url: editing.image_url || null,
    };
    const { error } = editing.id
      ? await supabase.from("lessons").update(payload).eq("id", editing.id)
      : await supabase.from("lessons").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("تم الحفظ");
    setOpen(false); setEditing(null); load();
  };

  const del = async (id: string) => {
    if (!confirm("حذف الدرس؟")) return;
    const { error } = await supabase.from("lessons").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("تم الحذف"); load();
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gradient-royal">الدروس</h1>
          <p className="text-muted-foreground">أضيفي وعدّلي محتوى الدروس مع دليل ولي الأمر.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing({})} className="gradient-royal text-primary-foreground">
              <Plus className="ml-1 w-4 h-4" /> درس جديد
            </Button>
          </DialogTrigger>
          <DialogContent dir="rtl" className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing?.id ? "تعديل درس" : "درس جديد"}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>العنوان</Label><Input value={editing?.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>التصنيف</Label><Input value={editing?.category || ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} placeholder="مثال: مهارات رقمية" /></div>
                <div><Label>رابط صورة (اختياري)</Label><Input value={editing?.image_url || ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} /></div>
              </div>
              <Tabs defaultValue="student">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="student">عرض الطالبة</TabsTrigger>
                  <TabsTrigger value="parent">دليل ولي الأمر</TabsTrigger>
                </TabsList>
                <TabsContent value="student"><Textarea rows={8} value={editing?.student_content || ""} onChange={(e) => setEditing({ ...editing, student_content: e.target.value })} /></TabsContent>
                <TabsContent value="parent"><Textarea rows={8} value={editing?.parent_guide || ""} onChange={(e) => setEditing({ ...editing, parent_guide: e.target.value })} /></TabsContent>
              </Tabs>
            </div>
            <DialogFooter><Button onClick={save} className="gradient-royal text-primary-foreground">حفظ</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.length === 0 ? (
          <div className="glass-card p-10 text-center text-muted-foreground col-span-full">لا توجد دروس بعد</div>
        ) : items.map((l) => (
          <div key={l.id} className="glass-card p-5">
            <div className="text-xs text-accent mb-1">{l.category}</div>
            <h3 className="font-bold mb-2">{l.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{l.student_content}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => { setEditing(l); setOpen(true); }}><Pencil className="w-3 h-3 ml-1" /> تعديل</Button>
              <Button size="sm" variant="ghost" onClick={() => del(l.id)}><Trash2 className="w-3 h-3 text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
