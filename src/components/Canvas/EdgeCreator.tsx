import { useState } from 'react'
import { useGraphStore } from '@/store/graphStore'
import type { Edge } from '@/types/graph'

interface EdgeCreatorProps {
  isActive: boolean
}

export default function EdgeCreator({ isActive }: EdgeCreatorProps) {
  const [sourceNode, setSourceNode] = useState<string | null>(null)
  const [targetNode, setTargetNode] = useState<string | null>(null)
  const [showWeightInput, setShowWeightInput] = useState(false)
  const [weight, setWeight] = useState<number>(100)
  const { graph, addEdge } = useGraphStore()

  const handleCreateEdge = () => {
    if (!sourceNode || !targetNode) return

    const edgeId = `edge-${sourceNode}-${targetNode}`
    const edge: Edge = {
      id: edgeId,
      source: sourceNode,
      target: targetNode,
      weight,
    }

    addEdge(edge)
    reset()
  }

  const reset = () => {
    setSourceNode(null)
    setTargetNode(null)
    setShowWeightInput(false)
    setWeight(100)
  }

  return (
    <>
      {/* 权重输入弹窗 */}
      {showWeightInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-80">
            <h3 className="text-lg font-semibold mb-4">设置边的权重</h3>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">
                从 {graph.getNode(sourceNode!)?.label} 到 {graph.getNode(targetNode!)?.label}
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value))}
                min="0"
                step="10"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="输入权重(距离)"
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={reset}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleCreateEdge}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 临时连线预览 */}
      {isActive && sourceNode && !targetNode && (
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full">
            <circle
              cx={graph.getNode(sourceNode)?.position.x}
              cy={graph.getNode(sourceNode)?.position.y}
              r="30"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          </svg>
        </div>
      )}
    </>
  )
}
