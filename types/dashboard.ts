/**
 * types/dashboard.ts
 * Tipos del dashboard — actualizados para Avalanche.
 * 
 * Cambios:
 * - Employee ahora incluye `wallet` (dirección EVM) y `amount` (monto USDC)
 * - ContractEvent conserva los tipos existentes
 */

export type UserRole = "admin" | "basic"

export interface DashboardProps {
  role: UserRole
  onLogout: () => void
}

export interface Transaction {
  id: string
  type: string
  amount: string
  date: string
  status: "completed" | "pending" | "failed"
  recipient?: string
  txHash?: string        // ← NUEVO: hash de transacción en Avalanche
  explorerUrl?: string   // ← NUEVO: URL de Snowtrace
}

export interface Employee {
  id: string
  name: string
  department: string
  country: string
  status: "active" | "inactive"
  wallet?: string   // ← NUEVO: dirección EVM del empleado (0x...)
  amount?: number   // ← NUEVO: monto en USDC a dispersar
}

export interface ContractEvent {
  id: string
  timestamp: string
  type: "escrow" | "dispersion" | "validation" | "token"
  message: string
  status: "ok" | "warning" | "error"
  txHash?: string   // ← NUEVO: hash de transacción en Avalanche
}
