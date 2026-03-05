import type { Graph } from '@/core/graph/Graph'
import type { GraphJSON } from '@/types/graph'

const STORAGE_KEY = 'campus-navigation-graph'

export const storage = {
  // 保存到 localStorage
  save(graph: Graph): void {
    try {
      const json = graph.toJSON()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(json))
    } catch (error) {
      console.error('保存失败:', error)
      throw new Error('保存失败')
    }
  },

  // 从 localStorage 加载
  load(): GraphJSON | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (!data) return null
      return JSON.parse(data)
    } catch (error) {
      console.error('加载失败:', error)
      return null
    }
  },

  // 导出为 JSON 文件
  exportToFile(graph: Graph, filename: string = 'graph.json'): void {
    const json = graph.toJSON()
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  },

  // 从文件导入
  importFromFile(file: File): Promise<GraphJSON> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string)
          resolve(json)
        } catch (error) {
          reject(new Error('文件格式错误'))
        }
      }
      reader.onerror = () => reject(new Error('文件读取失败'))
      reader.readAsText(file)
    })
  },

  // 清除存储
  clear(): void {
    localStorage.removeItem(STORAGE_KEY)
  },
}
