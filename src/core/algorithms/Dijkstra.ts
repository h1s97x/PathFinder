import type { Graph } from '@/core/graph/Graph'
import type {
  Algorithm,
  DijkstraInput,
  DijkstraOutput,
  AlgorithmStep,
} from '@/types/algorithm'

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
}

export class DijkstraAlgorithm implements Algorithm<DijkstraInput, DijkstraOutput> {
  name = 'Dijkstra'
  description = '单源最短路径算法'

  execute(graph: Graph, input: DijkstraInput): DijkstraOutput {
    const { startNodeId, endNodeId } = input
    const distances = new Map<string, number>()
    const previous = new Map<string, string | null>()
    const visited = new Set<string>()
    const pq = new PriorityQueue<string>()

    // 初始化
    graph.getAllNodes().forEach((node) => {
      distances.set(node.id, Infinity)
      previous.set(node.id, null)
    })
    distances.set(startNodeId, 0)
    pq.enqueue(startNodeId, 0)

    while (!pq.isEmpty()) {
      const current = pq.dequeue()!
      if (visited.has(current)) continue
      visited.add(current)

      if (endNodeId && current === endNodeId) break

      const neighbors = graph.getNeighbors(current)
      for (const neighbor of neighbors) {
        if (visited.has(neighbor)) continue

        const weight = graph.getEdgeWeight(current, neighbor) || 0
        const newDistance = distances.get(current)! + weight

        if (newDistance < distances.get(neighbor)!) {
          distances.set(neighbor, newDistance)
          previous.set(neighbor, current)
          pq.enqueue(neighbor, newDistance)
        }
      }
    }

    // 构建路径
    let path: string[] | undefined
    let totalDistance: number | undefined

    if (endNodeId) {
      path = this.buildPath(previous, startNodeId, endNodeId)
      totalDistance = distances.get(endNodeId)
      if (totalDistance === Infinity) {
        path = undefined
        totalDistance = undefined
      }
    }

    return { distances, previous, path, totalDistance }
  }

  *executeSteps(graph: Graph, input: DijkstraInput): Generator<AlgorithmStep, DijkstraOutput> {
    const { startNodeId, endNodeId } = input
    const distances = new Map<string, number>()
    const previous = new Map<string, string | null>()
    const visited = new Set<string>()
    const pq = new PriorityQueue<string>()

    // 初始化
    graph.getAllNodes().forEach((node) => {
      distances.set(node.id, Infinity)
      previous.set(node.id, null)
    })
    distances.set(startNodeId, 0)
    pq.enqueue(startNodeId, 0)

    yield {
      type: 'visit',
      nodeIds: [startNodeId],
      message: `开始从节点 ${startNodeId} 进行搜索`,
      data: { distances: new Map(distances) },
    }

    while (!pq.isEmpty()) {
      const current = pq.dequeue()!
      if (visited.has(current)) continue
      visited.add(current)

      yield {
        type: 'visit',
        nodeIds: [current],
        message: `访问节点 ${current}，当前距离: ${distances.get(current)}`,
        data: { distances: new Map(distances), visited: new Set(visited) },
      }

      if (endNodeId && current === endNodeId) {
        yield {
          type: 'complete',
          nodeIds: [endNodeId],
          message: `找到目标节点 ${endNodeId}`,
        }
        break
      }

      const neighbors = graph.getNeighbors(current)
      for (const neighbor of neighbors) {
        if (visited.has(neighbor)) continue

        const edge = graph.getEdgeBetween(current, neighbor)
        const weight = graph.getEdgeWeight(current, neighbor) || 0
        const newDistance = distances.get(current)! + weight

        yield {
          type: 'compare',
          nodeIds: [current, neighbor],
          edgeIds: edge ? [edge.id] : [],
          message: `比较路径: ${current} -> ${neighbor}, 新距离: ${newDistance}, 旧距离: ${distances.get(neighbor)}`,
        }

        if (newDistance < distances.get(neighbor)!) {
          distances.set(neighbor, newDistance)
          previous.set(neighbor, current)
          pq.enqueue(neighbor, newDistance)

          yield {
            type: 'update',
            nodeIds: [neighbor],
            edgeIds: edge ? [edge.id] : [],
            message: `更新节点 ${neighbor} 的距离为 ${newDistance}`,
            data: { distances: new Map(distances) },
          }
        }
      }
    }

    let path: string[] | undefined
    let totalDistance: number | undefined

    if (endNodeId) {
      path = this.buildPath(previous, startNodeId, endNodeId)
      totalDistance = distances.get(endNodeId)
      if (totalDistance === Infinity) {
        path = undefined
        totalDistance = undefined
      }
    }

    return { distances, previous, path, totalDistance }
  }

  private buildPath(
    previous: Map<string, string | null>,
    start: string,
    end: string
  ): string[] | undefined {
    const path: string[] = []
    let current: string | null = end

    while (current !== null) {
      path.unshift(current)
      if (current === start) break
      current = previous.get(current) || null
    }

    return path.length > 0 && path[0] === start ? path : undefined
  }
}
