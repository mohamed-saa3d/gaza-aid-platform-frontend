import type { Metadata } from "next"
import { Leaf, ShieldCheck, Zap } from "lucide-react"
import { TransferMethodCard } from "@/components/donate-no-bank/transfer-method-card"

export const metadata: Metadata = {
  title: "تبرع مباشر - بدون حساب بنكي | مؤسسة قدس للإغاثة",
  description: "اختر وسيلة التبرع المناسبة لك وقم بتحويل المبلغ مباشرة إلى مؤسسة قدس للإغاثة.",
}

const trustPoints = [
  { icon: ShieldCheck, label: "آمن وموثوق", description: "حماية بياناتك وضمان خصوصيتك" },
  { icon: Zap, label: "بدون عمولات", description: "يصل تبرعك كاملاً للمستحقين" },
  { icon: Leaf, label: "تأكيد فوري", description: "تصلك رسالة عند اعتماد تبرعك" },
]

export default function DonateNoBankPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="flex items-center justify-center gap-2 font-heading text-3xl font-bold text-balance sm:text-4xl">
          <Leaf className="size-7 text-primary" aria-hidden="true" />
          تبرع مباشر - بدون حساب بنكي
          <Leaf className="size-7 rotate-180 text-primary" aria-hidden="true" />
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
          اختر وسيلة التبرع المناسبة لك وقم بتحويل المبلغ مباشرة
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <TransferMethodCard
          order="01"
          image="/images/instapay-transfer.png"
          imageAlt="تحويل عبر إنستاباي"
          secondaryLabel="اسم الحساب"
          secondaryIcon="user"
          secondaryValue="مؤسسة قدس للإغاثة"
          fieldLabel="عنوان الدفع (IPA)"
          fieldIcon="link"
          fieldValue="quds@instapay"
        />
        <TransferMethodCard
          order="02"
          image="/images/mobile-wallet-transfer.png"
          imageAlt="تحويل عبر المحفظة الإلكترونية"
          fieldLabel="رقم الهاتف"
          fieldIcon="phone"
          fieldValue="010XXXXXXX"
        />
      </div>

      <div className="mt-10 flex flex-col items-center justify-center gap-8 border-t border-border/60 pt-8 sm:flex-row sm:gap-16">
        {trustPoints.map(({ icon: Icon, label, description }) => (
          <div key={label} className="flex flex-col items-center gap-2 text-center">
            <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <span className="font-heading text-sm font-bold text-foreground">{label}</span>
            <span className="text-xs text-muted-foreground">{description}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
