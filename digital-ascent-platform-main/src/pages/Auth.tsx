import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Butterfly } from "@/components/Butterfly";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export default function Auth() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) navigate("/admin");
  }, [session, navigate]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("مرحباً بكِ!");
    navigate("/admin");
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
        data: { full_name: name },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("تم إنشاء الحساب. تحققي من بريدك ثم سجّلي الدخول.");
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4">
      <div className="glass-card p-8 w-full max-w-md animate-scale-in">
        <div className="text-center mb-6">
          <Butterfly className="w-14 h-14 mx-auto animate-butterfly mb-3" />
          <h1 className="text-2xl font-bold text-gradient-royal">دخول المعلمة</h1>
          <p className="text-sm text-muted-foreground mt-1">لوحة تحكم نحو تعلم رقمي</p>
        </div>

        <Tabs defaultValue="signin">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="signin">تسجيل الدخول</TabsTrigger>
            <TabsTrigger value="signup">حساب جديد</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <form onSubmit={signIn} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="e1">البريد الإلكتروني</Label>
                <Input id="e1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="p1">كلمة السر</Label>
                <Input id="p1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" disabled={loading} className="w-full gradient-royal text-primary-foreground">
                {loading ? "..." : "دخول"}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={signUp} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="n2">الاسم</Label>
                <Input id="n2" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="e2">البريد الإلكتروني</Label>
                <Input id="e2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="p2">كلمة السر</Label>
                <Input id="p2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
              </div>
              <Button type="submit" disabled={loading} className="w-full gradient-gold text-accent-foreground">
                {loading ? "..." : "إنشاء حساب"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                * بعد التسجيل، اطلبي من المسؤول إضافة دور "admin" لحسابك من قاعدة البيانات.
              </p>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
