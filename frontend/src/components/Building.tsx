import { useRef, useMemo, useState, useEffect } from 'react'
import { Mesh, Group } from 'three'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import type { Project } from '@/data/types'

const BASE_HEIGHT = 0.5
const MAX_HEIGHT = 8
const WIDTH = 1.2
const DEPTH = 1.2

const BUILDING_COLOR = '#3d5a4a'
const BUILDING_EMISSIVE = '#1a2e22'
const BUILDING_SELECTED = '#4a6b58'
const WINDOW_COLOR = '#f5e6b3'
const WINDOW_W = 0.15
const WINDOW_H = 0.2
const WINDOW_MARGIN = 0.12

interface BuildingProps {
  project: Project
  position: [number, number, number]
  fontFamily?: string
  onClick?: () => void
  onPointerOver?: () => void
  onPointerOut?: () => void
  isSelected?: boolean
  currentContributions?: number // Contribuições acumuladas até o momento atual
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
          if (rnd(row, col) < 0.78) {
            const y = -height / 2 + WINDOW_MARGIN + row * (WINDOW_H + WINDOW_MARGIN * 2) + WINDOW_H / 2
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
  fontFamily = "'Courier New', 'Doto', monospace",
  onClick,
  onPointerOver,
  onPointerOut,
  isSelected,
  currentContributions,
}: BuildingProps) {
  const meshRef = useRef<Mesh>(null)
  const groupRef = useRef<Group>(null)
  // Usa currentContributions se fornecido, senão usa o total do projeto
  const contributions = currentContributions ?? project.totalContributions
  const normalized = Math.min(1, Math.max(0, contributions / 400))
  const targetHeight = BASE_HEIGHT + normalized * (MAX_HEIGHT - BASE_HEIGHT)
  const seed = useMemo(() => project.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0), [project.id])
  
  // Inicializa com altura base ou targetHeight se já houver contribuições
  const [animatedHeight, setAnimatedHeight] = useState(() => {
    return contributions > 0 ? BASE_HEIGHT : BASE_HEIGHT
  })
  
  // Anima suavemente a altura
  useEffect(() => {
    const duration = 800 // ms
    const startHeight = animatedHeight
    const heightDiff = targetHeight - startHeight
    const startTime = Date.now()

    if (Math.abs(heightDiff) < 0.01) {
      setAnimatedHeight(targetHeight)
      return
    }

    let animationId: number
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimatedHeight(startHeight + heightDiff * eased)

      if (progress < 1) {
        animationId = requestAnimationFrame(animate)
      } else {
        setAnimatedHeight(targetHeight)
      }
    }

    animationId = requestAnimationFrame(animate)
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [targetHeight, animatedHeight])

  const height = animatedHeight
  const windows = useWindowGrid(height, seed)

  // Atualiza a posição do grupo baseado na altura animada
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.y = height / 2
    }
  })

  return (
    <group ref={groupRef} position={[x, 0, z]}>
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
          color={isSelected ? BUILDING_SELECTED : BUILDING_COLOR}
          emissive={isSelected ? '#243d30' : BUILDING_EMISSIVE}
          metalness={0.3}
          roughness={0.85}
        />
      </mesh>
      {windows.map((w, i) => (
        <mesh key={i} position={[w.x, w.y, w.z]} rotation={[0, w.rotY, 0]}>
          <planeGeometry args={[WINDOW_W, WINDOW_H]} />
          <meshBasicMaterial color={WINDOW_COLOR} toneMapped={false} />
        </mesh>
      ))}
      <Html position={[0, height / 2 + 0.4, 0]} center style={{ pointerEvents: 'none' }}>
        <div
          style={{
            fontFamily,
            padding: '2px 8px',
            background: 'rgba(245, 250, 242, 0.95)',
            color: '#2d4a2d',
            fontSize: 11,
            whiteSpace: 'nowrap',
            borderRadius: 4,
            letterSpacing: '0.02em',
            boxShadow: '0 1px 6px rgba(45, 74, 45, 0.2)',
            border: '1px solid rgba(100, 160, 100, 0.25)',
          }}
        >
          {truncate(project.name)}
        </div>
      </Html>
    </group>
  )
}
