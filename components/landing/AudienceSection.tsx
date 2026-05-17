"use client"

import { motion } from "framer-motion"
import { Building2, User, ArrowRight, Check } from "lucide-react"
import { SectionHeading } from "@/components/landing/SectionHeading"
import { useLanguage } from "@/components/language-provider"
import { translations } from "@/lib/translations"

interface AudienceSectionProps {
  onGetStarted: (role: "admin" | "basic") => void
}

export function AudienceSection({ onGetStarted }: AudienceSectionProps) {
  const { lang } = useLanguage()
  const t = translations[lang]

  const segments = [
    {
      icon: Building2,
      title: t.audienceBusinessTitle,
      subtitle: t.audienceBusinessSubtitle,
      benefits: [t.audienceBusiness1, t.audienceBusiness2, t.audienceBusiness3, t.audienceBusiness4],
      cta: t.audienceBusinessCTA,
      role: "admin" as const,
      accent: "from-primary/15 to-accent/10",
    },
    {
      icon: User,
      title: t.audiencePersonTitle,
      subtitle: t.audiencePersonSubtitle,
      benefits: [t.audiencePerson1, t.audiencePerson2, t.audiencePerson3, t.audiencePerson4],
      cta: t.audiencePersonCTA,
      role: "basic" as const,
      accent: "from-accent/15 to-primary/10",
    },
  ]

  return (
    <section id="soluciones" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading title={t.audienceTitle} description={t.audienceDesc} />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-14 grid gap-8 lg:grid-cols-2"
        >
          {segments.map((segment, idx) => (
            <motion.article
              key={segment.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <motion.div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${segment.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                aria-hidden
              />
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="relative mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10"
              >
                <segment.icon className="h-6 w-6 text-primary" aria-hidden />
              </motion.div>
              <h3 className="relative text-xl font-semibold tracking-tight">{segment.title}</h3>
              <p className="relative mt-2 text-muted-foreground leading-relaxed">{segment.subtitle}</p>
              <ul className="relative mt-6 space-y-3">
                {segment.benefits.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3 w-3 text-primary" aria-hidden />
                    </span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => onGetStarted(segment.role)}
                className="relative mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                {segment.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
