// src/components/IdentifyResultCard.jsx
export default function IdentifyResultCard({ result }) {
  const identified = !!result?.identified;

  return (
    <div className="rounded-2xl border bg-white/5 p-5 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">
            Resultado: {identified ? "IDENTIFICADO" : "NÃO IDENTIFICADO"}
          </h2>
          <p className="text-sm opacity-80">{result?.reason}</p>
          <p className="text-xs opacity-70 mt-1">
            path: <span className="opacity-90">{result?.path}</span>
          </p>
        </div>

        {identified && (
          <div className="rounded-xl bg-white/10 px-3 py-2 text-right">
            <div className="text-xs opacity-70">best_user_id</div>
            <div className="text-base font-semibold">{result?.best_user_id}</div>
          </div>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Info label="distance" value={fmt(result?.distance)} />
        <Info label="threshold" value={fmt(result?.threshold)} />
        <Info label="top_k" value={String(result?.top_k?.length ?? 0)} />
      </div>

      <div className="rounded-xl bg-black/20 p-3 text-xs">
        <div className="grid gap-2 md:grid-cols-4">
          <Info label="model" value={result?.model} />
          <Info label="metric" value={result?.metric} />
          <Info label="fast" value={result?.detector_fast} />
          <Info label="fallback" value={result?.detector_fallback} />
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-semibold">Candidatos</div>
        <div className="overflow-hidden rounded-xl border bg-white/5">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left">
              <tr>
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">user_id</th>
                <th className="px-3 py-2">distance</th>
                <th className="px-3 py-2">ref</th>
              </tr>
            </thead>
            <tbody>
              {(result?.top_k ?? []).map((c, i) => (
                <tr key={`${c.user_id}-${i}`} className="border-t border-white/10">
                  <td className="px-3 py-2">{i + 1}</td>
                  <td className="px-3 py-2 font-medium">{c.user_id}</td>
                  <td className="px-3 py-2">{fmt(c.distance)}</td>
                  <td className="px-3 py-2">{String(c.ref_index)}</td>
                </tr>
              ))}
              {(result?.top_k ?? []).length === 0 && (
                <tr>
                  <td className="px-3 py-3 text-sm opacity-70" colSpan={4}>
                    Nenhum candidato retornado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl bg-white/5 px-3 py-2">
      <div className="text-xs opacity-70">{label}</div>
      <div className="text-sm font-medium">{value ?? "-"}</div>
    </div>
  );
}

function fmt(v) {
  if (v === null || v === undefined) return "-";
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return n.toFixed(4);
}
