import { useRef, useMemo, useState, useEffect } from 'react'
import { Mesh, Group } from 'three'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import type { Project } from '@/data/types'

const BASE_HEIGHT = 0.5
const MAX_HEIGHT = 8
const WIDTH = 1.3
const DEPTH = 1.3

const BUILDING_PALETTE = [
  { main: '#e07058', dark: '#b84838', roof: '#c05040' },
  { main: '#d4a04c', dark: '#a87830', roof: '#c09038' },
  { main: '#5cad6e', dark: '#3a8548', roof: '#408850' },
  { main: '#4ca0c0', dark: '#2a7898', roof: '#3080a0' },
  { main: '#c070b8', dark: '#984890', roof: '#a05098' },
  { main: '#e0a058', dark: '#b87830', roof: '#c88840' },
  { main: '#58b888', dark: '#389060', roof: '#409868' },
  { main: '#d06080', dark: '#a84060', roof: '#b04868' },
  { main: '#6888d0', dark: '#4060a8', roof: '#4868b0' },
  { main: '#b0c848', dark: '#88a020', roof: '#90a830' },
  { main: '#d88c58', dark: '#b06430', roof: '#b87438' },
  { main: '#58a8a8', dark: '#388080', roof: '#408888' },
  { main: '#c88040', dark: '#a06020', roof: '#a86820' },
  { main: '#8070c0', dark: '#5848a0', roof: '#6050a0' },
  { main: '#68b458', dark: '#409430', roof: '#489438' },
]

const WINDOW_COLOR = '#fff3c4'
const WINDOW_W = 0.18
const WINDOW_H = 0.22
const WINDOW_MARGIN = 0.14

const FONT_FAMILY = "'Segoe UI', Verdana, sans-serif"

interface BuildingProps {
  project: Project
  position: [number, number, number]
  fontFamily?: string
  onClick?: () => void
  onPointerOver?: () => void
  onPointerOut?: () => void
  isSelected?: boolean
  currentContributions?: number
}

function truncate(name: string, max = 14) {
  return name.length > max ? name.slice(0, max) + '…' : name
}

function useWindowGrid(height: number, seed: number) {
  return useMemo(() => {
    const rows = Math.max(1, Math.floor(height / (WINDOW_H + WINDOW_MARGIN * 2)))
    const cols = 2
    const halfW = WIDTH / 2
    const halfD = DEPTH / 2
    const rnd = (i: number, j: number) => ((seed + i * 7 + j * 13) % 100) / 100
    const positions: { x: number; y: number; z: number; rotY: number }[] = []
    ;(
      [
        [halfD + 0.01, 0],
        [-halfD - 0.01, Math.PI],
        [-halfW - 0.01, Math.PI / 2],
        [halfW + 0.01, -Math.PI / 2],
      ] as const
    ).forEach(([offset, rotY], faceIdx) => {
      const isZ = faceIdx < 2
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (rnd(row + faceIdx * 5, col) < 0.82) {
            const y =
              -height / 2 + WINDOW_MARGIN + row * (WINDOW_H + WINDOW_MARGIN * 2) + WINDOW_H / 2
            const u = (col - 0.5) * (WINDOW_W + WINDOW_MARGIN) * 2
            if (isZ) positions.push({ x: u, y, z: offset, rotY })
            else positions.push({ x: offset, y, z: u, rotY })
          }
        }
      }
    })
    return positions
  }, [height, seed])
}

export function Building({
  project,
  position: [x, _, z],
  fontFamily = FONT_FAMILY,
  onClick,
  onPointerOver,
  onPointerOut,
  isSelected,
  currentContributions,
}: BuildingProps) {
  const meshRef = useRef<Mesh>(null)
  const groupRef = useRef<Group>(null)
  const heightRef = useRef(BASE_HEIGHT)

  const contributions = currentContributions ?? project.totalContributions
  const normalized = Math.min(1, Math.max(0, contributions / 400))
  const targetHeight = BASE_HEIGHT + normalized * (MAX_HEIGHT - BASE_HEIGHT)
  const seed = useMemo(
    () => project.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0),
    [project.id],
  )

  const palette = BUILDING_PALETTE[seed % BUILDING_PALETTE.length]
  const hasSolarPanel = seed % 3 === 0

  const [animatedHeight, setAnimatedHeight] = useState(BASE_HEIGHT)

  useEffect(() => {
    const duration = 800
    const startHeight = heightRef.current
    const heightDiff = targetHeight - startHeight
    const startTime = Date.now()

    if (Math.abs(heightDiff) < 0.01) {
      heightRef.current = targetHeight
      setAnimatedHeight(targetHeight)
      return
    }

    let animationId: number
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const h = startHeight + heightDiff * eased
      heightRef.current = h
      setAnimatedHeight(h)
      if (progress < 1) {
        animationId = requestAnimationFrame(animate)
      } else {
        heightRef.current = targetHeight
        setAnimatedHeight(targetHeight)
      }
    }

    animationId = requestAnimationFrame(animate)
    return () => {
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [targetHeight])

  const height = animatedHeight
  const windows = useWindowGrid(height, seed)

  const roofBushes = useMemo(() => {
    return [
      [-0.3, 0.2],
      [0.3, -0.2],
      [0, 0.3],
      [-0.2, -0.3],
    ].map(([ox, oz], i) => ({
      pos: [ox, 0, oz] as [number, number, number],
      radius: 0.08 + ((seed + i) % 3) * 0.02,
      color: i % 2 === 0 ? '#3d8a3d' : '#5aaa5a',
    }))
  }, [seed])

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.y = height / 2
    }
  })

  return (
    <group ref={groupRef} position={[x, 0, z]}>
      {/* Main building body */}
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onClick={onClick}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      >
        <boxGeometry args={[WIDTH, height, DEPTH]} />
        <meshStandardMaterial
          color={isSelected ? '#fff' : palette.main}
          emissive={isSelected ? palette.main : palette.dark}
          emissiveIntensity={isSelected ? 0.3 : 0.15}
          metalness={0.1}
          roughness={0.7}
        />
      </mesh>

      {/* Foundation */}
      <mesh position={[0, -height / 2 + 0.05, 0]} castShadow>
        <boxGeometry args={[WIDTH + 0.06, 0.1, DEPTH + 0.06]} />
        <meshStandardMaterial color={palette.dark} roughness={0.9} />
      </mesh>

      {/* Roof ledge */}
      <mesh position={[0, height / 2 + 0.03, 0]} castShadow>
        <boxGeometry args={[WIDTH + 0.08, 0.06, DEPTH + 0.08]} />
        <meshStandardMaterial color={palette.roof} roughness={0.8} />
      </mesh>

      {/* Rooftop garden */}
      <mesh position={[0, height / 2 + 0.08, 0]}>
        <boxGeometry args={[WIDTH - 0.1, 0.04, DEPTH - 0.1]} />
        <meshStandardMaterial color="#4a9a4a" roughness={0.9} />
      </mesh>

      {/* Mini bushes on roof */}
      {roofBushes.map((bush, i) => (
        <mesh key={`bush-${i}`} position={[bush.pos[0], height / 2 + 0.15, bush.pos[2]]}>
          <sphereGeometry args={[bush.radius, 6, 5]} />
          <meshStandardMaterial color={bush.color} roughness={0.8} />
        </mesh>
      ))}

      {/* Solar panel on some roofs */}
      {hasSolarPanel && (
        <mesh position={[0.2, height / 2 + 0.14, -0.1]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.3, 0.02, 0.25]} />
          <meshStandardMaterial color="#1a237e" metalness={0.7} roughness={0.2} />
        </mesh>
      )}

      {/* Warm glowing windows */}
      {windows.map((w, i) => (
        <mesh key={i} position={[w.x, w.y, w.z]} rotation={[0, w.rotY, 0]}>
          <planeGeometry args={[WINDOW_W, WINDOW_H]} />
          <meshBasicMaterial color={WINDOW_COLOR} toneMapped={false} />
        </mesh>
      ))}

      {/* Name label */}
      <Html position={[0, height / 2 + 0.45, 0]} center style={{ pointerEvents: 'none' }}>
        <div
          style={{
            fontFamily,
            fontWeight: 700,
            padding: '3px 10px',
            background: `linear-gradient(135deg, ${palette.main}ee, ${palette.dark}ee)`,
            color: '#fff',
            fontSize: 11,
            whiteSpace: 'nowrap',
            borderRadius: 6,
            letterSpacing: '0.03em',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.3)',
            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
          }}
        >
          {truncate(project.name)}
        </div>
      </Html>

      {/* Selection glow ring */}
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -height / 2 + 0.02, 0]}>
          <ringGeometry args={[0.8, 1.0, 32]} />
          <meshBasicMaterial color="#ffd54f" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  )
}
