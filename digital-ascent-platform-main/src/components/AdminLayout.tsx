import { Navigate, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Butterfly } from "./Butterfly";
import { Users, BookOpen, Sparkles, MessageSquare, BarChart3, LogOut, Home } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const items = [
  { to: "/admin", label: "نظرة عامة", icon: BarChart3, end: true },
  { to: "/admin/students", label: "الطالبات", icon: Users },
  { to: "/admin/lessons", label: "الدروس", icon: BookOpen },
  { to: "/admin/quizzes", label: "الاختبارات", icon: Sparkles },
  { to: "/admin/inquiries", label: "مركز التواصل", icon: MessageSquare },
];

export default function AdminLayout() {
  const { user, isAdmin, loading, signOut } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">جارٍ التحميل…</div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div className="glass-card p-10 max-w-md">
        <h2 className="text-xl font-bold mb-2">صلاحيات غير كافية</h2>
        <p className="text-muted-foreground mb-4">يجب أن يكون لحسابك دور "admin" للوصول إلى لوحة التحكم.</p>
        <Button onClick={() => signOut()}>تسجيل الخروج</Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gradient-soft">
      <aside className="hidden lg:flex w-72 flex-col bg-sidebar text-sidebar-foreground p-6">
        <div className="flex items-center gap-3 mb-10">
          <Butterfly className="w-10 h-10" />
          <div>
            <div className="font-bold">لوحة التحكم</div>
            <div className="text-xs opacity-70">المعلمة نزيهة حمدي</div>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                isActive ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-gold" : "hover:bg-sidebar-accent"
              )}
            >
              <it.icon className="w-5 h-5" />
              <span>{it.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="space-y-2 pt-4 border-t border-sidebar-border">
          <NavLink to="/" className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm hover:bg-sidebar-accent">
            <Home className="w-4 h-4" /> الموقع الرئيسي
          </NavLink>
          <button onClick={() => signOut()} className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm hover:bg-sidebar-accent">
            <LogOut className="w-4 h-4" /> خروج
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-sidebar text-sidebar-foreground">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2"><Butterfly className="w-7 h-7" /><span className="font-bold text-sm">لوحة التحكم</span></div>
          <button onClick={() => signOut()}><LogOut className="w-5 h-5" /></button>
        </div>
        <div className="flex overflow-x-auto gap-1 px-3 pb-2">
          {items.map((it) => (
            <NavLink key={it.to} to={it.to} end={it.end} className={({ isActive }) => cn("text-xs px-3 py-1.5 rounded-full whitespace-nowrap", isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "bg-sidebar-accent")}>
              {it.label}
            </NavLink>
          ))}
        </div>
      </div>

      <main className="flex-1 p-4 md:p-8 lg:p-10 pt-28 lg:pt-10 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
