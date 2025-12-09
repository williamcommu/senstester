import React from 'react'
import { useSensitivity } from '../hooks/useSensitivity'
import { formatSensitivity, formatEDPI, getSensitivityCategory } from '../utils/sensitivityCalculations'
import './SensitivityControls.css'

interface SensitivityControlsProps {
  onOpenDPICalibration: () => void
}

const SensitivityControls: React.FC<SensitivityControlsProps> = ({ onOpenDPICalibration }) => {
  const { state, updateDPI, updateSensitivity, toggleAutoAdjustment, updateGameMode } = useSensitivity()

  const handleSensitivityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value)
    updateSensitivity(value)
  }

  const handleDPIChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value)
    updateDPI(value)
  }

  return (
    <div className="sensitivity-controls">
      <div className="controls-header">
        <h2>Sensitivity Settings</h2>
        <div className="edpi-display">
          <span className="edpi-value">{formatEDPI(state.eDPI)}</span>
          <span className="edpi-label">eDPI</span>
          <span className="sensitivity-category">{getSensitivityCategory(state.eDPI, state.gameMode)}</span>
        </div>
      </div>

      <div className="control-group">
        <label htmlFor="dpi-input">DPI:</label>
        <div className="input-group">
          <input
            id="dpi-input"
            type="number"
            min="100"
            max="10000"
            value={state.dpi}
            onChange={handleDPIChange}
            className="dpi-input"
          />
          <button 
            className="calibrate-btn"
            onClick={onOpenDPICalibration}
          >
            Calibrate
          </button>
        </div>
      </div>

      <div className="control-group">
        <label htmlFor="sensitivity-input">Sensitivity:</label>
        <div className="input-group">
          <input
            id="sensitivity-input"
            type="number"
            min="0.1"
            max="2.0"
            step="0.001"
            value={state.sensitivity}
            onChange={handleSensitivityChange}
            className="sensitivity-input"
          />
        </div>
      </div>

      <div className="control-group">
        <label htmlFor="sensitivity-slider">Sensitivity Slider:</label>
        <div className="sensitivity-slider-container">
          <input
            id="sensitivity-slider"
            type="range"
            min="0.1"
            max="2.0"
            step="0.001"
            value={state.sensitivity}
            onChange={handleSensitivityChange}
            className="sensitivity-slider"
          />
          <div className="sensitivity-value">{formatSensitivity(state.sensitivity)}</div>
        </div>
      </div>

      <div className="control-group">
        <label htmlFor="game-mode">Game Mode:</label>
        <select
          id="game-mode"
          value={state.gameMode}
          onChange={(e) => updateGameMode(e.target.value as 'valorant' | 'cs')}
          className="game-mode-select"
        >
          <option value="valorant">Valorant (FOV: 103°)</option>
          <option value="cs">Counter-Strike (FOV: 90°)</option>
        </select>
      </div>

      <div className="control-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={state.autoAdjustment}
            onChange={toggleAutoAdjustment}
          />
          Auto-adjust based on aim accuracy
        </label>
      </div>

      <div className="recommendations">
        <h3>Recommended Settings</h3>
        <div className="recommendation-item">
          <span>Pro Average:</span>
          <span>
            {state.gameMode === 'valorant' 
              ? '320 eDPI (0.4 @ 800 DPI)' 
              : '850 eDPI (1.06 @ 800 DPI)'
            }
          </span>
        </div>
        <div className="recommendation-item">
          <span>Pro Range:</span>
          <span>
            {state.gameMode === 'valorant' 
              ? '200-400 eDPI' 
              : '600-1200 eDPI'
            }
          </span>
        </div>
        <div className="recommendation-item">
          <span>Your Setting:</span>
          <span>{formatEDPI(state.eDPI)} eDPI ({formatSensitivity(state.sensitivity)} @ {state.dpi} DPI)</span>
        </div>
      </div>

      <div className="instructions">
        <h3>Instructions</h3>
        <ul>
          <li>Click on the scene to lock your mouse cursor</li>
          <li>Use the crosshair to aim at the red targets</li>
          <li>Click to shoot targets and test your aim</li>
          <li>Adjust sensitivity with the slider for comfort</li>
          <li>Enable auto-adjustment to fine-tune based on accuracy</li>
          <li>Press ESC to exit mouse lock mode</li>
        </ul>
      </div>
    </div>
  )
}

export default SensitivityControls