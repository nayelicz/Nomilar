"use client"

export function BrandTicker() {
  // Estos son los sectores y ejemplos de clientes potenciales — NO clientes confirmados
  const items = [
    "Restaurantes · Sector 72",
    "Call Centers · Sector 43",
    "Retail & Ventas · Sector 46",
    "Flotas & Logística",
    "Redes Multinivel",
    "Promotoras & Campo",
    "Hospitalidad & Turismo",
    "Distribución Mayorista",
  ]

  const doubled = [...items, ...items]

  return (
    <div className="w-full border-b border-border/50 py-4 overflow-hidden relative bg-background">
      {/* Fade masks */}
      <div className="ticker-mask flex whitespace-nowrap">
        <div
          className="flex gap-10 items-center px-10"
          style={{
            animation: "ticker 35s linear infinite",
            width: "max-content",
          }}
        >
          {doubled.map((item, i) => (
            <span
              key={i}
              className="text-xs font-semibold text-muted-foreground/50 uppercase tracking-[0.15em] select-none"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
