import { useState, useEffect } from 'react'
import Toolbar from './components/Toolbar/Toolbar'
import Sidebar from './components/Sidebar/Sidebar'
import Canvas from './components/Canvas/Canvas'
import StatusBar from './components/StatusBar/StatusBar'
import WelcomeDialog from './components/WelcomeDialog/WelcomeDialog'
import AlgorithmVisualizer from './components/Algorithm/AlgorithmVisualizer'
import { useGraphStore } from './store/graphStore'
import { useKeyboard } from './hooks/useKeyboard'
import { storage } from './utils/storage'
import { Graph } from './core/graph/Graph'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { setGraph, setMode, undo, redo } = useGraphStore()

  // 加载保存的数据
  useEffect(() => {
    const savedData = storage.load()
    if (savedData) {
      const graph = Graph.fromJSON(savedData)
      setGraph(graph, false) // 不记录历史
    }
  }, [setGraph])

  // 键盘快捷键
  useKeyboard({
    'ctrl+s': () => {
      const { graph } = useGraphStore.getState()
      storage.save(graph)
      alert('保存成功')
    },
    'meta+s': () => {
      const { graph } = useGraphStore.getState()
      storage.save(graph)
      alert('保存成功')
    },
    'ctrl+z': () => {
      undo()
    },
    'meta+z': () => {
      undo()
    },
    'ctrl+shift+z': () => {
      redo()
    },
    'meta+shift+z': () => {
      redo()
    },
    'ctrl+y': () => {
      redo()
    },
    space: () => setMode('view'),
    n: () => setMode('add-node'),
    e: () => setMode('add-edge'),
    delete: () => {
      const { selectedNodes, selectedEdges, removeNode, removeEdge } = useGraphStore.getState()
      selectedNodes.forEach((nodeId) => removeNode(nodeId))
      selectedEdges.forEach((edgeId) => removeEdge(edgeId))
    },
  })

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* 欢迎对话框 */}
      <WelcomeDialog />

      {/* 工具栏 */}
      <Toolbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* 主内容区 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 侧边栏 */}
        {sidebarOpen && <Sidebar />}

        {/* 画布 */}
        <Canvas />
      </div>

      {/* 状态栏 */}
      <StatusBar />

      {/* 算法可视化器 */}
      <AlgorithmVisualizer />
    </div>
  )
}

export default App
