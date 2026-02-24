import { useState, useRef, useCallback } from 'react'

export function useCamera() {
  const videoRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [error, setError] = useState(null)
  const [isActive, setIsActive] = useState(false)

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setStream(mediaStream)
      setIsActive(true)
    } catch (err) {
      setError('Não foi possível acessar a câmera. Verifique as permissões.')
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop())
      setStream(null)
      setIsActive(false)
    }
  }, [stream])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return null
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0)
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.92)
    })
  }, [])

  return { videoRef, stream, error, isActive, startCamera, stopCamera, capturePhoto }
}
