import { Progress } from "@/components/ui/progress"

export function ProjectProgress({
  progress,
  funded,
  remaining,
}: {
  progress: number
  funded: number
  remaining: number
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm font-semibold text-primary">
        <span />
        <span>{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          المتبقي: <span className="font-semibold text-foreground">{remaining.toLocaleString("ar")}</span>
        </span>
        <span>
          الممول: <span className="font-semibold text-foreground">{funded.toLocaleString("ar")}</span>
        </span>
      </div>
    </div>
  )
}
