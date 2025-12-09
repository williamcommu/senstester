import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import SensitivityControls from './components/SensitivityControls'
import TrainingGround from './components/TrainingGround'
import DPICalibration from './components/DPICalibration'
import { SensitivityProvider, useSensitivity } from './hooks/useSensitivity'
import './App.css'

// Accuracy Display Component
const AccuracyDisplay: React.FC<{ totalClicks: number; successfulHits: number }> = ({ totalClicks, successfulHits }) => {
  const accuracy = totalClicks > 0 ? Math.round((successfulHits / totalClicks) * 100) : 0
  
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '20px',
      color: '#00ff88',
      fontFamily: 'monospace',
      fontSize: '16px',
      fontWeight: 'bold',
      zIndex: 1000,
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
      pointerEvents: 'none'
    }}>
      <div>Clicks: {totalClicks}</div>
      <div>Hits: {successfulHits}</div>
      <div>Accuracy: {accuracy}%</div>
    </div>
  )
}

// Game Mode Aware Canvas Component
const GameModeAwareCanvas: React.FC<{ onStatsUpdate: (clicks: number, hits: number) => void }> = ({ onStatsUpdate }) => {
  const { state } = useSensitivity()
  const fov = state.gameMode === 'valorant' ? 103 : 90
  
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov }}
      style={{ width: '100%', height: '100vh' }}
    >
      <TrainingGround onStatsUpdate={onStatsUpdate} />
    </Canvas>
  )
}

function App() {
  const [showDPICalibration, setShowDPICalibration] = useState(false)
  const [totalClicks, setTotalClicks] = useState(0)
  const [successfulHits, setSuccessfulHits] = useState(0)

  const handleStatsUpdate = (clicks: number, hits: number) => {
    setTotalClicks(clicks)
    setSuccessfulHits(hits)
  }

  return (
    <SensitivityProvider>
      <div className="app">
        {showDPICalibration && (
          <DPICalibration onClose={() => setShowDPICalibration(false)} />
        )}
        
        <AccuracyDisplay totalClicks={totalClicks} successfulHits={successfulHits} />
        
        <div className="game-container">
          <div className="crosshair">
            <div className="crosshair-dot" />
          </div>
          <GameModeAwareCanvas onStatsUpdate={handleStatsUpdate} />
        </div>
        
        <SensitivityControls onOpenDPICalibration={() => setShowDPICalibration(true)} />
      </div>
    </SensitivityProvider>
  )
}

export default App
