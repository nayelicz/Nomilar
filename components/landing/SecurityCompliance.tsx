"use client"

import { Shield, Lock, FileKey, History, CheckCircle2 } from "lucide-react"

export function SecurityCompliance() {
  const pillars = [
    {
      icon: Shield,
      title: "Infraestructura de grado bancario",
      desc: "Datos encriptados en tránsito y en reposo. Acceso con autenticación multifactor para todos los roles.",
    },
    {
      icon: History,
      title: "Registro inmutable por transacción",
      desc: "Cada pago genera un hash único rastreable. Ningún monto puede ser alterado retroactivamente.",
    },
    {
      icon: FileKey,
      title: "Control de accesos granular",
      desc: "Permisos por rol: Visualizador, Aprobador, Admin. Tu equipo de auditoría ve lo que necesita — nada más.",
    },
    {
      icon: Lock,
      title: "Exportación lista para compliance",
      desc: "Reportes en formato SAT, IMSS y contabilidad. Conciliación automática sin trabajo manual adicional.",
    },
  ]

  const certPoints = [
    "No somos una institución bancaria",
    "No captamos depósitos del público",
    "Somos software de control operativo",
    "El dinero siempre es tuyo",
  ]

  return (
    <section className="py-24 bg-background border-y border-border">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: copy */}
          <div>
            <div className="inline-flex items-center gap-2 mb-6 text-xs font-semibold text-primary border border-primary/20 bg-primary/5 rounded-full px-4 py-1.5">
              Seguridad y cumplimiento
            </div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-5">
              Control total.<br />
              <span className="text-muted-foreground font-normal">Sin comprometer la seguridad.</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-10">
              Nomillar no es un banco y no captura depósitos. Somos el software de control que se sienta encima de tu infraestructura financiera existente — aportando trazabilidad, automatización y visibilidad que tu banco nunca te dará.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {pillars.map((p, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <p.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-0.5">{p.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: honest declaration card */}
          <div className="relative">
            <div className="absolute -inset-6 rounded-[3rem] opacity-10"
                 style={{ background: "radial-gradient(circle at center, hsl(var(--primary)) 0%, transparent 70%)" }} />
            <div className="relative bg-card border border-border rounded-3xl p-8 shadow-2xl">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Claridad total sobre qué somos</h3>
              <p className="text-sm text-muted-foreground text-center mb-8 leading-relaxed">
                En un sector lleno de ambigüedad, Nomillar opera con transparencia absoluta sobre su modelo.
              </p>
              <div className="space-y-3">
                {certPoints.map((point, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-muted/50 rounded-xl px-4 py-3">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    <span className="text-sm font-medium">{point}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-border text-center">
                <p className="text-xs text-muted-foreground">
                  Cumplimiento con regulación CNBV · LFPIORPI · Estándares PCI-DSS
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
