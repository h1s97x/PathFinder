import { useState, useCallback } from 'react'

export interface ViewportState {
  scale: number
  offsetX: number
  offsetY: number
}

export interface ViewportControls {
  viewport: ViewportState
  setScale: (scale: number) => void
  setOffset: (x: number, y: number) => void
  zoom: (delta: number, centerX?: number, centerY?: number) => void
  pan: (dx: number, dy: number) => void
  reset: () => void
  screenToWorld: (screenX: number, screenY: number) => { x: number; y: number }
  worldToScreen: (worldX: number, worldY: number) => { x: number; y: number }
}

const MIN_SCALE = 0.1
const MAX_SCALE = 3
const ZOOM_SENSITIVITY = 0.001

export function useViewport(): ViewportControls {
  const [viewport, setViewport] = useState<ViewportState>({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
  })

  const setScale = useCallback((scale: number) => {
    setViewport((prev) => ({
      ...prev,
      scale: Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale)),
    }))
  }, [])

  const setOffset = useCallback((x: number, y: number) => {
    setViewport((prev) => ({
      ...prev,
      offsetX: x,
      offsetY: y,
    }))
  }, [])

  const zoom = useCallback(
    (delta: number, centerX?: number, centerY?: number) => {
      setViewport((prev) => {
        const newScale = Math.max(
          MIN_SCALE,
          Math.min(MAX_SCALE, prev.scale * (1 - delta * ZOOM_SENSITIVITY))
        )

        // 如果提供了中心点，调整偏移以保持中心点位置不变
        if (centerX !== undefined && centerY !== undefined) {
          const scaleDiff = newScale - prev.scale
          const newOffsetX = prev.offsetX - (centerX - prev.offsetX) * (scaleDiff / prev.scale)
          const newOffsetY = prev.offsetY - (centerY - prev.offsetY) * (scaleDiff / prev.scale)

          return {
            scale: newScale,
            offsetX: newOffsetX,
            offsetY: newOffsetY,
          }
        }

        return {
          ...prev,
          scale: newScale,
        }
      })
    },
    []
  )

  const pan = useCallback((dx: number, dy: number) => {
    setViewport((prev) => ({
      ...prev,
      offsetX: prev.offsetX + dx,
      offsetY: prev.offsetY + dy,
    }))
  }, [])

  const reset = useCallback(() => {
    setViewport({
      scale: 1,
      offsetX: 0,
      offsetY: 0,
    })
  }, [])

  const screenToWorld = useCallback(
    (screenX: number, screenY: number) => {
      return {
        x: (screenX - viewport.offsetX) / viewport.scale,
        y: (screenY - viewport.offsetY) / viewport.scale,
      }
    },
    [viewport]
  )

  const worldToScreen = useCallback(
    (worldX: number, worldY: number) => {
      return {
        x: worldX * viewport.scale + viewport.offsetX,
        y: worldY * viewport.scale + viewport.offsetY,
      }
    },
    [viewport]
  )

  return {
    viewport,
    setScale,
    setOffset,
    zoom,
    pan,
    reset,
    screenToWorld,
    worldToScreen,
  }
}
