import React from 'react'
import clsx from 'clsx'

export default function LoadingSpinner({ message = 'Processando...', size = 'md' }) {
  return (
    <div className="flex flex-col items-center gap-4 py-8 animate-fade-in">
      {/* Animated rings */}
      <div className="relative">
        <div
          className={clsx(
            'rounded-full border-2 border-border animate-spin',
            size === 'sm' ? 'w-8 h-8' : 'w-14 h-14'
          )}
          style={{ borderTopColor: '#00F5A0' }}
        />
        <div
          className={clsx(
            'absolute inset-2 rounded-full border border-accent/20 animate-spin',
          )}
          style={{ animationDirection: 'reverse', animationDuration: '1.5s', borderTopColor: 'rgba(0,245,160,0.4)' }}
        />
        <div
          className={clsx(
            'absolute inset-0 flex items-center justify-center',
            size === 'sm' ? 'text-xs' : 'text-sm'
          )}
        >
          <span className="text-accent opacity-50 font-mono">⠿</span>
        </div>
      </div>

      {message && (
        <div className="text-center space-y-1">
          <p className="text-sm text-subtle font-medium">{message}</p>
          <p className="text-xs text-muted">Isso pode levar alguns segundos...</p>
        </div>
      )}
    </div>
  )
}
