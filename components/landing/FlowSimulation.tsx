"use client"

import { FileUp, CheckCircle2, Zap, Smartphone, ShieldCheck, ArrowRight } from "lucide-react"

export function FlowSimulation() {
  const steps = [
    {
      icon: FileUp,
      step: "01",
      title: "Carga tu nómina",
      desc: "Sube tu CSV o conecta tu ERP. El sistema mapea empleados, montos y conceptos automáticamente.",
      color: "text-primary bg-primary/10 border-primary/20",
    },
    {
      icon: CheckCircle2,
      step: "02",
      title: "Valida y aprueba",
      desc: "Dashboard de revisión con alertas de anomalías. Tu equipo de finanzas aprueba en un clic.",
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      icon: Zap,
      step: "03",
      title: "Dispersión inmediata",
      desc: "Los fondos salen de tu cuenta operativa y se distribuyen a cada empleado en segundos.",
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
    {
      icon: Smartphone,
      step: "04",
      title: "Empleado notificado",
      desc: "Cada empleado recibe confirmación en su portal: monto, concepto y comprobante descargable.",
      color: "text-green-500 bg-green-500/10 border-green-500/20",
    },
    {
      icon: ShieldCheck,
      step: "05",
      title: "Auditoría instantánea",
      desc: "Cada transacción queda registrada con hash único, fecha, monto y autorizador. Rastreable forever.",
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    },
  ]

  return (
    <section className="py-24 bg-card/20 border-y border-border overflow-hidden relative">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] opacity-[0.06]"
             style={{ background: "radial-gradient(ellipse at top, hsl(var(--primary)) 0%, transparent 70%)" }} />
      </div>

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 text-xs font-semibold text-primary border border-primary/20 bg-primary/5 rounded-full px-4 py-1.5">
            Flujo de pago end-to-end
          </div>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            De Excel a dispersión<br />
            <span className="text-muted-foreground font-normal">en 5 pasos, en minutos</span>
          </h2>
        </div>

        {/* Desktop: horizontal stepper */}
        <div className="relative hidden lg:block">
          <div className="absolute top-[52px] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="grid grid-cols-5 gap-4 relative z-10">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className={`w-[104px] h-[104px] rounded-2xl border flex flex-col items-center justify-center mb-5 bg-card shadow-sm group-hover:shadow-lg group-hover:scale-105 transition-all duration-300 ${step.color}`}>
                  <step.icon className="w-7 h-7 mb-1" />
                  <span className="text-[10px] font-bold font-mono opacity-60">{step.step}</span>
                </div>
                <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-snug">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: vertical */}
        <div className="space-y-4 lg:hidden">
          {steps.map((step, idx) => (
            <div key={idx} className="flex gap-4 bg-card border border-border rounded-2xl p-5">
              <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${step.color}`}>
                <step.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold text-muted-foreground mb-0.5">{step.step}</div>
                <h3 className="font-semibold text-sm">{step.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-snug">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-14 text-center">
          <p className="text-sm text-muted-foreground">
            Tiempo promedio de onboarding: <strong className="text-foreground">menos de 48 horas</strong> · Sin reemplazar tu sistema contable actual
          </p>
        </div>
      </div>
    </section>
  )
}
