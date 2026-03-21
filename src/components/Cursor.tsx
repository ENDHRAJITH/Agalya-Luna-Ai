import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const dot = dotRef.current!
    const ringEl = ringRef.current!

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      dot.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 3}px)`
    }

    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x - 16) * 0.15
      ring.current.y += (pos.current.y - ring.current.y - 16) * 0.15
      ringEl.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`
      rafRef.current = requestAnimationFrame(animate)
    }

    const addHover = () => {
      document.querySelectorAll('a, button, [data-hover]').forEach(el => {
        el.addEventListener('mouseenter', () => ringEl.classList.add('hovering'))
        el.addEventListener('mouseleave', () => ringEl.classList.remove('hovering'))
      })
    }

    document.addEventListener('mousemove', onMove)
    rafRef.current = requestAnimationFrame(animate)

    const observer = new MutationObserver(addHover)
    observer.observe(document.body, { childList: true, subtree: true })
    addHover()

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}
