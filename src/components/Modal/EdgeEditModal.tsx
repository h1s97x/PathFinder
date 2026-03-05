import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import type { Edge } from '@/types/graph'

interface EdgeEditModalProps {
  edge: Edge | null
  isOpen: boolean
  onClose: () => void
  onSave: (edge: Edge) => void
}

export default function EdgeEditModal({ edge, isOpen, onClose, onSave }: EdgeEditModalProps) {
  const [weight, setWeight] = useState(0)

  useEffect(() => {
    if (edge) {
      setWeight(edge.weight)
    }
  }, [edge])

  if (!isOpen || !edge) return null

  const handleSave = () => {
    if (weight <= 0) {
      alert('权重必须大于 0')
      return
    }

    onSave({
      ...edge,
      weight,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">编辑边</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">权重(距离)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value))}
              min="0"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="输入权重"
            />
          </div>

          <div className="text-sm text-gray-500">
            <p>起点: {edge.source}</p>
            <p>终点: {edge.target}</p>
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
