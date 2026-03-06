import { useMemo } from 'react'
import type { Project } from '@/data/types'
import { Building } from './Building'

const FONT_FAMILY = "'Courier New', 'Doto', monospace"

/** Segmentos de rua: eixo (x ou z), posição no outro eixo, centro, largura total, comprimento. */
const STREET_SEGMENTS: { axis: 'x' | 'z'; at: number; center: number; width: number; length: number }[] = [
  { axis: 'z', at: -3.2, center: 0, width: 2.4, length: 22 },
  { axis: 'z', at: 1.6, center: 0, width: 2.2, length: 20 },
  { axis: 'x', at: -3.8, center: -0.8, width: 2.2, length: 14 },
  { axis: 'x', at: 2.2, center: -0.8, width: 2.4, length: 16 },
  { axis: 'x', at: 0, center: 0, width: 2.0, length: 12 },
]

/** Gera posições em formato de mapa: blocos com ruas entre eles. Estável por project.id. */
function useMapLayout(projects: Project[]) {
  return useMemo(() => {
    const BLOCK_SIZE = 3.2
    const JITTER = 0.28
    const positions: [number, number][] = []
    const hash = (id: string) => id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)

    const blocks: { ox: number; oz: number; slots: number }[] = [
      { ox: -BLOCK_SIZE * 1.8, oz: -BLOCK_SIZE * 1.2, slots: 4 },
      { ox: BLOCK_SIZE * 0.6, oz: -BLOCK_SIZE * 1.4, slots: 3 },
      { ox: -BLOCK_SIZE * 1.2, oz: BLOCK_SIZE * 0.4, slots: 3 },
      { ox: BLOCK_SIZE * 1.4, oz: BLOCK_SIZE * 0.2, slots: 4 },
      { ox: 0, oz: 0, slots: 2 },
    ]

    let slotIndex = 0
    projects.forEach((p, i) => {
      const block = blocks[slotIndex % blocks.length]
      const slot = Math.floor((hash(p.id) + i * 17) % block.slots)
      const row = Math.floor(slot / 2)
      const col = slot % 2
      const jx = ((hash(p.id + 'x') % 1000) / 1000) * JITTER * 2 - JITTER
      const jz = ((hash(p.id + 'z') % 1000) / 1000) * JITTER * 2 - JITTER
      const x = block.ox + col * BLOCK_SIZE + jx
      const z = block.oz + row * BLOCK_SIZE + jz
      positions.push([x, z])
      slotIndex++
    })

    return positions
  }, [projects])
}

interface CityProps {
  projects: Project[]
  selectedProjectId: string | null
  onSelectProject: (id: string | null) => void
  onHoverProject: (id: string | null) => void
}

export function City({
  projects,
  selectedProjectId,
  onSelectProject,
  onHoverProject,
}: CityProps) {
  const positions = useMapLayout(projects)

  if (!projects.length) {
    return (
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#0c0e14" />
      </mesh>
    )
  }

  return (
    <>
      {/* Chão base (calçada/terreno escuro) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[28, 28]} />
        <meshStandardMaterial
          color="#0e1018"
          roughness={0.95}
          metalness={0.02}
        />
      </mesh>

      {/* Ruas visíveis (asfalto) */}
      {STREET_SEGMENTS.map((seg, i) => {
        const alongX = seg.axis === 'z'
        const planeW = alongX ? seg.length : seg.width
        const planeD = alongX ? seg.width : seg.length
        const x = alongX ? seg.center : seg.at
        const z = alongX ? seg.at : seg.center
        return (
          <group key={i} position={[x, 0.006, z]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[planeW, planeD]} />
              <meshStandardMaterial
                color="#14171e"
                roughness={0.98}
                metalness={0}
              />
            </mesh>
            {/* Faixa central (linha amarela discreta) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
              <planeGeometry args={[alongX ? planeW : 0.1, alongX ? 0.1 : planeD]} />
              <meshBasicMaterial color="#2a2610" transparent opacity={0.5} />
            </mesh>
          </group>
        )
      })}

      {projects.map((project, i) => {
        const [x, z] = positions[i]
        return (
          <Building
            key={project.id}
            project={project}
            position={[x, 0, z]}
            fontFamily={FONT_FAMILY}
            isSelected={selectedProjectId === project.id}
            onClick={() => onSelectProject(project.id)}
            onPointerOver={() => onHoverProject(project.id)}
            onPointerOut={() => onHoverProject(null)}
          />
        )
      })}
    </>
  )
}
