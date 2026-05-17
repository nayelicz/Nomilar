"use client"

import { motion } from "framer-motion"
import { Target, Clock, LineChart } from "lucide-react"
import { SectionHeading } from "@/components/landing/SectionHeading"
import { useLanguage } from "@/components/language-provider"
import { translations } from "@/lib/translations"

const valueIcons = [Target, Clock, LineChart]

export function ValueSection() {
  const { lang } = useLanguage()
  const t = translations[lang]

  const pillars = [
    { title: t.value1Title, desc: t.value1Desc },
    { title: t.value2Title, desc: t.value2Desc },
    { title: t.value3Title, desc: t.value3Desc },
  ]

  return (
    <section id="impacto" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading title={t.valueTitle} description={t.valueDesc} />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-14 grid gap-6 md:grid-cols-3"
        >
          {pillars.map((pillar, idx) => {
            const Icon = valueIcons[idx]
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="rounded-2xl border border-border bg-card/80 p-6 text-center transition-all hover:border-primary/25 hover:-translate-y-0.5"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10"
                >
                  <Icon className="h-6 w-6 text-primary" aria-hidden />
                </motion.div>
                <h3 className="text-lg font-medium">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pillar.desc}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
