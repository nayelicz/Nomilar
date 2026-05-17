"use client"

import { Building2, FileSpreadsheet, Settings2, Rocket, ArrowRight } from "lucide-react"

export function EnterpriseOnboarding() {
  const steps = [
    {
      icon: Building2,
      step: "Semana 1",
      title: "Cuenta corporativa",
      desc: "Registras tu empresa, defines estructura de equipos y roles de acceso para finanzas, RH y operaciones.",
    },
    {
      icon: FileSpreadsheet,
      step: "Semana 1–2",
      title: "Migración sin fricción",
      desc: "Importas tu plantilla actual en Excel o CSV. Nuestro equipo mapea los campos y valida los datos contigo.",
    },
    {
      icon: Settings2,
      step: "Semana 2",
      title: "Configuración de reglas",
      desc: "Defines las reglas de cálculo: propinas por turno, bonos por KPI, comisiones por venta. Sin código.",
    },
    {
      icon: Rocket,
      step: "Semana 2–3",
      title: "Primera dispersión real",
      desc: "Ejecutas tu primer ciclo de pagos en vivo. Tu equipo ve el resultado en tiempo real. Sin regresiones.",
    },
  ]

  return (
    <section className="py-24 bg-muted/20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left: headline */}
          <div className="lg:sticky lg:top-24">
            <div className="inline-flex items-center gap-2 mb-6 text-xs font-semibold text-primary border border-primary/20 bg-primary/5 rounded-full px-4 py-1.5">
              Onboarding enterprise
            </div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-5">
              Operativo en<br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                menos de 3 semanas.
              </span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Sin proyectos de 6 meses. Sin reemplazar tu ERP. Nomillar se integra en paralelo a lo que ya tienes — y el primer ciclo de pagos lo hacemos contigo.
            </p>
            <div className="space-y-3">
              {["Sin costo de integración inicial", "Sin cobro por empleado en piloto", "Soporte dedicado las primeras 4 semanas", "Importación de datos del sistema actual incluida"].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-10">
              <a
                href="#"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Hablar con un especialista
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Right: step cards */}
          <div className="space-y-4">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="flex gap-4 bg-card border border-border rounded-2xl p-5 hover:border-primary/30 hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="w-px flex-1 bg-border min-h-[24px]" />
                  )}
                </div>
                <div className="pb-2">
                  <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">{step.step}</span>
                  <h3 className="font-semibold mt-0.5 mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
