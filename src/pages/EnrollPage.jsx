import React, { useState, useCallback } from 'react'
import { UserPlus, Camera, Upload, Plus, RefreshCw, Info } from 'lucide-react'
import clsx from 'clsx'
import ImageDropzone from '../components/ImageDropzone'
import CameraCapture from '../components/CameraCapture'
import EnrollResultCard from '../components/EnrollResultCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { enrollFace } from '../services/api'

const INPUT_MODES = ['upload', 'camera']

export default function EnrollPage() {
  const [userId, setUserId] = useState('')
  const [inputMode, setInputMode] = useState('upload')
  const [file, setFile] = useState(null)
  const [capturedBlob, setCapturedBlob] = useState(null)
  const [append, setAppend] = useState(false)
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
      const data = await enrollFace(userId.trim(), imageSource, append)
      setResult({ ...data, user_id: userId.trim() })
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || 'Erro ao cadastrar')
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
              <UserPlus className="w-4.5 h-4.5 text-accent" />
            </div>
            <h1 className="font-display font-bold text-2xl">Cadastro Facial</h1>
          </div>
          <p className="text-sm text-subtle ml-12">
            Registre o embedding de referência de um usuário. Use fotos nítidas com boa iluminação.
          </p>
        </div>

        {result ? (
          <div className="space-y-4">
            <EnrollResultCard result={result} />
            <div className="flex gap-2 pt-2">
              <button
                onClick={reset}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-sm text-subtle hover:text-text hover:border-accent/30 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Novo cadastro
              </button>
              <button
                onClick={() => {
                  reset()
                  setAppend(true)
                  setUserId(result.user_id)
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-accent-glow border border-accent/20 text-sm text-accent hover:bg-accent/10 transition-all"
              >
                <Plus className="w-4 h-4" />
                Adicionar referência
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* User ID field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">
                User ID
                <span className="text-accent ml-1">*</span>
              </label>
              <input
                type="text"
                value={userId}
                onChange={e => setUserId(e.target.value)}
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

            {/* Append toggle */}
            <div
              className={clsx(
                'flex items-center justify-between rounded-xl border p-4 cursor-pointer transition-all',
                append
                  ? 'border-accent/30 bg-accent-glow'
                  : 'border-border bg-surface hover:border-border/80'
              )}
              onClick={() => setAppend(v => !v)}
            >
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-text">Adicionar referência</p>
                <p className="text-xs text-muted">Mantém as referências anteriores do usuário</p>
              </div>
              <div
                className={clsx(
                  'w-10 h-6 rounded-full transition-all relative',
                  append ? 'bg-accent' : 'bg-border'
                )}
              >
                <div
                  className={clsx(
                    'absolute top-1 w-4 h-4 rounded-full bg-void transition-all',
                    append ? 'left-5' : 'left-1'
                  )}
                />
              </div>
            </div>

            {/* Image input tabs */}
            <div className="space-y-3">
              <div className="flex gap-1 p-1 bg-panel rounded-xl border border-border">
                {[
                  { id: 'upload', label: 'Upload', icon: Upload },
                  { id: 'camera', label: 'Câmera', icon: Camera },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setInputMode(id)}
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
                  onFile={setFile}
                  label="Arraste a foto de referência aqui"
                />
              ) : (
                <CameraCapture
                  onCapture={setCapturedBlob}
                  captured={capturedBlob}
                  onRetake={() => setCapturedBlob(null)}
                />
              )}
            </div>

            {/* Tip */}
            <div className="flex gap-2 text-xs text-muted rounded-lg bg-panel border border-border p-3">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-accent/60" />
              <span>Use fotos frontais, com boa iluminação e sem óculos escuros. O detector RetinaFace é usado no cadastro para máxima qualidade.</span>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-danger/30 bg-danger-glow p-4 text-sm text-danger animate-slide-up">
                {error}
              </div>
            )}

            {/* Submit */}
            {loading ? (
              <LoadingSpinner message="Extraindo embedding de referência..." />
            ) : (
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
                <UserPlus className="w-4 h-4" />
                Cadastrar Face
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
