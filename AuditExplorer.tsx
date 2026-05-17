"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Download, Hash, ArrowRightLeft, ExternalLink, ShieldCheck, Loader2, RefreshCw } from "lucide-react"
import { useAvalanche } from "@/hooks/useAvalanche"

// API de Snowtrace Fuji
const SNOWTRACE_API = "https://api-testnet.snowtrace.io/api"
const USDC_CONTRACT = "0x5425890298aed601595a70AB815c96711a31Bc65"

interface SnowtraceTransaction {
  hash: string
  timeStamp: string
  from: string
  to: string
  value: string
  tokenSymbol: string
  tokenDecimal: string
  confirmations: string
  isError: string
}

interface DisplayTransaction {
  id: string
  hash: string
  date: string
  from: string
  to: string
  amount: string
  status: string
  explorerUrl: string
}

function shortenAddress(addr: string) {
  if (!addr) return "—"
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

function formatDate(timestamp: string) {
  const date = new Date(parseInt(timestamp) * 1000)
  return date.toLocaleString("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

function formatUSDC(value: string, decimals: string) {
  const dec = parseInt(decimals) || 6
  const amount = parseFloat(value) / Math.pow(10, dec)
  return `$${amount.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC`
}

export function AuditExplorer() {
  const { address, isConnected } = useAvalanche()
  const [transactions, setTransactions] = useState<DisplayTransaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [totalTx, setTotalTx] = useState(0)
  const pageSize = 5

  const fetchTransactions = useCallback(async () => {
    if (!address) return

    setIsLoading(true)
    setError(null)

    try {
      // Obtener transferencias de USDC de la wallet del admin
      const url = `${SNOWTRACE_API}?module=account&action=tokentx&contractaddress=${USDC_CONTRACT}&address=${address}&sort=desc&apikey=YourApiKeyToken`

      const res = await fetch(url)
      const data = await res.json()

      if (data.status === "1" && Array.isArray(data.result)) {
        const txs: DisplayTransaction[] = data.result.map((tx: SnowtraceTransaction, idx: number) => ({
          id: `${idx}`,
          hash: tx.hash,
          date: formatDate(tx.timeStamp),
          from: shortenAddress(tx.from),
          to: shortenAddress(tx.to),
          amount: formatUSDC(tx.value, tx.tokenDecimal),
          status: parseInt(tx.confirmations) > 0 ? "Confirmado" : "Pendiente",
          explorerUrl: `https://testnet.snowtrace.io/tx/${tx.hash}`,
        }))

        setTotalTx(txs.length)
        setTransactions(txs)
      } else if (data.status === "0" && data.message === "No transactions found") {
        setTransactions([])
        setTotalTx(0)
      } else {
        // Fallback: intentar con transacciones normales de AVAX
        const urlAvax = `${SNOWTRACE_API}?module=account&action=txlist&address=${address}&sort=desc&apikey=YourApiKeyToken`
        const resAvax = await fetch(urlAvax)
        const dataAvax = await resAvax.json()

        if (dataAvax.status === "1" && Array.isArray(dataAvax.result)) {
          const txs: DisplayTransaction[] = dataAvax.result.slice(0, 20).map((tx: any, idx: number) => ({
            id: `${idx}`,
            hash: tx.hash,
            date: formatDate(tx.timeStamp),
            from: shortenAddress(tx.from),
            to: shortenAddress(tx.to),
            amount: `${(parseFloat(tx.value) / 1e18).toFixed(6)} AVAX`,
            status: parseInt(tx.confirmations) > 0 ? "Confirmado" : "Pendiente",
            explorerUrl: `https://testnet.snowtrace.io/tx/${tx.hash}`,
          }))
          setTotalTx(txs.length)
          setTransactions(txs)
        } else {
          setTransactions([])
          setTotalTx(0)
        }
      }
    } catch (err: any) {
      setError("No se pudo cargar el historial. Verifica tu conexión.")
    } finally {
      setIsLoading(false)
    }
  }, [address])

  useEffect(() => {
    if (isConnected && address) {
      fetchTransactions()
    }
  }, [isConnected, address, fetchTransactions])

  // Filtrar por búsqueda
  const filtered = transactions.filter((tx) =>
    tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.date.includes(searchTerm)
  )

  // Paginación
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)
  const totalPages = Math.ceil(filtered.length / pageSize)

  // Exportar CSV
  const exportCSV = () => {
    const rows = [
      ["Hash", "Fecha", "Desde", "Hacia", "Monto", "Estado", "Explorer"],
      ...filtered.map((tx) => [tx.hash, tx.date, tx.from, tx.to, tx.amount, tx.status, tx.explorerUrl]),
    ]
    const csv = rows.map((r) => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `nomillar_auditoria_${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border bg-muted/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" /> Explorador de Auditoría
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {isConnected
                ? `Transacciones reales de ${shortenAddress(address || "")} en Avalanche Fuji`
                : "Conecta Core Wallet para ver tus transacciones reales."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchTransactions}
              disabled={!isConnected || isLoading}
              className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg text-sm font-medium hover:bg-secondary/80 border border-border disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              Actualizar
            </button>
            <button
              onClick={exportCSV}
              disabled={filtered.length === 0}
              className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg text-sm font-medium hover:bg-secondary/80 border border-border disabled:opacity-50"
            >
              <Download className="w-4 h-4" /> CSV Export
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por hash, dirección o fecha..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1) }}
            className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      {/* Contenido */}
      {!isConnected ? (
        <div className="p-12 text-center text-muted-foreground">
          <ShieldCheck className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>Conecta Core Wallet para ver el historial de transacciones.</p>
        </div>
      ) : isLoading ? (
        <div className="p-12 text-center text-muted-foreground">
          <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-primary" />
          <p>Cargando transacciones desde Snowtrace...</p>
        </div>
      ) : error ? (
        <div className="p-12 text-center text-red-500">
          <p>{error}</p>
          <button onClick={fetchTransactions} className="mt-3 text-sm underline">Reintentar</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-muted-foreground">
          <p>No se encontraron transacciones.</p>
          <a
            href={`https://testnet.snowtrace.io/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-sm text-primary underline block"
          >
            Ver en Snowtrace ↗
          </a>
        </div>
      ) : (
        <>
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
                {paginated.map((tx, idx) => (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-muted/10 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-mono text-primary text-xs">
                        <Hash className="w-3.5 h-3.5 shrink-0" />
                        {tx.hash.slice(0, 10)}...{tx.hash.slice(-6)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{tx.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="bg-secondary px-2 py-1 rounded text-xs font-mono">{tx.from}</span>
                        <ArrowRightLeft className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-mono">{tx.to}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-medium">{tx.amount}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        tx.status === "Confirmado"
                          ? "bg-green-500/10 text-green-600 dark:text-green-400"
                          : "bg-yellow-500/10 text-yellow-600"
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <a
                        href={tx.explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-primary transition-colors inline-flex"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between text-sm text-muted-foreground">
            <div>Mostrando {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, filtered.length)} de {filtered.length} registros</div>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded border border-border bg-secondary disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1 rounded border border-border bg-background hover:bg-secondary disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
