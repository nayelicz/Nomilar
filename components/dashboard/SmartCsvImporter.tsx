"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, FileText, CheckCircle2, AlertCircle, Send, X, ShieldAlert } from "lucide-react"

interface SmartCsvImporterProps {
  onDisperse: () => Promise<void>
  isDispersing: boolean
  escrowReady: boolean
}

export function SmartCsvImporter({ onDisperse, isDispersing, escrowReady }: SmartCsvImporterProps) {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [step, setStep] = useState<"upload" | "analyzing" | "preflight">("upload")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setStep("analyzing")
    // Simulate parsing and analyzing the CSV
    setTimeout(() => {
      setStep("preflight")
    }, 2000)
  }

  const reset = () => {
    setFile(null)
    setStep("upload")
  }

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {step === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/20"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".csv,.xlsx"
              className="hidden"
              onChange={handleChange}
            />
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-1">Cargar Nómina o Pagos</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Arrastra tu archivo CSV/Excel aquí o haz clic para buscar.
            </p>
            <button
              onClick={() => inputRef.current?.click()}
              className="px-4 py-2 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 border border-border"
            >
              Seleccionar Archivo
            </button>
          </motion.div>
        )}

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
            <h3 className="text-lg font-medium mb-2">Mapeando Inteligencia...</h3>
            <p className="text-sm text-muted-foreground">Analizando columnas, detectando cuentas y validando montos.</p>
          </motion.div>
        )}

        {step === "preflight" && (
          <motion.div
            key="preflight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-border rounded-xl bg-card overflow-hidden"
          >
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
              {/* Resumen de impacto */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-secondary/30 rounded-lg border border-border/50 text-center">
                  <div className="text-2xl font-bold text-foreground">342</div>
                  <div className="text-xs text-muted-foreground mt-1">Destinatarios válidos</div>
                </div>
                <div className="p-3 bg-secondary/30 rounded-lg border border-border/50 text-center">
                  <div className="text-2xl font-bold text-primary">$1.2M</div>
                  <div className="text-xs text-muted-foreground mt-1">Monto total a dispersar</div>
                </div>
              </div>

              {/* Alertas */}
              <div className="space-y-2">
                <div className="flex items-start gap-2 p-3 bg-green-500/10 rounded-lg text-sm text-green-600 dark:text-green-400">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <p>Fondos operativos suficientes en bóveda.</p>
                </div>
                <div className="flex items-start gap-2 p-3 bg-yellow-500/10 rounded-lg text-sm text-yellow-600 dark:text-yellow-500">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <p>2 registros omitidos (Cuentas no verificables).</p>
                </div>
              </div>

              {/* Botón de Ejecución (Doble Verificación Simulado) */}
              <button
                onClick={async () => {
                  await onDisperse()
                  reset() // Reset after success
                }}
                disabled={isDispersing || !escrowReady}
                className={`w-full py-3 mt-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                  isDispersing || !escrowReady
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:shadow-[0_0_20px_rgba(var(--primary),0.3)]"
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
                    Confirmar y Dispersar
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
