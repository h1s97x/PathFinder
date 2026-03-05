import { useCallback } from 'react'
import { useGraphStore } from '@/store/graphStore'
import { useAlgorithmStore } from '@/store/algorithmStore'
import type { Algorithm, AlgorithmStep } from '@/types/algorithm'

export function useAlgorithmExecution() {
  const { graph } = useGraphStore()
  const { setAlgorithm, isRunning } = useAlgorithmStore()

  const executeAlgorithm = useCallback(
    async <TInput, TOutput>(
      algorithm: Algorithm<TInput, TOutput>,
      input: TInput
    ): Promise<void> => {
      if (isRunning) {
        console.warn('算法正在运行中')
        return
      }

      // 设置当前算法
      setAlgorithm(algorithm)

      // 收集所有步骤
      const steps: AlgorithmStep[] = []
      const generator = algorithm.executeSteps(graph, input)

      try {
        let result = generator.next()
        while (!result.done) {
          steps.push(result.value)
          result = generator.next()
        }

        // 保存结果
        const finalResult = result.value

        // 更新 store
        useAlgorithmStore.setState({
          isRunning: true,
          isPaused: false,
          currentStep: 0,
          steps,
          result: finalResult,
        })
      } catch (error) {
        console.error('算法执行错误:', error)
        alert(`算法执行失败: ${error instanceof Error ? error.message : '未知错误'}`)
      }
    },
    [graph, isRunning, setAlgorithm]
  )

  return { executeAlgorithm }
}
