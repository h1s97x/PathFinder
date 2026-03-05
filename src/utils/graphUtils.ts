import type { Graph } from '@/core/graph/Graph'
import type { Node, Edge } from '@/types/graph'

export const graphUtils = {
  // 生成唯一 ID
  generateNodeId(): string {
    return `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  },

  generateEdgeId(source: string, target: string): string {
    return `edge-${source}-${target}`
  },

  // 计算路径长度
  calculatePathLength(graph: Graph, path: string[]): number {
    let totalLength = 0
    for (let i = 0; i < path.length - 1; i++) {
      const weight = graph.getEdgeWeight(path[i], path[i + 1])
      if (weight !== undefined) {
        totalLength += weight
      }
    }
    return totalLength
  },

  // 查找所有路径
  findAllPaths(graph: Graph, start: string, end: string, maxPaths: number = 10): string[][] {
    const paths: string[][] = []
    const visited = new Set<string>()

    const dfs = (current: string, path: string[]) => {
      if (paths.length >= maxPaths) return

      visited.add(current)
      path.push(current)

      if (current === end) {
        paths.push([...path])
      } else {
        const neighbors = graph.getNeighbors(current)
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            dfs(neighbor, path)
          }
        }
      }

      path.pop()
      visited.delete(current)
    }

    dfs(start, [])
    return paths
  },

  // 获取连通分量
  getConnectedComponents(graph: Graph): string[][] {
    const visited = new Set<string>()
    const components: string[][] = []

    const bfs = (start: string): string[] => {
      const component: string[] = []
      const queue: string[] = [start]
      visited.add(start)

      while (queue.length > 0) {
        const current = queue.shift()!
        component.push(current)

        const neighbors = graph.getNeighbors(current)
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor)
            queue.push(neighbor)
          }
        }
      }

      return component
    }

    const nodes = graph.getAllNodes()
    for (const node of nodes) {
      if (!visited.has(node.id)) {
        const component = bfs(node.id)
        components.push(component)
      }
    }

    return components
  },

  // 计算图的密度
  getGraphDensity(graph: Graph): number {
    const nodes = graph.getAllNodes().length
    const edges = graph.getAllEdges().length

    if (nodes <= 1) return 0

    const maxEdges = (nodes * (nodes - 1)) / 2
    return edges / maxEdges
  },

  // 检查是否为树
  isTree(graph: Graph): boolean {
    const nodes = graph.getAllNodes().length
    const edges = graph.getAllEdges().length

    // 树的边数 = 节点数 - 1
    if (edges !== nodes - 1) return false

    // 检查是否连通
    return graph.isConnected()
  },

  // 获取节点的度
  getNodeDegree(graph: Graph, nodeId: string): number {
    return graph.getNeighbors(nodeId).length
  },

  // 查找度最大的节点
  findMaxDegreeNode(graph: Graph): Node | null {
    const nodes = graph.getAllNodes()
    if (nodes.length === 0) return null

    let maxDegree = -1
    let maxNode: Node | null = null

    for (const node of nodes) {
      const degree = this.getNodeDegree(graph, node.id)
      if (degree > maxDegree) {
        maxDegree = degree
        maxNode = node
      }
    }

    return maxNode
  },

  // 计算两点之间的欧几里得距离
  calculateEuclideanDistance(node1: Node, node2: Node): number {
    const dx = node1.position.x - node2.position.x
    const dy = node1.position.y - node2.position.y
    return Math.sqrt(dx * dx + dy * dy)
  },

  // 自动布局(力导向)
  autoLayout(nodes: Node[], edges: Edge[], width: number, height: number): Node[] {
    const iterations = 100
    const k = Math.sqrt((width * height) / nodes.length)
    const c = 0.1

    // 初始化随机位置
    const positions = nodes.map((node) => ({
      ...node,
      position: {
        x: node.position.x || Math.random() * width,
        y: node.position.y || Math.random() * height,
      },
      vx: 0,
      vy: 0,
    }))

    for (let iter = 0; iter < iterations; iter++) {
      // 计算斥力
      for (let i = 0; i < positions.length; i++) {
        positions[i].vx = 0
        positions[i].vy = 0

        for (let j = 0; j < positions.length; j++) {
          if (i === j) continue

          const dx = positions[i].position.x - positions[j].position.x
          const dy = positions[i].position.y - positions[j].position.y
          const dist = Math.sqrt(dx * dx + dy * dy) || 1

          const force = (k * k) / dist
          positions[i].vx += (dx / dist) * force
          positions[i].vy += (dy / dist) * force
        }
      }

      // 计算引力
      for (const edge of edges) {
        const i = positions.findIndex((n) => n.id === edge.source)
        const j = positions.findIndex((n) => n.id === edge.target)

        if (i === -1 || j === -1) continue

        const dx = positions[i].position.x - positions[j].position.x
        const dy = positions[i].position.y - positions[j].position.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1

        const force = (dist * dist) / k
        const fx = (dx / dist) * force
        const fy = (dy / dist) * force

        positions[i].vx -= fx
        positions[i].vy -= fy
        positions[j].vx += fx
        positions[j].vy += fy
      }

      // 更新位置
      for (const pos of positions) {
        pos.position.x += pos.vx * c
        pos.position.y += pos.vy * c

        // 边界检查
        pos.position.x = Math.max(50, Math.min(width - 50, pos.position.x))
        pos.position.y = Math.max(50, Math.min(height - 50, pos.position.y))
      }
    }

    return positions.map(({ id, label, description, position, metadata }) => ({
      id,
      label,
      description,
      position,
      metadata,
    }))
  },
}
