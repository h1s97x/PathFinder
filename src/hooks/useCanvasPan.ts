import { useRef, useCallback, useEffect } from 'react'

interface UseCanvasPanProps {
  onPan: (dx: number, dy: number) => void
  enabled: boolean
}

export function useCanvasPan({ onPan, enabled }: UseCanvasPanProps) {
  const isPanning = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      // 只在按住空格键或中键时启用平移
      if (!enabled || (e.button !== 1 && !e.shiftKey)) return

      isPanning.current = true
      lastPos.current = { x: e.clientX, y: e.clientY }
      e.preventDefault()
    },
    [enabled]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isPanning.current) return

      const dx = e.clientX - lastPos.current.x
      const dy = e.clientY - lastPos.current.y

      onPan(dx, dy)

      lastPos.current = { x: e.clientX, y: e.clientY }
    },
    [onPan]
  )

  const handleMouseUp = useCallback(() => {
    isPanning.current = false
  }, [])

  useEffect(() => {
    if (!enabled) return

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [enabled, handleMouseDown, handleMouseMove, handleMouseUp])

  return { isPanning: isPanning.current }
}
