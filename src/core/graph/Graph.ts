import type { Node, Edge, GraphJSON, ValidationResult } from '@/types/graph'

export class Graph {
  private nodes: Map<string, Node>
  private edges: Map<string, Edge>
  private adjacencyList: Map<string, Map<string, number>>

  constructor() {
    this.nodes = new Map()
    this.edges = new Map()
    this.adjacencyList = new Map()
  }

  // 节点操作
  addNode(node: Node): void {
    this.nodes.set(node.id, node)
    if (!this.adjacencyList.has(node.id)) {
      this.adjacencyList.set(node.id, new Map())
    }
  }

  removeNode(nodeId: string): void {
    this.nodes.delete(nodeId)
    this.adjacencyList.delete(nodeId)

    // 删除相关的边
    const edgesToRemove: string[] = []
    this.edges.forEach((edge, edgeId) => {
      if (edge.source === nodeId || edge.target === nodeId) {
        edgesToRemove.push(edgeId)
      }
    })
    edgesToRemove.forEach((edgeId) => this.removeEdge(edgeId))
  }

  updateNode(nodeId: string, updates: Partial<Node>): void {
    const node = this.nodes.get(nodeId)
    if (node) {
      this.nodes.set(nodeId, { ...node, ...updates })
    }
  }

  getNode(nodeId: string): Node | undefined {
    return this.nodes.get(nodeId)
  }

  getAllNodes(): Node[] {
    return Array.from(this.nodes.values())
  }

  // 边操作
  addEdge(edge: Edge): void {
    this.edges.set(edge.id, edge)

    // 更新邻接表(无向图)
    if (!this.adjacencyList.has(edge.source)) {
      this.adjacencyList.set(edge.source, new Map())
    }
    if (!this.adjacencyList.has(edge.target)) {
      this.adjacencyList.set(edge.target, new Map())
    }

    this.adjacencyList.get(edge.source)!.set(edge.target, edge.weight)
    this.adjacencyList.get(edge.target)!.set(edge.source, edge.weight)
  }

  removeEdge(edgeId: string): void {
    const edge = this.edges.get(edgeId)
    if (edge) {
      this.adjacencyList.get(edge.source)?.delete(edge.target)
      this.adjacencyList.get(edge.target)?.delete(edge.source)
      this.edges.delete(edgeId)
    }
  }

  updateEdge(edgeId: string, updates: Partial<Edge>): void {
    const edge = this.edges.get(edgeId)
    if (edge) {
      const updatedEdge = { ...edge, ...updates }
      this.edges.set(edgeId, updatedEdge)

      // 更新邻接表中的权重
      if (updates.weight !== undefined) {
        this.adjacencyList.get(edge.source)?.set(edge.target, updates.weight)
        this.adjacencyList.get(edge.target)?.set(edge.source, updates.weight)
      }
    }
  }

  getEdge(edgeId: string): Edge | undefined {
    return this.edges.get(edgeId)
  }

  getEdgeBetween(source: string, target: string): Edge | undefined {
    return Array.from(this.edges.values()).find(
      (edge) =>
        (edge.source === source && edge.target === target) ||
        (edge.source === target && edge.target === source)
    )
  }

  getAllEdges(): Edge[] {
    return Array.from(this.edges.values())
  }

  // 图查询
  getNeighbors(nodeId: string): string[] {
    return Array.from(this.adjacencyList.get(nodeId)?.keys() || [])
  }

  getEdgeWeight(source: string, target: string): number | undefined {
    return this.adjacencyList.get(source)?.get(target)
  }

  hasPath(source: string, target: string): boolean {
    if (!this.nodes.has(source) || !this.nodes.has(target)) {
      return false
    }

    const visited = new Set<string>()
    const queue: string[] = [source]
    visited.add(source)

    while (queue.length > 0) {
      const current = queue.shift()!
      if (current === target) {
        return true
      }

      const neighbors = this.getNeighbors(current)
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor)
          queue.push(neighbor)
        }
      }
    }

    return false
  }

  // 序列化
  toJSON(): GraphJSON {
    return {
      nodes: this.getAllNodes(),
      edges: this.getAllEdges(),
    }
  }

  static fromJSON(json: GraphJSON): Graph {
    const graph = new Graph()
    json.nodes.forEach((node) => graph.addNode(node))
    json.edges.forEach((edge) => graph.addEdge(edge))
    return graph
  }

  // 验证
  validate(): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // 检查节点
    if (this.nodes.size === 0) {
      warnings.push('图中没有节点')
    }

    // 检查边的有效性
    this.edges.forEach((edge, edgeId) => {
      if (!this.nodes.has(edge.source)) {
        errors.push(`边 ${edgeId} 的起点 ${edge.source} 不存在`)
      }
      if (!this.nodes.has(edge.target)) {
        errors.push(`边 ${edgeId} 的终点 ${edge.target} 不存在`)
      }
      if (edge.weight < 0) {
        errors.push(`边 ${edgeId} 的权重不能为负数`)
      }
    })

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    }
  }

  isConnected(): boolean {
    if (this.nodes.size === 0) return true
    if (this.nodes.size === 1) return true

    const visited = new Set<string>()
    const startNode = this.getAllNodes()[0].id
    const queue: string[] = [startNode]
    visited.add(startNode)

    while (queue.length > 0) {
      const current = queue.shift()!
      const neighbors = this.getNeighbors(current)

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor)
          queue.push(neighbor)
        }
      }
    }

    return visited.size === this.nodes.size
  }

  clear(): void {
    this.nodes.clear()
    this.edges.clear()
    this.adjacencyList.clear()
  }

  clone(): Graph {
    return Graph.fromJSON(this.toJSON())
  }
}
