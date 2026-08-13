import Image from "next/image"

export function AboutHero() {
  return (
    <section className="relative flex h-[420px] items-end justify-center overflow-hidden sm:h-[480px]">
      <Image
        src="/images/about-hero.png"
        alt="فريق مؤسسة قدس للإغاثة يوزع المساعدات في غزة"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" aria-hidden="true" />
      <div className="relative z-10 flex flex-col items-center gap-4 px-4 pb-10 text-center">
        <h1 className="font-heading text-4xl font-bold text-balance text-white drop-shadow sm:text-5xl">
          من نحن
        </h1>
        <p className="rounded-full bg-black/60 px-5 py-2 text-sm font-medium text-white backdrop-blur-sm sm:text-base">
          نعمل من أجل الإنسان. لنزرع الأمل في قلوب المحتاجين.
        </p>
      </div>
    </section>
  )
}
