"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, FileText, CheckCircle2, AlertCircle, X, ShieldAlert, UserPlus, Save, Download } from "lucide-react"
import { ethers } from "ethers"

interface SmartCsvImporterProps {
  onDisperse: (recipients: { id: string; name: string; wallet: string; amount: number }[]) => Promise<void>
  isDispersing: boolean
  escrowReady: boolean
}

interface CsvRow {
  id: string
  name: string
  department: string
  country: string
  wallet: string
  amount: number
  addedManually?: boolean
}

interface ParseResult {
  valid: CsvRow[]
  invalid: number
  total: number
  totalAmount: number
}

interface NewEmployee {
  name: string
  department: string
  country: string
  wallet: string
  amount: string
}

function parseCsv(text: string): ParseResult {
  const lines = text.trim().split("\n")
  const headers = lines[0].toLowerCase().split(",").map((h) => h.trim())

  const idIdx = headers.indexOf("id")
  const nameIdx = headers.indexOf("name")
  const deptIdx = headers.indexOf("department")
  const countryIdx = headers.indexOf("country")
  const walletIdx = headers.indexOf("wallet")
  const amountIdx = headers.indexOf("amount")

  const valid: CsvRow[] = []
  let invalid = 0

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map((c) => c.trim())
    if (cols.length < 2) continue

    const wallet = walletIdx >= 0 ? cols[walletIdx] : ""
    const amount = amountIdx >= 0 ? parseFloat(cols[amountIdx]) : 0

    if (!ethers.isAddress(wallet) || isNaN(amount) || amount <= 0) {
      invalid++
      continue
    }

    valid.push({
      id: idIdx >= 0 ? cols[idIdx] : `row-${i}`,
      name: nameIdx >= 0 ? cols[nameIdx] : `Empleado ${i}`,
      department: deptIdx >= 0 ? cols[deptIdx] : "",
      country: countryIdx >= 0 ? cols[countryIdx] : "",
      wallet,
      amount,
    })
  }

  return {
    valid,
    invalid,
    total: valid.length + invalid,
    totalAmount: valid.reduce((sum, r) => sum + r.amount, 0),
  }
}

function generateCsvContent(employees: CsvRow[]): string {
  const headers = "id,name,department,country,wallet,amount"
  const rows = employees.map((e) =>
    `${e.id},${e.name},${e.department},${e.country},${e.wallet},${e.amount.toFixed(2)}`
  )
  return [headers, ...rows].join("\n")
}

export function SmartCsvImporter({ onDisperse, isDispersing, escrowReady }: SmartCsvImporterProps) {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [step, setStep] = useState<"upload" | "analyzing" | "preflight" | "success">("upload")
  const [parseResult, setParseResult] = useState<ParseResult | null>(null)
  const [extraEmployees, setExtraEmployees] = useState<CsvRow[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [dispersedEmployees, setDispersedEmployees] = useState<CsvRow[]>([])
  const [newEmployee, setNewEmployee] = useState<NewEmployee>({
    name: "", department: "", country: "", wallet: "", amount: ""
  })
  const [formError, setFormError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
    else if (e.type === "dragleave") setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFileSelect(e.dataTransfer.files[0])
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) handleFileSelect(e.target.files[0])
  }

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setStep("analyzing")
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const result = parseCsv(text)
      setParseResult(result)
      setExtraEmployees([])
      setStep("preflight")
    }
    reader.readAsText(selectedFile)
  }

  const reset = () => {
    setFile(null)
    setStep("upload")
    setParseResult(null)
    setExtraEmployees([])
    setShowAddForm(false)
    setDispersedEmployees([])
    setNewEmployee({ name: "", department: "", country: "", wallet: "", amount: "" })
    setFormError(null)
  }

  // Agregar empleado manual a la dispersión actual
  const handleAddEmployee = () => {
    setFormError(null)

    if (!newEmployee.name.trim()) {
      setFormError("El nombre es requerido.")
      return
    }
    if (!ethers.isAddress(newEmployee.wallet)) {
      setFormError("La dirección wallet no es válida (debe ser 0x...).")
      return
    }
    const amount = parseFloat(newEmployee.amount)
    if (isNaN(amount) || amount <= 0) {
      setFormError("El monto debe ser mayor a 0.")
      return
    }

    const nextId = `MANUAL-${Date.now()}`
    const emp: CsvRow = {
      id: nextId,
      name: newEmployee.name.trim(),
      department: newEmployee.department.trim() || "Sin departamento",
      country: newEmployee.country.trim() || "Sin país",
      wallet: newEmployee.wallet.trim(),
      amount,
      addedManually: true,
    }

    setExtraEmployees((prev) => [...prev, emp])
    setNewEmployee({ name: "", department: "", country: "", wallet: "", amount: "" })
    setShowAddForm(false)
  }

  const removeExtra = (id: string) => {
    setExtraEmployees((prev) => prev.filter((e) => e.id !== id))
  }

  // Todos los empleados = CSV + manuales
  const allEmployees = [...(parseResult?.valid || []), ...extraEmployees]
  const totalAmount = allEmployees.reduce((sum, e) => sum + e.amount, 0)

  const handleDisperse = async () => {
    if (allEmployees.length === 0) return
    setDispersedEmployees(allEmployees)
    await onDisperse(allEmployees)
    setStep("success")
  }

  // Descargar CSV actualizado con empleados manuales
  const handleSaveToCsv = () => {
    const content = generateCsvContent(dispersedEmployees)
    const blob = new Blob([content], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = file
      ? file.name.replace(".csv", "_actualizado.csv")
      : `nomina_actualizada_${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">

        {/* ── PASO 1: Upload ─────────────────────────────────────────────── */}
        {step === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/20"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={handleChange} />
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-1">Cargar Nómina o Pagos</h3>
            <p className="text-sm text-muted-foreground mb-4">Arrastra tu archivo CSV aquí o haz clic para buscar.</p>
            <p className="text-xs text-muted-foreground mb-4">
              Columnas requeridas: <span className="font-mono text-primary">id, name, wallet, amount</span>
            </p>
            <button
              onClick={() => inputRef.current?.click()}
              className="px-4 py-2 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 border border-border"
            >
              Seleccionar Archivo
            </button>
          </motion.div>
        )}

        {/* ── PASO 2: Analyzing ──────────────────────────────────────────── */}
        {step === "analyzing" && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="border border-border rounded-xl p-8 text-center bg-card"
          >
            <div className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4 relative">
              <div className="absolute inset-0 rounded-full border-2 border-accent border-t-transparent animate-spin" />
              <FileText className="w-5 h-5 text-accent animate-pulse" />
            </div>
            <h3 className="text-lg font-medium mb-2">Leyendo archivo...</h3>
            <p className="text-sm text-muted-foreground">Validando wallets y montos.</p>
          </motion.div>
        )}

        {/* ── PASO 3: Preflight ──────────────────────────────────────────── */}
        {step === "preflight" && parseResult && (
          <motion.div
            key="preflight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-border rounded-xl bg-card overflow-hidden"
          >
            {/* Header */}
            <div className="bg-muted/30 p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">{file?.name}</div>
                  <div className="text-xs text-muted-foreground">Análisis de Integridad Completo</div>
                </div>
              </div>
              <button onClick={reset} className="p-1 hover:bg-muted rounded-md text-muted-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Resumen */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-secondary/30 rounded-lg border border-border/50 text-center">
                  <div className="text-2xl font-bold text-foreground">{allEmployees.length}</div>
                  <div className="text-xs text-muted-foreground mt-1">Destinatarios válidos</div>
                </div>
                <div className="p-3 bg-secondary/30 rounded-lg border border-border/50 text-center">
                  <div className="text-2xl font-bold text-primary">
                    ${totalAmount.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">USDC total a dispersar</div>
                </div>
              </div>

              {/* Alertas */}
              <div className="space-y-2">
                {allEmployees.length > 0 && (
                  <div className="flex items-start gap-2 p-3 bg-green-500/10 rounded-lg text-sm text-green-600 dark:text-green-400">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                    <p>{allEmployees.length} empleados listos para dispersión en Avalanche C-Chain.</p>
                  </div>
                )}
                {parseResult.invalid > 0 && (
                  <div className="flex items-start gap-2 p-3 bg-yellow-500/10 rounded-lg text-sm text-yellow-600 dark:text-yellow-500">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <p>{parseResult.invalid} registros omitidos (wallet inválida o monto incorrecto).</p>
                  </div>
                )}
                {extraEmployees.length > 0 && (
                  <div className="flex items-start gap-2 p-3 bg-primary/10 rounded-lg text-sm text-primary">
                    <UserPlus className="w-4 h-4 mt-0.5 shrink-0" />
                    <p>{extraEmployees.length} empleado(s) agregado(s) manualmente a esta dispersión.</p>
                  </div>
                )}
              </div>

              {/* Lista de empleados */}
              {allEmployees.length > 0 && (
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {allEmployees.map((emp) => (
                    <div
                      key={emp.id}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs ${
                        emp.addedManually
                          ? "bg-primary/10 border border-primary/20"
                          : "bg-secondary/20"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {emp.addedManually && (
                          <span className="text-primary text-[10px] font-medium bg-primary/20 px-1.5 py-0.5 rounded">
                            MANUAL
                          </span>
                        )}
                        <span className="font-medium text-foreground">{emp.name}</span>
                        <span className="text-muted-foreground font-mono">
                          {emp.wallet.slice(0, 6)}...{emp.wallet.slice(-4)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-primary font-medium">
                          ${emp.amount.toLocaleString("es-MX", { minimumFractionDigits: 2 })} USDC
                        </span>
                        {emp.addedManually && (
                          <button
                            onClick={() => removeExtra(emp.id)}
                            className="text-muted-foreground hover:text-red-500 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Formulario agregar empleado manual */}
              <AnimatePresence>
                {showAddForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border border-primary/30 rounded-lg p-4 bg-primary/5 space-y-3"
                  >
                    <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                      <UserPlus className="w-4 h-4 text-primary" />
                      Agregar empleado a esta dispersión
                    </h4>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Nombre *</label>
                        <input
                          type="text"
                          placeholder="Ej: Ana García"
                          value={newEmployee.name}
                          onChange={(e) => setNewEmployee((p) => ({ ...p, name: e.target.value }))}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-primary/50"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Departamento</label>
                        <input
                          type="text"
                          placeholder="Ej: Operaciones"
                          value={newEmployee.department}
                          onChange={(e) => setNewEmployee((p) => ({ ...p, department: e.target.value }))}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-primary/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Wallet Avalanche (0x...) *</label>
                      <input
                        type="text"
                        placeholder="0x..."
                        value={newEmployee.wallet}
                        onChange={(e) => setNewEmployee((p) => ({ ...p, wallet: e.target.value }))}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-primary/50 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Monto USDC *</label>
                      <input
                        type="number"
                        placeholder="Ej: 500.00"
                        min="0"
                        step="0.01"
                        value={newEmployee.amount}
                        onChange={(e) => setNewEmployee((p) => ({ ...p, amount: e.target.value }))}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-primary/50"
                      />
                    </div>

                    {formError && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {formError}
                      </p>
                    )}

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={handleAddEmployee}
                        className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        Agregar a esta dispersión
                      </button>
                      <button
                        onClick={() => { setShowAddForm(false); setFormError(null) }}
                        className="px-3 py-2 bg-secondary text-foreground rounded-lg text-sm border border-border hover:bg-secondary/80"
                      >
                        Cancelar
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Botón agregar empleado */}
              {!showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full py-2 border border-dashed border-primary/40 rounded-lg text-sm text-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Agregar empleado fuera del CSV
                </button>
              )}

              {/* Botón dispersar */}
              <button
                onClick={handleDisperse}
                disabled={isDispersing || !escrowReady || allEmployees.length === 0}
                className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                  isDispersing || !escrowReady || allEmployees.length === 0
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {isDispersing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Procesando Operación...
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4" />
                    Confirmar y Dispersar {allEmployees.length} pagos
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* ── PASO 4: Éxito + opción guardar CSV ────────────────────────── */}
        {step === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border border-green-500/30 rounded-xl bg-card overflow-hidden"
          >
            <div className="p-6 text-center space-y-4">
              <div className="mx-auto w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">¡Dispersión completada!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {dispersedEmployees.length} pagos enviados en Avalanche C-Chain.
                </p>
              </div>

              {/* Opción guardar CSV si hubo empleados manuales */}
              {dispersedEmployees.some((e) => e.addedManually) && (
                <div className="border border-primary/20 rounded-lg p-4 bg-primary/5 text-left space-y-3">
                  <div className="flex items-start gap-2">
                    <Save className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Guardar empleados manuales para dispersiones futuras
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Se descargará un CSV actualizado con todos los empleados de esta dispersión, incluyendo los {dispersedEmployees.filter((e) => e.addedManually).length} agregados manualmente.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleSaveToCsv}
                    className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Descargar CSV actualizado
                  </button>
                </div>
              )}

              <button
                onClick={reset}
                className="w-full py-2.5 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 border border-border transition-colors"
              >
                Nueva dispersión
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
