import type { Graph } from '@/core/graph/Graph'
import type { Algorithm, TraversalInput, TraversalOutput, AlgorithmStep } from '@/types/algorithm'

export class DFSAlgorithm implements Algorithm<TraversalInput, TraversalOutput> {
  name = 'DFS'
  description = '深度优先搜索算法'

  execute(graph: Graph, input: TraversalInput): TraversalOutput {
    const { startNodeId, endNodeId } = input
    const visitOrder: string[] = []
    const visited = new Set<string>()
    const allPaths: string[][] = []

    const dfs = (current: string, path: string[]) => {
      visited.add(current)
      visitOrder.push(current)
      path.push(current)

      if (endNodeId && current === endNodeId) {
        allPaths.push([...path])
        visited.delete(current)
        return
      }

      const neighbors = graph.getNeighbors(current)
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfs(neighbor, path)
        }
      }

      path.pop()
      visited.delete(current)
    }

    dfs(startNodeId, [])

    return {
      visitOrder,
      path: allPaths.length > 0 ? allPaths[0] : undefined,
      allPaths: allPaths.length > 0 ? allPaths : undefined,
    }
  }

  *executeSteps(graph: Graph, input: TraversalInput): Generator<AlgorithmStep, TraversalOutput> {
    const { startNodeId, endNodeId } = input
    const visitOrder: string[] = []
    const visited = new Set<string>()
    const allPaths: string[][] = []

    function* dfs(
      current: string,
      path: string[]
    ): Generator<AlgorithmStep, void> {
      visited.add(current)
      visitOrder.push(current)
      path.push(current)

      yield {
        type: 'visit',
        nodeIds: [current],
        message: `访问节点 ${current}`,
        data: { path: [...path], visited: new Set(visited) },
      }

      if (endNodeId && current === endNodeId) {
        allPaths.push([...path])
        yield {
          type: 'complete',
          nodeIds: path,
          message: `找到一条路径: ${path.join(' -> ')}`,
        }
        visited.delete(current)
        return
      }

      const neighbors = graph.getNeighbors(current)
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          yield {
            type: 'compare',
            nodeIds: [current, neighbor],
            message: `探索邻居节点 ${neighbor}`,
          }
          yield* dfs(neighbor, path)
        }
      }

      path.pop()
      visited.delete(current)
    }

    yield {
      type: 'visit',
      nodeIds: [startNodeId],
      message: `开始从节点 ${startNodeId} 进行深度优先搜索`,
    }

    yield* dfs(startNodeId, [])

    return {
      visitOrder,
      path: allPaths.length > 0 ? allPaths[0] : undefined,
      allPaths: allPaths.length > 0 ? allPaths : undefined,
    }
  }
}
