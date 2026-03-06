import type { SeedData } from '@/data/types'
import { getTimeRange } from '@/data/timeline'

const FONT_FAMILY = "'Segoe UI', Verdana, sans-serif"

interface TimelineControlProps {
  data: SeedData
  currentTime: Date
  onTimeChange: (time: Date) => void
  isPlaying: boolean
  onPlayPause: () => void
  playbackSpeed: number
  onSpeedChange: (speed: number) => void
}

export function TimelineControl({
  data,
  currentTime,
  onTimeChange,
  isPlaying,
  onPlayPause,
  playbackSpeed,
  onSpeedChange,
}: TimelineControlProps) {
  const { start, end } = getTimeRange(data.contributions)
  const totalDuration = end.getTime() - start.getTime()
  const currentProgress = (currentTime.getTime() - start.getTime()) / totalDuration

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const progress = parseFloat(e.target.value)
    const newTime = new Date(start.getTime() + progress * totalDuration)
    onTimeChange(newTime)
  }

  const handleReset = () => {
    onTimeChange(start)
  }

  const handleJumpToEnd = () => {
    onTimeChange(end)
  }

  const btnBase: React.CSSProperties = {
    fontFamily: FONT_FAMILY,
    border: '2px solid rgba(255,255,255,0.2)',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 700,
    transition: 'transform 0.1s',
  }

  return (
    <div
      style={{
        fontFamily: FONT_FAMILY,
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'linear-gradient(135deg, rgba(20,25,45,0.94), rgba(30,40,60,0.92))',
        padding: '14px 22px',
        borderRadius: 14,
        boxShadow: '0 4px 24px rgba(0,0,0,0.35), 0 0 30px rgba(255,213,79,0.08)',
        border: '2px solid rgba(255,213,79,0.25)',
        zIndex: 20,
        minWidth: 480,
        maxWidth: '90vw',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <button
          type="button"
          onClick={onPlayPause}
          style={{
            ...btnBase,
            padding: '8px 18px',
            background: isPlaying
              ? 'linear-gradient(135deg, #ff6b6b, #ee5a24)'
              : 'linear-gradient(135deg, #ffd54f, #ffb300)',
            color: isPlaying ? '#fff' : '#1a1a2e',
            fontSize: 13,
            minWidth: 90,
          }}
        >
          {isPlaying ? 'Pausar' : 'Reproduzir'}
        </button>
        <button
          type="button"
          onClick={handleReset}
          style={{
            ...btnBase,
            padding: '6px 12px',
            background: 'rgba(255,255,255,0.1)',
            color: '#b0b8d0',
            fontSize: 12,
          }}
        >
          Inicio
        </button>
        <button
          type="button"
          onClick={handleJumpToEnd}
          style={{
            ...btnBase,
            padding: '6px 12px',
            background: 'rgba(255,255,255,0.1)',
            color: '#b0b8d0',
            fontSize: 12,
          }}
        >
          Fim
        </button>
        <select
          value={playbackSpeed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          style={{
            padding: '6px 10px',
            background: 'rgba(255,255,255,0.1)',
            color: '#b0b8d0',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 6,
            fontSize: 12,
            cursor: 'pointer',
            fontFamily: FONT_FAMILY,
          }}
        >
          <option value={0.5}>0.5x</option>
          <option value={1}>1x</option>
          <option value={2}>2x</option>
          <option value={4}>4x</option>
        </select>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={currentProgress}
          onChange={handleSliderChange}
          style={{
            flex: 1,
            height: 6,
            borderRadius: 3,
            background: `linear-gradient(to right, #ffd54f ${currentProgress * 100}%, rgba(255,255,255,0.15) ${currentProgress * 100}%)`,
            outline: 'none',
            cursor: 'pointer',
            WebkitAppearance: 'none',
          }}
        />
        <div
          style={{
            fontSize: 12,
            color: '#ffd54f',
            fontWeight: 600,
            minWidth: 140,
            textAlign: 'right',
          }}
        >
          {formatDate(currentTime)}
        </div>
      </div>

      <div
        style={{
          fontSize: 10,
          color: '#6870888',
          marginTop: 4,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ color: '#687088' }}>{formatDate(start)}</span>
        <span style={{ color: '#687088' }}>{formatDate(end)}</span>
      </div>
    </div>
  )
}
