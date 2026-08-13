import { CheckCircle2, Layers, Info } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { projectCompletionSummary } from "@/lib/mock-data"

export function CompletionRateCard() {
  const { overallRate, completedCount, activeCount } = projectCompletionSummary

  return (
    <Card className="flex flex-col justify-between border-border/60">
      <CardContent className="flex flex-1 flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold">نسبة الإنجاز العام</h3>
          <Info className="size-4 text-muted-foreground" aria-hidden="true" />
        </div>

        <div>
          <p className="font-heading text-5xl font-bold text-primary">{overallRate}%</p>
          <p className="mt-2 text-sm text-muted-foreground">من إجمالي المشاريع النشطة</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 rounded-lg border border-border/60 p-3">
            <CheckCircle2 className="size-5 text-primary" aria-hidden="true" />
            <div>
              <p className="font-heading text-xl font-bold">{completedCount}</p>
              <p className="text-xs text-muted-foreground">مشروع مكتمل</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border/60 p-3">
            <Layers className="size-5 text-accent-foreground" aria-hidden="true" />
            <div>
              <p className="font-heading text-xl font-bold">{activeCount}</p>
              <p className="text-xs text-muted-foreground">إجمالي المشاريع النشطة</p>
            </div>
          </div>
        </div>

        <Button
          variant="secondary"
          className="mt-auto w-full justify-center rounded-full"
        >
          معاً نصنع فرقاً حقيقياً ومستداماً
        </Button>
      </CardContent>
    </Card>
  )
}
