import React, { useCallback, useState } from 'react'
import clsx from 'clsx'
import { Upload, ImageIcon, X } from 'lucide-react'

export default function ImageDropzone({ onFile, label = 'Arraste ou clique para selecionar', accept = 'image/*' }) {
  const [preview, setPreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    onFile(file)
  }, [onFile])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }, [handleFile])

  const onInputChange = (e) => {
    const file = e.target.files[0]
    handleFile(file)
  }

  const clearFile = (e) => {
    e.stopPropagation()
    setPreview(null)
    onFile(null)
  }

  return (
    <div
      className={clsx(
        'relative rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden',
        isDragging
          ? 'border-accent bg-accent-glow scale-[1.01]'
          : preview
          ? 'border-border'
          : 'border-border hover:border-accent/50 hover:bg-accent-glow/50'
      )}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      onClick={() => !preview && document.getElementById('file-input').click()}
    >
      <input
        id="file-input"
        type="file"
        accept={accept}
        className="hidden"
        onChange={onInputChange}
      />

      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-void/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-sm text-subtle">Clique para trocar</span>
          </div>
          <button
            onClick={clearFile}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-surface border border-border flex items-center justify-center text-subtle hover:text-danger transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          {/* Corner brackets overlay */}
          <div className="absolute inset-4 corner-bracket pointer-events-none" />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-48 gap-3 p-6">
          <div className="w-12 h-12 rounded-full bg-border flex items-center justify-center">
            <Upload className="w-5 h-5 text-subtle" />
          </div>
          <div className="text-center">
            <p className="text-sm text-text font-medium">{label}</p>
            <p className="text-xs text-muted mt-1">JPG, PNG, WEBP — máx 10MB</p>
          </div>
        </div>
      )}
    </div>
  )
}
