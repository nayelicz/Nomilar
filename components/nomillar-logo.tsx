"use client"

interface NomillarLogoProps {
  variant?: "full" | "icon"
  className?: string
}

export function NomillarLogo({ variant = "full", className = "" }: NomillarLogoProps) {
  if (variant === "icon") {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <img
          src="/logo.png"
          alt="Nomillar"
          className="h-12 min-h-[48px] w-auto max-w-[200px] object-contain drop-shadow-md transition-all dark:drop-shadow-[0_0_12px_rgba(232,65,66,0.35)]"
        />
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src="/logo.png"
        alt="Nomillar"
        className="h-11 min-h-[44px] w-auto max-w-[220px] object-contain drop-shadow-sm transition-all dark:drop-shadow-[0_0_10px_rgba(232,65,66,0.3)]"
      />
      <span className="text-lg font-bold tracking-tight text-foreground">Nomillar</span>
      <div className="h-2 w-2 rounded-full bg-primary animate-ping-custom" />
    </div>
  )
}
