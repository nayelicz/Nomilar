/**
 * hooks/useAvalanche.ts
 * Hook React para manejar el estado de Core Wallet en toda la app.
 * Incluye auto-reconexión al cargar la página si la wallet ya estaba conectada.
 */

"use client"

import { useState, useEffect, useCallback } from "react"
import {
  connectCoreWallet,
  getUSDCBalance,
  isCoreWalletInstalled,
  dispersePayroll,
  type PayrollRecipient,
  type DispersionResult,
} from "@/lib/avalanche"

export interface AvalancheState {
  address: string | null
  isConnected: boolean
  isConnecting: boolean
  isInstalled: boolean
  usdcBalance: string | null
  network: "fuji" | "mainnet" | null
  error: string | null
}

export function useAvalanche() {
  const [state, setState] = useState<AvalancheState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    isInstalled: false,
    usdcBalance: null,
    network: null,
    error: null,
  })

  const refreshBalance = useCallback(async (addr: string) => {
    try {
      const balance = await getUSDCBalance(addr)
      setState((s) => ({ ...s, usdcBalance: balance }))
    } catch {
      // Silencioso
    }
  }, [])

  // ── Auto-reconexión al cargar la página ──────────────────────────────────
  useEffect(() => {
    const installed = isCoreWalletInstalled()
    setState((s) => ({ ...s, isInstalled: installed }))

    if (!installed) return

    const provider = (window as any).avalanche || (window as any).ethereum
    if (!provider) return

    // Verificar si ya hay cuentas conectadas sin pedir permiso
    provider.request({ method: "eth_accounts" }).then((accounts: string[]) => {
      if (accounts && accounts.length > 0) {
        const address = accounts[0]
        const env = process.env.NEXT_PUBLIC_AVALANCHE_ENV === "mainnet" ? "mainnet" : "fuji"
        setState((s) => ({
          ...s,
          address,
          isConnected: true,
          network: env,
        }))
        refreshBalance(address)
      }
    }).catch(() => {
      // Sin cuentas previas — estado inicial sin cambios
    })
  }, [refreshBalance])

  // ── Escuchar cambios de cuenta y red ─────────────────────────────────────
  useEffect(() => {
    const provider = (window as any).avalanche || (window as any).ethereum
    if (!provider) return

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setState((s) => ({
          ...s,
          address: null,
          isConnected: false,
          usdcBalance: null,
          network: null,
        }))
      } else {
        const env = process.env.NEXT_PUBLIC_AVALANCHE_ENV === "mainnet" ? "mainnet" : "fuji"
        setState((s) => ({
          ...s,
          address: accounts[0],
          isConnected: true,
          network: env,
        }))
        refreshBalance(accounts[0])
      }
    }

    const handleChainChanged = () => {
      window.location.reload()
    }

    provider.on?.("accountsChanged", handleAccountsChanged)
    provider.on?.("chainChanged", handleChainChanged)

    return () => {
      provider.removeListener?.("accountsChanged", handleAccountsChanged)
      provider.removeListener?.("chainChanged", handleChainChanged)
    }
  }, [refreshBalance])

  // ── Conectar manualmente ─────────────────────────────────────────────────
  const connect = useCallback(async () => {
    setState((s) => ({ ...s, isConnecting: true, error: null }))

    try {
      const address = await connectCoreWallet()
      const env = process.env.NEXT_PUBLIC_AVALANCHE_ENV === "mainnet" ? "mainnet" : "fuji"

      setState((s) => ({
        ...s,
        address,
        isConnected: true,
        isConnecting: false,
        network: env,
      }))

      await refreshBalance(address)
    } catch (err: any) {
      setState((s) => ({
        ...s,
        isConnecting: false,
        error: err.message || "Error al conectar Core Wallet",
      }))
    }
  }, [refreshBalance])

  const disconnect = useCallback(() => {
    setState((s) => ({
      ...s,
      address: null,
      isConnected: false,
      usdcBalance: null,
      network: null,
      error: null,
    }))
  }, [])

  // ── Dispersión ───────────────────────────────────────────────────────────
  const disperse = useCallback(
    async (
      recipients: PayrollRecipient[],
      onProgress?: (result: DispersionResult, index: number, total: number) => void
    ): Promise<DispersionResult[]> => {
      if (!state.isConnected || !state.address) {
        throw new Error("Conecta Core Wallet antes de dispersar")
      }

      const results = await dispersePayroll(recipients, onProgress)
      await refreshBalance(state.address)
      return results
    },
    [state.isConnected, state.address, refreshBalance]
  )

  return {
    ...state,
    connect,
    disconnect,
    disperse,
    refreshBalance: () => state.address && refreshBalance(state.address),
  }
}
