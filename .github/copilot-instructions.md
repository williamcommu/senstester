# Valorant Sensitivity Tester

This workspace contains a React-based 3D web application for testing and calibrating mouse sensitivity settings for Valorant.

## Project Overview

- **Framework**: React 18 with TypeScript
- **3D Engine**: Three.js with React Three Fiber
- **Build Tool**: Vite
- **Purpose**: Sensitivity testing and DPI calibration for FPS gamers

## Key Components

- `TrainingGround.tsx`: 3D scene with interactive targets and camera controls
- `SensitivityControls.tsx`: Settings panel for sensitivity adjustment
- `DPICalibration.tsx`: Mouse DPI measurement tool
- `useSensitivity.tsx`: Global state management for sensitivity settings
- `useMouseTracking.tsx`: Mouse movement tracking for DPI calculation

## Development Commands

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

## Development Guidelines

- Use TypeScript for all new code
- Follow React functional component patterns
- Maintain consistent Valorant-style theming (dark backgrounds, green accents)
- Ensure Three.js components are properly typed
- Test mouse interactions and pointer lock functionality