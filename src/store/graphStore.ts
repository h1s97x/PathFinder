import { create } from 'zustand'
import { Graph } from '@/core/graph/Graph'
import type { Node, Edge, EditMode } from '@/types/graph'

interface GraphStore {
  graph: Graph
  selectedNodes: Set<string>
  selectedEdges: Set<string>
  mode: EditMode

  // 图操作
  setGraph: (graph: Graph) => void
  addNode: (node: Node) => void
  removeNode: (nodeId: string) => void
  updateNode: (nodeId: string, updates: Partial<Node>) => void

  addEdge: (edge: Edge) => void
  removeEdge: (edgeId: string) => void
  updateEdge: (edgeId: string, updates: Partial<Edge>) => void

  // 选择操作
  selectNode: (nodeId: string, multi?: boolean) => void
  selectEdge: (edgeId: string, multi?: boolean) => void
  clearSelection: () => void

  // 模式切换
  setMode: (mode: EditMode) => void

  // 工具方法
  reset: () => void
}

export const useGraphStore = create<GraphStore>((set) => ({
  graph: new Graph(),
  selectedNodes: new Set(),
  selectedEdges: new Set(),
  mode: 'view',

  setGraph: (graph) => set({ graph }),

  addNode: (node) =>
    set((state) => {
      const newGraph = state.graph.clone()
      newGraph.addNode(node)
      return { graph: newGraph }
    }),

  removeNode: (nodeId) =>
    set((state) => {
      const newGraph = state.graph.clone()
      newGraph.removeNode(nodeId)
      const newSelectedNodes = new Set(state.selectedNodes)
      newSelectedNodes.delete(nodeId)
      return { graph: newGraph, selectedNodes: newSelectedNodes }
    }),

  updateNode: (nodeId, updates) =>
    set((state) => {
      const newGraph = state.graph.clone()
      newGraph.updateNode(nodeId, updates)
      return { graph: newGraph }
    }),

  addEdge: (edge) =>
    set((state) => {
      const newGraph = state.graph.clone()
      newGraph.addEdge(edge)
      return { graph: newGraph }
    }),

  removeEdge: (edgeId) =>
    set((state) => {
      const newGraph = state.graph.clone()
      newGraph.removeEdge(edgeId)
      const newSelectedEdges = new Set(state.selectedEdges)
      newSelectedEdges.delete(edgeId)
      return { graph: newGraph, selectedEdges: newSelectedEdges }
    }),

  updateEdge: (edgeId, updates) =>
    set((state) => {
      const newGraph = state.graph.clone()
      newGraph.updateEdge(edgeId, updates)
      return { graph: newGraph }
    }),

  selectNode: (nodeId, multi = false) =>
    set((state) => {
      const newSelectedNodes = multi ? new Set(state.selectedNodes) : new Set<string>()
      if (newSelectedNodes.has(nodeId)) {
        newSelectedNodes.delete(nodeId)
      } else {
        newSelectedNodes.add(nodeId)
      }
      return { selectedNodes: newSelectedNodes, selectedEdges: new Set() }
    }),

  selectEdge: (edgeId, multi = false) =>
    set((state) => {
      const newSelectedEdges = multi ? new Set(state.selectedEdges) : new Set<string>()
      if (newSelectedEdges.has(edgeId)) {
        newSelectedEdges.delete(edgeId)
      } else {
        newSelectedEdges.add(edgeId)
      }
      return { selectedEdges: newSelectedEdges, selectedNodes: new Set() }
    }),

  clearSelection: () => set({ selectedNodes: new Set(), selectedEdges: new Set() }),

  setMode: (mode) => set({ mode }),

  reset: () =>
    set({
      graph: new Graph(),
      selectedNodes: new Set(),
      selectedEdges: new Set(),
      mode: 'view',
    }),
}))
