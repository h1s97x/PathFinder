import { useGraphStore } from '@/store/graphStore'
import {
  MousePointer2,
  Plus,
  Link,
  Edit,
  Trash2,
  Undo,
  Redo,
  Menu,
  Maximize2,
} from 'lucide-react'
import type { EditMode } from '@/types/graph'
import FileManager from '../FileManager/FileManager'
import SearchBar from '../SearchBar/SearchBar'
import { graphUtils } from '@/utils/graphUtils'

interface ToolbarProps {
  onToggleSidebar: () => void
}

export default function Toolbar({ onToggleSidebar }: ToolbarProps) {
  const { mode, setMode, graph, setGraph, undo, redo, canUndo, canRedo } = useGraphStore()

  const tools: Array<{ mode: EditMode; icon: any; label: string }> = [
    { mode: 'view', icon: MousePointer2, label: '选择 (Space)' },
    { mode: 'add-node', icon: Plus, label: '添加节点 (N)' },
    { mode: 'add-edge', icon: Link, label: '添加边 (E)' },
    { mode: 'edit', icon: Edit, label: '编辑' },
    { mode: 'delete', icon: Trash2, label: '删除 (Delete)' },
  ]

  const handleAutoLayout = () => {
    const nodes = graph.getAllNodes()
    const edges = graph.getAllEdges()
    
    if (nodes.length === 0) {
      alert('没有节点可以布局')
      return
    }

    const layoutedNodes = graphUtils.autoLayout(nodes, edges, 600, 450)
    const newGraph = graph.clone()
    
    layoutedNodes.forEach((node) => {
      newGraph.updateNode(node.id, { position: node.position })
    })
    
    setGraph(newGraph)
  }

  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-2">
      {/* 菜单按钮 */}
      <button
        onClick={onToggleSidebar}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        title="切换侧边栏"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="w-px h-8 bg-gray-200 mx-2" />

      {/* 工具按钮 */}
      {tools.map((tool) => {
        const Icon = tool.icon
        return (
          <button
            key={tool.mode}
            onClick={() => setMode(tool.mode)}
            className={`p-2 rounded-lg transition-colors ${
              mode === tool.mode
                ? 'bg-primary-100 text-primary-600'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title={tool.label}
          >
            <Icon className="w-5 h-5" />
          </button>
        )
      })}

      <div className="w-px h-8 bg-gray-200 mx-2" />

      {/* 历史操作 */}
      <button
        onClick={undo}
        disabled={!canUndo()}
        className={`p-2 rounded-lg transition-colors ${
          canUndo()
            ? 'hover:bg-gray-100 text-gray-600'
            : 'text-gray-300 cursor-not-allowed'
        }`}
        title="撤销 (Ctrl+Z)"
      >
        <Undo className="w-5 h-5" />
      </button>
      <button
        onClick={redo}
        disabled={!canRedo()}
        className={`p-2 rounded-lg transition-colors ${
          canRedo()
            ? 'hover:bg-gray-100 text-gray-600'
            : 'text-gray-300 cursor-not-allowed'
        }`}
        title="重做 (Ctrl+Shift+Z / Ctrl+Y)"
      >
        <Redo className="w-5 h-5" />
      </button>

      <div className="w-px h-8 bg-gray-200 mx-2" />

      {/* 自动布局 */}
      <button
        onClick={handleAutoLayout}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
        title="自动布局"
      >
        <Maximize2 className="w-5 h-5" />
      </button>

      <div className="flex-1" />

      {/* 搜索栏 */}
      <SearchBar />

      <div className="w-px h-8 bg-gray-200 mx-2" />

      {/* 文件操作 */}
      <FileManager />
    </div>
  )
}
