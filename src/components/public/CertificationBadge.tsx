"use client";

import { useState } from "react";
import { ShieldCheck, X } from "lucide-react";

const CERTIFICATION_INFO: Record<string, string> = {
  "globalg.a.p.":
    "GlobalG.A.P. is an international certification confirming the farm follows recognized standards for food safety, worker welfare, and environmental care.",
  "organic nepal":
    "Organic Nepal certifies the product was grown without synthetic pesticides or fertilizers, following Nepal's national organic farming standards.",
  "ipm safe":
    "IPM Safe (Integrated Pest Management) certifies pests were managed using ecological methods first, minimizing chemical pesticide use.",
  "fair trade":
    "Fair Trade certifies producers were paid a fair price and worked under ethical labor conditions.",
  "rainforest alliance":
    "Rainforest Alliance certifies the farm meets standards for environmental sustainability and worker rights.",
  haccp:
    "HACCP certifies the product's handling follows a recognized food safety management system.",
};

function getCertificationInfo(name: string): string {
  const key = name.trim().toLowerCase();
  return (
    CERTIFICATION_INFO[key] ??
    `${name} is a certification held by this producer or product, confirming it meets recognized quality or safety standards.`
  );
}

export function CertificationBadge({ name }: { name: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="badge bg-pine-50 text-pine-700 hover:bg-pine-100"
      >
        <ShieldCheck className="h-3 w-3" /> {name}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-t-2xl bg-paper p-5 sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="flex items-center gap-2 font-display text-lg text-ink">
                <ShieldCheck className="h-5 w-5 text-pine-700" /> {name}
              </p>
              <button type="button" onClick={() => setOpen(false)} className="text-ink/40 hover:text-ink">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm leading-relaxed text-ink/75">{getCertificationInfo(name)}</p>
          </div>
        </div>
      )}
    </>
  );
}