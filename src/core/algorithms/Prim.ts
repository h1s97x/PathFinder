import type { Graph } from '@/core/graph/Graph'
import type { Algorithm, AlgorithmStep } from '@/types/algorithm'

export interface PrimInput {
  startNodeId?: string // 可选起始节点，默认从第一个节点开始
}

export interface PrimOutput {
  mstEdges: string[] // 最小生成树的边 ID
  totalWeight: number
  nodesVisited: number
}

class PriorityQueue<T> {
  private items: Array<{ element: T; priority: number }> = []

  enqueue(element: T, priority: number): void {
    this.items.push({ element, priority })
    this.items.sort((a, b) => a.priority - b.priority)
  }

  dequeue(): T | undefined {
    return this.items.shift()?.element
  }

  isEmpty(): boolean {
    return this.items.length === 0
  }

  updatePriority(element: T, newPriority: number): void {
    const index = this.items.findIndex((item) => item.element === element)
    if (index !== -1) {
      this.items[index].priority = newPriority
      this.items.sort((a, b) => a.priority - b.priority)
    }
  }

  has(element: T): boolean {
    return this.items.some((item) => item.element === element)
  }
}

export class PrimAlgorithm implements Algorithm<PrimInput, PrimOutput> {
  name = 'Prim'
  description = 'Prim 最小生成树算法'

  execute(graph: Graph, input: PrimInput): PrimOutput {
    const nodes = graph.getAllNodes()
    if (nodes.length === 0) {
      return { mstEdges: [], totalWeight: 0, nodesVisited: 0 }
    }

    const startNodeId = input.startNodeId || nodes[0].id
    const visited = new Set<string>()
    const mstEdges: string[] = []
    const parent = new Map<string, string>()
    const key = new Map<string, number>()
    const pq = new PriorityQueue<string>()

    // 初始化
    nodes.forEach((node) => {
      key.set(node.id, Infinity)
    })

    key.set(startNodeId, 0)
    pq.enqueue(startNodeId, 0)

    let totalWeight = 0
    let nodesVisited = 0

    while (!pq.isEmpty()) {
      const current = pq.dequeue()!
      
      if (visited.has(current)) continue
      
      visited.add(current)
      nodesVisited++

      // 添加边到 MST
      if (parent.has(current)) {
        const edge = graph.getEdgeBetween(parent.get(current)!, current)
        if (edge) {
          mstEdges.push(edge.id)
          totalWeight += edge.weight
        }
      }

      // 更新邻居
      const neighbors = graph.getNeighbors(current)
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          const weight = graph.getEdgeWeight(current, neighbor) || 0
          
          if (weight < key.get(neighbor)!) {
            key.set(neighbor, weight)
            parent.set(neighbor, current)
            pq.enqueue(neighbor, weight)
          }
        }
      }
    }

    return {
      mstEdges,
      totalWeight,
      nodesVisited,
    }
  }

  *executeSteps(graph: Graph, input: PrimInput): Generator<AlgorithmStep, PrimOutput> {
    const nodes = graph.getAllNodes()
    
    if (nodes.length === 0) {
      yield {
        type: 'complete',
        message: '图为空',
      }
      return { mstEdges: [], totalWeight: 0, nodesVisited: 0 }
    }

    const startNodeId = input.startNodeId || nodes[0].id
    const visited = new Set<string>()
    const mstEdges: string[] = []
    const parent = new Map<string, string>()
    const key = new Map<string, number>()
    const pq = new PriorityQueue<string>()

    // 初始化
    nodes.forEach((node) => {
      key.set(node.id, Infinity)
    })

    key.set(startNodeId, 0)
    pq.enqueue(startNodeId, 0)

    yield {
      type: 'visit',
      nodeIds: [startNodeId],
      message: `Prim 算法从节点 ${startNodeId} 开始`,
    }

    let totalWeight = 0
    let nodesVisited = 0

    while (!pq.isEmpty()) {
      const current = pq.dequeue()!
      
      if (visited.has(current)) continue
      
      visited.add(current)
      nodesVisited++

      yield {
        type: 'visit',
        nodeIds: [current],
        message: `访问节点 ${current}`,
      }

      // 添加边到 MST
      if (parent.has(current)) {
        const parentNode = parent.get(current)!
        const edge = graph.getEdgeBetween(parentNode, current)
        
        if (edge) {
          mstEdges.push(edge.id)
          totalWeight += edge.weight

          yield {
            type: 'update',
            nodeIds: [parentNode, current],
            edgeIds: [edge.id],
            message: `添加边 ${parentNode}-${current} (权重 ${edge.weight}) 到 MST，总权重 ${totalWeight.toFixed(2)}`,
          }
        }
      }

      // 更新邻居
      const neighbors = graph.getNeighbors(current)
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          const edge = graph.getEdgeBetween(current, neighbor)
          const weight = edge?.weight || 0
          
          yield {
            type: 'compare',
            nodeIds: [current, neighbor],
            edgeIds: edge ? [edge.id] : [],
            message: `检查邻居 ${neighbor}，权重 ${weight}`,
          }

          if (weight < key.get(neighbor)!) {
            key.set(neighbor, weight)
            parent.set(neighbor, current)
            pq.enqueue(neighbor, weight)

            yield {
              type: 'update',
              nodeIds: [neighbor],
              message: `更新 ${neighbor} 的最小权重为 ${weight}`,
            }
          }
        }
      }
    }

    yield {
      type: 'complete',
      edgeIds: mstEdges,
      message: `MST 完成！总权重: ${totalWeight.toFixed(2)}, 访问了 ${nodesVisited} 个节点`,
    }

    return {
      mstEdges,
      totalWeight,
      nodesVisited,
    }
  }
}
