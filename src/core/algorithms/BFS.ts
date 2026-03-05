import type { Graph } from '@/core/graph/Graph'
import type { Algorithm, TraversalInput, TraversalOutput, AlgorithmStep } from '@/types/algorithm'

export class BFSAlgorithm implements Algorithm<TraversalInput, TraversalOutput> {
  name = 'BFS'
  description = '广度优先搜索算法'

  execute(graph: Graph, input: TraversalInput): TraversalOutput {
    const { startNodeId, endNodeId } = input
    const visitOrder: string[] = []
    const visited = new Set<string>()
    const queue: string[] = [startNodeId]
    const previous = new Map<string, string | null>()

    visited.add(startNodeId)
    previous.set(startNodeId, null)

    while (queue.length > 0) {
      const current = queue.shift()!
      visitOrder.push(current)

      if (endNodeId && current === endNodeId) {
        break
      }

      const neighbors = graph.getNeighbors(current)
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor)
          previous.set(neighbor, current)
          queue.push(neighbor)
        }
      }
    }

    let path: string[] | undefined
    if (endNodeId && visited.has(endNodeId)) {
      path = this.buildPath(previous, startNodeId, endNodeId)
    }

    return { visitOrder, path }
  }

  *executeSteps(graph: Graph, input: TraversalInput): Generator<AlgorithmStep, TraversalOutput> {
    const { startNodeId, endNodeId } = input
    const visitOrder: string[] = []
    const visited = new Set<string>()
    const queue: string[] = [startNodeId]
    const previous = new Map<string, string | null>()

    visited.add(startNodeId)
    previous.set(startNodeId, null)

    yield {
      type: 'visit',
      nodeIds: [startNodeId],
      message: `开始从节点 ${startNodeId} 进行广度优先搜索`,
      data: { queue: [...queue], visited: new Set(visited) },
    }

    while (queue.length > 0) {
      const current = queue.shift()!
      visitOrder.push(current)

      yield {
        type: 'visit',
        nodeIds: [current],
        message: `访问节点 ${current}`,
        data: { queue: [...queue], visited: new Set(visited), visitOrder: [...visitOrder] },
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
        if (!visited.has(neighbor)) {
          visited.add(neighbor)
          previous.set(neighbor, current)
          queue.push(neighbor)

          yield {
            type: 'update',
            nodeIds: [current, neighbor],
            message: `将节点 ${neighbor} 加入队列`,
            data: { queue: [...queue], visited: new Set(visited) },
          }
        }
      }
    }

    let path: string[] | undefined
    if (endNodeId && visited.has(endNodeId)) {
      path = this.buildPath(previous, startNodeId, endNodeId)
    }

    return { visitOrder, path }
  }

  private buildPath(
    previous: Map<string, string | null>,
    start: string,
    end: string
  ): string[] {
    const path: string[] = []
    let current: string | null = end

    while (current !== null) {
      path.unshift(current)
      if (current === start) break
      current = previous.get(current) || null
    }

    return path
  }
}
