import type { Graph } from '@/core/graph/Graph'
import type { Algorithm, AlgorithmStep } from '@/types/algorithm'

export interface FloydWarshallInput {
  // Floyd-Warshall 不需要输入参数，计算所有节点对之间的最短路径
}

export interface FloydWarshallOutput {
  distances: Map<string, Map<string, number>>
  next: Map<string, Map<string, string | null>>
  hasNegativeCycle: boolean
}

export class FloydWarshallAlgorithm implements Algorithm<FloydWarshallInput, FloydWarshallOutput> {
  name = 'Floyd-Warshall'
  description = '全源最短路径算法'

  execute(graph: Graph, _input: FloydWarshallInput): FloydWarshallOutput {
    const nodes = graph.getAllNodes()
    const nodeIds = nodes.map((n) => n.id)

    // 初始化距离矩阵和路径矩阵
    const distances = new Map<string, Map<string, number>>()
    const next = new Map<string, Map<string, string | null>>()

    // 初始化
    for (const i of nodeIds) {
      distances.set(i, new Map())
      next.set(i, new Map())
      for (const j of nodeIds) {
        if (i === j) {
          distances.get(i)!.set(j, 0)
          next.get(i)!.set(j, null)
        } else {
          distances.get(i)!.set(j, Infinity)
          next.get(i)!.set(j, null)
        }
      }
    }

    // 设置直接边的距离
    for (const edge of graph.getAllEdges()) {
      distances.get(edge.source)!.set(edge.target, edge.weight)
      next.get(edge.source)!.set(edge.target, edge.target)
      // 无向图
      distances.get(edge.target)!.set(edge.source, edge.weight)
      next.get(edge.target)!.set(edge.source, edge.source)
    }

    // Floyd-Warshall 核心算法
    for (const k of nodeIds) {
      for (const i of nodeIds) {
        for (const j of nodeIds) {
          const distIK = distances.get(i)!.get(k)!
          const distKJ = distances.get(k)!.get(j)!
          const distIJ = distances.get(i)!.get(j)!

          if (distIK + distKJ < distIJ) {
            distances.get(i)!.set(j, distIK + distKJ)
            const nextK = next.get(i)!.get(k)
            next.get(i)!.set(j, nextK !== undefined ? nextK : null)
          }
        }
      }
    }

    // 检测负环
    let hasNegativeCycle = false
    for (const i of nodeIds) {
      if (distances.get(i)!.get(i)! < 0) {
        hasNegativeCycle = true
        break
      }
    }

    return { distances, next, hasNegativeCycle }
  }

  *executeSteps(graph: Graph, _input: FloydWarshallInput): Generator<AlgorithmStep, FloydWarshallOutput> {
    const nodes = graph.getAllNodes()
    const nodeIds = nodes.map((n) => n.id)
    const n = nodeIds.length

    // 初始化距离矩阵和路径矩阵
    const distances = new Map<string, Map<string, number>>()
    const next = new Map<string, Map<string, string | null>>()

    yield {
      type: 'visit',
      message: `初始化距离矩阵，共 ${n} 个节点`,
    }

    // 初始化
    for (const i of nodeIds) {
      distances.set(i, new Map())
      next.set(i, new Map())
      for (const j of nodeIds) {
        if (i === j) {
          distances.get(i)!.set(j, 0)
          next.get(i)!.set(j, null)
        } else {
          distances.get(i)!.set(j, Infinity)
          next.get(i)!.set(j, null)
        }
      }
    }

    // 设置直接边的距离
    for (const edge of graph.getAllEdges()) {
      const edgeObj = graph.getEdgeBetween(edge.source, edge.target)
      
      distances.get(edge.source)!.set(edge.target, edge.weight)
      next.get(edge.source)!.set(edge.target, edge.target)
      distances.get(edge.target)!.set(edge.source, edge.weight)
      next.get(edge.target)!.set(edge.source, edge.source)

      yield {
        type: 'visit',
        nodeIds: [edge.source, edge.target],
        edgeIds: edgeObj ? [edgeObj.id] : [],
        message: `设置边 ${edge.source} - ${edge.target} 的距离为 ${edge.weight}`,
      }
    }

    // Floyd-Warshall 核心算法
    for (const k of nodeIds) {
      yield {
        type: 'visit',
        nodeIds: [k],
        message: `使用节点 ${k} 作为中间节点`,
      }

      for (const i of nodeIds) {
        for (const j of nodeIds) {
          const distIK = distances.get(i)!.get(k)!
          const distKJ = distances.get(k)!.get(j)!
          const distIJ = distances.get(i)!.get(j)!

          if (distIK !== Infinity && distKJ !== Infinity) {
            yield {
              type: 'compare',
              nodeIds: [i, k, j],
              message: `比较路径: ${i} → ${k} → ${j} (${distIK + distKJ}) vs ${i} → ${j} (${distIJ === Infinity ? '∞' : distIJ})`,
            }

            if (distIK + distKJ < distIJ) {
              distances.get(i)!.set(j, distIK + distKJ)
              const nextK = next.get(i)!.get(k)
              next.get(i)!.set(j, nextK !== undefined ? nextK : null)

              yield {
                type: 'update',
                nodeIds: [i, j],
                message: `更新 ${i} → ${j} 的最短距离为 ${distIK + distKJ}`,
              }
            }
          }
        }
      }
    }

    // 检测负环
    let hasNegativeCycle = false
    for (const i of nodeIds) {
      if (distances.get(i)!.get(i)! < 0) {
        hasNegativeCycle = true
        yield {
          type: 'complete',
          nodeIds: [i],
          message: `检测到负环: 节点 ${i}`,
        }
        break
      }
    }

    if (!hasNegativeCycle) {
      yield {
        type: 'complete',
        message: `Floyd-Warshall 算法完成，计算了所有 ${n * n} 对节点之间的最短路径`,
      }
    }

    return { distances, next, hasNegativeCycle }
  }

  // 辅助方法：重建路径
  reconstructPath(
    next: Map<string, Map<string, string | null>>,
    start: string,
    end: string
  ): string[] | null {
    if (!next.get(start)?.get(end)) {
      return null
    }

    const path: string[] = [start]
    let current = start

    while (current !== end) {
      const nextNode = next.get(current)?.get(end)
      if (!nextNode) {
        return null
      }
      path.push(nextNode)
      current = nextNode
    }

    return path
  }
}
