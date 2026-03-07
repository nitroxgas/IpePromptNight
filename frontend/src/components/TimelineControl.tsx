import { MESSAGES, type Language } from '@/i18n'

const FONT_FAMILY = "'Segoe UI', Verdana, sans-serif"

interface TimelineControlProps {
  start: Date
  end: Date
  language: Language
  currentTime: Date
  progress: number
  onProgressChange: (progress: number) => void
  isPlaying: boolean
  onPlayPause: () => void
  playbackSpeed: number
  onSpeedChange: (speed: number) => void
  isMobile?: boolean
}

export function TimelineControl({
  start,
  end,
  language,
  currentTime,
  progress,
  onProgressChange,
  isPlaying,
  onPlayPause,
  playbackSpeed,
  onSpeedChange,
  isMobile = false,
}: TimelineControlProps) {
  const messages = MESSAGES[language]
  const currentProgress = Math.max(0, Math.min(1, progress))
  const speedOptions = [0.5, 1, 2, 4, 8, 12, 16, 24, 32, 50]

  const formatDate = (date: Date) => {
    const locale = language === 'pt-BR' ? 'pt-BR' : language === 'es' ? 'es-ES' : 'en-US'
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onProgressChange(parseFloat(e.target.value))
  }

  const handleReset = () => {
    onProgressChange(0)
  }

  const handleJumpToEnd = () => {
    onProgressChange(1)
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
        bottom: isMobile ? 12 : 24,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'linear-gradient(135deg, rgba(20,25,45,0.94), rgba(30,40,60,0.92))',
        padding: isMobile ? '12px 12px' : '14px 22px',
        borderRadius: isMobile ? 12 : 14,
        boxShadow: '0 4px 24px rgba(0,0,0,0.35), 0 0 30px rgba(255,213,79,0.08)',
        border: '2px solid rgba(255,213,79,0.25)',
        zIndex: 20,
        minWidth: isMobile ? 'calc(100vw - 20px)' : 480,
        maxWidth: isMobile ? 'calc(100vw - 20px)' : '90vw',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 10,
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          onClick={onPlayPause}
          style={{
            ...btnBase,
            padding: isMobile ? '10px 14px' : '8px 18px',
            background: isPlaying
              ? 'linear-gradient(135deg, #ff6b6b, #ee5a24)'
              : 'linear-gradient(135deg, #ffd54f, #ffb300)',
            color: isPlaying ? '#fff' : '#1a1a2e',
            fontSize: isMobile ? 12 : 13,
            minWidth: isMobile ? 100 : 90,
          }}
        >
          {isPlaying ? messages.pause : messages.play}
        </button>
        <button
          type="button"
          onClick={handleReset}
          style={{
            ...btnBase,
            padding: isMobile ? '8px 12px' : '6px 12px',
            background: 'rgba(255,255,255,0.1)',
            color: '#b0b8d0',
            fontSize: 12,
          }}
        >
          {messages.start}
        </button>
        <button
          type="button"
          onClick={handleJumpToEnd}
          style={{
            ...btnBase,
            padding: isMobile ? '8px 12px' : '6px 12px',
            background: 'rgba(255,255,255,0.1)',
            color: '#b0b8d0',
            fontSize: 12,
          }}
        >
          {messages.end}
        </button>
        <select
          value={playbackSpeed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          style={{
            padding: isMobile ? '8px 10px' : '6px 10px',
            background: 'rgba(255,255,255,0.1)',
            color: '#b0b8d0',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 6,
            fontSize: 12,
            cursor: 'pointer',
            fontFamily: FONT_FAMILY,
            minWidth: isMobile ? 86 : 72,
          }}
        >
          {speedOptions.map((speed) => (
            <option key={speed} value={speed}>
              {speed}x
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: isMobile ? 'stretch' : 'center',
          gap: isMobile ? 8 : 12,
          flexDirection: isMobile ? 'column' : 'row',
        }}
      >
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
            minWidth: isMobile ? 'auto' : 140,
            textAlign: isMobile ? 'left' : 'right',
          }}
        >
          {formatDate(currentTime)}
        </div>
      </div>

      <div
        style={{
          fontSize: 10,
          color: '#687088',
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
