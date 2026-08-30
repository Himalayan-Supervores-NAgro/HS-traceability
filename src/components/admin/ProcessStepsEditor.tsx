"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";

export type ProcessStepSummary = {
  id: string;
  order: number;
  title: string;
  description: string | null;
  photoUrl: string | null;
};

export function ProcessStepsEditor({
  productId,
  initialSteps,
}: {
  productId: string;
  initialSteps: ProcessStepSummary[];
}) {
  const router = useRouter();
  const [steps, setSteps] = useState<ProcessStepSummary[]>(
    [...initialSteps].sort((a, b) => a.order - b.order)
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function addStep(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/products/${productId}/process-steps`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description: description || null, photoUrl: photoUrl || null }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Could not add this step.");
      return;
    }
    const data = await res.json();
    setSteps((s) => [...s, data.step]);
    setTitle("");
    setDescription("");
    setPhotoUrl("");
    router.refresh();
  }

  async function removeStep(id: string) {
    setBusyId(id);
    await fetch(`/api/process-steps/${id}`, { method: "DELETE" });
    setSteps((s) => s.filter((step) => step.id !== id));
    setBusyId(null);
    router.refresh();
  }

  async function move(id: string, direction: -1 | 1) {
    const index = steps.findIndex((s) => s.id === id);
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= steps.length) return;

    const reordered = [...steps];
    [reordered[index], reordered[swapIndex]] = [reordered[swapIndex], reordered[index]];
    setSteps(reordered);

    setBusyId(id);
    await Promise.all(
      reordered.map((step, i) =>
        fetch(`/api/process-steps/${step.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: i }),
        })
      )
    );
    setBusyId(null);
    router.refresh();
  }

  return (
    <div className="card p-5">
      <h2 className="mb-1 font-display text-lg">Production process</h2>
      <p className="mb-4 text-sm text-sage">
        Optional steps shown on the public page — e.g. "Hand-sorting", "Sun-drying".
      </p>

      {error && <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {steps.length > 0 && (
        <ul className="mb-5 space-y-3">
          {steps.map((step, i) => (
            <li key={step.id} className="flex gap-3 rounded-md border border-line p-3">
              {step.photoUrl && (
                <img src={step.photoUrl} alt={step.title} className="h-14 w-14 rounded object-cover" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-ink">{step.title}</p>
                {step.description && <p className="text-xs text-sage">{step.description}</p>}
              </div>
              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(step.id, -1)}
                  disabled={i === 0 || busyId === step.id}
                  className="text-ink/40 hover:text-ink disabled:opacity-30"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => move(step.id, 1)}
                  disabled={i === steps.length - 1 || busyId === step.id}
                  className="text-ink/40 hover:text-ink disabled:opacity-30"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeStep(step.id)}
                disabled={busyId === step.id}
                className="text-ink/40 hover:text-red-700"
              >
                {busyId === step.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={addStep} className="space-y-3 border-t border-line pt-4">
        <input
          className="field-input"
          placeholder="Step title, e.g. Sun-drying"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="field-input min-h-16"
          placeholder="Short description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <ImageUpload value={photoUrl} onChange={setPhotoUrl} />
        <button type="submit" disabled={loading || !title.trim()} className="btn-secondary text-xs">
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
          Add step
        </button>
      </form>
    </div>
  );
}