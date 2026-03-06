import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import type { SeedData, Project, Contribution } from '../../src/data/types'
import { validateLayout } from '../../src/components/City'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const seedPath = path.resolve(__dirname, '../../public/data/seed.json')

function loadSeed(): SeedData {
  const raw = JSON.parse(readFileSync(seedPath, 'utf-8'))
  return raw as SeedData
}

describe('Seed data contract', () => {
  it('loads seed.json with 15 projects and 20 developers', () => {
    const data = loadSeed()
    expect(data.projects).toHaveLength(15)
    expect(data.developers).toHaveLength(20)
  })

  it('has valid project shape (id, name, totalContributions)', () => {
    const data = loadSeed()
    for (const p of data.projects as Project[]) {
      expect(p.id).toBeDefined()
      expect(typeof p.name).toBe('string')
      expect(typeof p.totalContributions).toBe('number')
      expect(p.totalContributions).toBeGreaterThanOrEqual(0)
    }
  })

  it('has valid developer shape (id, name)', () => {
    const data = loadSeed()
    for (const d of data.developers) {
      expect(d.id).toBeDefined()
      expect(typeof d.name).toBe('string')
    }
  })

  it('contributions have referential integrity (projectId and developerId exist)', () => {
    const data = loadSeed()
    const projectIds = new Set(data.projects.map((p) => p.id))
    const developerIds = new Set(data.developers.map((d) => d.id))
    for (const c of data.contributions as Contribution[]) {
      expect(projectIds.has(c.projectId)).toBe(true)
      expect(developerIds.has(c.developerId)).toBe(true)
      expect(c.commits).toBeGreaterThanOrEqual(0)
      expect(c.pullRequests).toBeGreaterThanOrEqual(0)
    }
  })

  it('per-project contribution sum equals project totalContributions', () => {
    const data = loadSeed()
    for (const project of data.projects) {
      const sum = (data.contributions as Contribution[])
        .filter((c) => c.projectId === project.id)
        .reduce((acc, c) => acc + c.commits + c.pullRequests, 0)
      expect(sum).toBe(project.totalContributions)
    }
  })
})

describe('Dashboard layout', () => {
  it('every project has one building and no overlap (validateLayout passes)', () => {
    const data = loadSeed()
    const result = validateLayout(data.projects)
    expect(result.ok).toBe(true)
    expect(result.errors).toEqual([])
  })
})
