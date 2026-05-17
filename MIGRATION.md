# Guía de Migración: Stellar → Avalanche C-Chain (Core Wallet)

## Archivos generados

| Archivo | Acción |
|---|---|
| `lib/avalanche.ts` | **CREAR** — Lógica de conexión y dispersión en Avalanche |
| `hooks/useAvalanche.ts` | **CREAR** — Hook React para estado de Core Wallet |
| `components/dashboard/WalletConnect.tsx` | **CREAR** — Botón de conexión visual |
| `components/dashboard.tsx` | **REEMPLAZAR** — Dashboard actualizado con dispersión real |
| `types/dashboard.ts` | **REEMPLAZAR** — Tipos con campos `wallet` y `txHash` |
| `.env.local.example` | **CREAR** → copiar como `.env.local` |

---

## Pasos de instalación

### 1. Instalar dependencias

```bash
npm install ethers
# o con pnpm:
pnpm add ethers
```

### 2. Copiar los archivos

Copia cada archivo generado a su ruta correspondiente en tu proyecto:

```
Nomina-main/
├── lib/avalanche.ts               ← nuevo
├── hooks/useAvalanche.ts          ← nuevo
├── components/
│   ├── dashboard.tsx              ← reemplazar
│   └── dashboard/
│       └── WalletConnect.tsx      ← nuevo
├── types/dashboard.ts             ← reemplazar
└── .env.local                     ← crear desde .env.local.example
```

### 3. Configurar variables de entorno

```bash
cp .env.local.example .env.local
```

Edita `.env.local`:
- `NEXT_PUBLIC_AVALANCHE_ENV=fuji` para desarrollo con Fuji Testnet
- `NEXT_PUBLIC_AVALANCHE_ENV=mainnet` para producción

### 4. Actualizar el CSV de empleados

El CSV que importas ahora debe incluir dos columnas adicionales:

| id | name | department | country | wallet | amount |
|---|---|---|---|---|---|
| OP-001 | Juan López | Kavak | Mexico | 0xAbCd...1234 | 5000.00 |

- `wallet`: dirección EVM del empleado (se obtiene de su Core Wallet)
- `amount`: monto en USDC a dispersar

### 5. Probar en Fuji Testnet

1. Instala [Core Wallet](https://core.app) en el navegador
2. Cambia a la red **Fuji Testnet** en Core Wallet
3. Obtén AVAX de prueba en [faucet.avax.network](https://faucet.avax.network)
4. Obtén USDC de prueba (usa un mock ERC-20 en Fuji)
5. Carga el CSV con wallets de prueba y ejecuta una dispersión

---

## Cómo funciona la dispersión

```
Admin carga CSV
    ↓
handleDisperseFunds() en dashboard.tsx
    ↓
disperse() del hook useAvalanche
    ↓
dispersePayroll() en lib/avalanche.ts
    ↓
Para cada empleado:
  usdc.transfer(wallet, amount) → tx en Avalanche C-Chain
    ↓
Resultado con txHash → link a Snowtrace
```

---

## Diferencias clave con Stellar

| Concepto | Stellar (antes) | Avalanche (ahora) |
|---|---|---|
| Wallet del admin | Keypair (clave secreta) | Core Wallet (EIP-1193) |
| Wallet del empleado | Dirección G... | Dirección 0x... (EVM) |
| Token de pago | XLM / USDC nativo | USDC en C-Chain |
| SDK | stellar-sdk | ethers.js |
| Explorer | stellar.expert | snowtrace.io |
| Tiempo de confirmación | ~5s | ~2s |
| Costo por tx | ~0.00001 XLM | Gas en AVAX (~$0.01) |

---

## Próximos pasos opcionales

- **Contrato de dispersión por lote**: en lugar de una tx por empleado, desplegar un contrato `PayrollDispatcher.sol` que reparte en una sola transacción (más eficiente en gas)
- **Firma multi-sig**: usar Safe (Gnosis) en Avalanche para requerir múltiples aprobaciones antes de dispersar
- **Historial on-chain**: leer eventos del contrato para el AuditExplorer en lugar de datos mock
