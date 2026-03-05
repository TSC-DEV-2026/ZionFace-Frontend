import React, { useEffect, useMemo, useRef, useState } from "react";
import { Camera, CameraOff, Aperture, RefreshCw } from "lucide-react";
import clsx from "clsx";
import { useCamera } from "../hooks/useCamera";

export default function CameraCapture({ onCapture, captured, onRetake }) {
  const { videoRef, error, isActive, startCamera, stopCamera, capturePhoto } = useCamera();
  const [capturing, setCapturing] = useState(false);

  // evita stopCamera por remount do DEV (HMR / remount inesperado)
  const allowCleanupStopRef = useRef(false);

  console.log("[CameraCapture] render isActive=", isActive, "error=", error);

  useEffect(() => {
    return () => {
      // Em DEV, HMR/remount pode desmontar o componente sem você sair da tela.
      // Então só paramos a câmera no unmount se tivermos marcado que é seguro.
      if (!allowCleanupStopRef.current) {
        console.log("[CameraCapture] unmount -> IGNORADO (DEV remount/HMR)");
        return;
      }

      console.log("[CameraCapture] unmount -> stopCamera()");
      stopCamera();
    };
  }, [stopCamera]);

  const capturedUrl = useMemo(() => {
    if (!captured) return null;
    return URL.createObjectURL(captured);
  }, [captured]);

  useEffect(() => {
    return () => {
      if (capturedUrl) URL.revokeObjectURL(capturedUrl);
    };
  }, [capturedUrl]);

  const handleCapture = async () => {
    console.log("[CameraCapture] handleCapture start");
    setCapturing(true);

    const blob = await capturePhoto();
    console.log("[CameraCapture] capturePhoto blob=", blob);

    if (blob) onCapture(blob);

    // aqui é intencional parar a câmera
    allowCleanupStopRef.current = true;
    console.log("[CameraCapture] stopCamera() after capture");
    stopCamera();

    setCapturing(false);
    console.log("[CameraCapture] handleCapture end");
  };

  if (captured && capturedUrl) {
    return (
      <div className="relative rounded-xl overflow-hidden border border-accent/30">
        <img src={capturedUrl} alt="Capturado" className="w-full h-64 object-cover" />
        <div className="absolute inset-4 corner-bracket pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 p-4 glass flex items-center justify-between">
          <span className="text-xs text-accent font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Foto capturada
          </span>
          <button
            type="button"
            onClick={() => {
              console.log("[CameraCapture] click retake");
              onRetake();
            }}
            className="flex items-center gap-2 text-xs text-subtle hover:text-text transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Tirar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        className={clsx(
          "relative rounded-xl overflow-hidden border border-border bg-surface",
          "h-64 flex items-center justify-center"
        )}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={clsx(
            "w-full h-full object-cover scale-x-[-1] transition-opacity",
            isActive ? "opacity-100" : "opacity-0"
          )}
        />

        {isActive && (
          <>
            <div className="scan-line" />
            <div className="absolute inset-4 corner-bracket pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-36 h-44 rounded-full border border-accent border-dashed" />
            </div>
          </>
        )}

        {!isActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center p-6">
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

      <div className="flex gap-2">
        {!isActive ? (
          <button
            type="button"
            onClick={() => {
              console.log("[CameraCapture] click ativar");
              // não queremos stopCamera em remount DEV
              allowCleanupStopRef.current = false;
              startCamera();
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-border hover:bg-muted/30 text-sm text-text transition-all"
          >
            <Camera className="w-4 h-4 text-accent" />
            Ativar câmera
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => {
                console.log("[CameraCapture] click cancelar -> stopCamera()");
                allowCleanupStopRef.current = true;
                stopCamera();
              }}
              className="px-4 py-2.5 rounded-lg border border-border text-sm text-subtle hover:text-text transition-colors"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleCapture}
              disabled={capturing}
              className={clsx(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
                "bg-accent text-void hover:bg-accent-dim",
                capturing && "opacity-70"
              )}
            >
              <Aperture className="w-4 h-4" />
              {capturing ? "Capturando..." : "Capturar foto"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}