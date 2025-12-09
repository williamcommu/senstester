# Valorant Sensitivity Tester

A 3D web application for testing and calibrating mouse sensitivity settings for Valorant, built with React, TypeScript, and Three.js.

## Features

- **3D Training Ground**: Valorant-style environment with interactive targets
- **Real-time Sensitivity Adjustment**: Live sensitivity slider with immediate feedback  
- **DPI Calibration**: Built-in tool to measure your mouse DPI
- **Auto-adjustment**: AI-assisted sensitivity tuning based on aim accuracy
- **Professional Settings**: Compare with pro player averages (320 eDPI recommended)
- **Mouse Lock**: First-person shooter controls with pointer lock API

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Modern web browser with WebGL support

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd senstester
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## How to Use

1. **Initial Setup**: 
   - Enter your current DPI or use the calibration tool
   - Set your current in-game sensitivity

2. **DPI Calibration** (if needed):
   - Click "Calibrate" button
   - Use a ruler to measure mouse movement distance
   - Follow the on-screen instructions

3. **Training**:
   - Click on the 3D scene to lock your mouse cursor
   - Aim and click on the red targets
   - Adjust sensitivity using the right-side control panel

4. **Optimization**:
   - Enable auto-adjustment for AI-assisted tuning
   - Compare your settings with pro recommendations
   - Fine-tune until you find your perfect sensitivity

## Technical Stack

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **Three.js**: 3D graphics and WebGL rendering  
- **React Three Fiber**: React renderer for Three.js
- **React Three Drei**: Useful helpers for React Three Fiber
- **Vite**: Fast build tool and development server

## Project Structure

```
src/
├── components/
│   ├── TrainingGround.tsx    # 3D scene and targets
│   ├── SensitivityControls.tsx # Settings panel
│   └── DPICalibration.tsx    # DPI measurement tool
├── hooks/
│   ├── useSensitivity.tsx    # Sensitivity state management
│   └── useMouseTracking.tsx  # Mouse movement tracking
├── utils/
│   └── sensitivityCalculations.ts # Helper functions
└── App.tsx                   # Main application component
```

## Sensitivity Recommendations

- **Pro Average**: 320 eDPI (0.4 sensitivity @ 800 DPI)
- **Low Sensitivity**: 200-300 eDPI (better for precision)
- **Medium Sensitivity**: 300-400 eDPI (balanced)
- **High Sensitivity**: 400+ eDPI (better for quick movements)

## Browser Support

- Chrome/Chromium 88+
- Firefox 85+  
- Safari 14+
- Edge 88+

Requires WebGL support and pointer lock API.