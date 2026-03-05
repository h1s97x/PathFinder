# API 文档

## 核心类和接口

### Graph 类

图数据结构的核心类。

```typescript
class Graph {
  constructor();
  
  // 节点操作
  addNode(node: Node): void;
  removeNode(nodeId: string): void;
  updateNode(nodeId: string, updates: Partial<Node>): void;
  getNode(nodeId: string): Node | undefined;
  getAllNodes(): Node[];
  
  // 边操作
  addEdge(edge: Edge): void;
  removeEdge(edgeId: string): void;
  updateEdge(edgeId: string, updates: Partial<Edge>): void;
  getEdge(edgeId: string): Edge | undefined;
  getAllEdges(): Edge[];
  
  // 图查询
  getNeighbors(nodeId: string): string[];
  getEdgeWeight(source: string, target: string): number | undefined;
  hasPath(source: string, target: string): boolean;
  
  // 序列化
  toJSON(): GraphJSON;
  static fromJSON(json: GraphJSON): Graph;
  
  // 验证
  validate(): ValidationResult;
  isConnected(): boolean;
}
```

### 算法接口

所有算法实现统一的接口。

```typescript
interface Algorithm<TInput, TOutput> {
  name: string;
  description: string;
  
  // 执行算法
  execute(graph: Graph, input: TInput): TOutput;
  
  // 步进执行(用于可视化)
  *executeSteps(graph: Graph, input: TInput): Generator<AlgorithmStep, TOutput>;
}

interface AlgorithmStep {
  type: 'visit' | 'compare' | 'update' | 'complete';
  nodeIds?: string[];
  edgeIds?: string[];
  message?: string;
  data?: any;
}
```

## 算法 API

### Dijkstra 最短路径

```typescript
interface DijkstraInput {
  startNodeId: string;
  endNodeId?: string;
}

interface DijkstraOutput {
  distances: Map<string, number>;
  previous: Map<string, string | null>;
  path?: string[];
  totalDistance?: number;
}

class DijkstraAlgorithm implements Algorithm<DijkstraInput, DijkstraOutput> {
  execute(graph: Graph, input: DijkstraInput): DijkstraOutput;
  *executeSteps(graph: Graph, input: DijkstraInput): Generator<AlgorithmStep, DijkstraOutput>;
}
```

### A* 搜索

```typescript
interface AStarInput {
  startNodeId: string;
  endNodeId: string;
  heuristic?: (nodeId: string, targetId: string) => number;
}

interface AStarOutput {
  path: string[];
  totalDistance: number;
  nodesExplored: number;
}

class AStarAlgorithm implements Algorithm<AStarInput, AStarOutput> {
  execute(graph: Graph, input: AStarInput): AStarOutput;
  *executeSteps(graph: Graph, input: AStarInput): Generator<AlgorithmStep, AStarOutput>;
}
```

### Held-Karp TSP

```typescript
interface HeldKarpInput {
  nodeIds: string[];
  returnToStart?: boolean;
}

interface HeldKarpOutput {
  path: string[];
  totalDistance: number;
  visitOrder: string[];
}

class HeldKarpAlgorithm implements Algorithm<HeldKarpInput, HeldKarpOutput> {
  execute(graph: Graph, input: HeldKarpInput): HeldKarpOutput;
  *executeSteps(graph: Graph, input: HeldKarpInput): Generator<AlgorithmStep, HeldKarpOutput>;
}
```

### DFS/BFS 遍历

```typescript
interface TraversalInput {
  startNodeId: string;
  endNodeId?: string;
}

interface TraversalOutput {
  visitOrder: string[];
  path?: string[];
  allPaths?: string[][];
}

class DFSAlgorithm implements Algorithm<TraversalInput, TraversalOutput> {
  execute(graph: Graph, input: TraversalInput): TraversalOutput;
  *executeSteps(graph: Graph, input: TraversalInput): Generator<AlgorithmStep, TraversalOutput>;
}

class BFSAlgorithm implements Algorithm<TraversalInput, TraversalOutput> {
  execute(graph: Graph, input: TraversalInput): TraversalOutput;
  *executeSteps(graph: Graph, input: TraversalInput): Generator<AlgorithmStep, TraversalOutput>;
}
```

## 状态管理 API

### useGraphStore

```typescript
interface GraphStore {
  // 状态
  graph: Graph;
  selectedNodes: Set<string>;
  selectedEdges: Set<string>;
  mode: EditMode;
  
  // 操作
  setGraph: (graph: Graph) => void;
  addNode: (node: Node) => void;
  removeNode: (nodeId: string) => void;
  updateNode: (nodeId: string, updates: Partial<Node>) => void;
  
  addEdge: (edge: Edge) => void;
  removeEdge: (edgeId: string) => void;
  updateEdge: (edgeId: string, updates: Partial<Edge>) => void;
  
  selectNode: (nodeId: string, multi?: boolean) => void;
  selectEdge: (edgeId: string, multi?: boolean) => void;
  clearSelection: () => void;
  
  setMode: (mode: EditMode) => void;
}

const useGraphStore = create<GraphStore>((set) => ({...}));
```

### useAlgorithmStore

```typescript
interface AlgorithmStore {
  // 状态
  algorithm: Algorithm<any, any> | null;
  isRunning: boolean;
  isPaused: boolean;
  currentStep: number;
  steps: AlgorithmStep[];
  result: any;
  
  // 操作
  setAlgorithm: (algorithm: Algorithm<any, any>) => void;
  start: (input: any) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  nextStep: () => void;
  previousStep: () => void;
  setSpeed: (speed: number) => void;
}

const useAlgorithmStore = create<AlgorithmStore>((set) => ({...}));
```

## 工具函数

### 图工具

```typescript
// 图验证
function validateGraph(graph: Graph): ValidationResult;

// 图转换
function graphToAdjacencyMatrix(graph: Graph): number[][];
function adjacencyMatrixToGraph(matrix: number[][]): Graph;

// 图分析
function getConnectedComponents(graph: Graph): string[][];
function isAcyclic(graph: Graph): boolean;
function getGraphDensity(graph: Graph): number;
```

### 路径工具

```typescript
// 路径计算
function calculatePathLength(graph: Graph, path: string[]): number;
function findAllPaths(graph: Graph, start: string, end: string): string[][];

// 路径比较
function comparePaths(paths: PathResult[]): PathComparison;
```

### 数据导入导出

```typescript
// JSON 格式
function exportToJSON(graph: Graph): string;
function importFromJSON(json: string): Graph;

// 其他格式
function exportToCSV(graph: Graph): string;
function importFromCSV(csv: string): Graph;
```

## 事件系统

```typescript
interface GraphEvents {
  'node:added': (node: Node) => void;
  'node:removed': (nodeId: string) => void;
  'node:updated': (nodeId: string, updates: Partial<Node>) => void;
  
  'edge:added': (edge: Edge) => void;
  'edge:removed': (edgeId: string) => void;
  'edge:updated': (edgeId: string, updates: Partial<Edge>) => void;
  
  'selection:changed': (selection: Selection) => void;
  'mode:changed': (mode: EditMode) => void;
}

class EventEmitter<T extends Record<string, (...args: any[]) => void>> {
  on<K extends keyof T>(event: K, handler: T[K]): void;
  off<K extends keyof T>(event: K, handler: T[K]): void;
  emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): void;
}
```
