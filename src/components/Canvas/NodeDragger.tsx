import { useState, useRef, useEffect } from 'react'
import { useGraphStore } from '@/store/graphStore'

interface NodeDraggerProps {
  nodeId: string
  children: React.ReactNode
}

export default function NodeDragger({ nodeId, children }: NodeDraggerProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const { updateNode, mode } = useGraphStore()
  const nodeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      if (mode !== 'view') return

      const newX = e.clientX - offset.x
      const newY = e.clientY - offset.y

      updateNode(nodeId, {
        position: { x: newX, y: newY },
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, offset, nodeId, updateNode, mode])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (mode !== 'view') return

    e.stopPropagation()
    const rect = nodeRef.current?.getBoundingClientRect()
    if (rect) {
      setOffset({
        x: e.clientX - rect.left - rect.width / 2,
        y: e.clientY - rect.top - rect.height / 2,
      })
      setIsDragging(true)
    }
  }

  return (
    <div
      ref={nodeRef}
      onMouseDown={handleMouseDown}
      style={{ cursor: mode === 'view' ? (isDragging ? 'grabbing' : 'grab') : 'pointer' }}
    >
      {children}
    </div>
  )
}
