"use client"

import { Upload, ShieldCheck, Zap } from "lucide-react"
import { SectionHeading } from "@/components/landing/SectionHeading"
import { useLanguage } from "@/components/language-provider"
import { translations } from "@/lib/translations"

const stepIcons = [Upload, ShieldCheck, Zap]

export function HowItWorks() {
  const { lang } = useLanguage()
  const t = translations[lang]

  const steps = [
    { title: t.howStep1Title, desc: t.howStep1Desc },
    { title: t.howStep2Title, desc: t.howStep2Desc },
    { title: t.howStep3Title, desc: t.howStep3Desc },
  ]

  return (
    <section id="como-funciona" className="border-y border-border bg-muted/30 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading title={t.howTitle} description={t.howDesc} />

        <ol className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((step, idx) => {
            const Icon = stepIcons[idx]
            return (
              <li
                key={step.title}
                className="animate-stagger relative rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/25"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <span className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {idx + 1}
                </span>
                <div
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 transition-transform hover:scale-110"
                >
                  <Icon className="h-5 w-5 text-primary" aria-hidden />
                </div>
                <h3 className="text-lg font-medium">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                {idx < steps.length - 1 && (
                  <span
                    className="absolute -right-4 top-1/2 hidden h-px w-8 -translate-y-1/2 bg-border md:block"
                    aria-hidden
                  />
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
