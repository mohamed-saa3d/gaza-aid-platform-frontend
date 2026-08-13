"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/components/locale-provider"
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex items-center gap-0.5", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      variant={isActive ? "outline" : "ghost"}
      size={size}
      className={cn(className)}
      nativeButton={false}
      render={
        <a
          aria-current={isActive ? "page" : undefined}
          data-slot="pagination-link"
          data-active={isActive}
          {...props}
        />
      }
    />
  )
}

function PaginationPrevious({
  className,
  text,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  const { dir, locale } = useLocale()
  const isRTL = dir === "rtl"
  const label = text ?? (locale === "ar" ? "السابق" : "Previous")

  return (
    <PaginationLink
      aria-label={locale === "ar" ? "الصفحة السابقة" : "Go to previous page"}
      size="default"
      dir={dir}
      className={cn(isRTL ? "pl-1.5!" : "pr-1.5!", className)}
      {...props}
    >
      {isRTL ? <ChevronRightIcon data-icon="inline-start" /> : <ChevronLeftIcon data-icon="inline-start" />}
      <span className="hidden sm:block">{label}</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  text,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  const { dir, locale } = useLocale()
  const isRTL = dir === "rtl"
  const label = text ?? (locale === "ar" ? "التالي" : "Next")

  return (
    <PaginationLink
      aria-label={locale === "ar" ? "الصفحة التالية" : "Go to next page"}
      size="default"
      dir={dir}
      className={cn(isRTL ? "pr-1.5!" : "pl-1.5!", className)}
      {...props}
    >
      <span className="hidden sm:block">{label}</span>
      {isRTL ? <ChevronLeftIcon data-icon="inline-end" /> : <ChevronRightIcon data-icon="inline-end" />}
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "flex size-8 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <MoreHorizontalIcon
      />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
