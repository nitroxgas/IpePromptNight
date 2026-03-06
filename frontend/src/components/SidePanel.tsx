import type { SeedData, Project, Developer, Contribution } from '@/data/types'
import { getContributionsUpTo } from '@/data/timeline'

const FONT_FAMILY = "'Courier New', 'Doto', monospace"

interface SidePanelProps {
  data: SeedData
  selectedProjectId: string | null
  isOpen: boolean
  onToggle: () => void
  currentTime?: Date
  contributionsByProject?: Map<string, number>
}

function totalByDeveloper(contributions: Contribution[], developerId: string, currentTime?: Date): number {
  const filtered = currentTime
    ? contributions.filter((c) => new Date(c.timestamp) <= currentTime)
    : contributions
  return filtered
    .filter((c) => c.developerId === developerId)
    .reduce((acc, c) => acc + c.commits + c.pullRequests, 0)
}

function contributionsForProject(contributions: Contribution[], projectId: string, currentTime?: Date) {
  const filtered = contributions.filter((c) => c.projectId === projectId)
  return currentTime ? filtered.filter((c) => new Date(c.timestamp) <= currentTime) : filtered
}

export function SidePanel({
  data,
  selectedProjectId,
  isOpen,
  onToggle,
  currentTime,
  contributionsByProject,
}: SidePanelProps) {
  const selectedProject = selectedProjectId
    ? data.projects.find((p) => p.id === selectedProjectId)
    : null
  const projectContributors = selectedProject
    ? contributionsForProject(data.contributions, selectedProject.id, currentTime)
    : []
  const selectedProjectContributions = selectedProjectId
    ? contributionsByProject?.get(selectedProjectId) ?? 0
    : 0

  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        style={{
          fontFamily: FONT_FAMILY,
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 20,
          padding: '8px 14px',
          background: '#3d5a4a',
          color: '#f5f5eb',
          border: '1px solid rgba(100, 140, 100, 0.4)',
          borderRadius: 8,
          cursor: 'pointer',
          fontSize: 14,
          boxShadow: '0 2px 8px rgba(45, 74, 45, 0.2)',
        }}
      >
        {isOpen ? 'Fechar painel' : 'Abrir painel'}
      </button>
      {isOpen && (
        <aside
          style={{
            fontFamily: FONT_FAMILY,
            position: 'fixed',
            top: 0,
            right: 0,
            width: 320,
            maxWidth: '90vw',
            height: '100vh',
            background: 'rgba(245, 250, 242, 0.97)',
            color: '#2d4a2d',
            padding: 24,
            paddingTop: 56,
            overflowY: 'auto',
            zIndex: 15,
            borderLeft: '1px solid rgba(100, 160, 100, 0.35)',
            boxShadow: '-4px 0 20px rgba(45, 74, 45, 0.08)',
          }}
        >
          <h2 style={{ fontSize: 18, marginBottom: 16 }}>Contribuições</h2>

          {selectedProject ? (
            <section style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 14, color: '#2d5a2d', marginBottom: 8 }}>
                Projeto: {selectedProject.name}
              </h3>
              <p style={{ fontSize: 13, marginBottom: 12 }}>
                Total: <strong>{selectedProjectContributions}</strong> (commits + PRs)
                {currentTime && selectedProjectContributions < selectedProject.totalContributions && (
                  <span style={{ fontSize: 11, color: '#5a7a5a', marginLeft: 8 }}>
                    (de {selectedProject.totalContributions})
                  </span>
                )}
              </p>
              <h4 style={{ fontSize: 12, color: '#4a6a4a', marginBottom: 6 }}>Contribuidores</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {projectContributors.map((c) => {
                  const dev = data.developers.find((d) => d.id === c.developerId)
                  const total = c.commits + c.pullRequests
                  return (
                    <li key={c.developerId} style={{ fontSize: 12, marginBottom: 4 }}>
                      {dev?.name ?? c.developerId}: {total} (commits: {c.commits}, PRs:{' '}
                      {c.pullRequests})
                    </li>
                  )
                })}
              </ul>
            </section>
          ) : null}

          <section style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 14, marginBottom: 8 }}>Projetos</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {data.projects.map((p: Project) => {
                const current = contributionsByProject?.get(p.id) ?? p.totalContributions
                return (
                  <li key={p.id} style={{ fontSize: 12, marginBottom: 4 }}>
                    {p.name}: <strong>{current}</strong>
                    {currentTime && current < p.totalContributions && (
                      <span style={{ fontSize: 11, color: '#5a7a5a', marginLeft: 4 }}>
                        (de {p.totalContributions})
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>

          <section>
            <h3 style={{ fontSize: 14, marginBottom: 8 }}>Desenvolvedores (total)</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {data.developers.map((d: Developer) => {
                const total = totalByDeveloper(data.contributions, d.id, currentTime)
                const finalTotal = totalByDeveloper(data.contributions, d.id)
                return (
                  <li key={d.id} style={{ fontSize: 12, marginBottom: 4 }}>
                    {d.name}: <strong>{total}</strong>
                    {currentTime && total < finalTotal && (
                      <span style={{ fontSize: 11, color: '#5a7a5a', marginLeft: 4 }}>
                        (de {finalTotal})
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        </aside>
      )}
    </>
  )
}
