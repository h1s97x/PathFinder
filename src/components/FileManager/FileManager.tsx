import { useRef } from 'react'
import { Download, Upload, FileJson } from 'lucide-react'
import { useGraphStore } from '@/store/graphStore'
import { storage } from '@/utils/storage'
import { Graph } from '@/core/graph/Graph'

export default function FileManager() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { graph, setGraph } = useGraphStore()

  const handleExport = () => {
    const filename = `campus-map-${new Date().toISOString().split('T')[0]}.json`
    storage.exportToFile(graph, filename)
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const json = await storage.importFromFile(file)
      const newGraph = Graph.fromJSON(json)
      
      // 验证图数据
      const validation = newGraph.validate()
      if (!validation.valid) {
        alert(`导入失败:\n${validation.errors.join('\n')}`)
        return
      }

      if (validation.warnings.length > 0) {
        const proceed = confirm(
          `导入警告:\n${validation.warnings.join('\n')}\n\n是否继续?`
        )
        if (!proceed) return
      }

      setGraph(newGraph)
      storage.save(newGraph)
      alert('导入成功!')
    } catch (error) {
      alert(`导入失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }

    // 重置文件输入
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSave = () => {
    try {
      storage.save(graph)
      alert('保存成功!')
    } catch (error) {
      alert(`保存失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  return (
    <div className="flex gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        title="导入文件"
      >
        <Upload className="w-4 h-4" />
        导入
      </button>

      <button
        onClick={handleExport}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        title="导出文件"
      >
        <Download className="w-4 h-4" />
        导出
      </button>

      <button
        onClick={handleSave}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        title="保存到本地存储"
      >
        <FileJson className="w-4 h-4" />
        保存
      </button>
    </div>
  )
}
