import type { Graph } from '@/core/graph/Graph'
import type { Algorithm, AlgorithmStep } from '@/types/algorithm'

export interface AStarInput {
  startNodeId: string
  endNodeId: string
  heuristic?: (nodeId: string, targetId: string, graph: Graph) => number
}

export interface AStarOutput {
  path: string[]
  totalDistance: number
  nodesExplored: number
  pathFound: boolean
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

  has(element: T): boolean {
    return this.items.some((item) => item.element === element)
  }
}

export class AStarAlgorithm implements Algorithm<AStarInput, AStarOutput> {
  name = 'A*'
  description = 'A* 启发式搜索算法'

  // 默认启发式函数：欧几里得距离
  private defaultHeuristic(nodeId: string, targetId: string, graph: Graph): number {
    const node = graph.getNode(nodeId)
    const target = graph.getNode(targetId)

    if (!node || !target) return 0

    const dx = node.position.x - target.position.x
    const dy = node.position.y - target.position.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  execute(graph: Graph, input: AStarInput): AStarOutput {
    const { startNodeId, endNodeId, heuristic = this.defaultHeuristic.bind(this) } = input

    const openSet = new PriorityQueue<string>()
    const closedSet = new Set<string>()
    const gScore = new Map<string, number>()
    const fScore = new Map<string, number>()
    const cameFrom = new Map<string, string>()

    // 初始化
    graph.getAllNodes().forEach((node) => {
      gScore.set(node.id, Infinity)
      fScore.set(node.id, Infinity)
    })

    gScore.set(startNodeId, 0)
    fScore.set(startNodeId, heuristic(startNodeId, endNodeId, graph))
    openSet.enqueue(startNodeId, fScore.get(startNodeId)!)

    let nodesExplored = 0

    while (!openSet.isEmpty()) {
      const current = openSet.dequeue()!
      nodesExplored++

      if (current === endNodeId) {
        // 重建路径
        const path = this.reconstructPath(cameFrom, current)
        return {
          path,
          totalDistance: gScore.get(endNodeId)!,
          nodesExplored,
          pathFound: true,
        }
      }

      closedSet.add(current)

      const neighbors = graph.getNeighbors(current)
      for (const neighbor of neighbors) {
        if (closedSet.has(neighbor)) continue

        const tentativeGScore = gScore.get(current)! + (graph.getEdgeWeight(current, neighbor) || 0)

        if (tentativeGScore < gScore.get(neighbor)!) {
          cameFrom.set(neighbor, current)
          gScore.set(neighbor, tentativeGScore)
          fScore.set(neighbor, tentativeGScore + heuristic(neighbor, endNodeId, graph))

          if (!openSet.has(neighbor)) {
            openSet.enqueue(neighbor, fScore.get(neighbor)!)
          }
        }
      }
    }

    // 未找到路径
    return {
      path: [],
      totalDistance: Infinity,
      nodesExplored,
      pathFound: false,
    }
  }

  *executeSteps(graph: Graph, input: AStarInput): Generator<AlgorithmStep, AStarOutput> {
    const { startNodeId, endNodeId, heuristic = this.defaultHeuristic.bind(this) } = input

    const openSet = new PriorityQueue<string>()
    const closedSet = new Set<string>()
    const gScore = new Map<string, number>()
    const fScore = new Map<string, number>()
    const cameFrom = new Map<string, string>()

    // 初始化
    graph.getAllNodes().forEach((node) => {
      gScore.set(node.id, Infinity)
      fScore.set(node.id, Infinity)
    })

    gScore.set(startNodeId, 0)
    const h = heuristic(startNodeId, endNodeId, graph)
    fScore.set(startNodeId, h)
    openSet.enqueue(startNodeId, fScore.get(startNodeId)!)

    yield {
      type: 'visit',
      nodeIds: [startNodeId],
      message: `开始 A* 搜索，启发值 h = ${h.toFixed(2)}`,
    }

    let nodesExplored = 0

    while (!openSet.isEmpty()) {
      const current = openSet.dequeue()!
      nodesExplored++

      yield {
        type: 'visit',
        nodeIds: [current],
        message: `访问节点 ${current}，g = ${gScore.get(current)!.toFixed(2)}, f = ${fScore.get(current)!.toFixed(2)}`,
      }

      if (current === endNodeId) {
        const path = this.reconstructPath(cameFrom, current)
        yield {
          type: 'complete',
          nodeIds: path,
          message: `找到最短路径！总距离: ${gScore.get(endNodeId)!.toFixed(2)}, 探索节点数: ${nodesExplored}`,
        }

        return {
          path,
          totalDistance: gScore.get(endNodeId)!,
          nodesExplored,
          pathFound: true,
        }
      }

      closedSet.add(current)

      const neighbors = graph.getNeighbors(current)
      for (const neighbor of neighbors) {
        if (closedSet.has(neighbor)) continue

        const edge = graph.getEdgeBetween(current, neighbor)
        const edgeWeight = graph.getEdgeWeight(current, neighbor) || 0
        const tentativeGScore = gScore.get(current)! + edgeWeight

        yield {
          type: 'compare',
          nodeIds: [current, neighbor],
          edgeIds: edge ? [edge.id] : [],
          message: `评估邻居 ${neighbor}，g = ${tentativeGScore.toFixed(2)}`,
        }

        if (tentativeGScore < gScore.get(neighbor)!) {
          cameFrom.set(neighbor, current)
          gScore.set(neighbor, tentativeGScore)
          const h = heuristic(neighbor, endNodeId, graph)
          fScore.set(neighbor, tentativeGScore + h)

          yield {
            type: 'update',
            nodeIds: [neighbor],
            edgeIds: edge ? [edge.id] : [],
            message: `更新 ${neighbor}: g = ${tentativeGScore.toFixed(2)}, h = ${h.toFixed(2)}, f = ${fScore.get(neighbor)!.toFixed(2)}`,
          }

          if (!openSet.has(neighbor)) {
            openSet.enqueue(neighbor, fScore.get(neighbor)!)
          }
        }
      }
    }

    // 未找到路径
    yield {
      type: 'complete',
      message: `未找到从 ${startNodeId} 到 ${endNodeId} 的路径`,
    }

    return {
      path: [],
      totalDistance: Infinity,
      nodesExplored,
      pathFound: false,
    }
  }

  private reconstructPath(cameFrom: Map<string, string>, current: string): string[] {
    const path: string[] = [current]
    while (cameFrom.has(current)) {
      current = cameFrom.get(current)!
      path.unshift(current)
    }
    return path
  }
}
