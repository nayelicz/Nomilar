"use client"

import { useState, useEffect, useRef } from "react"

export function ImpactMetrics() {
  const [counts, setCounts] = useState([0, 0, 0, 0])
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const metrics = [
    { value: 1.9, suffix: "T", label: "En nóminas anuales (Sectores 43, 46, 72)", type: "number" },
    { value: 100, suffix: "%", label: "Trazabilidad inmutable", type: "number" },
    { value: "< 3 seg", suffix: "", label: "Tiempo de dispersión", type: "fade" },
    { value: "Cero", suffix: "", label: "Errores operativos", type: "fade" },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const duration = 1800
    const frameDuration = 1000 / 60
    const totalFrames = Math.round(duration / frameDuration)
    
    let frame = 0
    const timer = setInterval(() => {
      frame++
      const progress = frame / totalFrames
      // easeOutQuart
      const easedProgress = 1 - Math.pow(1 - progress, 4)
      
      setCounts(metrics.map(m => m.type === "number" ? (m.value as number) * easedProgress : 0))

      if (frame === totalFrames) clearInterval(timer)
    }, frameDuration)

    return () => clearInterval(timer)
  }, [isVisible])

  return (
    <section ref={sectionRef} className="py-20 bg-background border-y border-border overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {metrics.map((metric, idx) => (
            <div 
              key={idx} 
              className={`text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div className="text-4xl font-bold text-foreground mb-2 md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                {metric.type === "number" ? (
                  <>
                    {idx === 0 && "$"}{counts[idx].toFixed(metric.value === 1.9 ? 1 : 0)}{metric.suffix}
                  </>
                ) : (
                  metric.value
                )}
              </div>
              <div className="text-sm font-medium text-muted-foreground md:text-base">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
