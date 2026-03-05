import { useState } from 'react'
import { History, RotateCcw, RotateCw, Eye, Trash2, Clock } from 'lucide-react'
import { useGraphStore } from '@/store/graphStore'
import { Graph } from '@/core/graph/Graph'

interface HistoryEntry {
  index: number
  timestamp: Date
  type: 'past' | 'current' | 'future'
  nodeCount: number
  edgeCount: number
  preview: string
}

export default function HistoryViewer() {
  const { graph, history, undo, redo, canUndo, canRedo, setGraph } = useGraphStore()
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  // 构建历史记录列表
  const buildHistoryList = (): HistoryEntry[] => {
    const entries: HistoryEntry[] = []

    // 添加过去的状态
    history.past.forEach((state, index) => {
      const g = Graph.fromJSON(state)
      entries.push({
        index: index - history.past.length,
        timestamp: new Date(Date.now() - (history.past.length - index) * 60000), // 模拟时间戳
        type: 'past',
        nodeCount: g.getAllNodes().length,
        edgeCount: g.getAllEdges().length,
        preview: `${g.getAllNodes().length} 节点, ${g.getAllEdges().length} 边`,
      })
    })

    // 添加当前状态
    entries.push({
      index: 0,
      timestamp: new Date(),
      type: 'current',
      nodeCount: graph.getAllNodes().length,
      edgeCount: graph.getAllEdges().length,
      preview: `${graph.getAllNodes().length} 节点, ${graph.getAllEdges().length} 边`,
    })

    // 添加未来的状态
    history.future.forEach((state, index) => {
      const g = Graph.fromJSON(state)
      entries.push({
        index: index + 1,
        timestamp: new Date(Date.now() + (index + 1) * 60000), // 模拟时间戳
        type: 'future',
        nodeCount: g.getAllNodes().length,
        edgeCount: g.getAllEdges().length,
        preview: `${g.getAllNodes().length} 节点, ${g.getAllEdges().length} 边`,
      })
    })

    return entries
  }

  const historyList = buildHistoryList()

  // 跳转到指定历史状态
  const jumpToState = (index: number) => {
    if (index === 0) return // 已经是当前状态

    if (index < 0) {
      // 跳转到过去
      const steps = Math.abs(index)
      for (let i = 0; i < steps; i++) {
        if (canUndo()) undo()
      }
    } else {
      // 跳转到未来
      for (let i = 0; i < index; i++) {
        if (canRedo()) redo()
      }
    }
    setSelectedIndex(null)
  }

  // 预览历史状态
  const previewState = (index: number) => {
    setSelectedIndex(index)
    setShowPreview(true)
  }

  // 获取选中状态的详细信息
  const getSelectedStateDetails = () => {
    if (selectedIndex === null) return null

    if (selectedIndex === 0) {
      return {
        graph,
        nodes: graph.getAllNodes(),
        edges: graph.getAllEdges(),
      }
    } else if (selectedIndex < 0) {
      const stateIndex = history.past.length + selectedIndex
      const state = history.past[stateIndex]
      const g = Graph.fromJSON(state)
      return {
        graph: g,
        nodes: g.getAllNodes(),
        edges: g.getAllEdges(),
      }
    } else {
      const state = history.future[selectedIndex - 1]
      const g = Graph.fromJSON(state)
      return {
        graph: g,
        nodes: g.getAllNodes(),
        edges: g.getAllEdges(),
      }
    }
  }

  // 清除历史记录
  const clearHistory = () => {
    if (confirm('确定要清除所有历史记录吗？此操作不可撤销。')) {
      // 保存当前状态，清除历史
      const currentState = graph.toJSON()
      setGraph(Graph.fromJSON(currentState), false)
    }
  }

  const selectedDetails = showPreview ? getSelectedStateDetails() : null

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold">历史记录</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={!canUndo()}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="撤销"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo()}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="重做"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={clearHistory}
            disabled={history.past.length === 0 && history.future.length === 0}
            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="清除历史"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="p-2 bg-blue-50 rounded-lg text-center">
          <div className="text-xs text-blue-600">过去</div>
          <div className="text-lg font-semibold text-blue-900">{history.past.length}</div>
        </div>
        <div className="p-2 bg-green-50 rounded-lg text-center">
          <div className="text-xs text-green-600">当前</div>
          <div className="text-lg font-semibold text-green-900">1</div>
        </div>
        <div className="p-2 bg-purple-50 rounded-lg text-center">
          <div className="text-xs text-purple-600">未来</div>
          <div className="text-lg font-semibold text-purple-900">{history.future.length}</div>
        </div>
      </div>

      {/* 历史记录列表 */}
      <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
        {historyList.length === 1 ? (
          <div className="text-sm text-gray-500 text-center py-8">
            暂无历史记录
          </div>
        ) : (
          historyList.map((entry) => (
            <div
              key={entry.index}
              className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                entry.type === 'current'
                  ? 'bg-green-50 border-green-500'
                  : entry.type === 'past'
                  ? 'bg-blue-50 border-blue-200 hover:border-blue-400'
                  : 'bg-purple-50 border-purple-200 hover:border-purple-400'
              } ${selectedIndex === entry.index ? 'ring-2 ring-primary-500' : ''}`}
              onClick={() => previewState(entry.index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-600">
                      {entry.type === 'current'
                        ? '当前状态'
                        : entry.type === 'past'
                        ? `${Math.abs(entry.index)} 步之前`
                        : `${entry.index} 步之后`}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {entry.preview}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {entry.type !== 'current' && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          previewState(entry.index)
                        }}
                        className="p-1 rounded hover:bg-white/50 transition-colors"
                        title="预览"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          jumpToState(entry.index)
                        }}
                        className="px-2 py-1 text-xs bg-white rounded hover:bg-gray-100 transition-colors"
                      >
                        跳转
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 预览详情 */}
      {showPreview && selectedDetails && selectedIndex !== 0 && (
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-700">状态预览</h4>
            <button
              onClick={() => {
                setShowPreview(false)
                setSelectedIndex(null)
              }}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              关闭
            </button>
          </div>
          <div className="space-y-2">
            <div className="p-2 bg-gray-50 rounded">
              <div className="text-xs text-gray-600 mb-1">节点列表</div>
              <div className="text-sm text-gray-900 max-h-24 overflow-y-auto">
                {selectedDetails.nodes.length === 0 ? (
                  <span className="text-gray-500">无节点</span>
                ) : (
                  selectedDetails.nodes.map((node) => node.label).join(', ')
                )}
              </div>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <div className="text-xs text-gray-600 mb-1">边列表</div>
              <div className="text-sm text-gray-900 max-h-24 overflow-y-auto">
                {selectedDetails.edges.length === 0 ? (
                  <span className="text-gray-500">无边</span>
                ) : (
                  selectedDetails.edges
                    .map((edge) => `${edge.source} → ${edge.target}`)
                    .join(', ')
                )}
              </div>
            </div>
            <button
              onClick={() => jumpToState(selectedIndex!)}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              恢复到此状态
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
