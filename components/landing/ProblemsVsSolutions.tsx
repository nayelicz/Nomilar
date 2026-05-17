"use client"

import { AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react"

export function ProblemsVsSolutions() {
  const points = [
    {
      problem: "Los empleados piden pagos por WhatsApp o en persona",
      solution: "Portal propio donde el empleado ve sus comisiones y solicita retiros en tiempo real.",
    },
    {
      problem: "Cálculos manuales en Excel con errores y peleas internas",
      solution: "Reglas de negocio configurables: propinas, bonos y comisiones calculadas automáticamente.",
    },
    {
      problem: "El banco procesa en 24-48 horas, no en tiempo real",
      solution: "Dispersión inmediata vía infraestructura programable, sin depender de ventanas bancarias.",
    },
    {
      problem: "Los auditores no pueden rastrear quién autorizó cada pago",
      solution: "Registro inmutable con hash único por transacción — auditable al instante.",
    },
    {
      problem: "RH y Finanzas pierden horas conciliando recibos y transferencias",
      solution: "Conciliación automática y exportación lista para compliance y contabilidad.",
    },
  ]

  return (
    <section id="como-funciona" className="py-24 bg-background">
      <div className="mx-auto max-w-5xl px-6">

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 text-xs font-semibold text-destructive/80 border border-destructive/20 bg-destructive/5 rounded-full px-4 py-1.5">
            El problema que resolvemos
          </div>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Por qué tu nómina operativa<br />
            <span className="text-muted-foreground font-normal">no puede seguir siendo manual</span>
          </h2>
        </div>

        <div className="space-y-3">
          {points.map((point, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4 bg-card border border-border rounded-2xl p-5 hover:border-primary/20 transition-all duration-300 group"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                </div>
                <span className="text-sm text-foreground/80 leading-snug">{point.problem}</span>
              </div>

              <div className="hidden md:flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-primary/40 group-hover:text-primary transition-colors" />
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </div>
                <span className="text-sm text-foreground font-medium leading-snug">{point.solution}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
