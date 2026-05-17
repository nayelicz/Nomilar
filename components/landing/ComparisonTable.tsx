"use client"

import { Check, X } from "lucide-react"

export function ComparisonTable() {
  const rows = [
    {
      feature: "Velocidad de pago",
      trad: "24–72 horas (ventana bancaria)",
      nom: "Dispersión inmediata, 24/7",
      tradBad: true,
    },
    {
      feature: "Cálculo de variables",
      trad: "Manual en Excel — propenso a errores",
      nom: "Reglas configurables y automatizadas",
      tradBad: true,
    },
    {
      feature: "Trazabilidad por pago",
      trad: "Sin registro por empleado",
      nom: "Hash único por transacción, auditable",
      tradBad: true,
    },
    {
      feature: "Solicitudes de empleados",
      trad: "WhatsApp / email a RH",
      nom: "Portal propio: autogestión 24/7",
      tradBad: true,
    },
    {
      feature: "Conciliación contable",
      trad: "Manual, lenta, con errores",
      nom: "Automática, exportable a cualquier ERP",
      tradBad: true,
    },
    {
      feature: "Cumplimiento SAT / IMSS",
      trad: "Depende del contador",
      nom: "Registros verificables listos para compliance",
      tradBad: true,
    },
  ]

  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 text-xs font-semibold text-muted-foreground border border-border rounded-full px-4 py-1.5">
            Nómina tradicional vs. Nomillar
          </div>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            La infraestructura actual<br />
            <span className="text-muted-foreground font-normal">no fue diseñada para equipos operativos</span>
          </h2>
        </div>

        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl">
          {/* Header */}
          <div className="grid grid-cols-3 bg-muted/30 border-b border-border">
            <div className="p-5 text-sm font-semibold text-muted-foreground">Característica</div>
            <div className="p-5 text-sm font-semibold text-center text-muted-foreground border-x border-border">Sistema tradicional</div>
            <div className="p-5 text-sm font-semibold text-center text-primary">Nomillar</div>
          </div>

          <div className="divide-y divide-border">
            {rows.map((row, idx) => (
              <div key={idx} className="grid grid-cols-3 hover:bg-muted/10 transition-colors group">
                <div className="p-5 text-sm font-medium flex items-center">{row.feature}</div>
                <div className="p-5 border-x border-border flex items-center gap-2 text-sm text-muted-foreground">
                  <X className="w-4 h-4 text-destructive shrink-0" />
                  <span className="hidden sm:inline">{row.trad}</span>
                </div>
                <div className="p-5 flex items-center gap-2 text-sm font-medium">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  <span className="hidden sm:inline">{row.nom}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 bg-primary/5 border-t border-primary/20 text-center">
            <p className="text-xs text-muted-foreground">
              Nomillar <strong className="text-foreground">no reemplaza tu sistema de nómina</strong> — es la capa operativa que lo complementa para pagos variables.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
