import { useState } from 'react'
import { Download, Info, TrendingUp, Clock, Route } from 'lucide-react'
import { useAlgorithmStore } from '@/store/algorithmStore'
import { useGraphStore } from '@/store/graphStore'

interface PathMetrics {
  algorithm: string
  path: string[]
  distance: number
  nodesExplored?: number
  executionTime?: number
}

export default function PathInfoPanel() {
  const { result } = useAlgorithmStore()
  const { graph } = useGraphStore()
  const [showDetails, setShowDetails] = useState(true)

  if (!result) return null

  // 计算路径详细信息
  const getPathDetails = () => {
    if (!result.path || result.path.length === 0) {
      return null
    }

    const pathSegments = []
    for (let i = 0; i < result.path.length - 1; i++) {
      const from = result.path[i]
      const to = result.path[i + 1]
      const weight = graph.getEdgeWeight(from, to) || 0
      pathSegments.push({
        from,
        to,
        weight,
      })
    }

    return pathSegments
  }

  // 导出路径信息为 JSON
  const exportPathJSON = () => {
    const pathData: PathMetrics = {
      algorithm: 'Current Algorithm',
      path: result.path || [],
      distance: result.totalDistance || 0,
      nodesExplored: result.nodesExplored,
      executionTime: result.executionTime,
    }

    const dataStr = JSON.stringify(pathData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `path-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  // 导出路径信息为 CSV
  const exportPathCSV = () => {
    const pathSegments = getPathDetails()
    if (!pathSegments) return

    let csv = 'From,To,Weight\n'
    pathSegments.forEach((segment) => {
      csv += `${segment.from},${segment.to},${segment.weight}\n`
    })
    csv += `\nTotal Distance,${result.totalDistance || 0}\n`
    if (result.nodesExplored) {
      csv += `Nodes Explored,${result.nodesExplored}\n`
    }

    const dataBlob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `path-${Date.now()}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  // 导出路径信息为文本
  const exportPathText = () => {
    const pathSegments = getPathDetails()
    let text = '=== 路径信息 ===\n\n'
    
    if (result.path && result.path.length > 0) {
      text += `路径: ${result.path.join(' → ')}\n`
      text += `总距离: ${result.totalDistance?.toFixed(2) || 0}\n`
      
      if (result.nodesExplored) {
        text += `探索节点数: ${result.nodesExplored}\n`
      }
      
      if (result.executionTime) {
        text += `执行时间: ${result.executionTime}ms\n`
      }

      text += '\n=== 路径段详情 ===\n\n'
      pathSegments?.forEach((segment, index) => {
        text += `${index + 1}. ${segment.from} → ${segment.to} (权重: ${segment.weight})\n`
      })
    } else {
      text += '未找到路径\n'
    }

    const dataBlob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `path-${Date.now()}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  const pathSegments = getPathDetails()

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold">路径信息</h3>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          {showDetails ? '收起' : '展开'}
        </button>
      </div>

      {showDetails && (
        <>
          {/* 基本信息 */}
          <div className="space-y-3 mb-4">
            {result.path && result.path.length > 0 ? (
              <>
                <div className="flex items-start gap-2">
                  <Route className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-700">路径</div>
                    <div className="text-sm text-gray-900 mt-1 font-mono">
                      {result.path.join(' → ')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-700">总距离</div>
                    <div className="text-lg font-semibold text-primary-600">
                      {result.totalDistance?.toFixed(2) || 0}
                    </div>
                  </div>
                </div>

                {result.nodesExplored && (
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-gray-500" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-700">探索节点数</div>
                      <div className="text-sm text-gray-900">{result.nodesExplored}</div>
                    </div>
                  </div>
                )}

                {result.executionTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-700">执行时间</div>
                      <div className="text-sm text-gray-900">{result.executionTime}ms</div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-sm text-gray-500 text-center py-4">
                未找到路径
              </div>
            )}
          </div>

          {/* 路径段详情 */}
          {pathSegments && pathSegments.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">路径段详情</div>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {pathSegments.map((segment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                  >
                    <span className="font-mono">
                      {segment.from} → {segment.to}
                    </span>
                    <span className="text-gray-600">权重: {segment.weight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 导出按钮 */}
          {result.path && result.path.length > 0 && (
            <div className="border-t pt-4">
              <div className="text-sm font-medium text-gray-700 mb-2">导出路径</div>
              <div className="flex gap-2">
                <button
                  onClick={exportPathJSON}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  JSON
                </button>
                <button
                  onClick={exportPathCSV}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  CSV
                </button>
                <button
                  onClick={exportPathText}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  TXT
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
