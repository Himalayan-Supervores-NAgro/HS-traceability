"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, ArrowUp, ArrowDown, Pencil, X } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { csvList } from "@/lib/utils";

export type ProcessStepSummary = {
  id: string;
  order: number;
  title: string;
  description: string | null;
  photoUrls: string | null;
};

function StepPhotosEditor({
  photoUrls,
  onChange,
}: {
  photoUrls: string;
  onChange: (value: string) => void;
}) {
  const urls = csvList(photoUrls);

  function addPhoto(url: string) {
    if (!url) return;
    onChange([...urls, url].join(","));
  }

  function removePhoto(index: number) {
    onChange(urls.filter((_, i) => i !== index).join(","));
  }

  return (
    <div>
      {urls.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {urls.map((url, i) => (
            <div key={i} className="relative">
              <img src={url} alt="" className="h-16 w-16 rounded-md object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute -right-1.5 -top-1.5 rounded-full bg-ink p-0.5 text-paper hover:bg-red-700"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      <ImageUpload value="" onChange={addPhoto} />
      <p className="mt-1 text-xs text-sage">Add one or more photos for this step.</p>
    </div>
  );
}

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
  const [editingId, setEditingId] = useState<string | null>(null);

  // New-step form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrls, setPhotoUrls] = useState("");

  // Edit form state (separate so editing one step doesn't clash with the "add" form)
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPhotoUrls, setEditPhotoUrls] = useState("");

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
      body: JSON.stringify({
        title,
        description: description || null,
        photoUrls: photoUrls || null,
      }),
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
    setPhotoUrls("");
    router.refresh();
  }

  function startEdit(step: ProcessStepSummary) {
    setEditingId(step.id);
    setEditTitle(step.title);
    setEditDescription(step.description ?? "");
    setEditPhotoUrls(step.photoUrls ?? "");
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(id: string) {
    setBusyId(id);
    setError(null);
    const res = await fetch(`/api/process-steps/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editTitle,
        description: editDescription || null,
        photoUrls: editPhotoUrls || null,
      }),
    });
    setBusyId(null);
    if (!res.ok) {
      setError("Could not save changes.");
      return;
    }
    const data = await res.json();
    setSteps((s) => s.map((step) => (step.id === id ? data.step : step)));
    setEditingId(null);
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
      <h2 className="mb-1 font-display text-lg">Processing steps</h2>
      <p className="mb-4 text-sm text-sage">
        Optional steps shown on the public page — e.g. "Hand-sorting", "Sun-drying".
      </p>

      {error && <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {steps.length > 0 && (
        <ul className="mb-5 space-y-3">
          {steps.map((step, i) => (
            <li key={step.id} className="rounded-md border border-line p-3">
              {editingId === step.id ? (
                <div className="space-y-3">
                  <input
                    className="field-input"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Step title"
                  />
                  <textarea
                    className="field-input min-h-16"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Description (optional)"
                  />
                  <StepPhotosEditor photoUrls={editPhotoUrls} onChange={setEditPhotoUrls} />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => saveEdit(step.id)}
                      disabled={busyId === step.id || !editTitle.trim()}
                      className="btn-primary text-xs"
                    >
                      {busyId === step.id && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      Save
                    </button>
                    <button type="button" onClick={cancelEdit} className="btn-secondary text-xs">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  {csvList(step.photoUrls ?? "").length > 0 ? (
                    <div className="flex -space-x-2">
                      {csvList(step.photoUrls ?? "")
                        .slice(0, 3)
                        .map((url, idx) => (
                          <img
                            key={idx}
                            src={url}
                            alt={step.title}
                            className="h-14 w-14 rounded-full border-2 border-paper object-cover"
                          />
                        ))}
                    </div>
                  ) : (
                    <div className="h-14 w-14 flex-shrink-0 rounded-md bg-pine-50" />
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
                    onClick={() => startEdit(step)}
                    className="text-ink/40 hover:text-pine-700"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeStep(step.id)}
                    disabled={busyId === step.id}
                    className="text-ink/40 hover:text-red-700"
                  >
                    {busyId === step.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              )}
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
        <StepPhotosEditor photoUrls={photoUrls} onChange={setPhotoUrls} />
        <button type="submit" disabled={loading || !title.trim()} className="btn-secondary text-xs">
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
          Add step
        </button>
      </form>
    </div>
  );
}