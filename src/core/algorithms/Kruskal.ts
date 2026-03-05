import type { Graph } from '@/core/graph/Graph'
import type { Algorithm, AlgorithmStep } from '@/types/algorithm'

export interface KruskalInput {
  // Kruskal 不需要输入参数，处理整个图
}

export interface KruskalOutput {
  mstEdges: string[] // 最小生成树的边 ID
  totalWeight: number
  edgesProcessed: number
}

// 并查集（Union-Find）数据结构
class UnionFind {
  private parent: Map<string, string>
  private rank: Map<string, number>

  constructor(nodes: string[]) {
    this.parent = new Map()
    this.rank = new Map()
    
    nodes.forEach((node) => {
      this.parent.set(node, node)
      this.rank.set(node, 0)
    })
  }

  find(node: string): string {
    if (this.parent.get(node) !== node) {
      // 路径压缩
      this.parent.set(node, this.find(this.parent.get(node)!))
    }
    return this.parent.get(node)!
  }

  union(node1: string, node2: string): boolean {
    const root1 = this.find(node1)
    const root2 = this.find(node2)

    if (root1 === root2) {
      return false // 已经在同一集合中
    }

    // 按秩合并
    const rank1 = this.rank.get(root1)!
    const rank2 = this.rank.get(root2)!

    if (rank1 < rank2) {
      this.parent.set(root1, root2)
    } else if (rank1 > rank2) {
      this.parent.set(root2, root1)
    } else {
      this.parent.set(root2, root1)
      this.rank.set(root1, rank1 + 1)
    }

    return true
  }
}

export class KruskalAlgorithm implements Algorithm<KruskalInput, KruskalOutput> {
  name = 'Kruskal'
  description = 'Kruskal 最小生成树算法'

  execute(graph: Graph, _input: KruskalInput): KruskalOutput {
    const nodes = graph.getAllNodes().map((n) => n.id)
    const edges = graph.getAllEdges()

    // 按权重排序边
    const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight)

    const uf = new UnionFind(nodes)
    const mstEdges: string[] = []
    let totalWeight = 0
    let edgesProcessed = 0

    for (const edge of sortedEdges) {
      edgesProcessed++
      
      if (uf.union(edge.source, edge.target)) {
        mstEdges.push(edge.id)
        totalWeight += edge.weight
        
        // 如果已经有 n-1 条边，MST 完成
        if (mstEdges.length === nodes.length - 1) {
          break
        }
      }
    }

    return {
      mstEdges,
      totalWeight,
      edgesProcessed,
    }
  }

  *executeSteps(graph: Graph, _input: KruskalInput): Generator<AlgorithmStep, KruskalOutput> {
    const nodes = graph.getAllNodes().map((n) => n.id)
    const edges = graph.getAllEdges()

    if (nodes.length === 0) {
      yield {
        type: 'complete',
        message: '图为空',
      }
      return { mstEdges: [], totalWeight: 0, edgesProcessed: 0 }
    }

    // 按权重排序边
    const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight)

    yield {
      type: 'visit',
      message: `Kruskal 算法开始，共 ${nodes.length} 个节点，${edges.length} 条边`,
    }

    const uf = new UnionFind(nodes)
    const mstEdges: string[] = []
    let totalWeight = 0
    let edgesProcessed = 0

    for (const edge of sortedEdges) {
      edgesProcessed++

      yield {
        type: 'compare',
        edgeIds: [edge.id],
        nodeIds: [edge.source, edge.target],
        message: `检查边 ${edge.source}-${edge.target}，权重 ${edge.weight}`,
      }

      if (uf.union(edge.source, edge.target)) {
        mstEdges.push(edge.id)
        totalWeight += edge.weight

        yield {
          type: 'update',
          edgeIds: [edge.id],
          nodeIds: [edge.source, edge.target],
          message: `添加边到 MST，当前总权重 ${totalWeight.toFixed(2)}`,
        }

        // 如果已经有 n-1 条边，MST 完成
        if (mstEdges.length === nodes.length - 1) {
          break
        }
      } else {
        yield {
          type: 'compare',
          edgeIds: [edge.id],
          message: `跳过边（会形成环）`,
        }
      }
    }

    yield {
      type: 'complete',
      edgeIds: mstEdges,
      message: `MST 完成！总权重: ${totalWeight.toFixed(2)}, 处理了 ${edgesProcessed} 条边`,
    }

    return {
      mstEdges,
      totalWeight,
      edgesProcessed,
    }
  }
}
