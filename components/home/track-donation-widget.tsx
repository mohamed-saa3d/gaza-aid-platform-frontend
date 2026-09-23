"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Clock, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/components/locale-provider"

export function TrackDonationWidget() {
  const { t } = useLocale()
  const [donationNumber, setDonationNumber] = useState("")
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    // Strictly accept numbers only up to 6 digits
    if (/^\d{0,6}$/.test(val)) {
      setDonationNumber(val)
      if (error) setError(null)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation: Strictly 6 digits
    if (donationNumber.length !== 6) {
      setError(t.home.trackCodeRequired)
      return
    }

    setError(null)
    setStatusMessage(t.home.trackPending)
    setDonationNumber("")

    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    // Auto disappear after exactly 3 seconds (3000ms)
    timerRef.current = setTimeout(() => {
      setStatusMessage(null)
    }, 3000)
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <h3 className="font-heading text-base font-bold text-foreground">{t.home.trackTitle}</h3>
      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
        {t.home.trackSubtitle}
      </p>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
        <div className="relative flex items-center">
          <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            placeholder={t.home.trackPlaceholder}
            value={donationNumber}
            onChange={handleInputChange}
            className="h-11 rounded-xl pr-9 pl-3 text-sm placeholder:text-muted-foreground/70"
          />
        </div>

        {error && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-destructive animate-in fade-in duration-200">
            <AlertCircle className="size-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {statusMessage && (
          <div className="flex items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/10 px-3.5 py-2.5 text-xs font-medium text-amber-800 dark:text-amber-300 animate-in fade-in slide-in-from-top-1 duration-300">
            <div className="flex items-center gap-2">
              <Clock className="size-4 shrink-0 text-amber-600 dark:text-amber-400 animate-pulse" />
              <span>{t.home.trackStatusLabel}</span>
            </div>
            <span className="rounded-md bg-amber-500/20 px-2 py-0.5 font-bold text-amber-700 dark:text-amber-300">
              {statusMessage}
            </span>
          </div>
        )}

        <Button
          type="submit"
          className="h-11 w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition-colors"
        >
          {t.home.trackNow}
        </Button>
      </form>
    </div>
  )
}
