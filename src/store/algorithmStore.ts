import { create } from 'zustand'
import type { Algorithm, AlgorithmStep } from '@/types/algorithm'

interface AlgorithmStore {
  algorithm: Algorithm<any, any> | null
  isRunning: boolean
  isPaused: boolean
  currentStep: number
  steps: AlgorithmStep[]
  result: any
  speed: number

  setAlgorithm: (algorithm: Algorithm<any, any> | null) => void
  start: (input: any) => void
  pause: () => void
  resume: () => void
  stop: () => void
  nextStep: () => void
  previousStep: () => void
  setSpeed: (speed: number) => void
  reset: () => void
}

export const useAlgorithmStore = create<AlgorithmStore>((set, get) => ({
  algorithm: null,
  isRunning: false,
  isPaused: false,
  currentStep: -1,
  steps: [],
  result: null,
  speed: 1,

  setAlgorithm: (algorithm) => set({ algorithm }),

  start: (_input: any) => {
    const { algorithm } = get()
    if (!algorithm) return

    set({ 
      isRunning: true, 
      isPaused: false, 
      currentStep: 0, 
      steps: [], 
      result: null 
    })
  },

  pause: () => set({ isPaused: true }),

  resume: () => set({ isPaused: false }),

  stop: () =>
    set({
      isRunning: false,
      isPaused: false,
      currentStep: -1,
      steps: [],
      result: null,
    }),

  nextStep: () =>
    set((state) => {
      const nextStep = Math.min(state.currentStep + 1, state.steps.length - 1)
      return { currentStep: nextStep }
    }),

  previousStep: () =>
    set((state) => {
      const prevStep = Math.max(state.currentStep - 1, -1)
      return { currentStep: prevStep }
    }),

  setSpeed: (speed) => set({ speed }),

  reset: () =>
    set({
      algorithm: null,
      isRunning: false,
      isPaused: false,
      currentStep: -1,
      steps: [],
      result: null,
      speed: 1,
    }),
}))
