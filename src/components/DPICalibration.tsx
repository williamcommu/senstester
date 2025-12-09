import React, { useState } from 'react'
import { useMouseTracking } from '../hooks/useMouseTracking'
import './DPICalibration.css'

interface DPICalibrationProps {
  onClose: () => void
}

const DPICalibration: React.FC<DPICalibrationProps> = ({ onClose }) => {
  const [step, setStep] = useState<'instructions' | 'measuring' | 'input' | 'result'>('instructions')
  const [physicalDistance, setPhysicalDistance] = useState<number>(10)
  const [calculatedDPI, setCalculatedDPI] = useState<number>(0)
  const { startTracking, stopTracking, calculateDPI, resetTracking } = useMouseTracking()

  const handleStartMeasurement = () => {
    setStep('measuring')
    startTracking()
  }

  const handleStopMeasurement = () => {
    stopTracking()
    setStep('input')
  }

  const handleCalculateDPI = () => {
    const dpi = calculateDPI(physicalDistance)
    setCalculatedDPI(dpi)
    setStep('result')
  }

  const handleReset = () => {
    resetTracking()
    setStep('instructions')
    setCalculatedDPI(0)
  }

  const handleAcceptDPI = () => {
    onClose()
  }

  return (
    <div className="dpi-calibration-overlay">
      <div className="dpi-calibration-modal">
        <div className="modal-header">
          <h2>DPI Calibration</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          {step === 'instructions' && (
            <div className="step-content">
              <h3>Instructions</h3>
              <ol>
                <li>Get a ruler or measuring tape</li>
                <li>Place it horizontally on your mousepad</li>
                <li>Note the starting position of your mouse</li>
                <li>Click "Start Measurement" below</li>
                <li>Move your mouse exactly along the ruler</li>
                <li>Click "Stop" when you reach the end</li>
                <li>Enter the distance you moved</li>
              </ol>
              <div className="step-actions">
                <button className="start-btn" onClick={handleStartMeasurement}>
                  Start Measurement
                </button>
              </div>
            </div>
          )}

          {step === 'measuring' && (
            <div className="step-content">
              <h3>Measuring...</h3>
              <div className="measuring-indicator">
                <div className="pulse-circle"></div>
                <p>Move your mouse along the ruler and click stop when done</p>
              </div>
              <div className="step-actions">
                <button className="stop-btn" onClick={handleStopMeasurement}>
                  Stop Measurement
                </button>
              </div>
            </div>
          )}

          {step === 'input' && (
            <div className="step-content">
              <h3>Physical Distance</h3>
              <p>How many centimeters did you move your mouse?</p>
              <div className="distance-input">
                <input
                  type="number"
                  min="1"
                  max="50"
                  step="0.1"
                  value={physicalDistance}
                  onChange={(e) => setPhysicalDistance(parseFloat(e.target.value))}
                  className="distance-field"
                />
                <span>cm</span>
              </div>
              <div className="step-actions">
                <button className="back-btn" onClick={handleReset}>
                  Start Over
                </button>
                <button className="calculate-btn" onClick={handleCalculateDPI}>
                  Calculate DPI
                </button>
              </div>
            </div>
          )}

          {step === 'result' && (
            <div className="step-content">
              <h3>Result</h3>
              <div className="dpi-result">
                <div className="calculated-dpi">{calculatedDPI}</div>
                <div className="dpi-label">DPI</div>
              </div>
              <p>Your calculated DPI is <strong>{calculatedDPI}</strong></p>
              <p className="result-note">
                This is an estimate. For most accurate results, repeat the measurement
                a few times and use the average.
              </p>
              <div className="step-actions">
                <button className="back-btn" onClick={handleReset}>
                  Measure Again
                </button>
                <button className="accept-btn" onClick={handleAcceptDPI}>
                  Use This DPI
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DPICalibration