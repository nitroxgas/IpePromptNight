import type { SeedData, Project, Developer, Contribution } from '@/data/types'

const FONT_FAMILY = "'Courier New', 'Doto', monospace"

interface SidePanelProps {
  data: SeedData
  selectedProjectId: string | null
  isOpen: boolean
  onToggle: () => void
}

function totalByDeveloper(contributions: Contribution[], developerId: string): number {
  return contributions
    .filter((c) => c.developerId === developerId)
    .reduce((acc, c) => acc + c.commits + c.pullRequests, 0)
}

function contributionsForProject(contributions: Contribution[], projectId: string) {
  return contributions.filter((c) => c.projectId === projectId)
}

export function SidePanel({ data, selectedProjectId, isOpen, onToggle }: SidePanelProps) {
  const selectedProject = selectedProjectId
    ? data.projects.find((p) => p.id === selectedProjectId)
    : null
  const projectContributors = selectedProject
    ? contributionsForProject(data.contributions, selectedProject.id)
    : []

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
                Total: <strong>{selectedProject.totalContributions}</strong> (commits + PRs)
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
              {data.projects.map((p: Project) => (
                <li key={p.id} style={{ fontSize: 12, marginBottom: 4 }}>
                  {p.name}: <strong>{p.totalContributions}</strong>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 style={{ fontSize: 14, marginBottom: 8 }}>Desenvolvedores (total)</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {data.developers.map((d: Developer) => (
                <li key={d.id} style={{ fontSize: 12, marginBottom: 4 }}>
                  {d.name}:{' '}
                  <strong>{totalByDeveloper(data.contributions, d.id)}</strong>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      )}
    </>
  )
}
