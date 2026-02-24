import React from 'react'
import { CheckCircle, XCircle, AlertCircle, Gauge, Cpu, Zap } from 'lucide-react'
import clsx from 'clsx'

const PATH_LABELS = {
  fast_only: 'Aprovado — detecção rápida',
  'fast+fallback_confirmed': 'Aprovado — confirmado pelo fallback',
  rejected: 'Rejeitado',
  no_face: 'Nenhuma face detectada',
}

const REASON_LABELS = {
  super_strict_pass: 'Passou no limiar super-estrito (≤ 0.33)',
  fallback_confirmed: 'Confirmado pelo detector RetinaFace',
  above_strict: 'Distância acima do limiar estrito',
  fallback_failed: 'Falhou na verificação com fallback',
  no_face_detected_fast: 'Sem face detectada (opencv)',
  no_face_detected_fallback: 'Sem face detectada (retinaface)',
}

function DistanceBar({ value, thresholds }) {
  const pct = Math.min((value / 0.8) * 100, 100)
  const superStrictPct = (thresholds.super_strict / 0.8) * 100
  const strictPct = (thresholds.strict / 0.8) * 100
  const loosePct = (thresholds.loose / 0.8) * 100

  const getColor = () => {
    if (value <= thresholds.super_strict) return '#00F5A0'
    if (value <= thresholds.strict) return '#F59E0B'
    return '#EF4444'
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-muted font-mono">
        <span>0.0 (idêntico)</span>
        <span>0.8 (diferente)</span>
      </div>
      <div className="relative h-3 bg-border rounded-full overflow-hidden">
        {/* Zones */}
        <div
          className="absolute left-0 top-0 h-full opacity-20"
          style={{ width: `${superStrictPct}%`, background: '#00F5A0' }}
        />
        <div
          className="absolute top-0 h-full opacity-10"
          style={{
            left: `${superStrictPct}%`,
            width: `${strictPct - superStrictPct}%`,
            background: '#F59E0B',
          }}
        />
        <div
          className="absolute top-0 h-full opacity-10"
          style={{
            left: `${strictPct}%`,
            width: `${loosePct - strictPct}%`,
            background: '#EF4444',
          }}
        />

        {/* Fill */}
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: getColor() }}
        />

        {/* Threshold markers */}
        {[
          { pct: superStrictPct, label: 'Super', color: '#00F5A0' },
          { pct: strictPct, label: 'Estrito', color: '#F59E0B' },
          { pct: loosePct, label: 'Loose', color: '#EF4444' },
        ].map(({ pct: p, label, color }) => (
          <div
            key={label}
            className="absolute top-0 h-full w-px"
            style={{ left: `${p}%`, background: color, opacity: 0.7 }}
          />
        ))}
      </div>
      {/* Threshold legend */}
      <div className="flex gap-3 text-xs font-mono">
        {[
          { label: `Super ≤${thresholds.super_strict}`, color: 'text-accent' },
          { label: `Estrito ≤${thresholds.strict}`, color: 'text-warn' },
          { label: `Loose ≤${thresholds.loose}`, color: 'text-danger' },
        ].map(({ label, color }) => (
          <span key={label} className={`${color} opacity-70`}>{label}</span>
        ))}
      </div>
    </div>
  )
}

export default function VerifyResultCard({ result }) {
  const { verified, distance, threshold, reason, path, model, metric } = result

  const thresholds = {
    super_strict: result.threshold_super_strict ?? 0.33,
    strict: threshold ?? 0.40,
    loose: result.threshold_loose ?? 0.52,
  }

  return (
    <div
      className={clsx(
        'rounded-2xl border overflow-hidden animate-slide-up',
        verified
          ? 'border-accent/30 shadow-glow'
          : 'border-danger/30 shadow-danger-glow'
      )}
    >
      {/* Header */}
      <div
        className={clsx(
          'flex items-center gap-4 p-5',
          verified ? 'bg-accent-glow' : 'bg-danger-glow'
        )}
      >
        <div
          className={clsx(
            'w-12 h-12 rounded-full flex items-center justify-center border-2',
            verified
              ? 'border-accent bg-void text-accent'
              : 'border-danger bg-void text-danger'
          )}
        >
          {verified ? (
            <CheckCircle className="w-6 h-6" />
          ) : (
            <XCircle className="w-6 h-6" />
          )}
        </div>
        <div>
          <p className="font-display font-bold text-xl">
            {verified ? 'Identidade Confirmada' : 'Verificação Falhou'}
          </p>
          <p className="text-sm text-subtle mt-0.5">
            {PATH_LABELS[path] || path}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-5 bg-surface">
        {/* Distance meter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-subtle flex items-center gap-2">
              <Gauge className="w-4 h-4" />
              Distância coseno
            </span>
            <span
              className={clsx(
                'font-mono text-lg font-bold',
                distance <= thresholds.super_strict
                  ? 'text-accent'
                  : distance <= thresholds.strict
                  ? 'text-warn'
                  : 'text-danger'
              )}
            >
              {distance.toFixed(4)}
            </span>
          </div>
          <DistanceBar value={distance} thresholds={thresholds} />
        </div>

        <div className="h-px bg-border" />

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3">
          <DetailBox
            icon={<AlertCircle className="w-3.5 h-3.5" />}
            label="Motivo"
            value={REASON_LABELS[reason] || reason}
          />
          <DetailBox
            icon={<Zap className="w-3.5 h-3.5" />}
            label="Caminho"
            value={path}
            mono
          />
          <DetailBox
            icon={<Cpu className="w-3.5 h-3.5" />}
            label="Modelo"
            value={model || '—'}
            mono
          />
          <DetailBox
            label="Métrica"
            value={metric || 'cosine'}
            mono
          />
        </div>

        {/* Best ref index */}
        {result.best_reference_index !== null && result.best_reference_index !== undefined && (
          <div className="rounded-lg bg-panel border border-border px-4 py-2.5 flex items-center justify-between">
            <span className="text-xs text-muted">Melhor referência</span>
            <span className="font-mono text-sm text-text">
              Ref #{result.best_reference_index}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

function DetailBox({ icon, label, value, mono }) {
  return (
    <div className="rounded-lg bg-panel border border-border p-3 space-y-1">
      <div className="flex items-center gap-1.5 text-xs text-muted">
        {icon}
        <span>{label}</span>
      </div>
      <p className={clsx('text-sm text-text leading-tight', mono && 'font-mono text-xs')}>
        {value}
      </p>
    </div>
  )
}
