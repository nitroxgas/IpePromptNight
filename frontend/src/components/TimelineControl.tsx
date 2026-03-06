import { useState, useEffect, useRef } from 'react'
import type { SeedData } from '@/data/types'
import { getTimeRange } from '@/data/timeline'

const FONT_FAMILY = "'Courier New', 'Doto', monospace"

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

  return (
    <div
      style={{
        fontFamily: FONT_FAMILY,
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(245, 250, 242, 0.95)',
        padding: '16px 24px',
        borderRadius: 12,
        boxShadow: '0 4px 20px rgba(45, 74, 45, 0.2)',
        border: '1px solid rgba(100, 160, 100, 0.3)',
        zIndex: 20,
        minWidth: 500,
        maxWidth: '90vw',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <button
          type="button"
          onClick={onPlayPause}
          style={{
            padding: '8px 16px',
            background: isPlaying ? '#3d5a4a' : '#5a7a5a',
            color: '#f5f5eb',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
            minWidth: 80,
          }}
        >
          {isPlaying ? '⏸ Pausar' : '▶ Reproduzir'}
        </button>
        <button
          type="button"
          onClick={handleReset}
          style={{
            padding: '8px 12px',
            background: '#6b8f6e',
            color: '#f5f5eb',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 12,
          }}
        >
          ⏮ Início
        </button>
        <button
          type="button"
          onClick={handleJumpToEnd}
          style={{
            padding: '8px 12px',
            background: '#6b8f6e',
            color: '#f5f5eb',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 12,
          }}
        >
          ⏭ Fim
        </button>
        <select
          value={playbackSpeed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          style={{
            padding: '6px 10px',
            background: '#fff',
            border: '1px solid rgba(100, 160, 100, 0.4)',
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
            background: '#c4d4b8',
            outline: 'none',
            cursor: 'pointer',
          }}
        />
        <div
          style={{
            fontSize: 12,
            color: '#2d4a2d',
            minWidth: 200,
            textAlign: 'right',
          }}
        >
          {formatDate(currentTime)}
        </div>
      </div>
      <div
        style={{
          fontSize: 11,
          color: '#5a7a5a',
          marginTop: 4,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>{formatDate(start)}</span>
        <span>{formatDate(end)}</span>
      </div>
    </div>
  )
}
