import { useState, useRef, useCallback } from "react";

export function useCamera() {
  const videoRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const startCamera = useCallback(async () => {
    console.log("[useCamera] startCamera called");

    try {
      setError(null);

      if (!navigator.mediaDevices?.getUserMedia) {
        console.log("[useCamera] getUserMedia not supported");
        setError("Seu navegador não suporta câmera (getUserMedia).");
        return;
      }

      if (stream) {
        console.log("[useCamera] closing previous stream");
        stream.getTracks().forEach((t) => t.stop());
        setStream(null);
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      console.log(
        "[useCamera] got stream",
        mediaStream?.id,
        mediaStream?.getTracks?.().map((t) => `${t.kind}:${t.readyState}`)
      );

      const video = videoRef.current;
      console.log("[useCamera] videoRef.current =", video);

      if (!video) {
        mediaStream.getTracks().forEach((t) => t.stop());
        setError("Elemento de vídeo não encontrado.");
        return;
      }

      video.srcObject = mediaStream;
      video.muted = true;
      video.playsInline = true;

      // ATIVA IMEDIATO (pra UI renderizar o modo ativo)
      setStream(mediaStream);
      setIsActive(true);
      console.log("[useCamera] setIsActive(true) + setStream");

      const tryPlay = async () => {
        try {
          const p = video.play();
          if (p && typeof p.then === "function") await p;
          console.log(
            "[useCamera] video.play OK | dims:",
            video.videoWidth,
            video.videoHeight
          );
        } catch (e) {
          console.log("[useCamera] video.play FAIL", e?.name, e?.message);
        }
      };

      tryPlay();
      setTimeout(tryPlay, 150);
      setTimeout(() => {
        console.log(
          "[useCamera] after 400ms dims:",
          video.videoWidth,
          video.videoHeight
        );
      }, 400);
    } catch (err) {
      console.log("[useCamera] getUserMedia ERROR:", err, err?.name, err?.message);

      const name = err?.name || "";
      if (name === "NotAllowedError") setError("Permissão da câmera negada no navegador.");
      else if (name === "NotFoundError") setError("Nenhuma câmera foi encontrada no dispositivo.");
      else if (name === "NotReadableError") setError("A câmera está em uso por outro app ou falhou ao iniciar.");
      else setError("Não foi possível acessar a câmera.");

      setIsActive(false);
    }
  }, [stream]);

  const stopCamera = useCallback(() => {
    console.log("[useCamera] stopCamera called");

    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setStream(null);
    setIsActive(false);
  }, [stream]);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    console.log("[useCamera] capturePhoto video=", video);

    if (!video) return null;

    const w = video.videoWidth;
    const h = video.videoHeight;

    console.log("[useCamera] capturePhoto dims:", w, h);

    if (!w || !h) return null;

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, w, h);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.92);
    });
  }, []);

  return { videoRef, stream, error, isActive, startCamera, stopCamera, capturePhoto };
}