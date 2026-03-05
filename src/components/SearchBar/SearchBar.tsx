import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { useGraphStore } from '@/store/graphStore'
import type { Node } from '@/types/graph'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Node[]>([])
  const [showResults, setShowResults] = useState(false)
  const { graph, selectNode } = useGraphStore()
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const allNodes = graph.getAllNodes()
    const filtered = allNodes.filter(
      (node) =>
        node.label.toLowerCase().includes(query.toLowerCase()) ||
        node.description.toLowerCase().includes(query.toLowerCase()) ||
        node.id.toLowerCase().includes(query.toLowerCase())
    )

    setResults(filtered)
    setShowResults(true)
  }, [query, graph])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as HTMLElement)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectNode = (nodeId: string) => {
    selectNode(nodeId)
    setQuery('')
    setShowResults(false)
  }

  return (
    <div ref={searchRef} className="relative w-64">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShowResults(true)}
          placeholder="搜索节点..."
          className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setResults([])
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* 搜索结果 */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto z-50">
          {results.map((node) => (
            <button
              key={node.id}
              onClick={() => handleSelectNode(node.id)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-sm">{node.label}</div>
              <div className="text-xs text-gray-500 truncate">{node.description}</div>
            </button>
          ))}
        </div>
      )}

      {/* 无结果提示 */}
      {showResults && query && results.length === 0 && (
        <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
          <p className="text-sm text-gray-500 text-center">未找到匹配的节点</p>
        </div>
      )}
    </div>
  )
}
