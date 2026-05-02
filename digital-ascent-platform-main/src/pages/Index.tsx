import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Butterfly } from "@/components/Butterfly";
import {
  ArrowLeft,
  BookOpen,
  ShieldCheck,
  Sparkles,
  Users,
  Laptop,
  GraduationCap,
  MapPin,
  Share2,
  TrendingUp,
  Star,
  Award,
  CheckCircle2,
} from "lucide-react";
import heroImg from "@/assets/hero-butterfly.jpg";
import { SCHOOL_MAP_URL, RESOURCES_LIBRARY_URL } from "@/components/SiteLayout";

const Index = () => {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroImg}
            alt="فراشة ذهبية فوق حاسوب تعليمي"
            width={1920}
            height={1080}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute inset-0 bg-grid-soft opacity-20" />
        </div>

        {/* Floating butterflies */}
        <Butterfly className="hidden md:block absolute top-24 left-[10%] w-12 h-12 animate-flutter opacity-80" />
        <Butterfly className="hidden md:block absolute bottom-32 right-[8%] w-16 h-16 animate-butterfly opacity-90" />

        <div className="container relative py-24 md:py-36">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm mb-6 animate-fade-up">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>مدرسة إسكان الساحي • المعلمة نزيهة حمدي</span>
            </div>
            <h1
              className="text-4xl md:text-6xl font-bold leading-tight mb-6 animate-fade-up"
              style={{ animationDelay: "0.1s" }}
            >
              نحو تعلم رقمي
              <span className="block mt-2 text-gradient-gold">يربط الأسرة بالمدرسة</span>
            </h1>
            <p
              className="text-base md:text-lg leading-loose opacity-95 mb-8 animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              منصةٌ تعليمية متكاملة بمعايير عالمية، تجمع بين دفء الأسرة ودقة التقنية،
              لتحويل كل تحدٍّ رقمي إلى فرصةٍ للإبداع والتفوّق.
            </p>
            <div className="flex flex-wrap justify-center gap-3 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <Button asChild size="lg" className="gradient-gold text-accent-foreground hover:opacity-90 shadow-gold">
                <Link to="/lessons">
                  ابدئي رحلة التعلم <ArrowLeft className="mr-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/40 text-white hover:bg-white/20">
                <Link to="/quizzes">جربي اختباراً</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex flex-wrap justify-center gap-6 text-xs md:text-sm opacity-90 animate-fade-up" style={{ animationDelay: "0.4s" }}>
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> محتوى تعليمي معتمد</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> آمن للطالبات</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> دعم لولي الأمر</span>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="container -mt-10 relative z-10">
        <div className="glass-card grid grid-cols-2 md:grid-cols-4 divide-x divide-x-reverse divide-border/40 overflow-hidden">
          {[
            { icon: BookOpen, label: "دروس تفاعلية", value: "+20" },
            { icon: Sparkles, label: "اختبارات ذكية", value: "+15" },
            { icon: Users, label: "أُسر مشاركة", value: "+150" },
            { icon: Award, label: "نسبة الرضا", value: "98%" },
          ].map((s) => (
            <div key={s.label} className="p-5 md:p-6 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl gradient-royal text-primary-foreground flex items-center justify-center shadow-card">
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WELCOME LETTER */}
      <section className="container mt-12 relative z-10">
        <div className="glass-card p-8 md:p-12 max-w-4xl mx-auto animate-fade-up ring-soft">
          <div className="flex items-center gap-3 mb-5">
            <Butterfly className="w-10 h-10 animate-butterfly" />
            <h2 className="text-2xl md:text-3xl font-bold text-gradient-royal">رسالة المعلمة</h2>
          </div>
          <p className="text-base md:text-lg leading-loose text-foreground/90">
            مرحباً بكم في رحلةٍ استكشافية تتجاوز حدود الصفحات، وتُبحر بنا في آفاق المستقبل.
            المهارات الرقمية ليست مجرد دروس تُلقى، بل هي لغة العصر ومفتاحنا لفهم عالمٍ يتشكل من حولنا.
            يسعدني أن أضع بين أيديكم منصتي
            <span className="font-semibold text-primary"> (نحو تعلم رقمي يربط الأسرة بالمدرسة)</span> —
            صرحٌ ذكي يجمع بين دقة التقنية ودفء الشراكة الأسرية، نُحوّل فيه كل تحدٍّ تقني إلى فرصةٍ للإبداع
            <span className="text-accent"> 🦋</span>.
          </p>
          <div className="mt-6 text-left">
            <span className="inline-block text-gradient-gold font-semibold">— المعلمة نزيهة حمدي</span>
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <span className="chip mb-4"><Star className="w-3 h-3" /> ركائز المنصة</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">تجربة تعلّمٍ متكاملة</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            ثلاثُ ركائز أنيقة تُشكّل تجربة تعلّمٍ راقية لكل طالبةٍ وأسرتها.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: BookOpen,
              title: "الدروس",
              desc: "مسارٌ مزدوج: عرض للطالبة، ودليلُ دعمٍ خاص بولي الأمر.",
              to: "/lessons",
              tag: "تعليمي",
            },
            {
              icon: Sparkles,
              title: "الاختبارات",
              desc: "محرّك تفاعلي بنتائج فورية وتغذيةٍ راجعةٍ بصرية.",
              to: "/quizzes",
              tag: "تفاعلي",
            },
            {
              icon: ShieldCheck,
              title: "الدرع الرقمي",
              desc: "وعيٌ سيبراني وإرشاداتٌ ذكيةٌ لاستخدامٍ آمن.",
              to: "/digital-shield",
              tag: "أمان",
            },
          ].map((p) => (
            <Link to={p.to} key={p.title} className="glass-card p-7 hover-lift group block ring-soft">
              <div className="flex items-start justify-between mb-5">
                <div className="w-14 h-14 rounded-2xl gradient-royal text-primary-foreground flex items-center justify-center group-hover:scale-110 transition-transform shadow-card">
                  <p.icon className="w-7 h-7" />
                </div>
                <span className="chip">{p.tag}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{p.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{p.desc}</p>
              <div className="mt-4 text-primary font-medium text-sm flex items-center gap-1">
                ابدئي <ArrowLeft className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="container pb-20">
        <div className="glass-card p-8 md:p-12 grid md:grid-cols-5 gap-8 items-center ring-soft">
          <div className="md:col-span-3">
            <span className="chip mb-4"><GraduationCap className="w-3 h-3" /> عن المنصة</span>
            <h3 className="text-2xl md:text-3xl font-bold mb-3">
              تعليمٌ عالميُّ المعايير، بهويةٍ محلية
            </h3>
            <p className="text-muted-foreground leading-loose mb-5">
              صُمّمت <span className="font-semibold text-primary">"نحو تعلم رقمي"</span> لتكون
              منصةً تعليمية متكاملة بمعايير عالمية، تخدم طلاب و طالبات مدرسة إسكان الزهي وأولياء أمورهنّ.
              نمزج بين أحدث تقنيات التعليم الرقمي وأصالة المحتوى التربوي، لنقدّم تجربةً تعليمية
              راقية، آمنة، وممتعة.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              {[
                { icon: Laptop, t: "تقنية حديثة" },
                { icon: Users, t: "شراكة أسرية" },
                { icon: ShieldCheck, t: "بيئة آمنة" },
                { icon: TrendingUp, t: "متابعة مستمرة" },
              ].map((f) => (
                <div key={f.t} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/60">
                  <div className="w-9 h-9 rounded-lg gradient-gold flex items-center justify-center">
                    <f.icon className="w-4 h-4 text-accent-foreground" />
                  </div>
                  <span className="text-sm font-medium">{f.t}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="gradient-royal text-primary-foreground">
                <a href={SCHOOL_MAP_URL} target="_blank" rel="noopener noreferrer">
                  <MapPin className="ml-1 w-4 h-4" /> موقع المدرسة
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={RESOURCES_LIBRARY_URL} target="_blank" rel="noopener noreferrer">
                  <BookOpen className="ml-1 w-4 h-4" /> مكتبة المصادر
                </a>
              </Button>
            </div>
          </div>
          <div className="md:col-span-2 relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-soft p-6 flex items-center justify-center relative ring-soft">
              <Laptop className="w-32 h-32 text-primary/20 absolute" strokeWidth={1.2} />
              <Butterfly className="w-40 h-40 animate-butterfly relative z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* DUAL PATH */}
      <section className="container pb-24">
        <div className="glass-card p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center ring-soft">
          <div>
            <span className="chip mb-4"><Users className="w-3 h-3" /> شراكة الأسرة</span>
            <h3 className="text-2xl md:text-3xl font-bold mb-3">نظامُ المسار المزدوج</h3>
            <p className="text-muted-foreground leading-loose mb-5">
              لكل درسٍ وجهان: واجهة الطالبة الواضحة المُيسّرة، ودليلٌ خاصّ يُمكّن
              ولي الأمر من مرافقة ابنته خطوةً بخطوة، فيتحوّل البيت امتداداً راقياً للمدرسة.
            </p>
            <Button asChild className="gradient-royal text-primary-foreground">
              <Link to="/lessons">استعراض الدروس</Link>
            </Button>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-soft p-6 flex items-center justify-center">
              <Butterfly className="w-40 h-40 animate-butterfly" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
