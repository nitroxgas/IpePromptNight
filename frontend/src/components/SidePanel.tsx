import type { SeedData, Project, Developer, Contribution } from '@/data/types'

const FONT_FAMILY = "'Segoe UI', Verdana, sans-serif"

const NPC_COLORS = [
  '#e85d75', '#f0a040', '#50b8e0', '#6dd465', '#c070d8',
  '#e8c840', '#40c8a0', '#f07850', '#7088e0', '#d85890',
  '#88c060', '#e07070', '#50c0b0', '#d0a060', '#8080d0',
  '#c06060', '#60b0c0', '#b0a040', '#a060b0', '#70b870',
]

interface SidePanelProps {
  data: SeedData
  selectedProjectId: string | null
  isOpen: boolean
  onToggle: () => void
  currentTime?: Date
  contributionsByProject?: Map<string, number>
}

function totalByDeveloper(
  contributions: Contribution[],
  developerId: string,
  currentTime?: Date,
): number {
  const filtered = currentTime
    ? contributions.filter((c) => new Date(c.timestamp) <= currentTime)
    : contributions
  return filtered
    .filter((c) => c.developerId === developerId)
    .reduce((acc, c) => acc + c.commits + c.pullRequests, 0)
}

function contributionsForProject(
  contributions: Contribution[],
  projectId: string,
  currentTime?: Date,
) {
  const filtered = contributions.filter((c) => c.projectId === projectId)
  return currentTime ? filtered.filter((c) => new Date(c.timestamp) <= currentTime) : filtered
}

function devColor(id: string) {
  const h = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return NPC_COLORS[h % NPC_COLORS.length]
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
    ? (contributionsByProject?.get(selectedProjectId) ?? 0)
    : 0

  const panelBg = 'linear-gradient(180deg, rgba(20,25,45,0.94), rgba(30,35,55,0.96))'
  const cardBg = 'rgba(255,255,255,0.07)'
  const accentColor = '#ffd54f'
  const textColor = '#e8e8f0'
  const mutedColor = '#8890a8'

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
          padding: '8px 16px',
          background: 'linear-gradient(135deg, #ffd54f, #ffb300)',
          color: '#1a1a2e',
          border: '2px solid rgba(255,255,255,0.3)',
          borderRadius: 10,
          cursor: 'pointer',
          fontSize: 13,
          fontWeight: 700,
          boxShadow: '0 3px 12px rgba(255,213,79,0.3)',
          letterSpacing: '0.02em',
        }}
      >
        {isOpen ? 'Fechar' : 'Painel'}
      </button>

      {isOpen && (
        <aside
          style={{
            fontFamily: FONT_FAMILY,
            position: 'fixed',
            top: 0,
            right: 0,
            width: 340,
            maxWidth: '90vw',
            height: '100vh',
            background: panelBg,
            color: textColor,
            padding: 20,
            paddingTop: 56,
            overflowY: 'auto',
            zIndex: 15,
            borderLeft: '2px solid rgba(255,213,79,0.25)',
            boxShadow: '-4px 0 24px rgba(0,0,0,0.3)',
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 800,
              marginBottom: 16,
              color: accentColor,
              letterSpacing: '0.04em',
              textShadow: '0 1px 4px rgba(0,0,0,0.3)',
            }}
          >
            Contribuicoes
          </h2>

          {selectedProject ? (
            <section
              style={{
                marginBottom: 20,
                background: cardBg,
                borderRadius: 10,
                padding: 14,
                border: '1px solid rgba(255,213,79,0.15)',
              }}
            >
              <h3 style={{ fontSize: 14, color: accentColor, marginBottom: 8, fontWeight: 700 }}>
                {selectedProject.name}
              </h3>
              <p style={{ fontSize: 13, marginBottom: 10 }}>
                Total:{' '}
                <strong style={{ color: accentColor, fontSize: 16 }}>
                  {selectedProjectContributions}
                </strong>{' '}
                <span style={{ fontSize: 11, color: mutedColor }}>commits + PRs</span>
                {currentTime &&
                  selectedProjectContributions < selectedProject.totalContributions && (
                    <span style={{ fontSize: 11, color: mutedColor, marginLeft: 6 }}>
                      (de {selectedProject.totalContributions})
                    </span>
                  )}
              </p>
              <h4 style={{ fontSize: 11, color: mutedColor, marginBottom: 6, fontWeight: 600 }}>
                CONTRIBUIDORES
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {projectContributors.map((c) => {
                  const dev = data.developers.find((d) => d.id === c.developerId)
                  const total = c.commits + c.pullRequests
                  return (
                    <li
                      key={c.developerId}
                      style={{
                        fontSize: 12,
                        marginBottom: 6,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          background: devColor(c.developerId),
                          display: 'inline-block',
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ flex: 1 }}>{dev?.name ?? c.developerId}</span>
                      <span style={{ color: accentColor, fontWeight: 700 }}>{total}</span>
                    </li>
                  )
                })}
              </ul>
            </section>
          ) : (
            <div
              style={{
                background: cardBg,
                borderRadius: 10,
                padding: 14,
                marginBottom: 20,
                border: '1px solid rgba(255,255,255,0.05)',
                color: mutedColor,
                fontSize: 12,
                textAlign: 'center',
              }}
            >
              Clique em um edificio para ver detalhes
            </div>
          )}

          <section
            style={{
              marginBottom: 20,
              background: cardBg,
              borderRadius: 10,
              padding: 14,
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <h3
              style={{
                fontSize: 13,
                marginBottom: 10,
                fontWeight: 700,
                color: '#80c8ff',
              }}
            >
              Projetos
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {data.projects.map((p: Project) => {
                const current = contributionsByProject?.get(p.id) ?? p.totalContributions
                return (
                  <li
                    key={p.id}
                    style={{
                      fontSize: 12,
                      marginBottom: 5,
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{p.name}</span>
                    <span>
                      <strong style={{ color: accentColor }}>{current}</strong>
                      {currentTime && current < p.totalContributions && (
                        <span style={{ fontSize: 10, color: mutedColor, marginLeft: 4 }}>
                          /{p.totalContributions}
                        </span>
                      )}
                    </span>
                  </li>
                )
              })}
            </ul>
          </section>

          <section
            style={{
              background: cardBg,
              borderRadius: 10,
              padding: 14,
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <h3
              style={{
                fontSize: 13,
                marginBottom: 10,
                fontWeight: 700,
                color: '#80ffa0',
              }}
            >
              Desenvolvedores
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {data.developers.map((d: Developer) => {
                const total = totalByDeveloper(data.contributions, d.id, currentTime)
                const finalTotal = totalByDeveloper(data.contributions, d.id)
                return (
                  <li
                    key={d.id}
                    style={{
                      fontSize: 12,
                      marginBottom: 5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: devColor(d.id),
                        display: 'inline-block',
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ flex: 1 }}>{d.name}</span>
                    <span>
                      <strong style={{ color: accentColor }}>{total}</strong>
                      {currentTime && total < finalTotal && (
                        <span style={{ fontSize: 10, color: mutedColor, marginLeft: 4 }}>
                          /{finalTotal}
                        </span>
                      )}
                    </span>
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
