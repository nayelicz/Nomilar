"use client"

import { useState, useEffect } from "react"
import { Building2, Users, Shield, UserCircle, ArrowRight, Zap } from "lucide-react"

type LoginAction = "create" | "join" | null
type UserRole = "admin" | "basic" | null

interface LoginScreenProps {
  onLogin: (role: UserRole) => void
}

// Animated particle component
function FloatingParticle({ delay, size, color, x, y }: { delay: number; size: number; color: string; x: number; y: number }) {
  return (
    <div
      className="absolute rounded-full animate-pulse opacity-60"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
        background: color,
        boxShadow: `0 0 ${size * 2}px ${color}`,
        animationDelay: `${delay}s`,
        animationDuration: `${3 + Math.random() * 2}s`,
      }}
    />
  )
}

// Animated grid line
function GridLine({ orientation, position, delay }: { orientation: "h" | "v"; position: number; delay: number }) {
  return (
    <div
      className={`absolute ${orientation === "h" ? "w-full h-px" : "h-full w-px"} opacity-0 animate-fade-in`}
      style={{
        [orientation === "h" ? "top" : "left"]: `${position}%`,
        background: `linear-gradient(${orientation === "h" ? "90deg" : "180deg"}, transparent, oklch(0.75 0.18 195 / 0.15), transparent)`,
        animationDelay: `${delay}s`,
        animationFillMode: "forwards",
      }}
    />
  )
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [action, setAction] = useState<LoginAction>(null)
  const [companyName, setCompanyName] = useState("")
  const [inviteCode, setInviteCode] = useState("")
  const [mounted, setMounted] = useState(false)
  const [logoHovered, setLogoHovered] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = (role: UserRole) => {
    onLogin(role)
  }

  // Generate particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    delay: Math.random() * 3,
    size: 2 + Math.random() * 4,
    color: i % 3 === 0 ? "oklch(0.75 0.18 195)" : i % 3 === 1 ? "oklch(0.70 0.22 330)" : "oklch(0.65 0.22 285)",
    x: Math.random() * 100,
    y: Math.random() * 100,
  }))

  // Generate grid lines
  const hLines = Array.from({ length: 8 }, (_, i) => ({ position: 12.5 * (i + 1), delay: 0.1 * i }))
  const vLines = Array.from({ length: 12 }, (_, i) => ({ position: 8.33 * (i + 1), delay: 0.1 * i }))

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Deep background with subtle gradient */}
      <div className="absolute inset-0 bg-[oklch(0.10_0.02_260)]" />
      
      {/* Animated grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {hLines.map((line, i) => (
          <GridLine key={`h-${i}`} orientation="h" position={line.position} delay={line.delay} />
        ))}
        {vLines.map((line, i) => (
          <GridLine key={`v-${i}`} orientation="v" position={line.position} delay={line.delay} />
        ))}
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <FloatingParticle key={p.id} {...p} />
        ))}
      </div>
      
      {/* Large gradient orbs */}
      <div 
        className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full blur-[120px] opacity-30 transition-all duration-1000"
        style={{ background: "radial-gradient(circle, oklch(0.75 0.18 195 / 0.4), transparent)" }}
      />
      <div 
        className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full blur-[120px] opacity-30 transition-all duration-1000"
        style={{ background: "radial-gradient(circle, oklch(0.70 0.22 330 / 0.4), transparent)" }}
      />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] opacity-20"
        style={{ background: "radial-gradient(circle, oklch(0.65 0.22 285 / 0.3), transparent)" }}
      />
      
      <div 
        className={`relative z-10 w-full max-w-lg transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Logo and Title */}
        <div className="text-center mb-10">
          <div 
            className={`inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-6 relative transition-all duration-500 cursor-pointer ${
              logoHovered ? "scale-110" : ""
            }`}
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
            style={{
              background: "linear-gradient(135deg, oklch(0.18 0.02 260 / 0.8), oklch(0.14 0.02 260 / 0.9))",
              backdropFilter: "blur(20px)",
              border: "1px solid oklch(0.40 0.05 260 / 0.5)",
              boxShadow: logoHovered 
                ? "0 0 60px oklch(0.75 0.18 195 / 0.4), 0 0 100px oklch(0.70 0.22 330 / 0.2), inset 0 1px 0 oklch(1 0 0 / 0.1)"
                : "0 0 40px oklch(0.75 0.18 195 / 0.2), inset 0 1px 0 oklch(1 0 0 / 0.05)",
            }}
          >
            {/* Rotating border gradient */}
            <div 
              className={`absolute inset-0 rounded-3xl transition-opacity duration-500 ${logoHovered ? "opacity-100" : "opacity-0"}`}
              style={{
                background: "conic-gradient(from 0deg, oklch(0.75 0.18 195), oklch(0.70 0.22 330), oklch(0.65 0.22 285), oklch(0.75 0.18 195))",
                padding: "2px",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                animation: logoHovered ? "spin 3s linear infinite" : "none",
              }}
            />
            <img
              src="/logo.png"
              alt="Nomillar"
              className="h-14 w-auto object-contain drop-shadow-lg"
            />
          </div>
          
          <h1 
            className="text-5xl font-bold mb-3 tracking-tight"
            style={{
              background: "linear-gradient(135deg, oklch(0.95 0.01 260), oklch(0.80 0.18 195), oklch(0.72 0.25 330), oklch(0.65 0.22 285))",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "gradient-shift 8s ease infinite",
            }}
          >
            Nomillar
          </h1>
          <p className="text-muted-foreground text-lg flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            Acceso empresa y empleado
          </p>
          <p className="text-muted-foreground text-sm text-center mt-3 max-w-sm mx-auto leading-relaxed">
            Accede como administrador de empresa o como empleado para explorar el panel de nómina.
          </p>
        </div>

        {/* Main Card */}
        <div 
          className="rounded-3xl p-8 relative overflow-hidden transition-all duration-300"
          style={{
            background: "linear-gradient(135deg, oklch(0.16 0.02 260 / 0.9), oklch(0.12 0.02 260 / 0.95))",
            backdropFilter: "blur(40px)",
            border: "1px solid oklch(0.35 0.03 260 / 0.5)",
            boxShadow: "0 25px 50px -12px oklch(0 0 0 / 0.5), inset 0 1px 0 oklch(1 0 0 / 0.05)",
          }}
        >
          {/* Subtle inner glow */}
          <div 
            className="absolute inset-0 opacity-50 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 50% 0%, oklch(0.75 0.18 195 / 0.1), transparent 50%)",
            }}
          />
          
          {!action ? (
            <div className="space-y-4 relative">
              <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
                Bienvenido
              </h2>
              
              {/* Create Company */}
              <button
                onClick={() => setAction("create")}
                className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all group hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "oklch(0.20 0.02 260 / 0.6)",
                  border: "1px solid oklch(0.30 0.03 260 / 0.5)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "oklch(0.25 0.03 260 / 0.7)"
                  e.currentTarget.style.borderColor = "oklch(0.75 0.18 195 / 0.5)"
                  e.currentTarget.style.boxShadow = "0 0 30px oklch(0.75 0.18 195 / 0.15)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "oklch(0.20 0.02 260 / 0.6)"
                  e.currentTarget.style.borderColor = "oklch(0.30 0.03 260 / 0.5)"
                  e.currentTarget.style.boxShadow = "none"
                }}
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300"
                  style={{ background: "linear-gradient(135deg, oklch(0.75 0.18 195 / 0.2), oklch(0.65 0.15 195 / 0.1))" }}
                >
                  <Building2 className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-foreground text-lg">Crear Empresa</p>
                  <p className="text-sm text-muted-foreground">Registra tu organizacion</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </button>

              {/* Join Team */}
              <button
                onClick={() => setAction("join")}
                className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all group hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "oklch(0.20 0.02 260 / 0.6)",
                  border: "1px solid oklch(0.30 0.03 260 / 0.5)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "oklch(0.25 0.03 260 / 0.7)"
                  e.currentTarget.style.borderColor = "oklch(0.70 0.22 330 / 0.5)"
                  e.currentTarget.style.boxShadow = "0 0 30px oklch(0.70 0.22 330 / 0.15)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "oklch(0.20 0.02 260 / 0.6)"
                  e.currentTarget.style.borderColor = "oklch(0.30 0.03 260 / 0.5)"
                  e.currentTarget.style.boxShadow = "none"
                }}
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300"
                  style={{ background: "linear-gradient(135deg, oklch(0.70 0.22 330 / 0.2), oklch(0.60 0.18 330 / 0.1))" }}
                >
                  <Users className="w-7 h-7 text-accent" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-foreground text-lg">Unirme a un Equipo</p>
                  <p className="text-sm text-muted-foreground">Usa tu codigo de invitacion</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
              </button>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div 
                    className="w-full h-px"
                    style={{ background: "linear-gradient(90deg, transparent, oklch(0.40 0.05 260), transparent)" }}
                  />
                </div>
                <div className="relative flex justify-center">
                  <span 
                    className="px-6 text-sm text-muted-foreground"
                    style={{ background: "oklch(0.14 0.02 260)" }}
                  >
                    Acceso de prueba
                  </span>
                </div>
              </div>

              {/* Test Access Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleSubmit("admin")}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl transition-all group hover:scale-[1.03] active:scale-[0.97]"
                  style={{
                    background: "linear-gradient(135deg, oklch(0.75 0.18 195 / 0.1), oklch(0.65 0.15 195 / 0.05))",
                    border: "1px solid oklch(0.75 0.18 195 / 0.3)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "oklch(0.75 0.18 195 / 0.6)"
                    e.currentTarget.style.boxShadow = "0 0 40px oklch(0.75 0.18 195 / 0.2), inset 0 0 30px oklch(0.75 0.18 195 / 0.05)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "oklch(0.75 0.18 195 / 0.3)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                >
                  <Shield className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-foreground">Vista Admin</span>
                  <span className="text-xs text-muted-foreground">Control total</span>
                </button>
                <button
                  onClick={() => handleSubmit("basic")}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl transition-all group hover:scale-[1.03] active:scale-[0.97]"
                  style={{
                    background: "linear-gradient(135deg, oklch(0.65 0.22 285 / 0.1), oklch(0.55 0.18 285 / 0.05))",
                    border: "1px solid oklch(0.65 0.22 285 / 0.3)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "oklch(0.65 0.22 285 / 0.6)"
                    e.currentTarget.style.boxShadow = "0 0 40px oklch(0.65 0.22 285 / 0.2), inset 0 0 30px oklch(0.65 0.22 285 / 0.05)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "oklch(0.65 0.22 285 / 0.3)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                >
                  <UserCircle className="w-10 h-10 text-neon-violet group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-foreground">Vista Empleado</span>
                  <span className="text-xs text-muted-foreground">Mi portal</span>
                </button>
              </div>
            </div>
          ) : action === "create" ? (
            <div className="space-y-6 relative">
              <button
                onClick={() => setAction(null)}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-1 group"
              >
                <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                Volver
              </button>
              
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Crear Empresa
                </h2>
                <p className="text-muted-foreground text-sm">
                  Ingresa el nombre de tu organizacion para comenzar
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Nombre de la Empresa
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Mi Empresa S.A. de C.V."
                  className="w-full px-5 py-4 rounded-xl outline-none transition-all text-foreground placeholder:text-muted-foreground"
                  style={{
                    background: "oklch(0.12 0.02 260)",
                    border: "1px solid oklch(0.30 0.03 260)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "oklch(0.75 0.18 195)"
                    e.currentTarget.style.boxShadow = "0 0 20px oklch(0.75 0.18 195 / 0.15)"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "oklch(0.30 0.03 260)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                />
              </div>

              <button
                onClick={() => handleSubmit("admin")}
                disabled={!companyName.trim()}
                className="w-full py-4 px-4 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: companyName.trim() 
                    ? "linear-gradient(135deg, oklch(0.75 0.18 195), oklch(0.65 0.20 210))"
                    : "oklch(0.30 0.03 260)",
                  color: companyName.trim() ? "oklch(0.13 0.02 260)" : "oklch(0.50 0.02 260)",
                  boxShadow: companyName.trim() ? "0 0 30px oklch(0.75 0.18 195 / 0.3)" : "none",
                }}
              >
                Crear y Continuar
              </button>
            </div>
          ) : (
            <div className="space-y-6 relative">
              <button
                onClick={() => setAction(null)}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-1 group"
              >
                <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                Volver
              </button>
              
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Unirme a un Equipo
                </h2>
                <p className="text-muted-foreground text-sm">
                  Ingresa el codigo de invitacion proporcionado por tu empresa
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Codigo de Invitacion
                </label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="XXXX-XXXX-XXXX"
                  className="w-full px-5 py-4 rounded-xl outline-none transition-all text-foreground placeholder:text-muted-foreground font-mono tracking-widest text-center text-lg"
                  style={{
                    background: "oklch(0.12 0.02 260)",
                    border: "1px solid oklch(0.30 0.03 260)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "oklch(0.70 0.22 330)"
                    e.currentTarget.style.boxShadow = "0 0 20px oklch(0.70 0.22 330 / 0.15)"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "oklch(0.30 0.03 260)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                />
              </div>

              <button
                onClick={() => handleSubmit("basic")}
                disabled={!inviteCode.trim()}
                className="w-full py-4 px-4 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: inviteCode.trim() 
                    ? "linear-gradient(135deg, oklch(0.70 0.22 330), oklch(0.60 0.20 340))"
                    : "oklch(0.30 0.03 260)",
                  color: inviteCode.trim() ? "oklch(0.95 0.01 260)" : "oklch(0.50 0.02 260)",
                  boxShadow: inviteCode.trim() ? "0 0 30px oklch(0.70 0.22 330 / 0.3)" : "none",
                }}
              >
                Unirme al Equipo
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-muted-foreground text-sm mt-10 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Dispersion de nomina internacional de alto volumen
        </p>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 1s ease forwards;
        }
      `}</style>
    </div>
  )
}
