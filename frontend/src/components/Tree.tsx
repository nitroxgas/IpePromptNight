import { useMemo } from 'react'

const TRUNK_COLOR = '#6b4226'
const CANOPY_COLORS = ['#2d8a4e', '#3ba55d', '#48c96b', '#28784a']
const GLOW_COLOR = '#ffd54f'
const FLOWER_COLORS = ['#ff6b8a', '#ff9a5c', '#ffd54f', '#ff82b0', '#c06cf0']

interface TreeProps {
  position: [number, number, number]
  scale?: number
  variant?: 'normal' | 'bioluminescent' | 'flowering' | 'palm'
  seed?: number
}

export function Tree({ position, scale = 1, variant = 'normal', seed = 0 }: TreeProps) {
  const canopyColor = CANOPY_COLORS[seed % CANOPY_COLORS.length]

  const glowOrbs = useMemo(() => {
    if (variant !== 'bioluminescent') return []
    return Array.from({ length: 4 }, (_, i) => {
      const a = (i / 4) * Math.PI * 2 + seed * 0.5
      const r = 0.2
      return [Math.cos(a) * r, 0.7 + i * 0.08, Math.sin(a) * r] as [number, number, number]
    })
  }, [variant, seed])

  const flowers = useMemo(() => {
    if (variant !== 'flowering') return []
    return Array.from({ length: 5 }, (_, i) => {
      const angle = (i / 5) * Math.PI * 2 + seed
      const r = 0.2 + ((seed + i * 7) % 10) / 30
      return [Math.cos(angle) * r, 0.7 + ((seed + i) % 5) / 15, Math.sin(angle) * r] as [number, number, number]
    })
  }, [variant, seed])

  if (variant === 'palm') {
    return (
      <group position={position} scale={scale}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.07, 1.0, 6]} />
          <meshStandardMaterial color={TRUNK_COLOR} roughness={0.9} />
        </mesh>
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = (i / 5) * Math.PI * 2
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 0.25, 0.95, Math.sin(angle) * 0.25]}
              rotation={[0.5, angle, 0.3]}
            >
              <boxGeometry args={[0.08, 0.02, 0.5]} />
              <meshStandardMaterial color="#3ba55d" roughness={0.7} />
            </mesh>
          )
        })}
      </group>
    )
  }

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.08, 0.6, 6]} />
        <meshStandardMaterial color={TRUNK_COLOR} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.75, 0]} castShadow>
        <sphereGeometry args={[0.35, 10, 8]} />
        <meshStandardMaterial color={canopyColor} roughness={0.7} />
      </mesh>
      <mesh position={[0.15, 0.85, 0.1]} castShadow>
        <sphereGeometry args={[0.2, 8, 6]} />
        <meshStandardMaterial color={canopyColor} roughness={0.7} />
      </mesh>
      <mesh position={[-0.12, 0.9, -0.08]} castShadow>
        <sphereGeometry args={[0.18, 8, 6]} />
        <meshStandardMaterial color={canopyColor} roughness={0.7} />
      </mesh>

      {glowOrbs.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshStandardMaterial color={GLOW_COLOR} emissive={GLOW_COLOR} emissiveIntensity={2} />
        </mesh>
      ))}

      {flowers.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.035, 6, 6]} />
          <meshStandardMaterial
            color={FLOWER_COLORS[i % FLOWER_COLORS.length]}
            emissive={FLOWER_COLORS[i % FLOWER_COLORS.length]}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}
