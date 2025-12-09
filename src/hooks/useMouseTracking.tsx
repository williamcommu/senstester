import { useState, useCallback } from 'react'

export interface MouseMovement {
  deltaX: number
  deltaY: number
  timestamp: number
}

export const useMouseTracking = () => {
  const [movements, setMovements] = useState<MouseMovement[]>([])
  const [isTracking, setIsTracking] = useState(false)
  const [startTime, setStartTime] = useState<number>(0)

  const startTracking = useCallback(() => {
    setMovements([])
    setIsTracking(true)
    setStartTime(Date.now())
  }, [])

  const stopTracking = useCallback(() => {
    setIsTracking(false)
  }, [])

  const recordMovement = useCallback((deltaX: number, deltaY: number) => {
    if (!isTracking) return
    
    const movement: MouseMovement = {
      deltaX,
      deltaY,
      timestamp: Date.now()
    }
    
    setMovements(prev => [...prev, movement])
  }, [isTracking])

  const calculateDPI = useCallback((physicalDistanceCm: number): number => {
    if (movements.length === 0) return 800 // Default fallback
    
    const totalPixelMovement = movements.reduce((sum, movement) => 
      sum + Math.sqrt(movement.deltaX * movement.deltaX + movement.deltaY * movement.deltaY), 0)
    
    // Convert cm to inches
    const physicalDistanceInches = physicalDistanceCm / 2.54
    
    // Calculate DPI
    return Math.round(totalPixelMovement / physicalDistanceInches)
  }, [movements])

  const resetTracking = useCallback(() => {
    setMovements([])
    setIsTracking(false)
    setStartTime(0)
  }, [])

  return {
    movements,
    isTracking,
    startTime,
    startTracking,
    stopTracking,
    recordMovement,
    calculateDPI,
    resetTracking
  }
}