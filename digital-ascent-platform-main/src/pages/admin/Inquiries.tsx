import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CheckCircle, MessageSquare, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Inquiry = { id: string; sender_name: string; sender_phone: string | null; message: string; status: string; reply: string | null; created_at: string };

export default function AdminInquiries() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [active, setActive] = useState<Inquiry | null>(null);
  const [reply, setReply] = useState("");

  const load = async () => {
    const { data } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false });
    setItems(data || []);
  };
  useEffect(() => { load(); }, []);

  const saveReply = async () => {
    if (!active) return;
    const { error } = await supabase.from("inquiries").update({ reply, status: "replied" }).eq("id", active.id);
    if (error) return toast.error(error.message);
    toast.success("تم حفظ الرد"); setActive(null); setReply(""); load();
  };

  const del = async (id: string) => {
    if (!confirm("حذف الاستفسار؟")) return;
    const { error } = await supabase.from("inquiries").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("تم الحذف"); load();
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gradient-royal">مركز التواصل</h1>
        <p className="text-muted-foreground">استفسارات أولياء الأمور والطالبات.</p>
      </header>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="glass-card p-10 text-center text-muted-foreground">لا توجد استفسارات</div>
        ) : items.map((i) => (
          <div key={i.id} className="glass-card p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <div className="font-semibold">{i.sender_name}</div>
                {i.sender_phone && <div className="text-xs text-muted-foreground">{i.sender_phone}</div>}
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${i.status === "replied" ? "bg-success/10 text-success" : "bg-accent/10 text-accent-foreground"}`}>
                {i.status === "replied" ? "مرَدٌّ عليه" : "جديد"}
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-3">{i.message}</p>
            {i.reply && (
              <div className="bg-success/5 border-r-2 border-success p-3 rounded-md text-sm mb-3">
                <strong className="text-success">ردُّكِ:</strong> {i.reply}
              </div>
            )}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => { setActive(i); setReply(i.reply || ""); }}>
                <MessageSquare className="w-3 h-3 ml-1" /> {i.reply ? "تعديل الرد" : "الرد"}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => del(i.id)}><Trash2 className="w-3 h-3 text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>الرد على {active?.sender_name}</DialogTitle></DialogHeader>
          <div className="bg-secondary/40 p-3 rounded-md text-sm mb-3">{active?.message}</div>
          <Textarea rows={5} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="اكتبي ردّكِ هنا…" />
          <DialogFooter>
            <Button onClick={saveReply} className="gradient-royal text-primary-foreground"><CheckCircle className="w-4 h-4 ml-1" /> حفظ الرد</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
