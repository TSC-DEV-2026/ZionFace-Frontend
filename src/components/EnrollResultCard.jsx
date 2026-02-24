import React from 'react'
import { CheckCircle, Database, Layers, Settings } from 'lucide-react'

export default function EnrollResultCard({ result }) {
  const { user_id, num_references, embedding_size, model, metric, detector_fast, detector_fallback } = result

  return (
    <div className="rounded-2xl border border-accent/30 shadow-glow overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="bg-accent-glow p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-accent bg-void text-accent flex items-center justify-center">
          <CheckCircle className="w-6 h-6" />
        </div>
        <div>
          <p className="font-display font-bold text-xl">Cadastro Realizado</p>
          <p className="text-sm text-subtle mt-0.5">Embedding de referência salvo com sucesso</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4 bg-surface">
        {/* User ID highlight */}
        <div className="rounded-xl bg-panel border border-border px-5 py-3 flex items-center justify-between">
          <span className="text-sm text-muted">User ID</span>
          <span className="font-mono text-accent font-medium">{user_id}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-panel border border-border p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <Layers className="w-3.5 h-3.5" />
              Referências totais
            </div>
            <p className="text-2xl font-display font-bold text-accent">{num_references}</p>
          </div>
          <div className="rounded-lg bg-panel border border-border p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <Database className="w-3.5 h-3.5" />
              Tamanho do embedding
            </div>
            <p className="text-2xl font-display font-bold text-text">{embedding_size}D</p>
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Config */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted mb-3">
            <Settings className="w-3.5 h-3.5" />
            Configurações usadas
          </div>
          {[
            { label: 'Modelo', value: model },
            { label: 'Métrica', value: metric },
            { label: 'Detector rápido', value: detector_fast },
            { label: 'Detector fallback', value: detector_fallback },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center text-sm">
              <span className="text-muted">{label}</span>
              <span className="font-mono text-xs text-subtle bg-border px-2 py-0.5 rounded">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
