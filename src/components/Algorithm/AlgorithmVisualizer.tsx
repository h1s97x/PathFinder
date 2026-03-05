import { useEffect, useState } from 'react'
import { Play, Pause, SkipForward, RotateCcw, FastForward } from 'lucide-react'
import { useAlgorithmStore } from '@/store/algorithmStore'

export default function AlgorithmVisualizer() {
  const {
    isRunning,
    isPaused,
    currentStep,
    steps,
    result,
    speed,
    pause,
    resume,
    stop,
    nextStep,
    previousStep,
    setSpeed,
  } = useAlgorithmStore()

  const [autoPlay, setAutoPlay] = useState(false)

  // 自动播放逻辑
  useEffect(() => {
    if (!isRunning || isPaused || !autoPlay) return

    const interval = setInterval(() => {
      if (currentStep < steps.length - 1) {
        nextStep()
      } else {
        setAutoPlay(false)
      }
    }, 1000 / speed)

    return () => clearInterval(interval)
  }, [isRunning, isPaused, autoPlay, currentStep, steps.length, speed, nextStep])

  if (!isRunning) return null

  const currentStepData = steps[currentStep]
  const progress = steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 w-[600px] z-40">
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">算法可视化</h3>
        <button
          onClick={stop}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          title="关闭"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* 进度条 */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>
            步骤: {currentStep + 1} / {steps.length}
          </span>
          <span>{progress.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 当前步骤信息 */}
      {currentStepData && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2" />
            <div className="flex-1">
              <div className="text-sm font-medium text-blue-900 mb-1">
                {currentStepData.type === 'visit' && '访问节点'}
                {currentStepData.type === 'compare' && '比较节点'}
                {currentStepData.type === 'update' && '更新距离'}
                {currentStepData.type === 'complete' && '完成'}
              </div>
              <div className="text-sm text-blue-800">{currentStepData.message}</div>
              {currentStepData.nodeIds && currentStepData.nodeIds.length > 0 && (
                <div className="text-xs text-blue-600 mt-1">
                  节点: {currentStepData.nodeIds.join(', ')}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 结果展示 */}
      {result && currentStep === steps.length - 1 && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="text-sm font-medium text-green-900 mb-1">执行结果</div>
          <div className="text-sm text-green-800">
            {result.path && (
              <div>路径: {result.path.join(' → ')}</div>
            )}
            {result.totalDistance !== undefined && (
              <div>总距离: {result.totalDistance}</div>
            )}
            {result.visitOrder && (
              <div>访问顺序: {result.visitOrder.join(', ')}</div>
            )}
          </div>
        </div>
      )}

      {/* 控制按钮 */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={previousStep}
          disabled={currentStep <= 0}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="上一步"
        >
          <SkipForward className="w-4 h-4 rotate-180" />
        </button>

        <button
          onClick={() => {
            if (autoPlay) {
              setAutoPlay(false)
              pause()
            } else {
              setAutoPlay(true)
              resume()
            }
          }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          {autoPlay ? (
            <>
              <Pause className="w-4 h-4" />
              暂停
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              播放
            </>
          )}
        </button>

        <button
          onClick={nextStep}
          disabled={currentStep >= steps.length - 1}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="下一步"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        <button
          onClick={stop}
          className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
        >
          停止
        </button>
      </div>

      {/* 速度控制 */}
      <div className="flex items-center gap-3">
        <FastForward className="w-4 h-4 text-gray-600" />
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.5"
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          className="flex-1"
        />
        <span className="text-sm text-gray-600 w-12">{speed}x</span>
      </div>
    </div>
  )
}
