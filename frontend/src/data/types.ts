export interface Project {
  id: string
  name: string
  totalContributions: number
}

export interface Developer {
  id: string
  name: string
}

export interface Contribution {
  projectId: string
  developerId: string
  commits: number
  pullRequests: number
  timestamp: string // ISO 8601 date string
}

export interface SeedData {
  projects: Project[]
  developers: Developer[]
  contributions: Contribution[]
}
