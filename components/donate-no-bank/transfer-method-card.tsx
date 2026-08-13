"use client"

import Image from "next/image"
import { useState } from "react"
import { Check, Copy, LinkIcon, Phone, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TransferMethodCardProps {
  order: string
  image: string
  imageAlt: string
  fieldIcon: "user" | "phone" | "link"
  fieldLabel: string
  fieldValue: string
  secondaryLabel?: string
  secondaryValue?: string
  secondaryIcon?: "user" | "phone" | "link"
}

const iconMap = {
  user: User,
  phone: Phone,
  link: LinkIcon,
}

export function TransferMethodCard({
  order,
  image,
  imageAlt,
  fieldIcon,
  fieldLabel,
  fieldValue,
  secondaryLabel,
  secondaryValue,
  secondaryIcon,
}: TransferMethodCardProps) {
  const [copied, setCopied] = useState(false)
  const FieldIcon = iconMap[fieldIcon]
  const SecondaryIcon = secondaryIcon ? iconMap[secondaryIcon] : null

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fieldValue)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Card className="relative border-border/60 p-6">
      <span className="absolute top-4 end-4 flex size-7 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
        {order}
      </span>

      <CardContent className="flex flex-col gap-5 px-0">
        <div className="flex items-center gap-4">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-xl">
            <Image src={image || "/placeholder.svg"} alt={imageAlt} fill className="object-cover" />
          </div>

          <div className="flex flex-col gap-1">
            {secondaryLabel && secondaryValue && (
              <>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  {secondaryLabel}
                  {SecondaryIcon && <SecondaryIcon className="size-3.5" />}
                </span>
                <span className="font-heading text-base font-bold text-foreground">{secondaryValue}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5 border-t border-border/60 pt-4">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {fieldLabel}
            <FieldIcon className="size-3.5" />
          </span>
          <span dir="ltr" className="text-end font-heading text-lg font-bold text-foreground">
            {fieldValue}
          </span>
        </div>

        <Button
          onClick={handleCopy}
          variant="outline"
          className={cn(
            "w-full justify-center gap-2 rounded-lg border-primary/30 text-primary hover:bg-primary/5 hover:text-primary",
            copied && "border-primary bg-primary/10",
          )}
        >
          {copied ? "تم النسخ" : "نسخ"}
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </Button>
      </CardContent>
    </Card>
  )
}
