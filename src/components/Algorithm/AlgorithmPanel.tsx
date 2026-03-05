import { useState } from 'react'
import { Zap } from 'lucide-react'
import { useAlgorithmStore } from '@/store/algorithmStore'
import { useGraphStore } from '@/store/graphStore'
import { DijkstraAlgorithm, AStarAlgorithm, BFSAlgorithm, DFSAlgorithm, HeldKarpAlgorithm, FloydWarshallAlgorithm } from '@/core/algorithms'
import { useAlgorithmExecution } from '@/hooks/useAlgorithmExecution'

export default function AlgorithmPanel() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('dijkstra')
  const [startNode, setStartNode] = useState<string>('')
  const [endNode, setEndNode] = useState<string>('')
  const [selectedNodes, setSelectedNodes] = useState<string[]>([])
  
  const { graph } = useGraphStore()
  const { isRunning } = useAlgorithmStore()
  const { executeAlgorithm } = useAlgorithmExecution()

  const algorithms = [
    { id: 'dijkstra', name: 'Dijkstra', description: '单源最短路径' },
    { id: 'astar', name: 'A*', description: '启发式搜索' },
    { id: 'floyd', name: 'Floyd-Warshall', description: '全源最短路径' },
    { id: 'bfs', name: 'BFS', description: '广度优先搜索' },
    { id: 'dfs', name: 'DFS', description: '深度优先搜索' },
    { id: 'tsp', name: 'TSP', description: '旅行商问题' },
  ]

  const handleRun = async () => {
    // Floyd-Warshall 不需要起点
    if (selectedAlgorithm !== 'floyd' && !startNode) {
      alert('请选择起点')
      return
    }

    // A* 需要终点
    if (selectedAlgorithm === 'astar' && !endNode) {
      alert('A* 算法需要选择终点')
      return
    }

    try {
      switch (selectedAlgorithm) {
        case 'dijkstra': {
          const algorithm = new DijkstraAlgorithm()
          await executeAlgorithm(algorithm, {
            startNodeId: startNode,
            endNodeId: endNode || undefined,
          })
          break
        }
        case 'astar': {
          const algorithm = new AStarAlgorithm()
          await executeAlgorithm(algorithm, {
            startNodeId: startNode,
            endNodeId: endNode,
          })
          break
        }
        case 'floyd': {
          const algorithm = new FloydWarshallAlgorithm()
          await executeAlgorithm(algorithm, {})
          break
        }
        case 'bfs': {
          const algorithm = new BFSAlgorithm()
          await executeAlgorithm(algorithm, {
            startNodeId: startNode,
            endNodeId: endNode || undefined,
          })
          break
        }
        case 'dfs': {
          const algorithm = new DFSAlgorithm()
          await executeAlgorithm(algorithm, {
            startNodeId: startNode,
            endNodeId: endNode || undefined,
          })
          break
        }
        case 'tsp': {
          if (selectedNodes.length < 2) {
            alert('TSP 算法至少需要选择 2 个节点')
            return
          }
          const algorithm = new HeldKarpAlgorithm()
          await executeAlgorithm(algorithm, {
            nodeIds: selectedNodes,
            returnToStart: false,
          })
          break
        }
        default:
          alert('未知算法')
      }
    } catch (error) {
      console.error('执行算法失败:', error)
      alert(`执行失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  const handleNodeToggle = (nodeId: string) => {
    setSelectedNodes((prev) =>
      prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-4">算法控制</h3>

      {/* 算法选择 */}
      <div className="space-y-2 mb-4">
        {algorithms.map((algo) => (
          <button
            key={algo.id}
            onClick={() => setSelectedAlgorithm(algo.id)}
            disabled={isRunning}
            className={`w-full p-3 rounded-lg text-left transition-colors ${
              selectedAlgorithm === algo.id
                ? 'bg-primary-50 border-2 border-primary-500'
                : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
            } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="font-medium">{algo.name}</div>
            <div className="text-sm text-gray-600">{algo.description}</div>
          </button>
        ))}
      </div>

      {/* 节点选择 */}
      {selectedAlgorithm === 'floyd' ? (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            Floyd-Warshall 算法会计算所有节点对之间的最短路径，不需要选择起点和终点。
          </p>
        </div>
      ) : selectedAlgorithm !== 'tsp' ? (
        <div className="space-y-3 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">起点</label>
            <select
              value={startNode}
              onChange={(e) => setStartNode(e.target.value)}
              disabled={isRunning}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              终点 {selectedAlgorithm === 'astar' ? '(必选)' : '(可选)'}
            </label>
            <select
              value={endNode}
              onChange={(e) => setEndNode(e.target.value)}
              disabled={isRunning}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
            >
              <option value="">
                {selectedAlgorithm === 'astar' ? '选择终点' : '选择终点(可选)'}
              </option>
              {graph.getAllNodes().map((node) => (
                <option key={node.id} value={node.id}>
                  {node.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            选择要访问的节点 (至少2个)
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {graph.getAllNodes().map((node) => (
              <label
                key={node.id}
                className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedNodes.includes(node.id)}
                  onChange={() => handleNodeToggle(node.id)}
                  disabled={isRunning}
                  className="rounded"
                />
                <span className="text-sm">{node.label}</span>
              </label>
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            已选择 {selectedNodes.length} 个节点
          </div>
        </div>
      )}

      {/* 运行按钮 */}
      <button
        onClick={handleRun}
        disabled={isRunning}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Zap className="w-4 h-4" />
        {isRunning ? '运行中...' : '运行算法'}
      </button>
    </div>
  )
}
