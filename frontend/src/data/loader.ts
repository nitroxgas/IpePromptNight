import type { SeedData, Project, Developer, Contribution } from './types'

const SEED_URL = '/data/seed.json'

function assertProject(raw: unknown): asserts raw is Project {
  if (
    !raw ||
    typeof raw !== 'object' ||
    !('id' in raw) ||
    !('name' in raw) ||
    !('totalContributions' in raw) ||
    typeof (raw as Project).totalContributions !== 'number'
  ) {
    throw new Error('Invalid project shape')
  }
}

function assertDeveloper(raw: unknown): asserts raw is Developer {
  if (
    !raw ||
    typeof raw !== 'object' ||
    !('id' in raw) ||
    !('name' in raw)
  ) {
    throw new Error('Invalid developer shape')
  }
}

function assertContribution(raw: unknown): asserts raw is Contribution {
  if (
    !raw ||
    typeof raw !== 'object' ||
    !('projectId' in raw) ||
    !('developerId' in raw) ||
    typeof (raw as Contribution).commits !== 'number' ||
    typeof (raw as Contribution).pullRequests !== 'number'
  ) {
    throw new Error('Invalid contribution shape')
  }
}

export async function loadSeedData(): Promise<SeedData> {
  const res = await fetch(SEED_URL)
  if (!res.ok) throw new Error(`Failed to load seed data: ${res.status}`)
  const data: unknown = await res.json()
  if (!data || typeof data !== 'object' || !('projects' in data) || !('developers' in data) || !('contributions' in data)) {
    throw new Error('Seed data must have projects, developers, contributions')
  }
  const raw = data as { projects: unknown[]; developers: unknown[]; contributions: unknown[] }
  raw.projects.forEach(assertProject)
  raw.developers.forEach(assertDeveloper)
  raw.contributions.forEach(assertContribution)
  const projectIds = new Set((raw.projects as Project[]).map((p) => p.id))
  const developerIds = new Set((raw.developers as Developer[]).map((d) => d.id))
  for (const c of raw.contributions as Contribution[]) {
    if (!projectIds.has(c.projectId)) throw new Error(`Contribution references unknown project ${c.projectId}`)
    if (!developerIds.has(c.developerId)) throw new Error(`Contribution references unknown developer ${c.developerId}`)
  }
  return data as SeedData
}
