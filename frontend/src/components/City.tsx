import { useMemo } from 'react'
import type { Project, Developer, Contribution } from '@/data/types'
import { Building } from './Building'
import { Tree } from './Tree'
import { NPC } from './NPC'
import { WindTurbine, SolarPanel, GardenBed, LampPost } from './SolarPunkDecor'

const FONT_FAMILY = "'Segoe UI', Verdana, sans-serif"

const STREET_SEGMENTS: {
  axis: 'x' | 'z'
  at: number
  center: number
  width: number
  length: number
}[] = [
  { axis: 'z', at: -3.2, center: 0, width: 2.4, length: 22 },
  { axis: 'z', at: 1.6, center: 0, width: 2.2, length: 20 },
  { axis: 'x', at: -3.8, center: -0.8, width: 2.2, length: 14 },
  { axis: 'x', at: 2.2, center: -0.8, width: 2.4, length: 16 },
  { axis: 'x', at: 0, center: 0, width: 2.0, length: 12 },
]

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
        errors.push(
          `Sobreposição: ${projects[i].name} e ${projects[j].name} em (${xi.toFixed(2)}, ${zi.toFixed(2)}) vs (${xj.toFixed(2)}, ${zj.toFixed(2)})`,
        )
      }
    }
  }
  return { ok: errors.length === 0, errors }
}

const TREE_DATA: {
  pos: [number, number, number]
  scale: number
  variant: 'normal' | 'bioluminescent' | 'flowering' | 'palm'
  seed: number
}[] = [
  { pos: [-9, 0, -8], scale: 1.2, variant: 'normal', seed: 1 },
  { pos: [-6, 0, -7], scale: 0.9, variant: 'flowering', seed: 2 },
  { pos: [-2, 0, -7.5], scale: 1.1, variant: 'normal', seed: 3 },
  { pos: [3, 0, -7], scale: 1.0, variant: 'bioluminescent', seed: 4 },
  { pos: [8, 0, -7.5], scale: 1.3, variant: 'palm', seed: 5 },
  { pos: [-8, 0, 7], scale: 1.1, variant: 'normal', seed: 6 },
  { pos: [-4, 0, 8], scale: 1.0, variant: 'flowering', seed: 7 },
  { pos: [0, 0, 7.5], scale: 0.8, variant: 'normal', seed: 8 },
  { pos: [5, 0, 8], scale: 1.2, variant: 'bioluminescent', seed: 9 },
  { pos: [10, 0, 7], scale: 0.9, variant: 'palm', seed: 10 },
  { pos: [-10, 0, -3], scale: 1.0, variant: 'normal', seed: 11 },
  { pos: [-10, 0, 2], scale: 1.3, variant: 'flowering', seed: 12 },
  { pos: [11, 0, -2], scale: 1.1, variant: 'normal', seed: 13 },
  { pos: [11, 0, 4], scale: 0.9, variant: 'bioluminescent', seed: 14 },
  { pos: [-7, 0, 4], scale: 1.0, variant: 'palm', seed: 19 },
  { pos: [9, 0, -4], scale: 1.1, variant: 'normal', seed: 20 },
  { pos: [-1, 0, -5.5], scale: 0.7, variant: 'flowering', seed: 21 },
  { pos: [6, 0, 4.5], scale: 0.8, variant: 'normal', seed: 22 },
  { pos: [-6, 0, -1], scale: 0.75, variant: 'bioluminescent', seed: 23 },
  { pos: [8, 0, 2], scale: 0.85, variant: 'normal', seed: 24 },
]

const RESIDENT_NPC_DATA: {
  name: string
  path: [number, number][]
  seed: number
}[] = [
  { name: 'Morador', path: [[-7, -3.4], [7, -3.4]], seed: 100 },
  { name: 'Moradora', path: [[-6, 1.8], [6, 1.8]], seed: 101 },
  { name: 'Visitante', path: [[-3.6, -5], [-3.6, 4]], seed: 102 },
  { name: 'Turista', path: [[2.4, -5], [2.4, 4]], seed: 103 },
  { name: 'Ciclista', path: [[0.2, -3], [0.2, 3]], seed: 104 },
  { name: 'Artista', path: [[-5, -3.0], [5, 1.4]], seed: 105 },
]

interface CityProps {
  projects: Project[]
  developers: Developer[]
  contributions: Contribution[]
  selectedProjectId: string | null
  onSelectProject: (id: string | null) => void
  onHoverProject: (id: string | null) => void
  contributionsByProject?: Map<string, number>
}

export function City({
  projects,
  developers,
  contributions,
  selectedProjectId,
  onSelectProject,
  onHoverProject,
  contributionsByProject,
}: CityProps) {
  const positions = useMapLayout(projects)

  const developerPlacements = useMemo(() => {
    const devsByProject = new Map<string, Developer[]>()
    for (const dev of developers) {
      const devContribs = contributions.filter((c) => c.developerId === dev.id)
      if (devContribs.length === 0) continue

      const projectTotals = new Map<string, number>()
      for (const c of devContribs) {
        projectTotals.set(
          c.projectId,
          (projectTotals.get(c.projectId) ?? 0) + c.commits + c.pullRequests,
        )
      }
      let maxProject = ''
      let maxTotal = 0
      for (const [projId, total] of projectTotals) {
        if (total > maxTotal) {
          maxTotal = total
          maxProject = projId
        }
      }
      const list = devsByProject.get(maxProject) ?? []
      list.push(dev)
      devsByProject.set(maxProject, list)
    }

    const result: { dev: Developer; pos: [number, number, number]; seed: number }[] = []
    for (const [projId, devs] of devsByProject) {
      const projIdx = projects.findIndex((p) => p.id === projId)
      if (projIdx < 0 || projIdx >= positions.length) continue
      const [bx, bz] = positions[projIdx]
      for (let i = 0; i < devs.length; i++) {
        const angle = (i / Math.max(devs.length, 1)) * Math.PI * 2 + 0.3
        const radius = 1.0 + (i % 2) * 0.3
        result.push({
          dev: devs[i],
          pos: [bx + Math.cos(angle) * radius, 0, bz + Math.sin(angle) * radius],
          seed: hash(devs[i].id),
        })
      }
    }
    return result
  }, [developers, contributions, projects, positions])

  if (!projects.length) {
    return (
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#5a9a4a" />
      </mesh>
    )
  }

  return (
    <>
      {/* Ground — vibrant grass */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[32, 32]} />
        <meshStandardMaterial color="#5a9a4a" roughness={0.92} metalness={0} />
      </mesh>

      {/* Outer ring — darker grass edge */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <ringGeometry args={[14, 18, 64]} />
        <meshStandardMaterial color="#4a8a3a" roughness={0.95} />
      </mesh>

      {/* Streets — warm sandstone paths */}
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
              <meshStandardMaterial color="#d8c8a0" roughness={0.95} metalness={0} />
            </mesh>
            {/* Center line — warm amber */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
              <planeGeometry args={[alongX ? planeW : 0.12, alongX ? 0.12 : planeD]} />
              <meshBasicMaterial color="#c8a860" transparent opacity={0.5} />
            </mesh>
          </group>
        )
      })}

      {/* Buildings */}
      {projects.map((project, i) => {
        const [x, z] = positions[i]
        const currentContributions = contributionsByProject?.get(project.id)
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
            currentContributions={currentContributions}
          />
        )
      })}

      {/* Trees */}
      {TREE_DATA.map((t, i) => (
        <Tree key={`tree-${i}`} position={t.pos} scale={t.scale} variant={t.variant} seed={t.seed} />
      ))}

      {/* Developer NPCs (near their buildings) */}
      {developerPlacements.map(({ dev, pos, seed: s }) => (
        <NPC key={`dev-${dev.id}`} name={dev.name} position={pos} seed={s} isDeveloper showLabel />
      ))}

      {/* Resident NPCs (walking streets) */}
      {RESIDENT_NPC_DATA.map((r, i) => (
        <NPC
          key={`resident-${i}`}
          name={r.name}
          position={[r.path[0][0], 0, r.path[0][1]]}
          walkPath={r.path}
          walkSpeed={0.4}
          seed={r.seed}
          showLabel
        />
      ))}

      {/* Wind turbines */}
      <WindTurbine position={[-11, 0, -6]} scale={0.9} />
      <WindTurbine position={[12, 0, 6]} scale={1.0} />
      <WindTurbine position={[-9, 0, 5]} scale={0.8} />

      {/* Solar panel arrays */}
      <SolarPanel position={[9, 0, -6]} rotation={0.3} />
      <SolarPanel position={[10, 0, -5.5]} rotation={0.3} />
      <SolarPanel position={[-8, 0, -5]} rotation={-0.2} />
      <SolarPanel position={[-7, 0, -5.5]} rotation={-0.2} />

      {/* Garden beds */}
      <GardenBed position={[-1.5, 0, -5.8]} />
      <GardenBed position={[1.5, 0, 5.5]} />
      <GardenBed position={[-5, 0, 5.5]} />
      <GardenBed position={[7, 0, -1]} />

      {/* Lamp posts along streets */}
      <LampPost position={[-5, 0, -4.5]} />
      <LampPost position={[0, 0, -4.5]} />
      <LampPost position={[5, 0, -4.5]} />
      <LampPost position={[-5, 0, 2.8]} />
      <LampPost position={[0, 0, 2.8]} />
      <LampPost position={[5, 0, 2.8]} />
    </>
  )
}
