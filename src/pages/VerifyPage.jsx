import React, { useState } from 'react'
import { ShieldCheck, Camera, Upload, RefreshCw, Info } from 'lucide-react'
import clsx from 'clsx'
import ImageDropzone from '../components/ImageDropzone'
import CameraCapture from '../components/CameraCapture'
import VerifyResultCard from '../components/VerifyResultCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { verifyFace } from '../services/api'

export default function VerifyPage() {
  const [userId, setUserId] = useState('')
  const [inputMode, setInputMode] = useState('upload')
  const [file, setFile] = useState(null)
  const [capturedBlob, setCapturedBlob] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const imageSource = inputMode === 'camera' ? capturedBlob : file
  const canSubmit = userId.trim() && imageSource && !loading

  const handleSubmit = async () => {
    if (!canSubmit) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await verifyFace(userId.trim(), imageSource)
      setResult(data)
    } catch (err) {
      const msg = err?.response?.data?.detail || err.message || 'Erro ao verificar'
      const status = err?.response?.status
      if (status === 404) {
        setError(`Usuário "${userId}" não encontrado. Faça o cadastro primeiro.`)
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setResult(null)
    setError(null)
    setFile(null)
    setCapturedBlob(null)
  }

  return (
    <div className="min-h-screen grid-bg pt-24 pb-16 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-accent-glow border border-accent/20 flex items-center justify-center">
              <ShieldCheck className="w-4.5 h-4.5 text-accent" />
            </div>
            <h1 className="font-display font-bold text-2xl">Verificar Identidade</h1>
          </div>
          <p className="text-sm text-subtle ml-12">
            Compare uma selfie com o embedding cadastrado. O resultado inclui score de distância e caminho de decisão.
          </p>
        </div>

        <div className="space-y-5">
          {/* User ID */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text">
              User ID
              <span className="text-accent ml-1">*</span>
            </label>
            <input
              type="text"
              value={userId}
              onChange={e => { setUserId(e.target.value); reset() }}
              placeholder="ex: user_123, joao.silva, etc"
              className={clsx(
                'w-full bg-surface border rounded-xl px-4 py-3 text-sm font-mono outline-none transition-all',
                'placeholder:text-muted text-text',
                userId
                  ? 'border-accent/30 focus:border-accent shadow-glow-sm'
                  : 'border-border focus:border-accent/50'
              )}
            />
          </div>

          {/* Image input */}
          <div className="space-y-3">
            <div className="flex gap-1 p-1 bg-panel rounded-xl border border-border">
              {[
                { id: 'upload', label: 'Upload', icon: Upload },
                { id: 'camera', label: 'Câmera', icon: Camera },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => { setInputMode(id); reset() }}
                  className={clsx(
                    'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all',
                    inputMode === id
                      ? 'bg-surface border border-border text-text shadow-sm'
                      : 'text-muted hover:text-subtle'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            {inputMode === 'upload' ? (
              <ImageDropzone
                onFile={(f) => { setFile(f); resetResult() }}
                label="Arraste a selfie para verificar"
              />
            ) : (
              <CameraCapture
                onCapture={setCapturedBlob}
                captured={capturedBlob}
                onRetake={() => { setCapturedBlob(null); reset() }}
              />
            )}
          </div>

          {/* Tip */}
          <div className="flex gap-2 text-xs text-muted rounded-lg bg-panel border border-border p-3">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-accent/60" />
            <span>A verificação usa detecção rápida (OpenCV) com fallback para RetinaFace em casos ambíguos — balanceando velocidade e precisão.</span>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-danger/30 bg-danger-glow p-4 text-sm text-danger animate-slide-up">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && <LoadingSpinner message="Verificando identidade..." />}

          {/* Result */}
          {result && !loading && (
            <div className="space-y-4">
              <VerifyResultCard result={result} />
              <button
                onClick={reset}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-sm text-subtle hover:text-text hover:border-accent/30 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Nova verificação
              </button>
            </div>
          )}

          {/* Submit */}
          {!loading && !result && (
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={clsx(
                'w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-display font-semibold text-sm transition-all',
                canSubmit
                  ? 'bg-accent text-void hover:bg-accent-dim shadow-glow'
                  : 'bg-border text-muted cursor-not-allowed'
              )}
            >
              <ShieldCheck className="w-4 h-4" />
              Verificar Identidade
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
