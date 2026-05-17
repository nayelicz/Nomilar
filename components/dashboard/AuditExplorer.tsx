"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Download, Hash, ArrowRightLeft, ExternalLink, ShieldCheck } from "lucide-react"

export function AuditExplorer() {
  const transactions = [
    { id: "1", date: "2026-05-15 14:32:01", from: "Fideicomiso Rappi MX", to: "Liquidación Repartidores Z-14", amount: "$1,124,500.00", hash: "TRX-88912-BNT", status: "Confirmado" },
    { id: "2", date: "2026-05-15 14:32:01", from: "Cuenta Operativa Kavak", to: "Comisiones Compra-Venta Q1", amount: "$585,320.00", hash: "TRX-88913-BNT", status: "Confirmado" },
    { id: "3", date: "2026-05-15 14:32:02", from: "Alsea Corp. Bóveda", to: "Propinas Starbucks Polanco", amount: "$45,100.00", hash: "TRX-88914-BNT", status: "Confirmado" },
    { id: "4", date: "2026-05-15 14:32:03", from: "Teleperformance Pagos", to: "Bonos Productividad Bilingüe", amount: "$319,450.00", hash: "TRX-88915-BNT", status: "Confirmado" },
    { id: "5", date: "2026-05-14 09:15:00", from: "Mercado Libre Logística", to: "Pago Flotilla Última Milla", amount: "$832,000.00", hash: "TRX-88916-BNT", status: "Confirmado" },
  ]

  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      {/* Explorer Header */}
      <div className="p-6 border-b border-border bg-muted/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" /> Explorador de Auditoría
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Registro inmutable de todas las transacciones operativas.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg text-sm font-medium hover:bg-secondary/80 border border-border">
              <Filter className="w-4 h-4" /> Filtros
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg text-sm font-medium hover:bg-secondary/80 border border-border">
              <Download className="w-4 h-4" /> CSV Export
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por ID de empleado, Hash o Fecha..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      {/* Advanced Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead>
            <tr className="bg-muted/30 border-b border-border text-muted-foreground">
              <th className="px-6 py-4 font-medium">Hash Transacción</th>
              <th className="px-6 py-4 font-medium">Fecha y Hora</th>
              <th className="px-6 py-4 font-medium">Origen / Destino</th>
              <th className="px-6 py-4 font-medium text-right">Monto</th>
              <th className="px-6 py-4 font-medium text-center">Estado</th>
              <th className="px-6 py-4 font-medium text-center">Auditoría</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions.map((tx, idx) => (
              <motion.tr 
                key={tx.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="hover:bg-muted/10 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 font-mono text-primary">
                    <Hash className="w-3.5 h-3.5" /> {tx.hash}
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{tx.date}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-secondary px-2 py-1 rounded text-xs truncate max-w-[120px]">{tx.from}</span>
                    <ArrowRightLeft className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs truncate max-w-[120px]">{tx.to}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-medium">{tx.amount}</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs">
                    {tx.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors inline-flex">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Mock */}
      <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between text-sm text-muted-foreground">
        <div>Mostrando 1 - 5 de 342 registros</div>
        <div className="flex gap-1">
          <button className="px-3 py-1 rounded border border-border bg-secondary opacity-50 cursor-not-allowed">Anterior</button>
          <button className="px-3 py-1 rounded border border-border bg-background hover:bg-secondary">Siguiente</button>
        </div>
      </div>
    </div>
  )
}
