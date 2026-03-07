import { useState, useEffect, useMemo, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { loadSeedData } from '@/data/loader'
import type { SeedData } from '@/data/types'
import { City } from '@/components/City'
import { SidePanel } from '@/components/SidePanel'
import { TimelineControl } from '@/components/TimelineControl'
import { getTimeRange, getContributionsUpTo } from '@/data/timeline'

const FONT_FAMILY = "'Segoe UI', Verdana, sans-serif"

function Scene({
  data,
  selectedId,
  onSelect,
  onHover,
  contributionsByProject,
  isMobile,
}: {
  data: SeedData
  selectedId: string | null
  onSelect: (id: string | null) => void
  onHover: (id: string | null) => void
  contributionsByProject: Map<string, number>
  isMobile: boolean
}) {
  return (
    <>
      <color attach="background" args={['#78b8d8']} />
      <fog attach="fog" args={['#90c8e0', 25, 60]} />

      {/* Warm golden-hour lighting */}
      <ambientLight intensity={0.5} color="#ffe8c8" />
      <directionalLight
        position={[10, 22, 8]}
        intensity={1.3}
        color="#fff0d0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      <pointLight position={[-6, 8, 4]} intensity={0.35} color="#ffcc80" distance={30} />
      <pointLight position={[6, 6, -4]} intensity={0.25} color="#80d0ff" distance={25} />
      <hemisphereLight args={['#87ceeb', '#5a9a4a', 0.3]} />

      <City
        projects={data.projects}
        developers={data.developers}
        contributions={data.contributions}
        selectedProjectId={selectedId}
        onSelectProject={onSelect}
        onHoverProject={onHover}
        contributionsByProject={contributionsByProject}
      />
      <OrbitControls
        enablePan={!isMobile}
        enableZoom
        minDistance={isMobile ? 7 : 5}
        maxDistance={isMobile ? 32 : 40}
        maxPolarAngle={Math.PI / 2 - 0.1}
      />
    </>
  )
}

function App() {
  const [data, setData] = useState<SeedData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [hoverProjectId, setHoverProjectId] = useState<string | null>(null)
  const [panelOpen, setPanelOpen] = useState(true)
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 900)
  const animationFrameRef = useRef<number>()
  const introStarted = useRef(false)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 900)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    loadSeedData()
      .then((loadedData) => {
        setData(loadedData)
        const { start } = getTimeRange(loadedData.contributions)
        setCurrentTime(start)
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load data'))
  }, [])

  // Intro animation: sweep from start to end in 1s on load
  useEffect(() => {
    if (!data || introStarted.current) return
    introStarted.current = true

    const { start, end } = getTimeRange(data.contributions)
    const totalRange = end.getTime() - start.getTime()
    const introDuration = 1000
    const t0 = Date.now()

    let frameId: number
    const animate = () => {
      const elapsed = Date.now() - t0
      const progress = Math.min(elapsed / introDuration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrentTime(new Date(start.getTime() + eased * totalRange))
      if (progress < 1) {
        frameId = requestAnimationFrame(animate)
      }
    }

    frameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameId)
  }, [data])

  useEffect(() => {
    if (!isPlaying || !data || !currentTime) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      return
    }

    const { end } = getTimeRange(data.contributions)
    const startTime = Date.now()
    const startTimestamp = currentTime.getTime()

    const animate = () => {
      const elapsed = (Date.now() - startTime) * playbackSpeed
      const newTimestamp = Math.min(startTimestamp + elapsed, end.getTime())
      const newTime = new Date(newTimestamp)
      setCurrentTime(newTime)

      if (newTimestamp < end.getTime()) {
        animationFrameRef.current = requestAnimationFrame(animate)
      } else {
        setIsPlaying(false)
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isPlaying, data, playbackSpeed, currentTime])

  const contributionsByProject = useMemo(() => {
    if (!data || !currentTime) return new Map<string, number>()
    const map = new Map<string, number>()
    data.projects.forEach((project) => {
      const total = getContributionsUpTo(data.contributions, project.id, currentTime)
      map.set(project.id, total)
    })
    return map
  }, [data, currentTime])

  if (error) {
    return (
      <div
        style={{
          padding: 24,
          color: '#ff6b6b',
          background: '#1a1a2e',
          minHeight: '100vh',
          fontFamily: FONT_FAMILY,
        }}
      >
        Erro: {error}
      </div>
    )
  }

  if (!data || !currentTime) {
    return (
      <div
        style={{
          padding: 24,
          color: '#ffd54f',
          background: '#1a1a2e',
          minHeight: '100vh',
          fontFamily: FONT_FAMILY,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          fontWeight: 700,
        }}
      >
        Carregando...
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: '100vh', background: '#78b8d8' }}>
      {/* Game-style title */}
      <h1
        style={{
          position: 'fixed',
          left: isMobile ? 10 : 20,
          top: isMobile ? 10 : 16,
          margin: 0,
          fontFamily: FONT_FAMILY,
          fontSize: 'clamp(1.2rem, 3.5vw, 2rem)',
          fontWeight: 800,
          color: '#fff',
          letterSpacing: '0.04em',
          zIndex: 10,
          pointerEvents: 'none',
          textShadow: '0 2px 8px rgba(0,0,0,0.4), 0 0 20px rgba(255,213,79,0.3)',
          background: 'linear-gradient(135deg, rgba(30,40,60,0.8), rgba(50,70,100,0.7))',
          padding: isMobile ? '6px 12px' : '8px 20px',
          borderRadius: 12,
          border: '2px solid rgba(255,213,79,0.4)',
        }}
      >
        Ipe City
      </h1>

      <Canvas
        style={{ touchAction: 'none' }}
        shadows
        camera={{ position: isMobile ? [0, 11, 19] : [0, 10, 16], fov: isMobile ? 58 : 50 }}
      >
        <Scene
          data={data}
          selectedId={selectedProjectId}
          onSelect={setSelectedProjectId}
          onHover={setHoverProjectId}
          contributionsByProject={contributionsByProject}
          isMobile={isMobile}
        />
      </Canvas>

      {/* Hover tooltip — game style */}
      {!isMobile && hoverProjectId && (
        <div
          style={{
            fontFamily: FONT_FAMILY,
            position: 'fixed',
            left: 20,
            top: 72,
            padding: '8px 14px',
            background: 'linear-gradient(135deg, rgba(30,40,60,0.9), rgba(50,70,100,0.85))',
            color: '#fff',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            zIndex: 10,
            pointerEvents: 'none',
            boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,213,79,0.4)',
          }}
        >
          <span style={{ color: '#ffd54f' }}>
            {data.projects.find((p) => p.id === hoverProjectId)?.name ?? ''}
          </span>
          {' — '}
          {contributionsByProject.get(hoverProjectId) ?? 0} contribuicoes
        </div>
      )}

      <TimelineControl
        data={data}
        currentTime={currentTime}
        onTimeChange={setCurrentTime}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying((p) => !p)}
        playbackSpeed={playbackSpeed}
        onSpeedChange={setPlaybackSpeed}
        isMobile={isMobile}
      />
      <SidePanel
        data={data}
        selectedProjectId={selectedProjectId}
        isOpen={panelOpen}
        onToggle={() => setPanelOpen((o) => !o)}
        currentTime={currentTime}
        contributionsByProject={contributionsByProject}
        isMobile={isMobile}
      />
    </div>
  )
}

export default App
