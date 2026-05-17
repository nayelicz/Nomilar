/**
 * components/dashboard.tsx
 * Dashboard principal con integración de Avalanche C-Chain y Core Wallet.
 * Incluye selector de periodo de nómina con cálculo automático de próxima fecha.
 */

"use client"

import { useState, useEffect } from "react"
import {
  Calendar,
  TrendingUp,
  LogOut,
  Shield,
  Activity,
  Pencil,
  Check,
  X,
} from "lucide-react"
import { toast } from "sonner"

import { useUIFeedback } from "@/hooks/useUIFeedback"
import { useAvalanche } from "@/hooks/useAvalanche"
import type { DashboardProps } from "@/types/dashboard"
import { useLanguage } from "@/components/language-provider"
import { translations } from "@/lib/translations"
import { LanguageToggle } from "@/components/language-toggle"
import { ThemeToggle } from "@/components/theme-toggle"
import { NomillarLogo } from "@/components/nomillar-logo"
import { WalletConnect } from "@/components/dashboard/WalletConnect"
import { getTxExplorerUrl } from "@/lib/avalanche"

import { SmartCsvImporter } from "@/components/dashboard/SmartCsvImporter"
import { EmployeeView } from "@/components/dashboard/EmployeeView"
import { AuditExplorer } from "@/components/dashboard/AuditExplorer"

interface PayrollRecipient {
  id: string
  name: string
  wallet: string
  amount: number
}

type PeriodType = "quincenal" | "mensual"

// ── Calcula la próxima fecha de dispersión ───────────────────────────────────
function getNextDispersionDate(period: PeriodType): Date {
  const today = new Date()
  const day = today.getDate()
  const month = today.getMonth()
  const year = today.getFullYear()

  if (period === "quincenal") {
    // Días de pago: 1 y 15 de cada mes
    if (day < 1) return new Date(year, month, 1)
    if (day < 15) return new Date(year, month, 15)
    // Si ya pasó el 15, siguiente es el 1 del próximo mes
    return new Date(year, month + 1, 1)
  } else {
    // Mensual: último día del mes
    const lastDay = new Date(year, month + 1, 0)
    if (today < lastDay) return lastDay
    // Si ya pasó, último día del próximo mes
    return new Date(year, month + 2, 0)
  }
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("es-MX", { day: "numeric", month: "short" })
}

function getDaysUntil(date: Date): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = date.getTime() - today.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

// ── Componente del KPI de Próxima Dispersión ─────────────────────────────────
function NextDispersionCard() {
  const [period, setPeriod] = useState<PeriodType>("quincenal")
  const [nextDate, setNextDate] = useState<Date>(getNextDispersionDate("quincenal"))
  const [isEditing, setIsEditing] = useState(false)
  const [manualDate, setManualDate] = useState("")

  // Recalcular cuando cambia el periodo
  useEffect(() => {
    if (!isEditing) {
      setNextDate(getNextDispersionDate(period))
    }
  }, [period, isEditing])

  const daysUntil = getDaysUntil(nextDate)
  const progressWidth = Math.max(5, Math.min(95, 100 - (daysUntil / 15) * 100))

  const handleSaveManual = () => {
    if (!manualDate) return
    const date = new Date(manualDate + "T12:00:00")
    if (isNaN(date.getTime())) return
    setNextDate(date)
    setIsEditing(false)
  }

  const handleCancelManual = () => {
    setIsEditing(false)
    setManualDate("")
    setNextDate(getNextDispersionDate(period))
  }

  return (
    <div className="bg-card rounded-2xl p-6 border border-border shadow-sm relative overflow-hidden group hover:border-accent/40 transition-colors">
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/10 transition-colors" />

      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">Próxima Dispersión</p>

          {isEditing ? (
            <div className="flex items-center gap-2 mt-1">
              <input
                type="date"
                value={manualDate}
                onChange={(e) => setManualDate(e.target.value)}
                className="bg-background border border-border rounded-lg px-2 py-1 text-sm outline-none focus:border-primary/50"
              />
              <button onClick={handleSaveManual} className="p-1 text-green-500 hover:bg-green-500/10 rounded">
                <Check className="w-4 h-4" />
              </button>
              <button onClick={handleCancelManual} className="p-1 text-red-500 hover:bg-red-500/10 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold text-foreground">{formatDate(nextDate)}</p>
              <button
                onClick={() => setIsEditing(true)}
                title="Cambiar fecha manualmente"
                className="p-1 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Selector de periodo */}
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => { setPeriod("quincenal"); setIsEditing(false) }}
              className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${
                period === "quincenal"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
            >
              Quincenal
            </button>
            <button
              onClick={() => { setPeriod("mensual"); setIsEditing(false) }}
              className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${
                period === "mensual"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
            >
              Mensual
            </button>
          </div>
        </div>

        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
          <Calendar className="w-6 h-6 text-accent" />
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
              style={{ width: `${progressWidth}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
            {daysUntil === 0 ? "¡Hoy!" : `${daysUntil} día${daysUntil !== 1 ? "s" : ""}`}
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Dashboard principal ───────────────────────────────────────────────────────
export function Dashboard({ role, onLogout }: DashboardProps) {
  const { notifyWIP } = useUIFeedback()
  const { lang } = useLanguage()
  const t = translations[lang]

  const { isConnected, usdcBalance, disperse } = useAvalanche()

  const [isLoading, setIsLoading] = useState(true)
  const [isDispersing, setIsDispersing] = useState(false)

  const isAdmin = role === "admin"

  const handleDisperseFunds = async (recipients: PayrollRecipient[]) => {
    if (!isConnected) {
      toast.error("Conecta Core Wallet primero", {
        description: "Usa el boton 'Conectar Core Wallet' en el header.",
      })
      return
    }

    if (!recipients || recipients.length === 0) {
      toast.error("No hay empleados validos en el CSV", {
        description: "Verifica que el archivo tenga columnas: id, name, wallet, amount.",
      })
      return
    }

    setIsDispersing(true)
    const toastId = toast.loading("Iniciando dispersion en Avalanche...", {
      description: `Procesando ${recipients.length} pagos. Confirma en Core Wallet.`,
    })

    try {
      let completados = 0
      let fallidos = 0

      const results = await disperse(recipients, (result, index, total) => {
        if (result.status === "success") {
          completados++
          toast.success(`${result.name}`, {
            description: (
              <a
                href={getTxExplorerUrl(result.txHash!)}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-primary"
              >
                Ver en Snowtrace
              </a>
            ) as any,
            duration: 4000,
          })
        } else {
          fallidos++
          toast.error(`${result.name}`, {
            description: result.error,
            duration: 4000,
          })
        }

        toast.loading(`Dispersando... ${index}/${total}`, {
          id: toastId,
          description: `${completados} exitosos - ${fallidos} fallidos`,
        })
      })

      const exitosos = results.filter((r) => r.status === "success").length
      const totalFallidos = results.filter((r) => r.status === "failed").length

      if (totalFallidos === 0) {
        toast.success("Dispersion completada", {
          id: toastId,
          description: `${exitosos} pagos enviados exitosamente en Avalanche C-Chain.`,
          duration: 6000,
        })
      } else {
        toast.warning("Dispersion completada con errores", {
          id: toastId,
          description: `${exitosos} exitosos - ${totalFallidos} fallidos. Revisa el Explorador de Auditoria.`,
          duration: 6000,
        })
      }
    } catch (err: any) {
      toast.error("Error en la dispersion", {
        id: toastId,
        description: err.message || "Verifica tu conexion y saldo de USDC.",
        duration: 6000,
      })
    } finally {
      setIsDispersing(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <NomillarLogo variant="icon" />
              <div>
                <h1 className="text-xl font-bold">{t.appName}</h1>
                <p className="text-xs text-muted-foreground">{t.appSubtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <ThemeToggle />
              <button onClick={onLogout} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-muted-foreground hover:bg-secondary transition-colors">
                <LogOut className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">{t.salir}</span>
              </button>
            </div>
          </div>
        </header>
        <EmployeeView />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <NomillarLogo variant="icon" />
              <div>
                <h1 className="text-xl font-bold">{t.appName}</h1>
                <p className="text-xs text-muted-foreground">Panel Administrativo</p>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-wrap justify-end">
              <LanguageToggle />
              <ThemeToggle />
              <WalletConnect />
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Admin</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">{t.salir}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {!isConnected && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
            <span className="text-sm text-amber-600 dark:text-amber-400">
              Conecta Core Wallet para habilitar la dispersion real en Avalanche C-Chain.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Saldo USDC real */}
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm relative overflow-hidden group hover:border-primary/40 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t.saldoCustodia}</p>
                <p className="text-3xl font-bold text-foreground">
                  {isConnected && usdcBalance !== null
                    ? `$${parseFloat(usdcBalance).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : "-"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {isConnected ? "USDC - Avalanche C-Chain" : "Conecta tu wallet"}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-red-500 fill-current">
                  <path d="M12 2L2 19h4.5l5.5-9.5L17.5 19H22L12 2z" />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-6 text-xs text-green-500 font-medium">
              <TrendingUp className="w-4 h-4" />
              <span>{isConnected ? "Saldo en tiempo real" : "Wallet no conectada"}</span>
            </div>
          </div>

          {/* Proxima dispersion con selector de periodo */}
          <NextDispersionCard />
        </div>

        <div className="space-y-8">
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6 max-w-4xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> Centro de Operaciones
            </h2>
            {isLoading ? (
              <div className="h-64 rounded-xl bg-secondary animate-pulse" />
            ) : (
              <SmartCsvImporter
                onDisperse={handleDisperseFunds}
                isDispersing={isDispersing}
                escrowReady={isConnected}
              />
            )}
          </div>

          <div className="max-w-6xl">
            {isLoading ? (
              <div className="h-64 rounded-2xl bg-card border border-border animate-pulse" />
            ) : (
              <AuditExplorer />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
