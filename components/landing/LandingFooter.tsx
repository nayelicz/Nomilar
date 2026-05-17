"use client"

import { NomillarLogo } from "@/components/nomillar-logo"
import { Lock } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { translations } from "@/lib/translations"
import { scrollToSection } from "@/lib/scroll-to"

export function LandingFooter() {
  const { lang } = useLanguage()
  const t = translations[lang]

  const productLinks = [
    { label: t.footerFeatures, id: "caracteristicas" },
    { label: t.footerSolutions, id: "soluciones" },
    { label: t.footerHow, id: "como-funciona" },
    { label: t.footerImpact, id: "impacto" },
  ]

  const companyLinks = [
    { label: t.footerAbout, id: "nosotros" },
    { label: t.navMetrics, id: "metricas" },
  ]

  const handleNav = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    scrollToSection(id)
  }

  return (
    <footer id="nosotros" className="border-t border-border bg-card/50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <NomillarLogo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">{t.footerTagline}</p>
            <div className="mt-6 flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" aria-hidden />
              <span className="text-xs text-muted-foreground">{t.footerCert}</span>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-foreground">{t.footerProduct}</h4>
            <ul className="mt-4 space-y-3">
              {productLinks.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => handleNav(e, item.id)}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-foreground">{t.footerCompany}</h4>
            <ul className="mt-4 space-y-3">
              {companyLinks.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => handleNav(e, item.id)}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">{t.footerRights}</p>
          <button
            type="button"
            onClick={() => scrollToSection("como-funciona")}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t.footerExplore}
          </button>
        </div>
      </div>
    </footer>
  )
}
