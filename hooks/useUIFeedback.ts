import { toast } from "sonner"

export const useUIFeedback = () => {
  const notifyWIP = (featureName: string) => {
    toast.message("Módulo en Construcción", {
      description: `La funcionalidad de "${featureName}" se encuentra en desarrollo.`,
      duration: 3500,
    })
  }

  const notifyValidation = (field: string) => {
    toast.warning("Atención Requerida", {
      description: `Asegúrate de configurar "${field}" antes de proceder.`,
      duration: 4000,
    })
  }

  const notifySuccess = (action: string) => {
    toast.success("Operación Exitosa", {
      description: `Se ha completado la acción: "${action}".`,
      duration: 3000,
    })
  }

  return { notifyWIP, notifyValidation, notifySuccess }
}
