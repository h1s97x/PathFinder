import { useRef, useState, useCallback } from 'react'
import { useGraphStore } from '@/store/graphStore'
import { useAlgorithmStore } from '@/store/algorithmStore'
import { useViewport } from '@/hooks/useViewport'
import NodeDragger from './NodeDragger'
import EdgeCreator from './EdgeCreator'
import NodeEditModal from '../Modal/NodeEditModal'
import EdgeEditModal from '../Modal/EdgeEditModal'
import type { Node, Edge } from '@/types/graph'

export default function Canvas() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const { graph, mode, addNode, selectedNodes, selectNode, updateNode, updateEdge, removeNode, removeEdge } = useGraphStore()
  const { isRunning, currentStep, steps } = useAlgorithmStore()
  const { viewport, zoom, pan, reset, screenToWorld } = useViewport()
  const [nextNodeId, setNextNodeId] = useState(1)
  const [editingNode, setEditingNode] = useState<Node | null>(null)
  const [editingEdge, setEditingEdge] = useState<Edge | null>(null)
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })

  // 获取当前步骤的高亮节点和边
  const getHighlightedElements = () => {
    if (!isRunning || currentStep < 0 || currentStep >= steps.length) {
      return { highlightedNodes: new Set<string>(), highlightedEdges: new Set<string>() }
    }

    const step = steps[currentStep]
    const highlightedNodes = new Set<string>(step.nodeIds || [])
    const highlightedEdges = new Set<string>(step.edgeIds || [])

    return { highlightedNodes, highlightedEdges }
  }

  const { highlightedNodes, highlightedEdges } = getHighlightedElements()

  // 处理滚轮缩放
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      const centerX = e.clientX - rect.left
      const centerY = e.clientY - rect.top
      zoom(e.deltaY, centerX, centerY)
    },
    [zoom]
  )

  // 处理画布平移
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // 中键或 Shift+左键启用平移
      if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
        setIsPanning(true)
        setPanStart({ x: e.clientX, y: e.clientY })
        e.preventDefault()
      }
    },
    []
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isPanning) return

      const dx = e.clientX - panStart.x
      const dy = e.clientY - panStart.y
      pan(dx, dy)
      setPanStart({ x: e.clientX, y: e.clientY })
    },
    [isPanning, panStart, pan]
  )

  const handleMouseUp = useCallback(() => {
    setIsPanning(false)
  }, [])

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== 'add-node' || isPanning) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const screenX = e.clientX - rect.left
    const screenY = e.clientY - rect.top
    const worldPos = screenToWorld(screenX, screenY)

    const newNode: Node = {
      id: `node-${nextNodeId}`,
      label: `节点 ${nextNodeId}`,
      description: `这是节点 ${nextNodeId}`,
      position: { x: worldPos.x, y: worldPos.y },
    }

    addNode(newNode)
    setNextNodeId(nextNodeId + 1)
  }

  const handleNodeClick = (node: Node, e: React.MouseEvent) => {
    e.stopPropagation()

    if (mode === 'view') {
      selectNode(node.id, e.shiftKey)
    } else if (mode === 'edit') {
      setEditingNode(node)
    } else if (mode === 'delete') {
      if (confirm(`确定要删除节点 "${node.label}" 吗?`)) {
        removeNode(node.id)
      }
    }
  }

  const handleEdgeClick = (edge: Edge, e: React.MouseEvent) => {
    e.stopPropagation()

    if (mode === 'edit') {
      setEditingEdge(edge)
    } else if (mode === 'delete') {
      const source = graph.getNode(edge.source)
      const target = graph.getNode(edge.target)
      if (confirm(`确定要删除从 "${source?.label}" 到 "${target?.label}" 的边吗?`)) {
        removeEdge(edge.id)
      }
    }
  }

  return (
    <div className="flex-1 relative bg-gray-50 overflow-hidden">
      <div
        ref={canvasRef}
        className="w-full h-full relative"
        onClick={handleCanvasClick}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ 
          cursor: isPanning 
            ? 'grabbing' 
            : mode === 'add-node' 
            ? 'crosshair' 
            : mode === 'delete' 
            ? 'not-allowed' 
            : 'default',
          backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
          backgroundSize: `${20 * viewport.scale}px ${20 * viewport.scale}px`,
          backgroundPosition: `${viewport.offsetX}px ${viewport.offsetY}px`,
        }}
      >
        {/* 变换容器 */}
        <div
          style={{
            transform: `translate(${viewport.offsetX}px, ${viewport.offsetY}px) scale(${viewport.scale})`,
            transformOrigin: '0 0',
            width: '100%',
            height: '100%',
            position: 'absolute',
          }}
        >
          {/* SVG 层用于绘制边 */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
            {graph.getAllEdges().map((edge) => {
              const sourceNode = graph.getNode(edge.source)
              const targetNode = graph.getNode(edge.target)
              if (!sourceNode || !targetNode) return null

              const midX = (sourceNode.position.x + targetNode.position.x) / 2
              const midY = (sourceNode.position.y + targetNode.position.y) / 2
            const isHighlighted = highlightedEdges.has(edge.id)

            return (
              <g key={edge.id}>
                <line
                  x1={sourceNode.position.x}
                  y1={sourceNode.position.y}
                  x2={targetNode.position.x}
                  y2={targetNode.position.y}
                  stroke={isHighlighted ? '#10b981' : '#fbbf24'}
                  strokeWidth={isHighlighted ? '4' : '3'}
                  className={`pointer-events-auto cursor-pointer transition-all ${
                    isHighlighted ? 'drop-shadow-lg' : 'hover:stroke-amber-500'
                  }`}
                  onClick={(e) => handleEdgeClick(edge, e as any)}
                />
                {/* 边权重背景 */}
                <rect
                  x={midX - 20}
                  y={midY - 12}
                  width="40"
                  height="24"
                  fill="white"
                  stroke={isHighlighted ? '#10b981' : '#fbbf24'}
                  strokeWidth={isHighlighted ? '2' : '1'}
                  rx="4"
                  className="pointer-events-auto cursor-pointer"
                  onClick={(e) => handleEdgeClick(edge, e as any)}
                />
                {/* 边权重文字 */}
                <text
                  x={midX}
                  y={midY}
                  fill={isHighlighted ? '#059669' : '#f59e0b'}
                  fontSize="14"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="pointer-events-auto cursor-pointer select-none"
                  onClick={(e) => handleEdgeClick(edge, e as any)}
                >
                  {edge.weight}
                </text>
              </g>
            )
          })}
        </svg>

        {/* 节点层 */}
        {graph.getAllNodes().map((node) => {
          const isHighlighted = highlightedNodes.has(node.id)
          const isSelected = selectedNodes.has(node.id)
          
          return (
            <NodeDragger key={node.id} nodeId={node.id}>
              <div
                className={`absolute w-12 h-12 rounded-full flex items-center justify-center font-bold text-white cursor-pointer transition-all ${
                  isHighlighted
                    ? 'bg-green-500 scale-125 shadow-xl ring-4 ring-green-300 animate-pulse'
                    : isSelected
                    ? 'bg-red-500 scale-110 shadow-lg ring-4 ring-red-200'
                    : 'bg-blue-500 hover:bg-blue-600 hover:scale-105'
                }`}
                style={{
                  left: node.position.x - 24,
                  top: node.position.y - 24,
                }}
                onClick={(e) => handleNodeClick(node, e)}
                title={`${node.label}\n${node.description}`}
              >
                {node.id.replace('node-', '')}
              </div>
              {/* 节点标签 */}
              <div
                className={`absolute text-xs font-medium px-2 py-1 rounded shadow-sm whitespace-nowrap pointer-events-none ${
                  isHighlighted
                    ? 'bg-green-100 text-green-800 font-bold'
                    : 'bg-white text-gray-700'
                }`}
                style={{
                  left: node.position.x - 50,
                  top: node.position.y + 30,
                  maxWidth: '100px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {node.label}
              </div>
            </NodeDragger>
          )
        })}

        {/* 边创建器 */}
        <EdgeCreator isActive={mode === 'add-edge'} />

        {/* 提示信息 */}
        {graph.getAllNodes().length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-gray-400">
              <p className="text-lg mb-2">欢迎使用校园导航系统</p>
              <p className="text-sm">
                {mode === 'add-node'
                  ? '点击画布添加节点'
                  : '点击工具栏的 "+" 按钮开始添加节点'}
              </p>
            </div>
          </div>
        )}
        </div>

        {/* 缩放控制按钮 */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2 bg-white rounded-lg shadow-md p-2">
          <button
            onClick={() => zoom(-500)}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="放大 (滚轮向上)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <div className="text-xs text-center text-gray-600 px-2">
            {Math.round(viewport.scale * 100)}%
          </div>
          <button
            onClick={() => zoom(500)}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="缩小 (滚轮向下)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <button
            onClick={reset}
            className="p-2 hover:bg-gray-100 rounded transition-colors border-t border-gray-200"
            title="重置视图"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* 模式提示 */}
        <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md text-sm text-gray-600 pointer-events-none">
          {mode === 'view' && '查看模式 - Shift+拖拽平移画布, 滚轮缩放'}
          {mode === 'add-node' && '添加节点 - 点击画布添加新节点'}
          {mode === 'add-edge' && '添加边 - 依次点击两个节点创建连接'}
          {mode === 'edit' && '编辑模式 - 点击节点或边进行编辑'}
          {mode === 'delete' && '删除模式 - 点击节点或边进行删除'}
        </div>
      </div>

      {/* 编辑弹窗 */}
      <NodeEditModal
        node={editingNode}
        isOpen={!!editingNode}
        onClose={() => setEditingNode(null)}
        onSave={(node) => {
          updateNode(node.id, node)
          setEditingNode(null)
        }}
      />

      <EdgeEditModal
        edge={editingEdge}
        isOpen={!!editingEdge}
        onClose={() => setEditingEdge(null)}
        onSave={(edge) => {
          updateEdge(edge.id, edge)
          setEditingEdge(null)
        }}
      />
    </div>
  )
}
