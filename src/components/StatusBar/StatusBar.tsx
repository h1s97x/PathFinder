import { useGraphStore } from '@/store/graphStore'
import { useAlgorithmStore } from '@/store/algorithmStore'

export default function StatusBar() {
  const { graph, selectedNodes, selectedEdges, mode } = useGraphStore()
  const { algorithm, isRunning } = useAlgorithmStore()

  const nodeCount = graph.getAllNodes().length
  const edgeCount = graph.getAllEdges().length

  const modeText = {
    view: '查看模式',
    'add-node': '添加节点',
    'add-edge': '添加边',
    edit: '编辑模式',
    delete: '删除模式',
  }

  return (
    <div className="h-8 bg-gray-800 text-white px-4 flex items-center text-sm gap-4">
      <span>校园导航系统 v1.0.0</span>
      <span className="text-gray-400">|</span>
      <span>节点: {nodeCount}</span>
      <span>边: {edgeCount}</span>
      {selectedNodes.size > 0 && (
        <>
          <span className="text-gray-400">|</span>
          <span>已选择 {selectedNodes.size} 个节点</span>
        </>
      )}
      {selectedEdges.size > 0 && (
        <>
          <span className="text-gray-400">|</span>
          <span>已选择 {selectedEdges.size} 条边</span>
        </>
      )}
      <span className="text-gray-400">|</span>
      <span>{modeText[mode]}</span>
      {isRunning && algorithm && (
        <>
          <span className="text-gray-400">|</span>
          <span className="text-green-400">运行中: {algorithm.name}</span>
        </>
      )}
    </div>
  )
}
