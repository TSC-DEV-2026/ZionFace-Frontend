import React, { useEffect, useRef, useState } from 'react'
import { Camera, CameraOff, Aperture, FlipHorizontal, RefreshCw } from 'lucide-react'
import clsx from 'clsx'
import { useCamera } from '../hooks/useCamera'

export default function CameraCapture({ onCapture, captured, onRetake }) {
  const { videoRef, error, isActive, startCamera, stopCamera, capturePhoto } = useCamera()
  const [capturing, setCapturing] = useState(false)
  const canvasRef = useRef(null)

  useEffect(() => {
    return () => stopCamera()
  }, [])

  const handleCapture = async () => {
    setCapturing(true)
    const blob = await capturePhoto()
    if (blob) onCapture(blob)
    stopCamera()
    setCapturing(false)
  }

  if (captured) {
    const url = URL.createObjectURL(captured)
    return (
      <div className="relative rounded-xl overflow-hidden border border-accent/30">
        <img src={url} alt="Capturado" className="w-full h-64 object-cover" />
        <div className="absolute inset-4 corner-bracket pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 p-4 glass flex items-center justify-between">
          <span className="text-xs text-accent font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Foto capturada
          </span>
          <button
            onClick={onRetake}
            className="flex items-center gap-2 text-xs text-subtle hover:text-text transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Tirar novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Camera viewport */}
      <div
        className={clsx(
          'relative rounded-xl overflow-hidden border border-border bg-surface',
          'h-64 flex items-center justify-center'
        )}
      >
        {isActive ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
            {/* Scan line */}
            <div className="scan-line" />
            {/* Corner brackets */}
            <div className="absolute inset-4 corner-bracket pointer-events-none" />
            {/* Face guide circle */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-36 h-44 rounded-full border border-accent/20 border-dashed" />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center p-6">
            {error ? (
              <>
                <CameraOff className="w-8 h-8 text-danger" />
                <p className="text-sm text-danger">{error}</p>
              </>
            ) : (
              <>
                <Camera className="w-8 h-8 text-muted" />
                <p className="text-sm text-subtle">Câmera inativa</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        {!isActive ? (
          <button
            onClick={startCamera}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-border hover:bg-muted/30 text-sm text-text transition-all"
          >
            <Camera className="w-4 h-4 text-accent" />
            Ativar câmera
          </button>
        ) : (
          <>
            <button
              onClick={stopCamera}
              className="px-4 py-2.5 rounded-lg border border-border text-sm text-subtle hover:text-text transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleCapture}
              disabled={capturing}
              className={clsx(
                'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all',
                'bg-accent text-void hover:bg-accent-dim',
                capturing && 'opacity-70'
              )}
            >
              <Aperture className="w-4 h-4" />
              {capturing ? 'Capturando...' : 'Capturar foto'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
