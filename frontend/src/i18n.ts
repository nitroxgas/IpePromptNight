export type Language = 'pt-BR' | 'en' | 'es'

export interface Messages {
  loading: string
  errorPrefix: string
  fallbackLoadError: string
  contributionsSuffix: string
  panelOpen: string
  panelClose: string
  contributionsTitle: string
  totalLabel: string
  commitsAndPrs: string
  fromLabel: string
  contributorsUpper: string
  selectBuildingHint: string
  projectsTitle: string
  developersTitle: string
  play: string
  pause: string
  start: string
  end: string
}

export const MESSAGES: Record<Language, Messages> = {
  'pt-BR': {
    loading: 'Carregando...',
    errorPrefix: 'Erro',
    fallbackLoadError: 'Falha ao carregar dados',
    contributionsSuffix: 'contribuicoes',
    panelOpen: 'Painel',
    panelClose: 'Fechar',
    contributionsTitle: 'Contribuicoes',
    totalLabel: 'Total',
    commitsAndPrs: 'commits + PRs',
    fromLabel: 'de',
    contributorsUpper: 'CONTRIBUIDORES',
    selectBuildingHint: 'Clique em um edificio para ver detalhes',
    projectsTitle: 'Projetos',
    developersTitle: 'Desenvolvedores',
    play: 'Reproduzir',
    pause: 'Pausar',
    start: 'Inicio',
    end: 'Fim',
  },
  en: {
    loading: 'Loading...',
    errorPrefix: 'Error',
    fallbackLoadError: 'Failed to load data',
    contributionsSuffix: 'contributions',
    panelOpen: 'Panel',
    panelClose: 'Close',
    contributionsTitle: 'Contributions',
    totalLabel: 'Total',
    commitsAndPrs: 'commits + PRs',
    fromLabel: 'of',
    contributorsUpper: 'CONTRIBUTORS',
    selectBuildingHint: 'Click a building to view details',
    projectsTitle: 'Projects',
    developersTitle: 'Developers',
    play: 'Play',
    pause: 'Pause',
    start: 'Start',
    end: 'End',
  },
  es: {
    loading: 'Cargando...',
    errorPrefix: 'Error',
    fallbackLoadError: 'No se pudieron cargar los datos',
    contributionsSuffix: 'contribuciones',
    panelOpen: 'Panel',
    panelClose: 'Cerrar',
    contributionsTitle: 'Contribuciones',
    totalLabel: 'Total',
    commitsAndPrs: 'commits + PRs',
    fromLabel: 'de',
    contributorsUpper: 'COLABORADORES',
    selectBuildingHint: 'Haz clic en un edificio para ver detalles',
    projectsTitle: 'Proyectos',
    developersTitle: 'Desarrolladores',
    play: 'Reproducir',
    pause: 'Pausar',
    start: 'Inicio',
    end: 'Fin',
  },
}

export function detectLanguage(): Language {
  const saved = window.localStorage.getItem('app-language')
  if (saved === 'pt-BR' || saved === 'en' || saved === 'es') return saved

  const browser = (navigator.language || '').toLowerCase()
  if (browser.startsWith('pt')) return 'pt-BR'
  if (browser.startsWith('es')) return 'es'
  return 'en'
}

