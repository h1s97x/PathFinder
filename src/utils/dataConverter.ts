import type { GraphJSON, Node, Edge } from '@/types/graph'

// 转换旧版本 .dat 格式到新的 JSON 格式
export function convertDatToJSON(datContent: string): GraphJSON {
  const lines = datContent.split('\n').filter((line) => line.trim())
  let index = 0

  // 读取节点数量
  const nodeCount = parseInt(lines[index++])
  const nodes: Node[] = []

  // 读取节点
  for (let i = 0; i < nodeCount; i++) {
    const [x, y, idx] = lines[index++].split(' ').map(Number)
    const name = lines[index++]
    const description = lines[index++]

    nodes.push({
      id: `node-${idx}`,
      label: name || `节点 ${idx}`,
      description: description || '',
      position: { x, y },
      metadata: { originalId: idx },
    })
  }

  // 读取边数量
  const edgeCount = parseInt(lines[index++])
  const edges: Edge[] = []

  // 读取边
  for (let i = 0; i < edgeCount; i++) {
    const [a, b, w] = lines[index++].split(' ').map(Number)

    edges.push({
      id: `edge-${a}-${b}`,
      source: `node-${a}`,
      target: `node-${b}`,
      weight: w,
    })
  }

  return { nodes, edges }
}

// 导出为 CSV 格式
export function exportToCSV(graph: GraphJSON): string {
  let csv = 'Nodes\n'
  csv += 'ID,Label,Description,X,Y\n'

  for (const node of graph.nodes) {
    csv += `${node.id},"${node.label}","${node.description}",${node.position.x},${node.position.y}\n`
  }

  csv += '\nEdges\n'
  csv += 'ID,Source,Target,Weight\n'

  for (const edge of graph.edges) {
    csv += `${edge.id},${edge.source},${edge.target},${edge.weight}\n`
  }

  return csv
}

// 从 CSV 导入
export function importFromCSV(csvContent: string): GraphJSON {
  const lines = csvContent.split('\n').filter((line) => line.trim())
  const nodes: Node[] = []
  const edges: Edge[] = []

  let section: 'nodes' | 'edges' | null = null
  let skipHeader = false

  for (const line of lines) {
    if (line === 'Nodes') {
      section = 'nodes'
      skipHeader = true
      continue
    }
    if (line === 'Edges') {
      section = 'edges'
      skipHeader = true
      continue
    }

    if (skipHeader) {
      skipHeader = false
      continue
    }

    if (section === 'nodes') {
      const match = line.match(/^([^,]+),"([^"]+)","([^"]+)",([^,]+),([^,]+)$/)
      if (match) {
        const [, id, label, description, x, y] = match
        nodes.push({
          id,
          label,
          description,
          position: { x: parseFloat(x), y: parseFloat(y) },
        })
      }
    } else if (section === 'edges') {
      const [id, source, target, weight] = line.split(',')
      edges.push({
        id,
        source,
        target,
        weight: parseFloat(weight),
      })
    }
  }

  return { nodes, edges }
}
