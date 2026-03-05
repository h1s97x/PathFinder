import { useState } from 'react'
import { Play, BarChart3, Download } from 'lucide-react'
import { useGraphStore } from '@/store/graphStore'
import {
  DijkstraAlgorithm,
  AStarAlgorithm,
  BFSAlgorithm,
  DFSAlgorithm,
} from '@/core/algorithms'

interface ComparisonResult {
  algorithm: string
  path: string[]
  distance: number
  nodesExplored: number
  executionTime: number
  pathFound: boolean
}

export default function AlgorithmComparison() {
  const { graph } = useGraphStore()
  const [startNode, setStartNode] = useState<string>('')
  const [endNode, setEndNode] = useState<string>('')
  const [results, setResults] = useState<ComparisonResult[]>([])
  const [isComparing, setIsComparing] = useState(false)

  const algorithms = [
    { id: 'dijkstra', name: 'Dijkstra', class: DijkstraAlgorithm },
    { id: 'astar', name: 'A*', class: AStarAlgorithm },
    { id: 'bfs', name: 'BFS', class: BFSAlgorithm },
    { id: 'dfs', name: 'DFS', class: DFSAlgorithm },
  ]

  const runComparison = async () => {
    if (!startNode || !endNode) {
      alert('请选择起点和终点')
      return
    }

    setIsComparing(true)
    const comparisonResults: ComparisonResult[] = []

    for (const algo of algorithms) {
      try {
        const algorithm = new algo.class()
        const startTime = performance.now()
        
        const result = algorithm.execute(graph, {
          startNodeId: startNode,
          endNodeId: endNode,
        })
        
        const endTime = performance.now()
        const executionTime = endTime - startTime

        // 处理不同算法的输出格式
        let path: string[] = []
        let distance = 0
        let nodesExplored = 0
        let pathFound = false

        if ('path' in result && result.path) {
          path = result.path
          pathFound = true
        }

        if ('totalDistance' in result && result.totalDistance !== undefined) {
          distance = result.totalDistance
        }

        if ('nodesExplored' in result && result.nodesExplored !== undefined) {
          nodesExplored = result.nodesExplored
        }

        if ('visitOrder' in result && result.visitOrder) {
          nodesExplored = result.visitOrder.length
        }

        comparisonResults.push({
          algorithm: algo.name,
          path,
          distance,
          nodesExplored,
          executionTime: parseFloat(executionTime.toFixed(2)),
          pathFound,
        })
      } catch (error) {
        console.error(`${algo.name} 执行失败:`, error)
        comparisonResults.push({
          algorithm: algo.name,
          path: [],
          distance: Infinity,
          nodesExplored: 0,
          executionTime: 0,
          pathFound: false,
        })
      }
    }

    setResults(comparisonResults)
    setIsComparing(false)
  }

  const exportComparison = () => {
    const csv = [
      'Algorithm,Path Found,Distance,Nodes Explored,Execution Time (ms),Path',
      ...results.map((r) =>
        [
          r.algorithm,
          r.pathFound ? 'Yes' : 'No',
          r.distance === Infinity ? 'N/A' : r.distance.toFixed(2),
          r.nodesExplored,
          r.executionTime,
          r.path.join(' → '),
        ].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `algorithm-comparison-${Date.now()}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const getBestAlgorithm = (metric: 'distance' | 'nodesExplored' | 'executionTime') => {
    if (results.length === 0) return null
    
    const validResults = results.filter((r) => r.pathFound)
    if (validResults.length === 0) return null

    return validResults.reduce((best, current) => {
      if (metric === 'distance') {
        return current.distance < best.distance ? current : best
      } else if (metric === 'nodesExplored') {
        return current.nodesExplored < best.nodesExplored ? current : best
      } else {
        return current.executionTime < best.executionTime ? current : best
      }
    })
  }

  const bestDistance = getBestAlgorithm('distance')
  const bestNodes = getBestAlgorithm('nodesExplored')
  const bestTime = getBestAlgorithm('executionTime')

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* 标题 */}
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-semibold">算法对比</h3>
      </div>

      {/* 节点选择 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">起点</label>
          <select
            value={startNode}
            onChange={(e) => setStartNode(e.target.value)}
            disabled={isComparing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
          >
            <option value="">选择起点</option>
            {graph.getAllNodes().map((node) => (
              <option key={node.id} value={node.id}>
                {node.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">终点</label>
          <select
            value={endNode}
            onChange={(e) => setEndNode(e.target.value)}
            disabled={isComparing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
          >
            <option value="">选择终点</option>
            {graph.getAllNodes().map((node) => (
              <option key={node.id} value={node.id}>
                {node.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 运行按钮 */}
      <button
        onClick={runComparison}
        disabled={isComparing || !startNode || !endNode}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
      >
        <Play className="w-4 h-4" />
        {isComparing ? '对比中...' : '运行对比'}
      </button>

      {/* 结果表格 */}
      {results.length > 0 && (
        <>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2 font-medium text-gray-700">算法</th>
                  <th className="text-right py-2 px-2 font-medium text-gray-700">距离</th>
                  <th className="text-right py-2 px-2 font-medium text-gray-700">探索节点</th>
                  <th className="text-right py-2 px-2 font-medium text-gray-700">时间(ms)</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index} className="border-b last:border-b-0">
                    <td className="py-2 px-2 font-medium">{result.algorithm}</td>
                    <td
                      className={`text-right py-2 px-2 ${
                        result.pathFound && bestDistance?.algorithm === result.algorithm
                          ? 'text-green-600 font-semibold'
                          : ''
                      }`}
                    >
                      {result.pathFound
                        ? result.distance.toFixed(2)
                        : 'N/A'}
                    </td>
                    <td
                      className={`text-right py-2 px-2 ${
                        result.pathFound && bestNodes?.algorithm === result.algorithm
                          ? 'text-blue-600 font-semibold'
                          : ''
                      }`}
                    >
                      {result.pathFound ? result.nodesExplored : 'N/A'}
                    </td>
                    <td
                      className={`text-right py-2 px-2 ${
                        result.pathFound && bestTime?.algorithm === result.algorithm
                          ? 'text-purple-600 font-semibold'
                          : ''
                      }`}
                    >
                      {result.pathFound ? result.executionTime : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 最佳算法提示 */}
          <div className="space-y-2 mb-4 text-xs">
            {bestDistance && (
              <div className="flex items-center gap-2 text-green-700">
                <div className="w-2 h-2 bg-green-600 rounded-full" />
                <span>最短距离: {bestDistance.algorithm}</span>
              </div>
            )}
            {bestNodes && (
              <div className="flex items-center gap-2 text-blue-700">
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
                <span>最少探索: {bestNodes.algorithm}</span>
              </div>
            )}
            {bestTime && (
              <div className="flex items-center gap-2 text-purple-700">
                <div className="w-2 h-2 bg-purple-600 rounded-full" />
                <span>最快执行: {bestTime.algorithm}</span>
              </div>
            )}
          </div>

          {/* 导出按钮 */}
          <button
            onClick={exportComparison}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            导出对比结果
          </button>
        </>
      )}
    </div>
  )
}
