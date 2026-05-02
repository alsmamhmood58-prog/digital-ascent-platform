import { Shield, Lock, Eye, KeyRound, AlertTriangle, Heart } from "lucide-react";

const tips = [
  { icon: Lock, title: "كلمات السر القوية", text: "اختاري كلمات طويلة تجمع حروفاً وأرقاماً ورموزاً، ولا تشاركيها مع أحد." },
  { icon: Eye, title: "خصوصية المعلومات", text: "لا تنشري اسمك الكامل أو عنوان مدرستك أو صورك على المنصات المفتوحة." },
  { icon: KeyRound, title: "التحقّق بخطوتين", text: "فعّلي التحقق بخطوتين على حساباتك المهمة لزيادة الحماية." },
  { icon: AlertTriangle, title: "احذري من الروابط", text: "لا تنقري على روابط مجهولة المصدر، وتأكدي من المرسِل قبل الفتح." },
  { icon: Shield, title: "حماية الجهاز", text: "حدّثي نظامك باستمرار، واستخدمي برنامج حماية موثوقاً." },
  { icon: Heart, title: "السلوك الراقي", text: "اجعلي تعاملك الرقمي مرآةً لأخلاقك الراقية، وتجنّبي ما يؤذي غيرك." },
];

export default function DigitalShield() {
  return (
    <div className="container py-12">
      <header className="text-center mb-12 animate-fade-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm mb-4">
          <Shield className="w-4 h-4" /> الأمن السيبراني
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gradient-royal mb-3">الدرع الرقمي</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          وعيُكِ هو حصنُكِ الأول. إرشاداتٌ موجزة لتُبحري في العالم الرقمي بثقةٍ وأمان.
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tips.map((t, i) => (
          <article
            key={t.title}
            className="glass-card p-7 hover-lift animate-fade-up"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="w-14 h-14 rounded-2xl gradient-royal flex items-center justify-center mb-4 shadow-card">
              <t.icon className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-bold mb-2">{t.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{t.text}</p>
          </article>
        ))}
      </div>

      <div className="glass-card p-8 mt-12 text-center max-w-3xl mx-auto">
        <Shield className="w-12 h-12 mx-auto text-accent mb-3" />
        <p className="text-lg leading-loose">
          إذا واجهتِ موقفاً مريباً، تحدّثي مع ولي الأمر أو معلّمتك فوراً.
          <br />
          <span className="text-gradient-gold font-semibold">السلامة قبل كل شيء.</span>
        </p>
      </div>
    </div>
  );
}
