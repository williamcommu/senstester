import React, { useRef, useState, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { useSensitivity } from '../hooks/useSensitivity'

// Particle system for explosion effects
const ParticleExplosion: React.FC<{ position: [number, number, number]; trigger: boolean }> = ({ position, trigger }) => {
  const particlesRef = useRef<THREE.Group>(null);
  const [particles, setParticles] = useState<Array<{ position: THREE.Vector3; velocity: THREE.Vector3; life: number }>>([]);

  React.useEffect(() => {
    if (trigger) {
      const newParticles = [];
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          position: new THREE.Vector3(...position),
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 5
          ),
          life: 0.8
        });
      }
      setParticles(newParticles);
    }
  }, [trigger, position]);

  useFrame((_state, delta) => {
    setParticles(prev => 
      prev.map(particle => ({
        ...particle,
        position: particle.position.clone().add(particle.velocity.clone().multiplyScalar(delta)),
        velocity: particle.velocity.clone().multiplyScalar(0.98),
        life: particle.life - delta * 2
      })).filter(particle => particle.life > 0)
    );
  });

  return (
    <group ref={particlesRef}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position.toArray()}>
          <boxGeometry args={[0.02, 0.02, 0.02]} />
          <meshBasicMaterial 
            color={new THREE.Color().setHSL(0.1, 1, 0.5 + particle.life * 0.5)} 
            transparent 
            opacity={particle.life} 
          />
        </mesh>
      ))}
    </group>
  );
};

interface TargetProps {
  position: [number, number, number]
  onHit: (offset: { x: number; y: number }) => void
  isActive?: boolean
}

const Target: React.FC<TargetProps> = ({ position, onHit, isActive = true }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [isHit, setIsHit] = useState(false)
  const [hitAnimation, setHitAnimation] = useState(0)
  const [showExplosion, setShowExplosion] = useState(false)
  const [currentPosition, setCurrentPosition] = useState<[number, number, number]>(position)
  const [isHovered, setIsHovered] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Pre-create audio context for instant sound playback
  React.useEffect(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const createBeep = () => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.08);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.08);
    };
    audioRef.current = { play: () => createBeep(), pause: () => {}, currentTime: 0 } as any;
    return () => {
      audioRef.current = null;
    };
  }, []);

  useFrame((_state, delta) => {
    if (hitAnimation > 0) {
      setHitAnimation(prev => Math.max(0, prev - delta * 3))
    }
    if (meshRef.current && !isHit) {
      meshRef.current.rotation.x += delta * 0.5
      meshRef.current.rotation.y += delta * 0.5
      const scale = 1
      meshRef.current.scale.setScalar(scale)
    }
  })

  const getRandomPosition = useCallback((): [number, number, number] => {
    return [
      (Math.random() - 0.5) * 8,  // X: -4 to 4
      (Math.random() - 0.5) * 6,  // Y: -3 to 3
      -3 - Math.random() * 4       // Z: -3 to -7
    ]
  }, [])

  const handleClick = useCallback((intersect: any) => {
    if (!isActive || isHit) return;
    
    // Instant feedback - set states immediately
    setIsHit(true);
    setShowExplosion(true);
    setHitAnimation(1);
    
    // Play hit sound instantly
    if (audioRef.current && audioRef.current.play) {
      try {
        audioRef.current.play();
      } catch (e) {
        // Ignore audio errors
      }
    }
    
    // Calculate hit offset from center of target for sensitivity adjustment
    const localPoint = intersect.point.sub(new THREE.Vector3(...currentPosition));
    
    onHit({ x: localPoint.x, y: localPoint.y });
    
    // Use requestAnimationFrame for smoother respawn timing
    setTimeout(() => {
      setShowExplosion(false);
      setCurrentPosition(getRandomPosition());
      setIsHit(false);
    }, 300);
  }, [currentPosition, onHit, isActive, isHit, getRandomPosition]);

  // Register this target for center raycasting and hover detection
  React.useEffect(() => {
    if (meshRef.current) {
      meshRef.current.userData.target = { 
        handleClick,
        setHovered: setIsHovered
      }
    }
  }, [handleClick])



  return (
    <group>
      <group position={currentPosition}>
        {!isHit && (
          <>
            <Sphere
              ref={meshRef}
              args={[0.3, 12, 12]}
            >
              <meshBasicMaterial
                color={isActive ? (isHovered ? '#ff8888' : '#ff6b6b') : '#444444'}
                transparent
                opacity={isActive ? 1 : 0.7}
              />
            </Sphere>
            <Sphere
              args={[0.15, 8, 8]}
              position={[0, 0, 0.01]}
            >
              <meshBasicMaterial
                color={isActive ? '#ffffff' : '#666666'}
                transparent
                opacity={isActive ? (isHovered ? 1 : 0.9) : 0.3}
              />
            </Sphere>
          </>
        )}
      </group>
      <ParticleExplosion position={currentPosition} trigger={showExplosion} />
    </group>
  )
}

const CameraController: React.FC = () => {
  const { camera, gl } = useThree()
  const { state } = useSensitivity()
  const eulerRef = useRef(new THREE.Euler(0, 0, 0, 'YXZ'))
  const isInitialized = useRef(false)
  
  React.useEffect(() => {
    // Initialize camera position and rotation only once
    if (!isInitialized.current) {
      camera.position.set(0, 0, 5)
      eulerRef.current.set(0, 0, 0, 'YXZ')
      camera.quaternion.setFromEuler(eulerRef.current)
      isInitialized.current = true
    }
    
    // Simple, direct mouse movement handling
    const handleMouseMove = (event: MouseEvent) => {
      if (document.pointerLockElement === gl.domElement) {
        const sensitivity = state.sensitivity * 0.0015
        
        // Apply movement directly with simple bounds checking
        const deltaX = Math.max(-10, Math.min(10, event.movementX))
        const deltaY = Math.max(-10, Math.min(10, event.movementY))
        
        // Update Euler angles directly
        eulerRef.current.y -= deltaX * sensitivity
        eulerRef.current.x -= deltaY * sensitivity
        
        // Clamp vertical rotation
        eulerRef.current.x = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, eulerRef.current.x))
        
        // Apply rotation immediately
        camera.quaternion.setFromEuler(eulerRef.current)
      }
    }
    
    const handleClick = () => {
      gl.domElement.requestPointerLock()
    }
    
    const handlePointerLockChange = () => {
      if (document.pointerLockElement === gl.domElement) {
        gl.domElement.style.cursor = 'none'
      } else {
        gl.domElement.style.cursor = 'crosshair'
      }
    }
    
    // Add event listeners
    gl.domElement.addEventListener('click', handleClick)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('pointerlockchange', handlePointerLockChange)
    
    return () => {
      gl.domElement.removeEventListener('click', handleClick)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('pointerlockchange', handlePointerLockChange)
    }
  }, [camera, gl, state.sensitivity])
  
  return null
}

interface TrainingGroundProps {
  onStatsUpdate?: (totalClicks: number, successfulHits: number) => void
}

const TrainingGround: React.FC<TrainingGroundProps> = ({ onStatsUpdate }) => {
  const { adjustSensitivityByOffset, state } = useSensitivity()
  const { camera, raycaster, scene } = useThree()
  const [totalClicks, setTotalClicks] = useState(0)
  const [successfulHits, setSuccessfulHits] = useState(0)
  const [lastSettings, setLastSettings] = useState({ dpi: state.dpi, sensitivity: state.sensitivity, autoAdjustment: state.autoAdjustment, gameMode: state.gameMode })
  const [targets] = useState([
    { id: 1, position: [-2, 1, -5] as [number, number, number] },
    { id: 2, position: [2, 1, -5] as [number, number, number] },
    { id: 3, position: [0, 2, -6] as [number, number, number] },
    { id: 4, position: [-1, -1, -4] as [number, number, number] },
    { id: 5, position: [1, -1, -4] as [number, number, number] },
  ])

  const handleTargetHit = useCallback((offset: { x: number; y: number }) => {
    adjustSensitivityByOffset(offset)
    setSuccessfulHits(prev => prev + 1)
  }, [adjustSensitivityByOffset])

  // Reset accuracy when settings change (except sensitivity changes when auto-adjust is on)
  React.useEffect(() => {
    const settingsChanged = 
      lastSettings.dpi !== state.dpi || 
      (!state.autoAdjustment && lastSettings.sensitivity !== state.sensitivity) ||
      lastSettings.autoAdjustment !== state.autoAdjustment ||
      lastSettings.gameMode !== state.gameMode
    
    if (settingsChanged) {
      setTotalClicks(0)
      setSuccessfulHits(0)
      setLastSettings({ dpi: state.dpi, sensitivity: state.sensitivity, autoAdjustment: state.autoAdjustment, gameMode: state.gameMode })
    }
  }, [state.dpi, state.sensitivity, state.autoAdjustment, state.gameMode, lastSettings])

  // Update parent component with stats
  React.useEffect(() => {
    if (onStatsUpdate) {
      onStatsUpdate(totalClicks, successfulHits)
    }
  }, [totalClicks, successfulHits, onStatsUpdate])

  // Global click handler that raycasts from screen center
  const handleGlobalClick = useCallback(() => {
    if (document.pointerLockElement) {
      setTotalClicks(prev => prev + 1)
      
      // Raycast from screen center (0, 0 in normalized coordinates)
      raycaster.setFromCamera(new THREE.Vector2(0, 0), camera)
      const intersects = raycaster.intersectObjects(scene.children, true)
      
      // Find the first target intersection
      for (const intersect of intersects) {
        const target = intersect.object.userData.target
        if (target && target.handleClick) {
          target.handleClick(intersect)
          break
        }
      }
    }
  }, [raycaster, camera, scene])

  // Add global click listener
  React.useEffect(() => {
    const canvas = document.querySelector('canvas')
    if (canvas) {
      canvas.addEventListener('click', handleGlobalClick)
      return () => canvas.removeEventListener('click', handleGlobalClick)
    }
  }, [handleGlobalClick])

  // Continuous raycasting for hover detection
  useFrame(() => {
    if (document.pointerLockElement) {
      // Raycast from screen center
      raycaster.setFromCamera(new THREE.Vector2(0, 0), camera)
      const intersects = raycaster.intersectObjects(scene.children, true)
      
      // Reset all hover states first
      scene.traverse((object) => {
        if (object.userData.target && object.userData.target.setHovered) {
          object.userData.target.setHovered(false)
        }
      })
      
      // Set hover state for the first intersected target
      for (const intersect of intersects) {
        const target = intersect.object.userData.target
        if (target && target.setHovered) {
          target.setHovered(true)
          break
        }
      }
    }
  })

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      <mesh position={[0, -3, -10]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      
      {targets.map(target => (
        <Target
          key={target.id}
          position={target.position}
          onHit={handleTargetHit}
          isActive={true}
        />
      ))}
      

      
      <CameraController />
    </>
  )
}

export default TrainingGround