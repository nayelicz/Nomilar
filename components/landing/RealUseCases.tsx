"use client"

import { Utensils, Headphones, ShoppingBag, Truck, Building2, Users } from "lucide-react"

export function RealUseCases() {
  const cases = [
    {
      icon: Utensils,
      sector: "Sector 72 · Alojamiento temporal",
      title: "Restaurantes y Hospitalidad",
      desc: "Propinas automáticas al finalizar cada turno. Distribución por puntos o porcentaje configurable. Cero peleas entre meseros.",
      tag: "Propinas · Turnos",
      color: "text-orange-500",
      tagColor: "bg-orange-500/10 text-orange-500",
    },
    {
      icon: Headphones,
      sector: "Sector 43 · Servicios profesionales",
      title: "Call Centers y BPO",
      desc: "Bonos por desempeño, KPIs y métricas de soporte calculados y dispersados automáticamente al cierre de quincena.",
      tag: "Bonos · KPIs",
      color: "text-blue-500",
      tagColor: "bg-blue-500/10 text-blue-500",
    },
    {
      icon: ShoppingBag,
      sector: "Sector 46 · Comercio al por mayor",
      title: "Retail y Ventas por Catálogo",
      desc: "Comisiones escalonadas por volumen. Pago a promotoras y vendedores de campo sin necesidad de cuenta bancaria tradicional.",
      tag: "Comisiones · Field Sales",
      color: "text-purple-500",
      tagColor: "bg-purple-500/10 text-purple-500",
    },
    {
      icon: Truck,
      sector: "Logística y Movilidad",
      title: "Flotas y Última Milla",
      desc: "Pago diario o semanal a repartidores, choferes y personal de campo con trazabilidad completa por ruta y conductor.",
      tag: "Diario · Semanal",
      color: "text-green-500",
      tagColor: "bg-green-500/10 text-green-500",
    },
    {
      icon: Building2,
      sector: "Multinivel y Afiliados",
      title: "Redes de Distribución",
      desc: "Comisiones multinivel, bonos de liderazgo y pagos recurrentes a redes de afiliados gestionados desde un solo panel.",
      tag: "Multinivel · Afiliados",
      color: "text-pink-500",
      tagColor: "bg-pink-500/10 text-pink-500",
    },
    {
      icon: Users,
      sector: "Promotores y Eventos",
      title: "Equipos Eventuales",
      desc: "Alta masiva de personal eventual y liquidación inmediata al terminar el evento. Sin fricciones, sin papeleo extra.",
      tag: "Eventual · Masivo",
      color: "text-cyan-500",
      tagColor: "bg-cyan-500/10 text-cyan-500",
    },
  ]

  return (
    <section className="py-24 bg-muted/20 border-y border-border">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 text-xs font-semibold text-primary border border-primary/20 bg-primary/5 rounded-full px-4 py-1.5">
            ¿Para quién es Nomillar?
          </div>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Empresas con equipos que ganan<br />
            <span className="text-muted-foreground font-normal">de forma variable, no fija</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Si tu equipo no cobra lo mismo todos los meses, Nomillar es para ti.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cases.map((useCase, idx) => (
            <div
              key={useCase.title}
              className="card-hover-glow bg-card dark:bg-[#161616] border border-border rounded-2xl p-6 group flex flex-col gap-4"
              style={{ transitionDelay: `${idx * 60}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-secondary transition-all duration-300 icon-scale`}>
                  <useCase.icon className={`w-5 h-5 ${useCase.color}`} />
                </div>
                <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${useCase.tagColor}`}>
                  {useCase.tag}
                </span>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-medium mb-1 uppercase tracking-wider">{useCase.sector}</p>
                <h3 className="font-semibold text-base mb-2">{useCase.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{useCase.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
