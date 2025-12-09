import React, { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface SensitivityState {
  dpi: number
  sensitivity: number
  eDPI: number
  autoAdjustment: boolean
  gameMode: 'valorant' | 'cs'
}

interface SensitivityContextType {
  state: SensitivityState
  updateDPI: (dpi: number) => void
  updateSensitivity: (sensitivity: number) => void
  toggleAutoAdjustment: () => void
  adjustSensitivityByOffset: (offset: { x: number; y: number }) => void
  updateGameMode: (gameMode: 'valorant' | 'cs') => void
}

const SensitivityContext = createContext<SensitivityContextType | undefined>(undefined)

interface SensitivityProviderProps {
  children: ReactNode
}

export const SensitivityProvider: React.FC<SensitivityProviderProps> = ({ children }) => {
  const [state, setState] = useState<SensitivityState>({
    dpi: 800,
    sensitivity: 0.4,
    eDPI: 320,
    autoAdjustment: false,
    gameMode: 'valorant'
  })

  const updateDPI = (dpi: number) => {
    setState(prev => ({
      ...prev,
      dpi,
      eDPI: dpi * prev.sensitivity
    }))
  }

  const updateSensitivity = (sensitivity: number) => {
    setState(prev => ({
      ...prev,
      sensitivity,
      eDPI: prev.dpi * sensitivity
    }))
  }

  const toggleAutoAdjustment = () => {
    setState(prev => ({
      ...prev,
      autoAdjustment: !prev.autoAdjustment
    }))
  }

  const adjustSensitivityByOffset = (offset: { x: number; y: number }) => {
    if (!state.autoAdjustment) return
    
    // Calculate adjustment based on offset from target center
    const maxOffset = Math.sqrt(offset.x * offset.x + offset.y * offset.y)
    const adjustment = Math.max(-0.05, Math.min(0.05, maxOffset * 0.001))
    
    const newSensitivity = Math.max(0.1, Math.min(2.0, state.sensitivity - adjustment))
    updateSensitivity(newSensitivity)
  }

  const updateGameMode = (gameMode: 'valorant' | 'cs') => {
    if (gameMode === state.gameMode) return
    
    let newSensitivity = state.sensitivity
    
    // Convert sensitivity between games
    if (state.gameMode === 'valorant' && gameMode === 'cs') {
      // Valorant to CS: multiply by 3.181818
      newSensitivity = state.sensitivity * 3.181818
    } else if (state.gameMode === 'cs' && gameMode === 'valorant') {
      // CS to Valorant: divide by 3.181818
      newSensitivity = state.sensitivity / 3.181818
    }
    
    setState(prev => ({
      ...prev,
      gameMode,
      sensitivity: Math.round(newSensitivity * 1000) / 1000, // Round to 3 decimals
      eDPI: prev.dpi * newSensitivity
    }))
  }

  const value: SensitivityContextType = {
    state,
    updateDPI,
    updateSensitivity,
    toggleAutoAdjustment,
    adjustSensitivityByOffset,
    updateGameMode
  }

  return (
    <SensitivityContext.Provider value={value}>
      {children}
    </SensitivityContext.Provider>
  )
}

export const useSensitivity = (): SensitivityContextType => {
  const context = useContext(SensitivityContext)
  if (context === undefined) {
    throw new Error('useSensitivity must be used within a SensitivityProvider')
  }
  return context
}