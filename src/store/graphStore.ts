import { create } from 'zustand'
import { Graph } from '@/core/graph/Graph'
import type { Node, Edge, EditMode, GraphJSON } from '@/types/graph'

interface HistoryState {
  past: GraphJSON[]
  future: GraphJSON[]
}

interface GraphStore {
  graph: Graph
  selectedNodes: Set<string>
  selectedEdges: Set<string>
  mode: EditMode
  history: HistoryState

  // 图操作
  setGraph: (graph: Graph, recordHistory?: boolean) => void
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

  // 历史操作
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean

  // 工具方法
  reset: () => void
}

export const useGraphStore = create<GraphStore>((set, get) => ({
  graph: new Graph(),
  selectedNodes: new Set(),
  selectedEdges: new Set(),
  mode: 'view',
  history: {
    past: [],
    future: [],
  },

  setGraph: (graph, recordHistory = true) =>
    set((state) => {
      if (recordHistory) {
        return {
          graph,
          history: {
            past: [...state.history.past, state.graph.toJSON()],
            future: [],
          },
        }
      }
      return { graph }
    }),

  addNode: (node) =>
    set((state) => {
      const newGraph = state.graph.clone()
      newGraph.addNode(node)
      return {
        graph: newGraph,
        history: {
          past: [...state.history.past, state.graph.toJSON()],
          future: [],
        },
      }
    }),

  removeNode: (nodeId) =>
    set((state) => {
      const newGraph = state.graph.clone()
      newGraph.removeNode(nodeId)
      const newSelectedNodes = new Set(state.selectedNodes)
      newSelectedNodes.delete(nodeId)
      return {
        graph: newGraph,
        selectedNodes: newSelectedNodes,
        history: {
          past: [...state.history.past, state.graph.toJSON()],
          future: [],
        },
      }
    }),

  updateNode: (nodeId, updates) =>
    set((state) => {
      const newGraph = state.graph.clone()
      newGraph.updateNode(nodeId, updates)
      return {
        graph: newGraph,
        history: {
          past: [...state.history.past, state.graph.toJSON()],
          future: [],
        },
      }
    }),

  addEdge: (edge) =>
    set((state) => {
      const newGraph = state.graph.clone()
      newGraph.addEdge(edge)
      return {
        graph: newGraph,
        history: {
          past: [...state.history.past, state.graph.toJSON()],
          future: [],
        },
      }
    }),

  removeEdge: (edgeId) =>
    set((state) => {
      const newGraph = state.graph.clone()
      newGraph.removeEdge(edgeId)
      const newSelectedEdges = new Set(state.selectedEdges)
      newSelectedEdges.delete(edgeId)
      return {
        graph: newGraph,
        selectedEdges: newSelectedEdges,
        history: {
          past: [...state.history.past, state.graph.toJSON()],
          future: [],
        },
      }
    }),

  updateEdge: (edgeId, updates) =>
    set((state) => {
      const newGraph = state.graph.clone()
      newGraph.updateEdge(edgeId, updates)
      return {
        graph: newGraph,
        history: {
          past: [...state.history.past, state.graph.toJSON()],
          future: [],
        },
      }
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

  undo: () =>
    set((state) => {
      if (state.history.past.length === 0) return state

      const previous = state.history.past[state.history.past.length - 1]
      const newPast = state.history.past.slice(0, -1)

      return {
        graph: Graph.fromJSON(previous),
        history: {
          past: newPast,
          future: [state.graph.toJSON(), ...state.history.future],
        },
        selectedNodes: new Set(),
        selectedEdges: new Set(),
      }
    }),

  redo: () =>
    set((state) => {
      if (state.history.future.length === 0) return state

      const next = state.history.future[0]
      const newFuture = state.history.future.slice(1)

      return {
        graph: Graph.fromJSON(next),
        history: {
          past: [...state.history.past, state.graph.toJSON()],
          future: newFuture,
        },
        selectedNodes: new Set(),
        selectedEdges: new Set(),
      }
    }),

  canUndo: () => get().history.past.length > 0,

  canRedo: () => get().history.future.length > 0,

  reset: () =>
    set({
      graph: new Graph(),
      selectedNodes: new Set(),
      selectedEdges: new Set(),
      mode: 'view',
      history: {
        past: [],
        future: [],
      },
    }),
}))
