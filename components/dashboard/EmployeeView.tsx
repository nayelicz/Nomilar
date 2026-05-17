"use client"

import { motion } from "framer-motion"
import { Wallet, TrendingUp, ArrowDownToLine, Receipt, Calendar, ChevronRight, CheckCircle2 } from "lucide-react"

export function EmployeeView() {
  const recentTransactions = [
    { id: 1, type: "Comisiones Q1", amount: "+$4,500.00", date: "Hoy, 10:23 AM", status: "completado" },
    { id: 2, type: "Nómina Quincenal", amount: "+$12,450.00", date: "15 May, 09:00 AM", status: "completado" },
    { id: 3, type: "Bono Desempeño", amount: "+$2,000.00", date: "1 May, 11:30 AM", status: "completado" },
  ]

  return (
    <div className="max-w-md mx-auto sm:max-w-3xl px-4 py-8 space-y-6">
      {/* Header / Neo-bank Balance Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-3xl p-6 border border-border shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />
        
        <div className="relative z-10 flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30">
              <span className="text-accent font-semibold">AM</span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Bienvenida de vuelta,</p>
              <p className="font-medium">Ana Martínez</p>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
            <Calendar className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="relative z-10 text-center py-6">
          <p className="text-sm text-muted-foreground mb-2">Balance Acumulado (Mes)</p>
          <h1 className="text-5xl font-bold tracking-tight text-foreground">$18,950.00</h1>
          <div className="inline-flex items-center gap-2 px-3 py-1 mt-4 rounded-full bg-green-500/10 text-green-500 text-sm font-medium">
            <TrendingUp className="w-4 h-4" />
            +15% vs mes anterior
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-4 mt-6">
          <button className="flex flex-col items-center justify-center p-4 bg-secondary rounded-2xl hover:bg-secondary/80 transition-colors gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <ArrowDownToLine className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">Retirar Fondos</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-secondary rounded-2xl hover:bg-secondary/80 transition-colors gap-2">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
              <Receipt className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">Mis Recibos</span>
          </button>
        </div>
      </motion.div>

      {/* Ingresos Variables */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-3xl p-6 border border-border"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg">Ingresos Variables</h3>
          <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
            Ver desglose <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        {/* Gráfico Simplificado (Barras) */}
        <div className="flex items-end justify-between h-32 gap-2 mb-4">
          {[40, 70, 45, 90, 60, 100].map((h, i) => (
            <div key={i} className="w-full flex flex-col items-center gap-2 group">
              <div 
                className={`w-full rounded-t-md transition-all ${i === 5 ? 'bg-accent' : 'bg-secondary group-hover:bg-accent/50'}`}
                style={{ height: `${h}%` }}
              />
              <span className="text-[10px] text-muted-foreground">{['Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May'][i]}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Historial de Movimientos */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-3xl p-2 border border-border overflow-hidden"
      >
        <div className="px-4 py-4 border-b border-border flex justify-between items-center">
          <h3 className="font-semibold px-2">Movimientos Recientes</h3>
        </div>
        <div className="divide-y divide-border/50">
          {recentTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center border border-border/50">
                  <Wallet className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="font-medium">{tx.type}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{tx.date}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-green-500">{tx.amount}</div>
                <div className="flex items-center justify-end gap-1 text-[10px] text-muted-foreground mt-1">
                  <CheckCircle2 className="w-3 h-3 text-green-500" /> Confirmado
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full py-4 text-sm font-medium text-muted-foreground hover:bg-muted/50 transition-colors">
          Ver historial completo
        </button>
      </motion.div>
    </div>
  )
}
