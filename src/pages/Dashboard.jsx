import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  UserPlus, ShieldCheck, Activity, Cpu, Gauge,
  ChevronRight, Zap, AlertTriangle
} from 'lucide-react'
import clsx from 'clsx'
import { checkHealth } from '../services/api'

const FEATURES = [
  {
    icon: UserPlus,
    title: 'Cadastro Facial',
    description: 'Registre a face de referência de um usuário. Suporta múltiplas referências para maior precisão.',
    to: '/enroll',
    accent: '#00F5A0',
  },
  {
    icon: ShieldCheck,
    title: 'Verificar Identidade',
    description: 'Compare uma selfie contra o embedding cadastrado. Resultado em tempo real com score de distância.',
    to: '/verify',
    accent: '#00F5A0',
  },
]

const MODEL_INFO = [
  { label: 'Modelo', value: 'ArcFace', icon: Cpu },
  { label: 'Métrica', value: 'Cosine Distance', icon: Gauge },
  { label: 'Detector rápido', value: 'OpenCV', icon: Zap },
  { label: 'Detector fallback', value: 'RetinaFace', icon: Activity },
]

const THRESHOLD_INFO = [
  { label: 'Super-estrito', value: '≤ 0.33', color: 'text-accent', bg: 'bg-accent-glow border-accent/20', desc: 'Aprova diretamente, sem fallback' },
  { label: 'Estrito', value: '≤ 0.40', color: 'text-warn', bg: 'bg-yellow-900/10 border-yellow-700/20', desc: 'Aprovado com confirmação do fallback' },
  { label: 'Zona cinza', value: '≤ 0.52', color: 'text-orange-400', bg: 'bg-orange-900/10 border-orange-700/20', desc: 'Tenta fallback antes de rejeitar' },
  { label: 'Rejeição', value: '> 0.52', color: 'text-danger', bg: 'bg-danger-glow border-danger/20', desc: 'Rejeitado imediatamente' },
]

export default function Dashboard() {
  const [health, setHealth] = useState(null)
  const [healthLoading, setHealthLoading] = useState(true)

  useEffect(() => {
    checkHealth()
      .then(d => setHealth(d))
      .catch(() => setHealth(null))
      .finally(() => setHealthLoading(false))
  }, [])

  return (
    <div className="min-h-screen grid-bg">
      {/* Hero */}
      <div className="relative pt-32 pb-20 px-6">
        {/* Radial glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,245,160,0.08) 0%, transparent 70%)',
          }}
        />

        <div className="max-w-4xl mx-auto text-center relative">
          {/* Status pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface/80 text-xs font-mono mb-8">
            {healthLoading ? (
              <span className="text-muted">Conectando...</span>
            ) : health ? (
              <>
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-accent">API Online</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
                <span className="text-danger">API Offline</span>
              </>
            )}
          </div>

          <h1 className="font-display font-extrabold text-5xl sm:text-6xl leading-none tracking-tight mb-6">
            Reconhecimento
            <br />
            <span className="text-accent">Facial</span>
          </h1>

          <p className="text-lg text-subtle max-w-xl mx-auto leading-relaxed">
            Sistema de verificação biométrica baseado em <span className="text-text font-medium">ArcFace</span>,
            com detecção em dois estágios e estratégia de zona cinza para alta precisão.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-24 space-y-16">
        {/* Action cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          {FEATURES.map(({ icon: Icon, title, description, to }) => (
            <Link
              key={to}
              to={to}
              className="group relative rounded-2xl border border-border bg-surface p-6 hover:border-accent/40 transition-all duration-300 hover:shadow-glow-sm overflow-hidden"
            >
              <div className="absolute inset-0 bg-accent-glow opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative space-y-4">
                <div className="w-11 h-11 rounded-xl bg-panel border border-border flex items-center justify-center group-hover:border-accent/30 transition-colors">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg">{title}</h2>
                  <p className="text-sm text-subtle mt-1.5 leading-relaxed">{description}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-accent font-medium">
                  Acessar
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        

        {/* Threshold explanation */}
        <section className="space-y-4">
          <h2 className="font-display font-bold text-lg flex items-center gap-2">
            <Gauge className="w-5 h-5 text-accent" />
            Limiares de Decisão
          </h2>
          <p className="text-sm text-subtle">
            O sistema usa distância coseno — quanto <strong className="text-text">menor</strong>, mais similar a face é.
            A estratégia em dois estágios reduz falsos positivos sem comprometer a velocidade.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {THRESHOLD_INFO.map(({ label, value, color, bg, desc }) => (
              <div key={label} className={`rounded-xl border p-4 ${bg}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-text">{label}</span>
                  <span className={`font-mono text-sm font-bold ${color}`}>{value}</span>
                </div>
                <p className="text-xs text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Flow diagram */}
        <section className="space-y-4">
          <h2 className="font-display font-bold text-lg flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            Fluxo de Verificação
          </h2>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex flex-col gap-1 font-mono text-xs text-muted">
              {[
                { step: '1', text: 'Detectar face com OpenCV (rápido)', color: 'text-accent' },
                { step: '2', text: 'Calcular embedding ArcFace', color: 'text-accent' },
                { step: '3a', text: 'Distância ≤ 0.33 → Aprovado direto ✓', color: 'text-accent' },
                { step: '3b', text: 'Distância > 0.52 → Rejeitado ✗', color: 'text-danger' },
                { step: '4', text: 'Zona cinza (0.33–0.52) → Fallback RetinaFace', color: 'text-warn' },
                { step: '5a', text: 'Embedding fallback ≤ 0.40 → Aprovado ✓', color: 'text-accent' },
                { step: '5b', text: 'Embedding fallback > 0.40 → Rejeitado ✗', color: 'text-danger' },
              ].map(({ step, text, color }) => (
                <div key={step} className="flex items-center gap-3 py-1.5">
                  <span className="text-muted w-6 shrink-0">{step}</span>
                  <span className="w-px h-4 bg-border shrink-0" />
                  <span className={color}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {!health && !healthLoading && (
          <div className="rounded-xl border border-warn/30 bg-yellow-900/10 p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warn shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-warn">API não encontrada</p>
              <p className="text-xs text-muted mt-1">
                Certifique-se de que o servidor FastAPI está rodando em{' '}
                <code className="text-subtle">http://localhost:8000</code> e configure a variável{' '}
                <code className="text-subtle">VITE_API_URL</code> se necessário.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
