import type { GraphJSON } from '@/types/graph'

export const simpleCampusMap: GraphJSON = {
  nodes: [
    {
      id: 'node-1',
      label: '图书馆',
      description: '学校图书馆,藏书丰富',
      position: { x: 100, y: 100 },
    },
    {
      id: 'node-2',
      label: '教学楼',
      description: '主教学楼',
      position: { x: 300, y: 100 },
    },
    {
      id: 'node-3',
      label: '食堂',
      description: '学生食堂',
      position: { x: 200, y: 250 },
    },
    {
      id: 'node-4',
      label: '宿舍',
      description: '学生宿舍',
      position: { x: 400, y: 250 },
    },
    {
      id: 'node-5',
      label: '操场',
      description: '运动场',
      position: { x: 250, y: 400 },
    },
  ],
  edges: [
    { id: 'edge-1-2', source: 'node-1', target: 'node-2', weight: 200 },
    { id: 'edge-1-3', source: 'node-1', target: 'node-3', weight: 180 },
    { id: 'edge-2-3', source: 'node-2', target: 'node-3', weight: 150 },
    { id: 'edge-2-4', source: 'node-2', target: 'node-4', weight: 180 },
    { id: 'edge-3-4', source: 'node-3', target: 'node-4', weight: 220 },
    { id: 'edge-3-5', source: 'node-3', target: 'node-5', weight: 160 },
    { id: 'edge-4-5', source: 'node-4', target: 'node-5', weight: 200 },
  ],
}

export const complexCampusMap: GraphJSON = {
  nodes: [
    { id: 'node-1', label: '南门', description: '学校南门入口', position: { x: 300, y: 50 } },
    { id: 'node-2', label: '北门', description: '学校北门入口', position: { x: 300, y: 550 } },
    { id: 'node-3', label: '图书馆', description: '中央图书馆', position: { x: 150, y: 150 } },
    { id: 'node-4', label: '教学楼A', description: '理工科教学楼', position: { x: 450, y: 150 } },
    { id: 'node-5', label: '教学楼B', description: '文科教学楼', position: { x: 300, y: 250 } },
    { id: 'node-6', label: '实验楼', description: '科研实验楼', position: { x: 150, y: 350 } },
    { id: 'node-7', label: '食堂', description: '学生食堂', position: { x: 450, y: 350 } },
    { id: 'node-8', label: '宿舍区', description: '学生宿舍', position: { x: 100, y: 450 } },
    { id: 'node-9', label: '体育馆', description: '综合体育馆', position: { x: 500, y: 450 } },
    { id: 'node-10', label: '行政楼', description: '行政办公楼', position: { x: 300, y: 400 } },
  ],
  edges: [
    { id: 'edge-1-3', source: 'node-1', target: 'node-3', weight: 150 },
    { id: 'edge-1-4', source: 'node-1', target: 'node-4', weight: 180 },
    { id: 'edge-1-5', source: 'node-1', target: 'node-5', weight: 200 },
    { id: 'edge-3-5', source: 'node-3', target: 'node-5', weight: 180 },
    { id: 'edge-3-6', source: 'node-3', target: 'node-6', weight: 220 },
    { id: 'edge-4-5', source: 'node-4', target: 'node-5', weight: 180 },
    { id: 'edge-4-7', source: 'node-4', target: 'node-7', weight: 220 },
    { id: 'edge-5-6', source: 'node-5', target: 'node-6', weight: 180 },
    { id: 'edge-5-7', source: 'node-5', target: 'node-7', weight: 180 },
    { id: 'edge-5-10', source: 'node-5', target: 'node-10', weight: 160 },
    { id: 'edge-6-8', source: 'node-6', target: 'node-8', weight: 150 },
    { id: 'edge-6-10', source: 'node-6', target: 'node-10', weight: 120 },
    { id: 'edge-7-9', source: 'node-7', target: 'node-9', weight: 150 },
    { id: 'edge-7-10', source: 'node-7', target: 'node-10', weight: 120 },
    { id: 'edge-8-10', source: 'node-8', target: 'node-10', weight: 220 },
    { id: 'edge-8-2', source: 'node-8', target: 'node-2', weight: 180 },
    { id: 'edge-9-10', source: 'node-9', target: 'node-10', weight: 220 },
    { id: 'edge-9-2', source: 'node-9', target: 'node-2', weight: 180 },
    { id: 'edge-10-2', source: 'node-10', target: 'node-2', weight: 160 },
  ],
}
