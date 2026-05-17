"use client"

import { useState, useEffect, useRef } from "react"
import { Navbar } from "@/components/landing/Navbar"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { useLanguage } from "@/components/language-provider"
import { translations } from "@/lib/translations"
import { scrollToSection } from "@/lib/scroll-to"
import { ArrowRight, Play, Shield, ChevronDown } from "lucide-react"

import { BrandTicker } from "@/components/landing/BrandTicker"
import { FlowSimulation } from "@/components/landing/FlowSimulation"
import { InteractiveDemo } from "@/components/landing/InteractiveDemo"
import { RealUseCases } from "@/components/landing/RealUseCases"
import { ProblemsVsSolutions } from "@/components/landing/ProblemsVsSolutions"
import { ComparisonTable } from "@/components/landing/ComparisonTable"
import { AuditTransparency } from "@/components/landing/AuditTransparency"
import { SecurityCompliance } from "@/components/landing/SecurityCompliance"
import { EnterpriseOnboarding } from "@/components/landing/EnterpriseOnboarding"
import { ImpactMetrics } from "@/components/landing/ImpactMetrics"

interface LandingPageProps {
  onGetStarted: (role: "admin" | "basic") => void
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const { lang } = useLanguage()
  const t = translations[lang]
  const [scrolled, setScrolled] = useState(false)
  const heroRef = useRef<HTMLElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })

    const handleMouseMove = (e: MouseEvent) => {
      if (glowRef.current && window.innerWidth > 1024) {
        glowRef.current.style.transform = `translate3d(${e.clientX - 200}px, ${e.clientY - 200}px, 0)`
      }
    }
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar scrolled={scrolled} onGetStarted={onGetStarted} />

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-16">

        {/* Cursor glow — desktop only */}
        <div ref={glowRef} className="glow-follow fixed top-0 left-0 w-[400px] h-[400px] z-0 pointer-events-none hidden lg:block" />

        {/* Background */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-background overflow-hidden">
          {/* Dot mesh */}
          <div className="absolute inset-0 dot-mesh opacity-[0.05] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_90%)]" />
          {/* Ambient glows */}
          <div className="absolute left-1/4 top-0 w-[700px] h-[500px] opacity-10"
               style={{ background: "radial-gradient(ellipse at top, hsl(var(--primary)) 0%, transparent 65%)" }} />
          <div className="absolute right-0 bottom-1/3 w-[500px] h-[500px] opacity-10"
               style={{ background: "radial-gradient(ellipse at center, hsl(var(--accent)) 0%, transparent 65%)" }} />
          {/* Grid */}
          <div className="absolute inset-[-40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_100%)]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:40px_40px] animate-grid-flow" />
          </div>
        </div>

        {/* Content grid */}
        <div className="relative mx-auto max-w-7xl px-6 w-full z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT: Copy */}
          <div className="flex flex-col items-start text-left">

            {/* Badge */}
            <div className="animate-stagger [animation-delay:0ms] mb-7 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/60 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-primary ring-1 ring-primary/10 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Infraestructura de pagos operativos · v2.0
            </div>

            {/* Headline */}
            <h1 className="animate-stagger [animation-delay:80ms] text-5xl font-bold tracking-tight md:text-6xl lg:text-[4.25rem] leading-[1.08]">
              Paga a tu equipo<br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient">
                en tiempo real.
              </span><br />
              <span className="text-foreground/70 text-4xl font-semibold">Sin errores. Sin Excel.</span>
            </h1>

            {/* Subheadline */}
            <p className="animate-stagger [animation-delay:160ms] mt-6 text-lg text-muted-foreground leading-relaxed max-w-lg">
              Nomillar dispersa comisiones, propinas y bonos a equipos operativos de forma automática y trazable — sin depender de horarios bancarios ni procesos manuales.
            </p>

            {/* CTAs */}
            <div className="animate-stagger [animation-delay:240ms] mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => onGetStarted("admin")}
                className="group flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-all hover:scale-[1.03] hover:shadow-[0_0_36px_rgba(245,166,35,0.35)] w-full sm:w-auto"
              >
                Solicitar acceso enterprise
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("como-funciona")}
                className="group flex items-center justify-center gap-2 rounded-xl border border-border bg-card/50 backdrop-blur-sm px-8 py-4 text-base font-medium transition-all hover:bg-secondary hover:border-primary/30 w-full sm:w-auto"
              >
                <Play className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                Ver cómo funciona
              </button>
            </div>

            {/* Trust strip */}
            <div className="animate-stagger [animation-delay:320ms] mt-10 flex flex-wrap items-center gap-6 border-t border-border/50 pt-8 w-full max-w-lg">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground font-medium">Infraestructura nivel bancario</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs text-muted-foreground font-medium">Trazabilidad inmutable</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-xs text-muted-foreground font-medium">Sin captación de depósitos</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Live dashboard mockup */}
          <div className="animate-stagger [animation-delay:400ms] relative lg:ml-auto w-full max-w-lg hidden md:block">
            {/* Glow halo */}
            <div className="absolute -inset-4 rounded-[2.5rem] opacity-20"
                 style={{ background: "radial-gradient(circle at center, hsl(var(--primary)) 0%, transparent 70%)" }} />

            <div className="relative bg-card/70 backdrop-blur-md border border-border/60 rounded-3xl p-6 shadow-2xl space-y-5">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Dispersión activa · Ciclo Semanal</p>
                  <h3 className="text-2xl font-bold mt-0.5">$4,250,000 <span className="text-xs font-normal text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full ml-1">MXN</span></h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-green-500 font-medium bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  En vivo
                </div>
              </div>

              {/* Bar chart */}
              <div className="h-36 flex items-end justify-between gap-2 px-1">
                {[
                  { h: "40%", l: "L", active: false },
                  { h: "55%", l: "M", active: false },
                  { h: "35%", l: "X", active: false },
                  { h: "70%", l: "J", active: false },
                  { h: "90%", l: "V", active: true },
                  { h: "60%", l: "S", active: false },
                  { h: "45%", l: "D", active: false },
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="w-full flex items-end" style={{ height: "112px" }}>
                      <div
                        style={{ height: bar.h, transition: `height 1s cubic-bezier(0.34,1.56,0.64,1)`, transitionDelay: `${400 + i * 100}ms` }}
                        className={`w-full rounded-t-md relative ${bar.active
                          ? "bg-gradient-to-t from-primary/80 to-primary shadow-[0_0_12px_rgba(245,166,35,0.4)]"
                          : "bg-secondary/60 hover:bg-secondary"
                        } transition-colors`}
                      >
                        {bar.active && (
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-white/80 rounded-full" />
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">{bar.l}</span>
                  </div>
                ))}
              </div>

              {/* Stat row */}
              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border/50">
                {[
                  { label: "Empleados", value: "342" },
                  { label: "Pagos hoy", value: "1,284" },
                  { label: "Tasa error", value: "0%" },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className="text-lg font-bold">{stat.value}</p>
                    <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent tx */}
              <div className="space-y-2 pt-1">
                {[
                  { name: "Flotilla Kavak CDMX", amount: "$124,500", status: "ok" },
                  { name: "Comisiones Rappi Norte", amount: "$89,320", status: "ok" },
                  { name: "Propinas Alsea Turno V", amount: "$12,100", status: "pending" },
                ].map((tx, i) => (
                  <div key={i} className="flex items-center justify-between text-xs bg-secondary/30 rounded-lg px-3 py-2">
                    <span className="text-muted-foreground truncate max-w-[160px]">{tx.name}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-semibold">{tx.amount}</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${tx.status === "ok" ? "bg-green-500" : "bg-amber-500 animate-pulse"}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground/50 animate-bounce">
          <span className="text-[10px] font-medium tracking-widest uppercase">Explorar</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </section>

      <BrandTicker />
      <ImpactMetrics />
      <ProblemsVsSolutions />
      <FlowSimulation />
      <AuditTransparency />
      <RealUseCases />
      <ComparisonTable />
      <SecurityCompliance />
      <EnterpriseOnboarding />
      <InteractiveDemo />

      {/* ─── CTA FINAL ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-border py-24 bg-background">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] opacity-10"
               style={{ background: "radial-gradient(ellipse at center, hsl(var(--primary)) 0%, transparent 70%)" }} />
        </div>
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <div className="inline-flex items-center gap-2 mb-6 text-xs font-semibold text-primary border border-primary/20 bg-primary/5 rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Para empresas con equipos operativos
          </div>
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl leading-tight">
            Tu operación merece<br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              infraestructura real.
            </span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Deja de usar Excel para pagar comisiones, propinas y bonos variables. Nomillar es la capa operativa que tu equipo de finanzas necesita hoy.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onGetStarted("admin")}
              className="group flex items-center gap-2 rounded-xl bg-primary px-10 py-4 text-base font-semibold text-primary-foreground hover:shadow-[0_0_36px_rgba(245,166,35,0.3)] hover:scale-[1.03] transition-all"
            >
              Registrar empresa
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("como-funciona")}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
            >
              Ver cómo funciona primero
            </button>
          </div>
          <p className="mt-8 text-xs text-muted-foreground/60">
            Sin costo de integración inicial · Sin costo por empleado en piloto · Sin captación de depósitos
          </p>
        </div>
      </section>

      <LandingFooter />
    </div>
  )
}
