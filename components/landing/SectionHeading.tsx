"use client"

import { motion } from "framer-motion"

interface SectionHeadingProps {
  title: string
  description?: string
  align?: "center" | "left"
  className?: string
}

export function SectionHeading({
  title,
  description,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}
    >
      <h2 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">{title}</h2>
      {description && (
        <p className="mt-4 text-lg text-muted-foreground text-pretty leading-relaxed">{description}</p>
      )}
    </motion.div>
  )
}
