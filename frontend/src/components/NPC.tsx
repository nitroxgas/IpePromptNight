import { useRef, useMemo } from 'react'
import { Group } from 'three'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'

const NPC_COLORS = [
  '#e85d75', '#f0a040', '#50b8e0', '#6dd465', '#c070d8',
  '#e8c840', '#40c8a0', '#f07850', '#7088e0', '#d85890',
  '#88c060', '#e07070', '#50c0b0', '#d0a060', '#8080d0',
  '#c06060', '#60b0c0', '#b0a040', '#a060b0', '#70b870',
]

interface NPCProps {
  name: string
  position: [number, number, number]
  color?: string
  seed?: number
  showLabel?: boolean
  walkPath?: [number, number][]
  walkSpeed?: number
  isDeveloper?: boolean
}

export function NPC({
  name,
  position,
  color,
  seed = 0,
  showLabel = true,
  walkPath,
  walkSpeed = 0.5,
  isDeveloper = false,
}: NPCProps) {
  const groupRef = useRef<Group>(null)
  const npcColor = color ?? NPC_COLORS[seed % NPC_COLORS.length]
  const timeOffset = useMemo(() => (seed * 2.3) % (Math.PI * 2), [seed])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime() + timeOffset

    if (walkPath && walkPath.length >= 2) {
      const [startX, startZ] = walkPath[0]
      const [endX, endZ] = walkPath[walkPath.length - 1]
      const dx = endX - startX
      const dz = endZ - startZ
      const dist = Math.sqrt(dx * dx + dz * dz)
      const cycleTime = dist / walkSpeed

      const rawT = (t % (cycleTime * 2)) / cycleTime
      const progress = rawT < 1 ? rawT : 2 - rawT

      groupRef.current.position.x = startX + dx * progress
      groupRef.current.position.z = startZ + dz * progress
      groupRef.current.position.y = Math.abs(Math.sin(t * 6)) * 0.03

      const dir = rawT < 1 ? 1 : -1
      if (Math.abs(dx) > 0.001 || Math.abs(dz) > 0.001) {
        groupRef.current.rotation.y = Math.atan2(dx * dir, dz * dir)
      }
    } else {
      groupRef.current.position.y = position[1] + Math.sin(t * 1.8) * 0.015
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Feet */}
      <mesh position={[0, 0.04, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 0.08, 8]} />
        <meshStandardMaterial color="#5a4030" roughness={0.8} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.11, 0.28, 8]} />
        <meshStandardMaterial color={npcColor} roughness={0.5} metalness={0.1} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.46, 0]} castShadow>
        <sphereGeometry args={[0.13, 12, 10]} />
        <meshStandardMaterial color="#f5d0a8" roughness={0.6} />
      </mesh>
      {/* Eye whites */}
      <mesh position={[0.045, 0.48, 0.105]}>
        <sphereGeometry args={[0.032, 6, 6]} />
        <meshBasicMaterial color="#fff" />
      </mesh>
      <mesh position={[-0.045, 0.48, 0.105]}>
        <sphereGeometry args={[0.032, 6, 6]} />
        <meshBasicMaterial color="#fff" />
      </mesh>
      {/* Eye pupils */}
      <mesh position={[0.045, 0.48, 0.12]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
      <mesh position={[-0.045, 0.48, 0.12]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
      {/* Developer hat */}
      {isDeveloper && (
        <mesh position={[0, 0.58, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.14, 0.06, 8]} />
          <meshStandardMaterial color="#2d2d4e" roughness={0.5} />
        </mesh>
      )}
      {showLabel && (
        <Html position={[0, 0.72, 0]} center zIndexRange={[50, 0]} style={{ pointerEvents: 'none' }}>
          <div
            style={{
              fontSize: 8,
              fontWeight: 700,
              fontFamily: "'Segoe UI', Verdana, sans-serif",
              background: isDeveloper ? 'rgba(45, 45, 78, 0.85)' : 'rgba(0,0,0,0.55)',
              color: '#fff',
              padding: '1px 5px',
              borderRadius: 4,
              whiteSpace: 'nowrap',
              border: isDeveloper ? '1px solid rgba(130,130,220,0.4)' : 'none',
            }}
          >
            {name}
          </div>
        </Html>
      )}
    </group>
  )
}
