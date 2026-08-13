import Link from "next/link"

const sections = [
  {
    title: "قبول الشروط",
    description:
      "باستخدامك لمنصة قزة الخيرية، فإنك توافق على الالتزام بهذه الشروط والأحكام، وتقر بأنك مسؤول عن أي استخدام لكامل المنصة أو أي جزء منها وفق القوانين المعمول بها في بلدك أو منطقتك.",
  },
  {
    title: "الغرض من المنصة",
    description:
      "تهدف المنصة إلى تسهيل جمع التبرعات الخيرية لدعم المشاريع الإنسانية والإنسانية، مع تقديم معلومات شاملة حول المشاريع والبرامج والمصادر. لا تعد المنصة أداة قانونية أو مصرفية مستقلة، بل وسيلة لتسهيل التواصل والتبرع بشكل آمن وملائم.",
  },
  {
    title: "التبرعات والمساهمات",
    description:
      "تُعتبر جميع التبرعات غير قابلة للاسترداد إلا في الحالات التي يحددها النظام أو الجهات المعنية. يعتمد قبول التبرع على التحقق من البيانات وتحديد المشروع المستهدف، ويجب أن يكون كل تبرع منظمًا وفق القواعد المعلنة داخل المنصة.",
  },
  {
    title: "المسؤولية والالتزامات",
    description:
      "نحن نسعى إلى تقديم خدمة واضحة وموثوقة، ولكن لا نتحمل مسؤولية أي خسارة أو أضرار قد تنشأ عن الاستخدام غير السليم للمنصة أو تأخير في تجهيز الدفع أو أي ظروف خارجة عن سيطرتنا. يتحمل المستخدم مسؤولية مراجعة المشروع وتقييمه قبل التبرع.",
  },
  {
    title: "الملكية الفكرية",
    description:
      "جميع المحتويات المُدرجة في المنصة من نصوص، صور، شعارات، تصميمات، ومعلومات تُعد ملكية للمنصة أو مرخصة لها بشكل قانوني. يحظر النسخ أو إعادة الإنتاج أو الاستخدام التجاري بدون إذن مسبق من مالك المنصة.",
  },
  {
    title: "تغيير الخدمة أو إيقافها",
    description:
      "نحتفظ بالحق في تعديل أو إيقاف أجزاء من المنصة أو جميعها في أي وقت، بما في ذلك تحديث واجهات المستخدم أو تعديل آليات التبرع وسياستها. قد نُحدث شروط الاستخدام بشكل دوري، وفي حال كان التغيير جوهرياً سنقوم بإعلامك بالطرق المتاحة.",
  },
]

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 md:px-6 lg:px-8">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
        <div className="mb-8 space-y-3">
          <p className="text-sm font-medium text-primary">الشروط والأحكام</p>
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">الشروط والأحكام</h1>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            يرجى قراءة هذه الأحكام بعناية قبل استخدامك لمنصة قزة الخيرية. إن استخدام المنصة يمثل موافقتك على الالتزام بها، وتسري هذه الأحكام على جميع الزيارات والمشاركات والتبرعات داخل الموقع.
          </p>
        </div>

        <div className="space-y-6">
          {sections.map((section) => (
            <section key={section.title} className="rounded-2xl border border-border/80 bg-background/80 p-5">
              <h2 className="mb-2 text-lg font-bold text-foreground">{section.title}</h2>
              <p className="text-sm leading-7 text-muted-foreground">{section.description}</p>
            </section>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-secondary/40 p-5 text-sm leading-7 text-muted-foreground">
          <p>
            نحتفظ بالحق في تفسير هذه الأحكام وفق ما نراه مناسباً، ونلتزم بتحديثها بشكل دوري لتعكس أي تغييرات في الخدمات أو الأنظمة ذات الصلة.
          </p>
          <p className="mt-2">
            في حال وجود أي سؤال، يمكنك التواصل معنا عبر قنوات الدعم أو البريد الرسمي للمنصة قبل إتمام أي معاملة.
          </p>
          <div className="mt-4">
            <Link href="/" className="font-medium text-primary underline-offset-4 hover:underline">
              العودة إلى الصفحة الرئيسية
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
