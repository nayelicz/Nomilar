"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import type { Lang } from "@/lib/translations"

interface LanguageContextType {
  lang: Lang
  setLang: (lang: Lang) => void
  toggleLang: () => void
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "es",
  setLang: () => {},
  toggleLang: () => {},
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es")

  // Persist language preference in localStorage
  useEffect(() => {
    const saved = localStorage.getItem("nomillar-lang") as Lang | null
    if (saved === "en" || saved === "es") setLangState(saved)
  }, [])

  const setLang = (newLang: Lang) => {
    setLangState(newLang)
    localStorage.setItem("nomillar-lang", newLang)
  }

  const toggleLang = () => setLang(lang === "es" ? "en" : "es")

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
