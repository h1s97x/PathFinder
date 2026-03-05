import type { Graph } from '@/core/graph/Graph'

export interface AlgorithmStep {
  type: 'visit' | 'compare' | 'update' | 'complete'
  nodeIds?: string[]
  edgeIds?: string[]
  message?: string
  data?: any
}

export interface Algorithm<TInput = any, TOutput = any> {
  name: string
  description: string
  execute(graph: Graph, input: TInput): TOutput
  executeSteps(graph: Graph, input: TInput): Generator<AlgorithmStep, TOutput>
}

export interface DijkstraInput {
  startNodeId: string
  endNodeId?: string
}

export interface DijkstraOutput {
  distances: Map<string, number>
  previous: Map<string, string | null>
  path?: string[]
  totalDistance?: number
}

export interface AStarInput {
  startNodeId: string
  endNodeId: string
  heuristic?: (nodeId: string, targetId: string, graph: Graph) => number
}

export interface AStarOutput {
  path: string[]
  totalDistance: number
  nodesExplored: number
}

export interface TraversalInput {
  startNodeId: string
  endNodeId?: string
}

export interface TraversalOutput {
  visitOrder: string[]
  path?: string[]
  allPaths?: string[][]
}

export interface HeldKarpInput {
  nodeIds: string[]
  returnToStart?: boolean
}

export interface HeldKarpOutput {
  path: string[]
  totalDistance: number
  visitOrder: string[]
}
