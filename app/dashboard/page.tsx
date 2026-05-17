"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dashboard } from "@/components/dashboard"
import { Users, ShieldCheck } from "lucide-react"

export default function DashboardRoute() {
  const router = useRouter()
  const [role, setRole] = useState<"admin" | "basic">("admin")

  return (
    <div className="relative">
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-card p-1 rounded-full border border-border shadow-lg">
        <button 
          onClick={() => setRole("admin")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${role === "admin" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:bg-muted"}`}
        >
          <ShieldCheck className="w-4 h-4" /> Vista Admin
        </button>
        <button 
          onClick={() => setRole("basic")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${role === "basic" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:bg-muted"}`}
        >
          <Users className="w-4 h-4" /> Vista Empleado
        </button>
      </div>
      <Dashboard 
        role={role} 
        onLogout={() => router.push("/")} 
      />
    </div>
  )
}
