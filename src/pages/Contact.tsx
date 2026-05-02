import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  sender_name: z.string().trim().min(2, "الاسم قصير جداً").max(80),
  sender_phone: z.string().trim().max(30).optional().or(z.literal("")),
  message: z.string().trim().min(3, "الرسالة قصيرة جداً").max(2000),
});

export default function Contact() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ sender_name: name, sender_phone: phone, message });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("inquiries").insert({
      sender_name: name,
      sender_phone: phone || null,
      message,
    });
    setLoading(false);
    if (error) {
      toast.error("تعذّر الإرسال، حاولي لاحقاً.");
      return;
    }
    setSent(true);
    setName(""); setPhone(""); setMessage("");
  };

  return (
    <div className="container py-12 max-w-2xl">
      <header className="text-center mb-10 animate-fade-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-soft text-accent-foreground text-sm mb-4">
          <Mail className="w-4 h-4" /> تواصلي معنا
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gradient-royal mb-3">رأيُكِ يُهمّنا</h1>
        <p className="text-muted-foreground leading-relaxed">
          شاركينا اقتراحاتكِ أو استفساراتكِ، وسنردّ عليكِ بإذن الله.
        </p>
      </header>

      {sent ? (
        <div className="glass-card p-10 text-center animate-scale-in">
          <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">وصلتنا رسالتُكِ</h2>
          <p className="text-muted-foreground mb-6">شكراً جزيلاً، سنتواصل معكِ قريباً.</p>
          <Button onClick={() => setSent(false)} variant="outline">إرسال رسالة أخرى</Button>
        </div>
      ) : (
        <form onSubmit={submit} className="glass-card p-8 space-y-5">
          <div>
            <Label htmlFor="name">الاسم</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} required />
          </div>
          <div>
            <Label htmlFor="phone">رقم التواصل (اختياري)</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" maxLength={30} />
          </div>
          <div>
            <Label htmlFor="msg">رسالتُكِ</Label>
            <Textarea id="msg" value={message} onChange={(e) => setMessage(e.target.value)} rows={5} maxLength={2000} required />
          </div>
          <Button type="submit" disabled={loading} className="w-full gradient-royal text-primary-foreground">
            <Send className="ml-1 w-4 h-4" /> {loading ? "جارٍ الإرسال…" : "أرسلي الرسالة"}
          </Button>
        </form>
      )}
    </div>
  );
}
