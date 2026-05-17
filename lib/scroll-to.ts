const NAV_OFFSET = 88

export function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return false
  const y = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET
  window.scrollTo({ top: y, behavior: "smooth" })
  return true
}
