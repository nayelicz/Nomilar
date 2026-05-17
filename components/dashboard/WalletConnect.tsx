/**
 * components/dashboard/WalletConnect.tsx
 * Botón de conexión para Core Wallet con estado visual completo.
 * 
 * Reemplaza cualquier referencia a Stellar keypair en el header del dashboard.
 */

"use client"

import { Wallet, LogOut, ExternalLink, AlertCircle, Loader2 } from "lucide-react"
import { useAvalanche } from "@/hooks/useAvalanche"

interface WalletConnectProps {
  /** Callback opcional cuando la wallet se conecta exitosamente */
  onConnected?: (address: string) => void
}

export function WalletConnect({ onConnected }: WalletConnectProps) {
  const {
    address,
    isConnected,
    isConnecting,
    isInstalled,
    usdcBalance,
    network,
    error,
    connect,
    disconnect,
  } = useAvalanche()

  // Abreviar dirección: 0x1234...abcd
  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null

  // Core Wallet no instalado
  if (!isInstalled) {
    return (
      <a
        href="https://core.app"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 transition-all text-sm font-medium"
      >
        <AlertCircle className="w-4 h-4" />
        <span className="hidden sm:inline">Instalar Core Wallet</span>
        <ExternalLink className="w-3 h-3" />
      </a>
    )
  }

  // Conectado — mostrar dirección y balance
  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        {/* Badge de red */}
        <span className="hidden md:flex items-center gap-1 px-2 py-1 rounded-md bg-red-500/10 text-red-500 text-xs font-medium border border-red-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          {network === "mainnet" ? "Mainnet" : "Fuji Testnet"}
        </span>

        {/* Balance USDC */}
        {usdcBalance !== null && (
          <span className="hidden md:block text-xs text-muted-foreground font-mono">
            {parseFloat(usdcBalance).toLocaleString("es-MX", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            USDC
          </span>
        )}

        {/* Dirección */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
          <Wallet className="w-4 h-4 text-primary" />
          <span className="text-sm font-mono text-primary">{shortAddress}</span>
        </div>

        {/* Desconectar */}
        <button
          onClick={disconnect}
          title="Desconectar wallet"
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    )
  }

  // No conectado
  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={async () => {
          await connect()
          if (address) onConnected?.(address)
        }}
        disabled={isConnecting}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isConnecting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="hidden sm:inline">Conectando...</span>
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4" />
            <span className="hidden sm:inline">Conectar Core Wallet</span>
          </>
        )}
      </button>

      {/* Error de conexión */}
      {error && (
        <p className="text-xs text-red-500 max-w-[200px] text-right">{error}</p>
      )}
    </div>
  )
}
