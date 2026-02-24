// src/pages/IdentifyPage.jsx
import { useMemo, useState } from "react";
import ImageDropzone from "../components/ImageDropzone";
import CameraCapture from "../components/CameraCapture";
import LoadingSpinner from "../components/LoadingSpinner";
import IdentifyResultCard from "../components/IdentifyResultCard";
import { identifyFace } from "../services/api";

export default function IdentifyPage() {
  const [mode, setMode] = useState("upload"); // upload | camera
  const [file, setFile] = useState(null);
  const [capturedBlob, setCapturedBlob] = useState(null);

  const [topK, setTopK] = useState(5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const imageSource = useMemo(() => {
    if (mode === "camera") return capturedBlob;
    return file;
  }, [mode, capturedBlob, file]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!imageSource) {
      setError("Envie uma imagem ou capture pela câmera.");
      return;
    }

    setLoading(true);
    try {
      const data = await identifyFace(imageSource, Number(topK) || 5);
      setResult(data);
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Falha ao identificar";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Identificação 1:N</h1>
        <p className="text-sm opacity-80">
          Envie apenas a foto. O sistema retorna o usuário mais provável (se passar no threshold/margin).
        </p>
      </div>

      <div className="rounded-2xl border bg-white/5 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setMode("upload");
              setCapturedBlob(null);
            }}
            className={`rounded-xl px-3 py-2 text-sm ${mode === "upload" ? "bg-white/15" : "bg-white/5"}`}
          >
            Upload
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("camera");
              setFile(null);
            }}
            className={`rounded-xl px-3 py-2 text-sm ${mode === "camera" ? "bg-white/15" : "bg-white/5"}`}
          >
            Câmera
          </button>

          <div className="ml-auto flex items-center gap-2">
            <label className="text-sm opacity-80">top_k</label>
            <input
              type="number"
              min={2}
              max={50}
              value={topK}
              onChange={(e) => setTopK(e.target.value)}
              className="w-24 rounded-xl border bg-white/5 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="mt-4">
          {mode === "upload" ? (
            <ImageDropzone onFile={setFile} />
          ) : (
            <CameraCapture
              onCapture={(blob) => setCapturedBlob(blob)}
              capturedBlob={capturedBlob}
              onReset={() => setCapturedBlob(null)}
            />
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-white/15 px-4 py-2 text-sm hover:bg-white/20 disabled:opacity-50"
          >
            Identificar
          </button>

          {loading && <LoadingSpinner />}
          {error && <span className="text-sm text-red-300">{error}</span>}
        </form>
      </div>

      {result && <IdentifyResultCard result={result} />}
    </div>
  );
}
