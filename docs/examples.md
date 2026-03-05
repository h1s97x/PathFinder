# 示例数据

## 示例 1: 简单校园地图

```json
{
  "nodes": [
    {
      "id": "node-1",
      "label": "图书馆",
      "description": "学校图书馆,藏书丰富",
      "position": { "x": 100, "y": 100 }
    },
    {
      "id": "node-2",
      "label": "教学楼",
      "description": "主教学楼",
      "position": { "x": 300, "y": 100 }
    },
    {
      "id": "node-3",
      "label": "食堂",
      "description": "学生食堂",
      "position": { "x": 200, "y": 250 }
    },
    {
      "id": "node-4",
      "label": "宿舍",
      "description": "学生宿舍",
      "position": { "x": 400, "y": 250 }
    },
    {
      "id": "node-5",
      "label": "操场",
      "description": "运动场",
      "position": { "x": 250, "y": 400 }
    }
  ],
  "edges": [
    {
      "id": "edge-1-2",
      "source": "node-1",
      "target": "node-2",
      "weight": 200
    },
    {
      "id": "edge-1-3",
      "source": "node-1",
      "target": "node-3",
      "weight": 180
    },
    {
      "id": "edge-2-3",
      "source": "node-2",
      "target": "node-3",
      "weight": 150
    },
    {
      "id": "edge-2-4",
      "source": "node-2",
      "target": "node-4",
      "weight": 180
    },
    {
      "id": "edge-3-4",
      "source": "node-3",
      "target": "node-4",
      "weight": 220
    },
    {
      "id": "edge-3-5",
      "source": "node-3",
      "target": "node-5",
      "weight": 160
    },
    {
      "id": "edge-4-5",
      "source": "node-4",
      "target": "node-5",
      "weight": 200
    }
  ]
}
```

## 示例 2: 复杂校园地图

包含更多节点和路径的完整校园地图示例。

```json
{
  "nodes": [
    { "id": "node-1", "label": "南门", "description": "学校南门入口", "position": { "x": 300, "y": 50 } },
    { "id": "node-2", "label": "北门", "description": "学校北门入口", "position": { "x": 300, "y": 550 } },
    { "id": "node-3", "label": "图书馆", "description": "中央图书馆", "position": { "x": 150, "y": 150 } },
    { "id": "node-4", "label": "教学楼A", "description": "理工科教学楼", "position": { "x": 450, "y": 150 } },
    { "id": "node-5", "label": "教学楼B", "description": "文科教学楼", "position": { "x": 300, "y": 250 } },
    { "id": "node-6", "label": "实验楼", "description": "科研实验楼", "position": { "x": 150, "y": 350 } },
    { "id": "node-7", "label": "食堂", "description": "学生食堂", "position": { "x": 450, "y": 350 } },
    { "id": "node-8", "label": "宿舍区", "description": "学生宿舍", "position": { "x": 100, "y": 450 } },
    { "id": "node-9", "label": "体育馆", "description": "综合体育馆", "position": { "x": 500, "y": 450 } },
    { "id": "node-10", "label": "行政楼", "description": "行政办公楼", "position": { "x": 300, "y": 400 } }
  ],
  "edges": [
    { "id": "edge-1-3", "source": "node-1", "target": "node-3", "weight": 150 },
    { "id": "edge-1-4", "source": "node-1", "target": "node-4", "weight": 180 },
    { "id": "edge-1-5", "source": "node-1", "target": "node-5", "weight": 200 },
    { "id": "edge-3-5", "source": "node-3", "target": "node-5", "weight": 180 },
    { "id": "edge-3-6", "source": "node-3", "target": "node-6", "weight": 220 },
    { "id": "edge-4-5", "source": "node-4", "target": "node-5", "weight": 180 },
    { "id": "edge-4-7", "source": "node-4", "target": "node-7", "weight": 220 },
    { "id": "edge-5-6", "source": "node-5", "target": "node-6", "weight": 180 },
    { "id": "edge-5-7", "source": "node-5", "target": "node-7", "weight": 180 },
    { "id": "edge-5-10", "source": "node-5", "target": "node-10", "weight": 160 },
    { "id": "edge-6-8", "source": "node-6", "target": "node-8", "weight": 150 },
    { "id": "edge-6-10", "source": "node-6", "target": "node-10", "weight": 120 },
    { "id": "edge-7-9", "source": "node-7", "target": "node-9", "weight": 150 },
    { "id": "edge-7-10", "source": "node-7", "target": "node-10", "weight": 120 },
    { "id": "edge-8-10", "source": "node-8", "target": "node-10", "weight": 220 },
    { "id": "edge-8-2", "source": "node-8", "target": "node-2", "weight": 180 },
    { "id": "edge-9-10", "source": "node-9", "target": "node-10", "weight": 220 },
    { "id": "edge-9-2", "source": "node-9", "target": "node-2", "weight": 180 },
    { "id": "edge-10-2", "source": "node-10", "target": "node-2", "weight": 160 }
  ]
}
```

## 使用方法

1. 复制上面的 JSON 数据
2. 在应用中点击"打开文件"按钮
3. 创建一个新的 .json 文件并粘贴数据
4. 选择该文件导入

或者直接在浏览器控制台中运行:

```javascript
const exampleData = { /* 粘贴上面的 JSON */ };
const graph = Graph.fromJSON(exampleData);
useGraphStore.getState().setGraph(graph);
```

## 测试场景

### 场景 1: 最短路径查询
- 起点: 南门
- 终点: 北门
- 算法: Dijkstra
- 预期: 找到最短路径并显示总距离

### 场景 2: 遍历所有节点
- 起点: 图书馆
- 算法: BFS 或 DFS
- 预期: 按顺序访问所有可达节点

### 场景 3: 旅行商问题
- 节点: 图书馆、教学楼、食堂、宿舍
- 算法: Held-Karp
- 预期: 找到访问所有节点的最短路径
