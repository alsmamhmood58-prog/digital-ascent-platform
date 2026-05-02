import { Link, NavLink, useNavigate } from "react-router-dom";
import { Butterfly } from "./Butterfly";
import { Menu, X, LogOut, Shield, MapPin, Share2, Mail, BookOpen } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "الرئيسية" },
  { to: "/lessons", label: "الدروس" },
  { to: "/quizzes", label: "الاختبارات" },
  { to: "/digital-shield", label: "الدرع الرقمي" },
  { to: "/contact", label: "تواصل" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { isAdmin, user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <Butterfly className="w-10 h-10 group-hover:animate-flutter" />
          </div>
          <div className="leading-tight">
            <div className="text-lg font-bold text-gradient-royal">نحو تعلم رقمي</div>
            <div className="text-[11px] text-muted-foreground">مجمع إسكان الزهي</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-card"
                    : "text-foreground/80 hover:bg-secondary"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          {isAdmin ? (
            <>
              <Button variant="outline" size="sm" onClick={() => navigate("/admin")}>
                <Shield className="ml-1 w-4 h-4" /> لوحة التحكم
              </Button>
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : user ? (
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              <LogOut className="ml-1 w-4 h-4" /> خروج
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
              دخول المعلمة
            </Button>
          )}
        </div>

        <button
          className="lg:hidden p-2 rounded-md hover:bg-secondary"
          onClick={() => setOpen(!open)}
          aria-label="القائمة"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border/50 glass animate-fade-in">
          <nav className="container py-4 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "px-4 py-3 rounded-xl text-base font-medium",
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="border-t my-2" />
            {isAdmin ? (
              <Button onClick={() => { setOpen(false); navigate("/admin"); }}>
                <Shield className="ml-1 w-4 h-4" /> لوحة التحكم
              </Button>
            ) : user ? (
              <Button variant="outline" onClick={() => signOut()}>تسجيل الخروج</Button>
            ) : (
              <Button variant="outline" onClick={() => { setOpen(false); navigate("/auth"); }}>
                دخول المعلمة
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export const SCHOOL_MAP_URL = "https://maps.app.goo.gl/Cg6MD7WCVvMPcS838?g_st=aw";
export const SCHOOL_SHARE_URL = "https://share.google/7HWsfyhoUVOwgcm71";
export const RESOURCES_LIBRARY_URL = "https://share.google/7HWsfyhoUVOwgcm71";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/50 bg-primary-deep text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.07] bg-grid-soft pointer-events-none" />
      <div className="container py-14 grid gap-10 md:grid-cols-4 relative">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-3">
            <Butterfly className="w-9 h-9" />
            <span className="font-bold text-lg">نحو تعلم رقمي</span>
          </div>
          <p className="text-sm opacity-80 leading-relaxed max-w-md">
            منصة تعليمية متكاملة تجمع بين دفء الأسرة ودقة التقنية، لنرتقي معاً نحو تعلّمٍ راقٍ.
          </p>
          <div className="flex flex-wrap gap-2 mt-5">
            <a
              href={SCHOOL_MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm"
            >
              <MapPin className="w-4 h-4 text-accent" /> موقع المدرسة
            </a>
            <a
              href={RESOURCES_LIBRARY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm"
            >
              <BookOpen className="w-4 h-4 text-accent" /> مكتبة المصادر
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-accent">روابط سريعة</h4>
          <ul className="space-y-2 text-sm opacity-90">
            {links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-accent transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-accent">المعلمة</h4>
          <p className="text-sm opacity-90">المعلمة نزيهة حمدي</p>
          <p className="text-sm opacity-70 mt-1">مدرسة إسكان الزهي</p>
          <Link to="/contact" className="inline-flex items-center gap-2 mt-3 text-sm text-accent hover:underline">
            <Mail className="w-4 h-4" /> تواصل مباشر
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs opacity-70 relative">
        © {new Date().getFullYear()} نحو تعلم رقمي — جميع الحقوق محفوظة
      </div>
    </footer>
  );
}
