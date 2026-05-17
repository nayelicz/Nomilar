/**
 * lib/avalanche.ts
 * Lógica de conexión y dispersión en Avalanche C-Chain usando Core Wallet (EIP-1193).
 * Modelo: una transacción por empleado — permite pagar en diferentes momentos.
 *
 * Instalar: npm install ethers
 */

import { ethers } from "ethers"

// ─── Configuración de red ────────────────────────────────────────────────────

export const AVALANCHE_MAINNET = {
  chainId: "0xA86A",
  chainName: "Avalanche C-Chain",
  nativeCurrency: { name: "AVAX", symbol: "AVAX", decimals: 18 },
  rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
  blockExplorerUrls: ["https://snowtrace.io"],
}

export const AVALANCHE_FUJI = {
  chainId: "0xA869",
  chainName: "Avalanche Fuji Testnet",
  nativeCurrency: { name: "AVAX", symbol: "AVAX", decimals: 18 },
  rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
  blockExplorerUrls: ["https://testnet.snowtrace.io"],
}

export const TARGET_NETWORK =
  process.env.NEXT_PUBLIC_AVALANCHE_ENV === "mainnet"
    ? AVALANCHE_MAINNET
    : AVALANCHE_FUJI

export const USDC_ADDRESS =
  process.env.NEXT_PUBLIC_AVALANCHE_ENV === "mainnet"
    ? "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6"
    : "0x5425890298aed601595a70AB815c96711a31Bc65"

const ERC20_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function approve(address spender, uint256 amount) returns (bool)",
]

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface PayrollRecipient {
  id: string
  name: string
  wallet: string
  amount: number
}

export interface DispersionResult {
  recipientId: string
  name: string
  wallet: string
  amount: number
  txHash: string | null
  status: "success" | "failed"
  error?: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function isCoreWalletInstalled(): boolean {
  if (typeof window === "undefined") return false
  return !!(window as any).avalanche || !!(window as any).ethereum
}

function getCoreProvider(): any {
  if (typeof window === "undefined") return null
  return (window as any).avalanche || (window as any).ethereum || null
}

async function ensureAvalancheNetwork(provider: any): Promise<void> {
  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: TARGET_NETWORK.chainId }],
    })
  } catch (switchError: any) {
    if (switchError.code === 4902) {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [TARGET_NETWORK],
      })
    } else {
      throw switchError
    }
  }
}

// ─── Funciones principales ───────────────────────────────────────────────────

export async function connectCoreWallet(): Promise<string> {
  const provider = getCoreProvider()
  if (!provider) throw new Error("Core Wallet no detectado. Instálalo desde core.app")

  const accounts: string[] = await provider.request({ method: "eth_requestAccounts" })
  if (!accounts || accounts.length === 0) throw new Error("No se obtuvo ninguna cuenta.")

  await ensureAvalancheNetwork(provider)
  return accounts[0]
}

export async function getUSDCBalance(address: string): Promise<string> {
  const provider = getCoreProvider()
  if (!provider) throw new Error("Core Wallet no conectado")

  const ethersProvider = new ethers.BrowserProvider(provider)
  const usdc = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, ethersProvider)
  const [balance, decimals] = await Promise.all([usdc.balanceOf(address), usdc.decimals()])
  return ethers.formatUnits(balance, decimals)
}

/**
 * Dispersa nómina enviando una transacción individual por empleado.
 * Permite pagar a cada empleado en el momento exacto que le corresponde,
 * independientemente del resto del equipo.
 */
export async function dispersePayroll(
  recipients: PayrollRecipient[],
  onProgress?: (result: DispersionResult, index: number, total: number) => void
): Promise<DispersionResult[]> {
  const provider = getCoreProvider()
  if (!provider) throw new Error("Core Wallet no conectado")

  const ethersProvider = new ethers.BrowserProvider(provider)
  const signer = await ethersProvider.getSigner()
  const usdc = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, signer)
  const decimals: number = await usdc.decimals()

  const results: DispersionResult[] = []

  for (let i = 0; i < recipients.length; i++) {
    const recipient = recipients[i]

    try {
      if (!ethers.isAddress(recipient.wallet)) {
        throw new Error(`Dirección inválida: ${recipient.wallet}`)
      }

      const amountInUnits = ethers.parseUnits(recipient.amount.toFixed(6), decimals)
      const tx = await usdc.transfer(recipient.wallet, amountInUnits)
      await tx.wait()

      const result: DispersionResult = {
        recipientId: recipient.id,
        name: recipient.name,
        wallet: recipient.wallet,
        amount: recipient.amount,
        txHash: tx.hash,
        status: "success",
      }

      results.push(result)
      onProgress?.(result, i + 1, recipients.length)

    } catch (err: any) {
      const result: DispersionResult = {
        recipientId: recipient.id,
        name: recipient.name,
        wallet: recipient.wallet,
        amount: recipient.amount,
        txHash: null,
        status: "failed",
        error: err.message || "Error desconocido",
      }

      results.push(result)
      onProgress?.(result, i + 1, recipients.length)
    }
  }

  return results
}

export function getTxExplorerUrl(txHash: string): string {
  const base =
    process.env.NEXT_PUBLIC_AVALANCHE_ENV === "mainnet"
      ? "https://snowtrace.io/tx"
      : "https://testnet.snowtrace.io/tx"
  return `${base}/${txHash}`
}
