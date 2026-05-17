import { NextResponse } from "next/server"

/** En Vercel: sube el límite para tx Stellar + recibos (plan Hobby permite hasta 60s). */
export const maxDuration = 60

/**
 * Proxy hacia el dispersor LFPDP (repo dispersor-nomina-alebrije, `npm run api`).
 * El cliente solo llama a /api/dispersar (mismo dominio que Nomina).
 *
 * Variables:
 * - DISPERSOR_API_URL (recomendada en Vercel, solo servidor): URL base del API desplegado, sin /api/dispersar
 * - NEXT_PUBLIC_DISPERSOR_API_URL: alternativa si ya la tenías; también la usa el proxy
 */
export async function POST(request: Request) {
  const base = (
    process.env.DISPERSOR_API_URL ||
    process.env.NEXT_PUBLIC_DISPERSOR_API_URL ||
    "http://127.0.0.1:3001"
  ).replace(/\/$/, "")

  const body = await request.text()

  try {
    const res = await fetch(`${base}/api/dispersar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    })
    const text = await res.text()
    return new NextResponse(text, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json(
      {
        error: `No se pudo contactar al dispersor en ${base}. En Vercel configura DISPERSOR_API_URL con la URL pública del API. Detalle: ${msg}`,
      },
      { status: 502 }
    )
  }
}
