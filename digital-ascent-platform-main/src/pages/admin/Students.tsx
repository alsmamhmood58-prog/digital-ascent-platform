import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Student = { id: string; name: string; parent_phone: string; grade: string };

export default function AdminStudents() {
  const [items, setItems] = useState<Student[]>([]);
  const [editing, setEditing] = useState<Partial<Student> | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("students").select("*").order("created_at", { ascending: false });
    setItems(data || []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.name || !editing?.parent_phone || !editing?.grade) {
      toast.error("املئي جميع الحقول");
      return;
    }
    const payload = { name: editing.name, parent_phone: editing.parent_phone, grade: editing.grade };
    const { error } = editing.id
      ? await supabase.from("students").update(payload).eq("id", editing.id)
      : await supabase.from("students").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("تم الحفظ");
    setOpen(false); setEditing(null); load();
  };

  const del = async (id: string) => {
    if (!confirm("هل أنت متأكدة؟")) return;
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("تم الحذف"); load();
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gradient-royal">الطالبات</h1>
          <p className="text-muted-foreground">إدارة سجلات الطالبات.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing({})} className="gradient-royal text-primary-foreground">
              <Plus className="ml-1 w-4 h-4" /> إضافة طالبة
            </Button>
          </DialogTrigger>
          <DialogContent dir="rtl">
            <DialogHeader><DialogTitle>{editing?.id ? "تعديل طالبة" : "طالبة جديدة"}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>الاسم</Label><Input value={editing?.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
              <div><Label>رقم ولي الأمر</Label><Input value={editing?.parent_phone || ""} onChange={(e) => setEditing({ ...editing, parent_phone: e.target.value })} /></div>
              <div><Label>الصف</Label><Input value={editing?.grade || ""} onChange={(e) => setEditing({ ...editing, grade: e.target.value })} /></div>
            </div>
            <DialogFooter><Button onClick={save} className="gradient-royal text-primary-foreground">حفظ</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      <div className="glass-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow><TableHead>الاسم</TableHead><TableHead>رقم ولي الأمر</TableHead><TableHead>الصف</TableHead><TableHead className="w-32">إجراءات</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-10">لا توجد طالبات</TableCell></TableRow>
            ) : items.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell>{s.parent_phone}</TableCell>
                <TableCell>{s.grade}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => { setEditing(s); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => del(s.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
