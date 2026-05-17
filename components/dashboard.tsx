/**
 * components/dashboard.tsx
 * Dashboard principal con integración de Avalanche C-Chain y Core Wallet.
 * 
 * Cambios respecto al original:
 * - handleDisperseFunds ahora llama a dispersePayroll() real en lugar del setTimeout simulado
 * - Se agrega WalletConnect en el header
 * - El saldo de custodia muestra el balance real de USDC
 * - Los empleados deben tener campo `wallet` (dirección EVM) en el CSV
 */

"use client"

import { useState, useEffect } from "react"
import {
  Calendar,
  Users,
  TrendingUp,
  LogOut,
  Shield,
  Activity,
} from "lucide-react"
import { toast } from "sonner"

import { useUIFeedback } from "@/hooks/useUIFeedback"
import { useAvalanche } from "@/hooks/useAvalanche"                  // ← NUEVO
import type { DashboardProps, Employee } from "@/types/dashboard"
import { useLanguage } from "@/components/language-provider"
import { translations } from "@/lib/translations"
import { LanguageToggle } from "@/components/language-toggle"
import { ThemeToggle } from "@/components/theme-toggle"
import { NomillarLogo } from "@/components/nomillar-logo"
import { WalletConnect } from "@/components/dashboard/WalletConnect"  // ← NUEVO
import { getTxExplorerUrl } from "@/lib/avalanche"                   // ← NUEVO

import { SmartCsvImporter } from "@/components/dashboard/SmartCsvImporter"
import { EmployeeView } from "@/components/dashboard/EmployeeView"
import { AuditExplorer } from "@/components/dashboard/AuditExplorer"

export function Dashboard({ role, onLogout }: DashboardProps) {
  const { notifyWIP } = useUIFeedback()
  const { lang } = useLanguage()
  const t = translations[lang]

  // ── Avalanche / Core Wallet ──────────────────────────────────────────────
  const {
    isConnected,
    usdcBalance,
    disperse,
  } = useAvalanche()

  // ── Estado local ─────────────────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(true)
  const [isDispersing, setIsDispersing] = useState(false)
  const [employeeList, setEmployeeList] = useState<Employee[]>([])

  const isAdmin = role === "admin"

  // ── Dispersión real en Avalanche ─────────────────────────────────────────
  const handleDisperseFunds = async () => {
    if (!isConnected) {
      toast.error("Conecta Core Wallet primero", {
        description: "Usa el botón 'Conectar Core Wallet' en el header.",
      })
      return
    }

    if (employeeList.length === 0) {
      toast.error("No hay empleados cargados", {
        description: "Importa un CSV con los empleados y sus wallets Avalanche.",
      })
      return
    }

    // Validar que todos los empleados tengan wallet EVM
    const sinWallet = employeeList.filter((e) => !(e as any).wallet)
    if (sinWallet.length > 0) {
      toast.error(`${sinWallet.length} empleado(s) sin wallet Avalanche`, {
        description: "Agrega la columna 'wallet' (0x...) al CSV antes de dispersar.",
      })
      return
    }

    setIsDispersing(true)
    const toastId = toast.loading("Iniciando dispersión en Avalanche...", {
      description: "Confirma las transacciones en Core Wallet.",
    })

    try {
      // Mapear empleados al formato de PayrollRecipient
      const recipients = employeeList.map((e) => ({
        id: e.id,
        name: e.name,
        wallet: (e as any).wallet as string,
        amount: (e as any).amount as number,
      }))

      let completados = 0
      let fallidos = 0

      const results = await disperse(recipients, (result, index, total) => {
        if (result.status === "success") {
          completados++
          toast.success(`✓ ${result.name}`, {
            description: (
              <a
                href={getTxExplorerUrl(result.txHash!)}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-primary"
              >
                Ver en Snowtrace ↗
              </a>
            ) as any,
            duration: 4000,
          })
        } else {
          fallidos++
          toast.error(`✗ ${result.name}`, {
            description: result.error,
            duration: 4000,
          })
        }

        // Actualizar toast principal con progreso
        toast.loading(`Dispersando... ${index}/${total}`, {
          id: toastId,
          description: `${completados} exitosos · ${fallidos} fallidos`,
        })
      })

      // Resumen final
      const exitosos = results.filter((r) => r.status === "success").length
      const totalFallidos = results.filter((r) => r.status === "failed").length

      if (totalFallidos === 0) {
        toast.success("Dispersión completada", {
          id: toastId,
          description: `${exitosos} pagos enviados exitosamente en Avalanche C-Chain.`,
          duration: 6000,
        })
      } else {
        toast.warning("Dispersión completada con errores", {
          id: toastId,
          description: `${exitosos} exitosos · ${totalFallidos} fallidos. Revisa el Explorador de Auditoría.`,
          duration: 6000,
        })
      }
    } catch (err: any) {
      toast.error("Error en la dispersión", {
        id: toastId,
        description: err.message || "Verifica tu conexión y saldo de USDC.",
        duration: 6000,
      })
    } finally {
      setIsDispersing(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)

    setEmployeeList([
      // NOTA: agrega campo `wallet` y `amount` cuando importes el CSV real
      { id: "OP-4921", name: "Operador Logístico #4921", department: "Kavak - Flotilla Centro", country: "Mexico", status: "active" },
      { id: "RP-8812", name: "Repartidor Z-Sur", department: "Rappi - Última Milla", country: "Mexico", status: "active" },
      { id: "ST-092", name: "Staff Tienda #092", department: "Grupo Alsea - Operaciones", country: "Colombia", status: "active" },
    ])

    return () => clearTimeout(timer)
  }, [])

  // ── Vista de empleado (no admin) ─────────────────────────────────────────
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

  // ── Vista de administrador ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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

              {/* ← Core Wallet reemplaza al badge estático de "Admin" */}
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* Aviso si wallet no conectada */}
        {!isConnected && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
            <span className="text-sm text-amber-600 dark:text-amber-400">
              Conecta Core Wallet para habilitar la dispersión real en Avalanche C-Chain.
            </span>
          </div>
        )}

        {/* KPI Row */}
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
                    : "—"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {isConnected ? "USDC · Avalanche C-Chain" : "Conecta tu wallet"}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                {/* Logo de Avalanche */}
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

          {/* Próxima dispersión */}
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm relative overflow-hidden group hover:border-accent/40 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/10 transition-colors" />
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t.proximaDispersion}</p>
                <p className="text-3xl font-bold text-foreground">15 Ene</p>
                <p className="text-xs text-muted-foreground mt-1">{t.nominaQuincenal}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2">
              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-primary to-accent rounded-full" />
              </div>
              <span className="text-xs text-muted-foreground font-medium">{t.diasRestantes}</span>
            </div>
          </div>
        </div>

        {/* Centro de Operaciones */}
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
                escrowReady={isConnected}   // ← solo activo si wallet conectada
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
