export interface Node {
  id: string
  label: string
  description: string
  position: { x: number; y: number }
  metadata?: Record<string, any>
}

export interface Edge {
  id: string
  source: string
  target: string
  weight: number
  metadata?: Record<string, any>
}

export interface GraphJSON {
  nodes: Node[]
  edges: Edge[]
  metadata?: Record<string, any>
}

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

export type EditMode = 'view' | 'add-node' | 'add-edge' | 'edit' | 'delete'
