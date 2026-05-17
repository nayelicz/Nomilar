"use client"

import { motion } from "framer-motion"
import { Search, Hash, ArrowRightLeft } from "lucide-react"

export function AuditTransparency() {
  const transactions = [
    { origin: "Fideicomiso Alsea Corp", dest: "Cta. Nomina terminación 4122", date: "2026-05-15 14:32:01", hash: "TRX-88912-BNT", status: "Confirmado" },
    { origin: "Bóveda Mercado Libre V2", dest: "Cta. Nomina terminación 8911", date: "2026-05-15 14:32:01", hash: "TRX-88913-BNT", status: "Confirmado" },
    { origin: "Cuenta Operativa Kavak", dest: "Liquidación Gastos Viaje", date: "2026-05-15 14:32:02", hash: "TRX-88914-BNT", status: "Confirmado" },
  ]

  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Transparencia y auditoría visual</h2>
          <p className="mt-4 text-lg text-muted-foreground">Cada pago queda registrado en nuestra infraestructura inmutable, creando un "explorador empresarial" para tus auditores.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden font-mono text-sm"
        >
          <div className="bg-muted/50 p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Search className="w-4 h-4" /> Explorador de Pagos
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Red Activa
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/20 text-muted-foreground border-b border-border">
                  <th className="p-4 font-medium">Hash</th>
                  <th className="p-4 font-medium">Fecha</th>
                  <th className="p-4 font-medium">Origen / Destino</th>
                  <th className="p-4 font-medium text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactions.map((tx, idx) => (
                  <tr key={idx} className="hover:bg-muted/10 transition-colors">
                    <td className="p-4 flex items-center gap-2 text-primary">
                      <Hash className="w-3 h-3" /> {tx.hash}
                    </td>
                    <td className="p-4 text-muted-foreground">{tx.date}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="bg-muted px-2 py-1 rounded text-xs">{tx.origin}</span>
                        <ArrowRightLeft className="w-3 h-3 text-muted-foreground" />
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">{tx.dest}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-green-500 bg-green-500/10 px-2 py-1 rounded text-xs">{tx.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
