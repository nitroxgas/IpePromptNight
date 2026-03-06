import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { loadSeedData } from '@/data/loader'
import type { SeedData } from '@/data/types'
import { City } from '@/components/City'
import { SidePanel } from '@/components/SidePanel'

function Scene({
  data,
  selectedId,
  onSelect,
  onHover,
}: {
  data: SeedData
  selectedId: string | null
  onSelect: (id: string | null) => void
  onHover: (id: string | null) => void
}) {
  return (
    <>
      <color attach="background" args={['#b8d4c8']} />
      <fog attach="fog" args={['#c5e0d4', 18, 42]} />
      <ambientLight intensity={0.45} color="#e8f0e4" />
      <directionalLight
        position={[10, 22, 8]}
        intensity={1.1}
        color="#fff5e6"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={50}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />
      <pointLight position={[-4, 6, 2]} intensity={0.25} color="#f5e6c8" distance={25} />
      <pointLight position={[5, 5, -2]} intensity={0.2} color="#d4e8c4" distance={22} />
      <City
        projects={data.projects}
        selectedProjectId={selectedId}
        onSelectProject={onSelect}
        onHoverProject={onHover}
      />
      <OrbitControls
        enablePan
        enableZoom
        minDistance={5}
        maxDistance={40}
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

  useEffect(() => {
    loadSeedData()
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load data'))
  }, [])

  if (error) {
    return (
      <div style={{ padding: 24, color: '#8b4513', background: '#f5f0e8', minHeight: '100vh' }}>
        Erro: {error}
      </div>
    )
  }

  if (!data) {
    return (
      <div style={{ padding: 24, color: '#5a7a5a', background: '#eef5ed', minHeight: '100vh' }}>
        Carregando…
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: '100vh', background: '#b8d4c8' }}>
      <h1
        style={{
          position: 'fixed',
          left: 20,
          top: 20,
          margin: 0,
          fontFamily: "'Courier New', 'Doto', monospace",
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          fontWeight: 700,
          color: '#2d4a2d',
          letterSpacing: '0.02em',
          zIndex: 10,
          pointerEvents: 'none',
          textShadow: '0 1px 2px rgba(255,255,255,0.4)',
        }}
      >
        Ipê City Projects Dashboard
      </h1>
      <Canvas shadows camera={{ position: [0, 8, 12], fov: 50 }}>
        <Scene
          data={data}
          selectedId={selectedProjectId}
          onSelect={setSelectedProjectId}
          onHover={setHoverProjectId}
        />
      </Canvas>
      {hoverProjectId && (
        <div
          style={{
            fontFamily: "'Courier New', 'Doto', monospace",
            position: 'fixed',
            left: 20,
            top: 72,
            padding: '8px 12px',
            background: 'rgba(245, 250, 242, 0.92)',
            color: '#2d4a2d',
            borderRadius: 8,
            fontSize: 13,
            zIndex: 10,
            pointerEvents: 'none',
            boxShadow: '0 2px 12px rgba(45, 74, 45, 0.15)',
            border: '1px solid rgba(100, 160, 100, 0.3)',
          }}
        >
          {data.projects.find((p) => p.id === hoverProjectId)?.name ?? ''} —{' '}
          {data.projects.find((p) => p.id === hoverProjectId)?.totalContributions ?? 0} contribuições
        </div>
      )}
      <SidePanel
        data={data}
        selectedProjectId={selectedProjectId}
        isOpen={panelOpen}
        onToggle={() => setPanelOpen((o) => !o)}
      />
    </div>
  )
}

export default App
