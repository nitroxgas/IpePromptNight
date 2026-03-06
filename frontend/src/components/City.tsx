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

/** Blocos com número de slots (grid 2 colunas). */
const BLOCKS = [
  { ox: -3.2 * 1.8, oz: -3.2 * 1.2, slots: 4 },
  { ox: 3.2 * 0.6, oz: -3.2 * 1.4, slots: 3 },
  { ox: -3.2 * 1.2, oz: 3.2 * 0.4, slots: 3 },
  { ox: 3.2 * 1.4, oz: 3.2 * 0.2, slots: 4 },
  { ox: 0, oz: 0, slots: 2 },
] as const

const BLOCK_SIZE = 3.2
const JITTER = 0.28
const BUILDING_FOOTPRINT = 1.2

const hash = (id: string) => id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)

/** Calcula posições únicas por projeto (um slot por projeto, sem sobreposição). */
function computeLayoutPositions(projects: Project[]): [number, number][] {
  const positions: [number, number][] = []
  let globalSlot = 0
  for (let i = 0; i < projects.length; i++) {
    const p = projects[i]
    let remaining = globalSlot
    let blockIdx = 0
    for (; blockIdx < BLOCKS.length; blockIdx++) {
      const n = BLOCKS[blockIdx].slots
      if (remaining < n) break
      remaining -= n
    }
    const block = BLOCKS[blockIdx % BLOCKS.length]
    const slot = remaining % block.slots
    const row = Math.floor(slot / 2)
    const col = slot % 2
    const jx = ((hash(p.id + 'x') % 1000) / 1000) * JITTER * 2 - JITTER
    const jz = ((hash(p.id + 'z') % 1000) / 1000) * JITTER * 2 - JITTER
    const x = block.ox + col * BLOCK_SIZE + jx
    const z = block.oz + row * BLOCK_SIZE + jz
    positions.push([x, z])
    globalSlot++
  }
  return positions
}

function useMapLayout(projects: Project[]) {
  return useMemo(() => computeLayoutPositions(projects), [projects])
}

/** Valida: 1 projeto = 1 prédio; sem sobreposição. */
export function validateLayout(projects: Project[]): { ok: boolean; errors: string[] } {
  const errors: string[] = []
  const positions = computeLayoutPositions(projects)
  if (positions.length !== projects.length) {
    errors.push(`Posições (${positions.length}) !== projetos (${projects.length})`)
  }
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const [xi, zi] = positions[i]
      const [xj, zj] = positions[j]
      const dx = Math.abs(xi - xj)
      const dz = Math.abs(zi - zj)
      if (dx < BUILDING_FOOTPRINT && dz < BUILDING_FOOTPRINT) {
        errors.push(`Sobreposição: ${projects[i].name} e ${projects[j].name} em (${xi.toFixed(2)}, ${zi.toFixed(2)}) vs (${xj.toFixed(2)}, ${zj.toFixed(2)})`)
      }
    }
  }
  return { ok: errors.length === 0, errors }
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
        <meshStandardMaterial color="#7a9e82" />
      </mesh>
    )
  }

  return (
    <>
      {/* Chão base — vegetação / terreno Solarpunk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[28, 28]} />
        <meshStandardMaterial
          color="#6b8f6e"
          roughness={0.92}
          metalness={0}
        />
      </mesh>

      {/* Ruas — pavimento claro, sustentável (Solarpunk) */}
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
                color="#c4d4b8"
                roughness={0.95}
                metalness={0}
              />
            </mesh>
            {/* Faixa central — tom âmbar suave */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
              <planeGeometry args={[alongX ? planeW : 0.1, alongX ? 0.1 : planeD]} />
              <meshBasicMaterial color="#d4c49a" transparent opacity={0.4} />
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
