"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="h-10 w-10" />

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card shadow-sm transition-all hover:bg-accent hover:text-accent-foreground flex-shrink-0"
    >
      {resolvedTheme === "light" ? (
        <Moon className="h-[1.2rem] w-[1.2rem] text-slate-700" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] text-amber-500" />
      )}
      <span className="sr-only">Cambiar tema</span>
    </button>
  )
}
