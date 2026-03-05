import type { Graph } from '@/core/graph/Graph'
import type { Algorithm, HeldKarpInput, HeldKarpOutput, AlgorithmStep } from '@/types/algorithm'

export class HeldKarpAlgorithm implements Algorithm<HeldKarpInput, HeldKarpOutput> {
  name = 'Held-Karp'
  description = '旅行商问题(TSP)动态规划算法'

  execute(graph: Graph, input: HeldKarpInput): HeldKarpOutput {
    const { nodeIds, returnToStart = false } = input
    const n = nodeIds.length

    if (n === 0) {
      return { path: [], totalDistance: 0, visitOrder: [] }
    }

    if (n === 1) {
      return { path: [nodeIds[0]], totalDistance: 0, visitOrder: [nodeIds[0]] }
    }

    // 预处理所有节点对之间的距离
    const dist = this.buildDistanceMatrix(graph, nodeIds)

    // dp[mask][i] 表示访问了 mask 中的节点,当前在节点 i 的最短距离
    const dp: number[][] = Array(1 << n)
      .fill(0)
      .map(() => Array(n).fill(Infinity))
    const parent: number[][] = Array(1 << n)
      .fill(0)
      .map(() => Array(n).fill(-1))

    // 初始化:从起点开始
    dp[1][0] = 0

    // 动态规划
    for (let mask = 1; mask < 1 << n; mask++) {
      for (let u = 0; u < n; u++) {
        if (!(mask & (1 << u))) continue
        if (dp[mask][u] === Infinity) continue

        for (let v = 0; v < n; v++) {
          if (mask & (1 << v)) continue

          const newMask = mask | (1 << v)
          const newDist = dp[mask][u] + dist[u][v]

          if (newDist < dp[newMask][v]) {
            dp[newMask][v] = newDist
            parent[newMask][v] = u
          }
        }
      }
    }

    // 找到最优终点
    const fullMask = (1 << n) - 1
    let minDist = Infinity
    let endNode = -1

    for (let i = 0; i < n; i++) {
      let dist = dp[fullMask][i]
      if (returnToStart) {
        dist += this.getDistance(graph, nodeIds[i], nodeIds[0])
      }
      if (dist < minDist) {
        minDist = dist
        endNode = i
      }
    }

    // 重建路径
    const path: number[] = []
    let mask = fullMask
    let current = endNode

    while (current !== -1) {
      path.unshift(current)
      const prev = parent[mask][current]
      if (prev !== -1) {
        mask ^= 1 << current
      }
      current = prev
    }

    const visitOrder = path.map((i) => nodeIds[i])
    if (returnToStart && visitOrder.length > 0) {
      visitOrder.push(nodeIds[0])
    }

    return {
      path: this.expandPath(graph, visitOrder),
      totalDistance: minDist,
      visitOrder,
    }
  }

  *executeSteps(graph: Graph, input: HeldKarpInput): Generator<AlgorithmStep, HeldKarpOutput> {
    const { nodeIds } = input
    const n = nodeIds.length

    yield {
      type: 'visit',
      nodeIds: nodeIds,
      message: `开始求解 ${n} 个节点的旅行商问题`,
    }

    if (n === 0 || n === 1) {
      return this.execute(graph, input)
    }

    const dist = this.buildDistanceMatrix(graph, nodeIds)

    yield {
      type: 'update',
      message: '构建距离矩阵完成',
      data: { distanceMatrix: dist },
    }

    const dp: number[][] = Array(1 << n)
      .fill(0)
      .map(() => Array(n).fill(Infinity))
    const parent: number[][] = Array(1 << n)
      .fill(0)
      .map(() => Array(n).fill(-1))

    dp[1][0] = 0

    for (let mask = 1; mask < 1 << n; mask++) {
      for (let u = 0; u < n; u++) {
        if (!(mask & (1 << u))) continue
        if (dp[mask][u] === Infinity) continue

        yield {
          type: 'visit',
          nodeIds: [nodeIds[u]],
          message: `处理状态: 已访问节点集合,当前在 ${nodeIds[u]}`,
        }

        for (let v = 0; v < n; v++) {
          if (mask & (1 << v)) continue

          const newMask = mask | (1 << v)
          const newDist = dp[mask][u] + dist[u][v]

          if (newDist < dp[newMask][v]) {
            dp[newMask][v] = newDist
            parent[newMask][v] = u

            yield {
              type: 'update',
              nodeIds: [nodeIds[u], nodeIds[v]],
              message: `更新: ${nodeIds[u]} -> ${nodeIds[v]}, 距离: ${newDist.toFixed(2)}`,
            }
          }
        }
      }
    }

    const result = this.execute(graph, input)

    yield {
      type: 'complete',
      nodeIds: result.visitOrder,
      message: `找到最优路径,总距离: ${result.totalDistance.toFixed(2)}`,
    }

    return result
  }

  private buildDistanceMatrix(graph: Graph, nodeIds: string[]): number[][] {
    const n = nodeIds.length
    const dist: number[][] = Array(n)
      .fill(0)
      .map(() => Array(n).fill(Infinity))

    for (let i = 0; i < n; i++) {
      dist[i][i] = 0
      for (let j = i + 1; j < n; j++) {
        const d = this.getDistance(graph, nodeIds[i], nodeIds[j])
        dist[i][j] = d
        dist[j][i] = d
      }
    }

    return dist
  }

  private getDistance(graph: Graph, from: string, to: string): number {
    // 使用 BFS 找最短路径
    const queue: Array<{ node: string; dist: number }> = [{ node: from, dist: 0 }]
    const visited = new Set<string>([from])

    while (queue.length > 0) {
      const { node, dist } = queue.shift()!

      if (node === to) {
        return dist
      }

      const neighbors = graph.getNeighbors(node)
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor)
          const weight = graph.getEdgeWeight(node, neighbor) || 0
          queue.push({ node: neighbor, dist: dist + weight })
        }
      }
    }

    return Infinity
  }

  private expandPath(graph: Graph, visitOrder: string[]): string[] {
    const fullPath: string[] = []

    for (let i = 0; i < visitOrder.length - 1; i++) {
      const segment = this.getShortestPath(graph, visitOrder[i], visitOrder[i + 1])
      if (i === 0) {
        fullPath.push(...segment)
      } else {
        fullPath.push(...segment.slice(1))
      }
    }

    return fullPath
  }

  private getShortestPath(graph: Graph, from: string, to: string): string[] {
    const queue: Array<{ node: string; path: string[] }> = [{ node: from, path: [from] }]
    const visited = new Set<string>([from])

    while (queue.length > 0) {
      const { node, path } = queue.shift()!

      if (node === to) {
        return path
      }

      const neighbors = graph.getNeighbors(node)
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor)
          queue.push({ node: neighbor, path: [...path, neighbor] })
        }
      }
    }

    return [from, to]
  }
}
