import { useState, useEffect } from 'react'
import { X, BookOpen, Map } from 'lucide-react'
import { useGraphStore } from '@/store/graphStore'
import { Graph } from '@/core/graph/Graph'
import { simpleCampusMap, complexCampusMap } from '@/data/sampleData'

export default function WelcomeDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const { setGraph } = useGraphStore()

  useEffect(() => {
    // 检查是否是首次访问
    const hasVisited = localStorage.getItem('hasVisited')
    if (!hasVisited) {
      setIsOpen(true)
      localStorage.setItem('hasVisited', 'true')
    }
  }, [])

  const loadSampleData = (data: typeof simpleCampusMap) => {
    const graph = Graph.fromJSON(data)
    setGraph(graph)
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">欢迎使用校园导航系统</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            这是一个现代化的校园导航系统,支持图的可视化编辑、多种路径查询算法和算法可视化演示。
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">主要功能:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 直观的图编辑功能(添加/删除/编辑节点和边)</li>
              <li>• 多种路径查询算法(Dijkstra、BFS、DFS、TSP)</li>
              <li>• 算法可视化,支持步进执行</li>
              <li>• 数据导入导出,支持本地存储</li>
            </ul>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">快速开始:</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => loadSampleData(simpleCampusMap)}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-left group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary-100 rounded-lg group-hover:bg-primary-200">
                  <BookOpen className="w-5 h-5 text-primary-600" />
                </div>
                <span className="font-semibold">简单示例</span>
              </div>
              <p className="text-sm text-gray-600">
                5个节点的简单校园地图,适合快速了解功能
              </p>
            </button>

            <button
              onClick={() => loadSampleData(complexCampusMap)}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-left group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary-100 rounded-lg group-hover:bg-primary-200">
                  <Map className="w-5 h-5 text-primary-600" />
                </div>
                <span className="font-semibold">完整示例</span>
              </div>
              <p className="text-sm text-gray-600">
                10个节点的完整校园地图,展示更多功能
              </p>
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsOpen(false)}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            从空白开始
          </button>
          <button
            onClick={() => {
              window.open('/docs/getting-started.md', '_blank')
            }}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            查看使用指南
          </button>
        </div>

        <div className="mt-4 text-center">
          <label className="inline-flex items-center text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              onChange={(e) => {
                if (e.target.checked) {
                  localStorage.setItem('dontShowWelcome', 'true')
                }
              }}
              className="mr-2 rounded"
            />
            不再显示此对话框
          </label>
        </div>
      </div>
    </div>
  )
}
