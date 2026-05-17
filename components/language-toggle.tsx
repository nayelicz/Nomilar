"use client"

import { useLanguage } from "@/components/language-provider"

export function LanguageToggle() {
  const { lang, toggleLang } = useLanguage()

  return (
    <button
      onClick={toggleLang}
      title={lang === "es" ? "Switch to English" : "Cambiar a Español"}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card shadow-sm transition-all hover:bg-accent hover:text-accent-foreground flex-shrink-0 font-bold text-sm"
    >
      {lang === "es" ? "EN" : "ES"}
      <span className="sr-only">
        {lang === "es" ? "Switch to English" : "Cambiar a Español"}
      </span>
    </button>
  )
}
