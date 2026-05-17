"use client"

import { useState } from "react"
import { ArrowRight, Menu, X } from "lucide-react"
import { NomillarLogo } from "@/components/nomillar-logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/components/language-provider"
import { translations } from "@/lib/translations"
import { scrollToSection } from "@/lib/scroll-to"

interface NavbarProps {
  scrolled: boolean
  onGetStarted: (role: "admin" | "basic") => void
}

export function Navbar({ scrolled, onGetStarted }: NavbarProps) {
  const { lang } = useLanguage()
  const t = translations[lang]
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { label: t.navFeatures, id: "caracteristicas" },
    { label: t.navHowItWorks, id: "como-funciona" },
    { label: t.navAudiences, id: "soluciones" },
    { label: t.navMetrics, id: "metricas" },
    { label: t.navAbout, id: "nosotros" },
  ]

  const handleNav = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    scrollToSection(id)
    setMobileOpen(false)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-background/90 shadow-sm backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }) }} aria-label="Inicio">
          <NomillarLogo className="min-w-0 [&_img]:h-10" />
        </a>

        <div className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleNav(e, item.id)}
              className="group relative text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageToggle />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => onGetStarted("basic")}
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground md:block"
          >
            {t.navSignIn}
          </button>
          <button
            type="button"
            onClick={() => onGetStarted("admin")}
            className="group hidden items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25 sm:flex"
          >
            {t.navCTA}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border lg:hidden"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border bg-background/95 px-6 py-4 backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNav(e, item.id)}
                className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => { setMobileOpen(false); onGetStarted("admin") }}
              className="mt-2 flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
            >
              {t.navCTA}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
