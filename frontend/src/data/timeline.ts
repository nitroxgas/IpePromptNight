import type { SeedData, Contribution, Project } from './types'

/**
 * Calcula o total de contribuições acumuladas para um projeto até um determinado timestamp
 */
export function getContributionsUpTo(
  contributions: Contribution[],
  projectId: string,
  timestamp: Date
): number {
  return contributions
    .filter((c) => c.projectId === projectId && new Date(c.timestamp) <= timestamp)
    .reduce((acc, c) => acc + c.commits + c.pullRequests, 0)
}

/**
 * Encontra o timestamp mais antigo e mais recente no conjunto de contribuições
 */
export function getTimeRange(contributions: Contribution[]): { start: Date; end: Date } {
  if (contributions.length === 0) {
    const now = new Date()
    return { start: now, end: now }
  }
  const timestamps = contributions.map((c) => new Date(c.timestamp))
  return {
    start: new Date(Math.min(...timestamps.map((d) => d.getTime()))),
    end: new Date(Math.max(...timestamps.map((d) => d.getTime()))),
  }
}

/**
 * Calcula projetos com contribuições acumuladas até um timestamp
 */
export function getProjectsAtTime(data: SeedData, timestamp: Date): Project[] {
  return data.projects.map((project) => {
    const totalContributions = getContributionsUpTo(data.contributions, project.id, timestamp)
    return {
      ...project,
      totalContributions,
    }
  })
}
