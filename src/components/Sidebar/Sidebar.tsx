import { useState } from 'react'
import { useGraphStore } from '@/store/graphStore'
import { MapPin, Route, Settings, Info, BarChart3 } from 'lucide-react'
import AlgorithmPanel from '../Algorithm/AlgorithmPanel'
import PathInfoPanel from '../PathInfo/PathInfoPanel'
import AlgorithmComparison from '../PathInfo/AlgorithmComparison'

type Tab = 'nodes' | 'algorithms' | 'pathInfo' | 'comparison' | 'settings'

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState<Tab>('nodes')
  const { graph, selectNode } = useGraphStore()

  const tabs = [
    { id: 'nodes' as Tab, icon: MapPin, label: '节点' },
    { id: 'algorithms' as Tab, icon: Route, label: '算法' },
    { id: 'pathInfo' as Tab, icon: Info, label: '路径信息' },
    { id: 'comparison' as Tab, icon: BarChart3, label: '算法对比' },
    { id: 'settings' as Tab, icon: Settings, label: '设置' },
  ]

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* 标签页 */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 transition-colors ${
                activeTab === tab.id
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'nodes' && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              节点列表 ({graph.getAllNodes().length})
            </h3>
            <div className="space-y-2">
              {graph.getAllNodes().length === 0 ? (
                <p className="text-sm text-gray-500">暂无节点</p>
              ) : (
                graph.getAllNodes().map((node) => (
                  <div
                    key={node.id}
                    onClick={() => selectNode(node.id)}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <div className="font-medium text-sm">{node.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{node.description}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      位置: ({Math.round(node.position.x)}, {Math.round(node.position.y)})
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'algorithms' && <AlgorithmPanel />}

        {activeTab === 'pathInfo' && <PathInfoPanel />}

        {activeTab === 'comparison' && <AlgorithmComparison />}

        {activeTab === 'settings' && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">设置</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 block mb-2">动画速度</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  defaultValue="1"
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>慢</span>
                  <span>快</span>
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded" />
                  显示节点标签
                </label>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded" />
                  显示边权重
                </label>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded" />
                  自动保存
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
