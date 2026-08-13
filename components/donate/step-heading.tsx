import type { LucideIcon } from "lucide-react"

interface StepHeadingProps {
  step: number
  icon: LucideIcon
  title: string
}

export function StepHeading({ step, icon: Icon, title }: StepHeadingProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <h2 className="flex items-center gap-2 font-heading text-base font-bold">
        <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
        {title}
      </h2>
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
        {step}
      </span>
    </div>
  )
}
