"use client"

import { useState } from "react"
import { 
  Users, DollarSign, Activity, FileText, Filter, 
  Download, CheckCircle, Clock, Search, TrendingUp 
} from "lucide-react"

export function InteractiveDemo() {
  const [activeTab, setActiveTab] = useState("nomina")

  const mockPayments = [
    { id: "1", name: "Dispersión Flotilla Uber MX", amount: "$3,124,500.00", status: "completado", date: "Hoy, 10:23 AM" },
    { id: "2", name: "Comisiones Agentes GNP", amount: "$985,320.00", status: "completado", date: "Hoy, 10:21 AM" },
    { id: "3", name: "Fondo Fijo Oxxo Norte", amount: "$450,100.00", status: "pendiente", date: "Procesando..." },
    { id: "4", name: "Reembolsos DiDi Food", amount: "$219,450.00", status: "pendiente", date: "Procesando..." },
  ]

  return (
    <section className="py-24 bg-card/30 border-y border-border relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Dashboard interactivo</h2>
          <p className="mt-4 text-lg text-muted-foreground">Explora cómo se ve el control total sobre tus pagos operativos. Transparencia, velocidad y reportes al instante.</p>
        </div>

        {/* Browser Frame */}
        <div 
          className="rounded-[2rem] border border-border/50 bg-background shadow-2xl overflow-hidden transition-all duration-1000 translate-y-0 opacity-100"
        >
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-3">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-destructive/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
            </div>
            <div className="ml-4 text-xs font-medium text-muted-foreground">app.nomillar.com/dashboard</div>
          </div>

          <div className="flex h-[600px]">
            {/* Sidebar Mock */}
            <div className="w-64 border-r border-border bg-card/50 p-4 hidden md:flex flex-col gap-2">
              <div className="font-bold text-lg mb-6 flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-primary" />
                Nomillar
              </div>
              <button 
                onClick={() => setActiveTab("nomina")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "nomina" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
              >
                <Activity className="w-4 h-4" /> Nómina Activa
              </button>
              <button 
                onClick={() => setActiveTab("historial")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "historial" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
              >
                <FileText className="w-4 h-4" /> Historial y Reportes
              </button>
              <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted mt-auto">
                Configuración
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-6 lg:p-8 overflow-y-auto bg-background">
              {/* Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <h3 className="text-2xl font-semibold">Resumen Operativo</h3>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type="text" placeholder="Buscar..." className="pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-full text-sm outline-none focus:border-primary/50 transition-colors" />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full text-sm hover:bg-muted transition-colors">
                    <Filter className="w-4 h-4" /> Filtros
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full text-sm hover:bg-muted transition-colors">
                    <Download className="w-4 h-4" /> Exportar
                  </button>
                </div>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex items-center gap-3 text-muted-foreground mb-3">
                    <DollarSign className="w-5 h-5 text-primary" /> Fondos Dispersados
                  </div>
                  <div className="text-3xl font-bold">$1.2M</div>
                  <div className="text-sm text-green-500 mt-2">+12% vs mes anterior</div>
                </div>
                <div className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex items-center gap-3 text-muted-foreground mb-3">
                    <TrendingUp className="w-5 h-5 text-primary" /> Liquidez Operativa
                  </div>
                  <div className="text-3xl font-bold mb-3">68%</div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary animate-progress" 
                      style={{ '--progress-width': '68%' } as any}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">Fondo de reserva activo</div>
                </div>
                <div className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex items-center gap-3 text-muted-foreground mb-3">
                    <Activity className="w-5 h-5 text-primary" /> Estado de Red
                  </div>
                  <div className="text-3xl font-bold">Óptimo</div>
                  <div className="text-sm text-muted-foreground mt-2">100% auditado</div>
                </div>
              </div>

              {/* Table Area */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-muted/20 flex justify-between items-center">
                  <h4 className="font-semibold">Transacciones Recientes</h4>
                  <div className="text-sm text-muted-foreground">Actualizado hace 2 seg</div>
                </div>
                <div className="divide-y divide-border">
                  {mockPayments.map((payment) => (
                    <div key={payment.id} className="px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                          {payment.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{payment.name}</div>
                          <div className="text-xs text-muted-foreground">{payment.date}</div>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-6">
                        <div className="font-medium">{payment.amount}</div>
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium w-28 justify-center ${payment.status === 'completado' ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                          {payment.status === 'completado' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                          {payment.status === 'completado' ? 'Completado' : 'Pendiente'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
