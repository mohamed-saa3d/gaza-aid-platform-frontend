import Link from "next/link"

const sections = [
  {
    title: "معلوماتنا الأساسية",
    description:
      "نحن منصة خيرية تدعم المشاريع الإنسانية والإنسانية عبر تمكين التبرعات عبر الإنترنت، مع التركيز على المساعدة في مجالات المياه، الغذاء، التعليم، الصحة، الإيواء، ورعاية الأيتام.",
  },
  {
    title: "جمع البيانات وحفظها",
    description:
      "نقوم بجمع المعلومات الضرورية فقط لتتمكن من استخدام المنصة بشكل آمن وفعال، مثل اسمك، رقم الهاتف، البريد الإلكتروني، وعنوان التبرع عند الحاجة. كما نستخدم هذه البيانات لتحسين تجربة المستخدم، متابعة الطلبات، وضمان الامتثال الداخلي للمعايير الرقابية.",
  },
  {
    title: "استخدام المعلومات",
    description:
      "تُستخدم بياناتك لإتمام عملية التبرع، التواصل معك بخصوص المعاملات أو التحديثات المهمة، والحفاظ على أمان حسابك داخل المنصة. لا نستخدم بياناتك لأغراض تسويقية دون موافقتك الصريحة، ما لم يتم تحديد ذلك بوضوح في وقت جمع البيانات.",
  },
  {
    title: "مشاركة المعلومات",
    description:
      "لا نبيع أو نوّع معلوماتك الشخصية إلى أطراف ثالثة. قد نشارك بيانات محدودة مع مزودين خدمات تقنيين يساعدوننا في تشغيل المنصة، مثل الدفع أو الاستضافة أو دعم التشغيل، مع الالتزام بالحفاظ على سرية البيانات وفق المعايير المناسبة.",
  },
  {
    title: "الأمان والخصوصية",
    description:
      "نلتزم باتخاذ التدابير الفنية والتنظيمية المعقولة للحفاظ على أمان معلوماتك ومنع الوصول غير المصرح به أو الفقدان أو التعديل أو الإفشاء. ومع ذلك، لا يوجد نظام كامل الأمان بنسبة 100%، لذلك نطلب منك استخدام كلمات مرور قوية ومراجعة حسابك بانتظام.",
  },
  {
    title: "حقك في التحكم",
    description:
      "لك الحق في طلب الاطلاع على البيانات التي نحتفظ بها عنك، أو طلب تصحيحها، أو تقييد استخدامها، أو حذفها عند توفر الأساس القانوني لذلك. يمكنك التواصل معنا مباشرة عبر وسائل التواصل أو البريد الذي نحدده في موقعنا.",
  },
]

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 md:px-6 lg:px-8">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
        <div className="mb-8 space-y-3">
          <p className="text-sm font-medium text-primary">سياسة الخصوصية</p>
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">سياسة الخصوصية</h1>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            نلتزم بحماية خصوصيتك عند استخدامك لمنصة قزة الخيرية. توضح هذه السياسة كيفية جمعنا واستخدامنا وحفظنا لمعلوماتك، وكيف يمكنك التحكم بها.
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
            يمكن تحديث هذه السياسة من وقت لآخر. إذا كانت هناك تغييرات جوهرية، سنقوم بإعلامك عبر البريد الإلكتروني أو من خلال إشعارات داخل المنصة عند اللزوم.
          </p>
          <p className="mt-2">
            لمزيد من الاستفسارات، يمكنك التواصل معنا عبر صفحة الاتصال أو من خلال البريد الرسمي للمنصة.
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
