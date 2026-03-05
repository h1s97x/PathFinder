import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import type { Node } from '@/types/graph'

interface NodeEditModalProps {
  node: Node | null
  isOpen: boolean
  onClose: () => void
  onSave: (node: Node) => void
}

export default function NodeEditModal({ node, isOpen, onClose, onSave }: NodeEditModalProps) {
  const [label, setLabel] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (node) {
      setLabel(node.label)
      setDescription(node.description)
    }
  }, [node])

  if (!isOpen || !node) return null

  const handleSave = () => {
    onSave({
      ...node,
      label,
      description,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">编辑节点</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">节点名称</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="输入节点名称"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">节点描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="输入节点描述"
            />
          </div>

          <div className="text-sm text-gray-500">
            <p>ID: {node.id}</p>
            <p>
              位置: ({Math.round(node.position.x)}, {Math.round(node.position.y)})
            </p>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  )
}
