"use client";

import { useEffect, useRef, useState } from "react";

export type AvatarRow = {
  ign: string;
  displayIgn: string;
  dataUrl: string;
};

const MAX_PX = 160;

async function fileToSquarePng(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const size = Math.min(MAX_PX, Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unsupported");
  const scale = Math.min(size / bitmap.width, size / bitmap.height);
  const w = bitmap.width * scale;
  const h = bitmap.height * scale;
  ctx.drawImage(bitmap, (size - w) / 2, (size - h) / 2, w, h);
  return canvas.toDataURL("image/png");
}

export default function AvatarManager({ igns }: { igns: string[] }) {
  const [avatars, setAvatars] = useState<AvatarRow[]>([]);
  const [ign, setIgn] = useState("");
  const [mode, setMode] = useState<"upload" | "link">("upload");
  const [url, setUrl] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    const res = await fetch("/api/avatars");
    const data = await res.json().catch(() => ({}));
    setAvatars(data.avatars ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleFile(file: File | undefined) {
    setError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please pick a PNG image.");
      return;
    }
    try {
      setPreview(await fileToSquarePng(file));
    } catch {
      setError("Couldn't read that image.");
    }
  }

  function handleUrl(value: string) {
    setUrl(value);
    setError(null);
    const trimmed = value.trim();
    if (!trimmed) {
      setPreview(null);
      return;
    }
    if (!/^https?:\/\//i.test(trimmed)) {
      setPreview(null);
      setError("Paste a full image link starting with http:// or https://");
      return;
    }
    setPreview(trimmed);
  }

  function switchMode(next: "upload" | "link") {
    setMode(next);
    setPreview(null);
    setError(null);
    setUrl("");
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!ign.trim() || !preview) return;
    setSaving(true);
    setError(null);
    const res = await fetch("/api/avatars", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ign, dataUrl: preview }),
    });
    setSaving(false);
    if (res.ok) {
      setIgn("");
      setPreview(null);
      setUrl("");
      if (fileRef.current) fileRef.current.value = "";
      load();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Couldn't save that picture.");
    }
  }

  async function handleRemove(key: string) {
    await fetch(`/api/avatars?ign=${encodeURIComponent(key)}`, { method: "DELETE" });
    load();
  }

  return (
    <section className="notch bg-panel border border-white/10 p-5 mb-10 space-y-4">
      <div>
        <p className="text-sm text-bone font-semibold">Player pictures</p>
        <p className="text-xs text-ash mt-1">
          Upload a PNG someone sent you, or paste an image link you copied from Google. It shows
          next to them on the tier list.
        </p>
      </div>

      <div className="flex gap-2">
        {(["upload", "link"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => switchMode(m)}
            className={`notch-sm px-3 py-1.5 text-xs uppercase tracking-widest border transition-colors ${
              mode === m
                ? "border-azure-bright text-azure-bright bg-azure/10"
                : "border-white/10 text-ash hover:text-bone"
            }`}
          >
            {m === "upload" ? "Upload PNG" : "Paste link"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            value={ign}
            onChange={(e) => setIgn(e.target.value)}
            list="known-igns"
            placeholder="Bedrock IGN"
            className="notch-sm bg-void border border-white/10 px-3 py-2 text-sm text-bone placeholder:text-ash/60 focus:border-azure-bright outline-none"
          />
          <datalist id="known-igns">
            {igns.map((i) => (
              <option key={i} value={i} />
            ))}
          </datalist>
          {mode === "upload" ? (
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => handleFile(e.target.files?.[0])}
              className="notch-sm bg-void border border-white/10 px-3 py-2 text-sm text-ash file:mr-3 file:border-0 file:bg-azure/20 file:px-3 file:py-1 file:text-xs file:uppercase file:tracking-widest file:text-azure-bright"
            />
          ) : (
            <input
              value={url}
              onChange={(e) => handleUrl(e.target.value)}
              placeholder="https://example.com/head.png"
              className="notch-sm bg-void border border-white/10 px-3 py-2 text-sm text-bone placeholder:text-ash/60 focus:border-azure-bright outline-none"
            />
          )}
        </div>

        {preview ? (
          <div className="flex items-center gap-3">
            <img
              src={preview}
              alt="Preview"
              onError={() => setError("That link didn't load as an image.")}
              className="h-12 w-12 notch-sm border border-white/10 object-cover"
            />
            <span className="text-xs text-ash">Preview</span>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={saving || !ign.trim() || !preview}
          className="notch-sm bg-crimson px-4 py-2 text-sm font-semibold tracking-wide hover:bg-crimson-bright transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : "Assign picture"}
        </button>
        {error && <p className="text-crimson-bright text-sm">{error}</p>}
      </form>

      {avatars.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
          {avatars.map((a) => (
            <div
              key={a.ign}
              className="flex items-center gap-3 notch-sm bg-panel/60 border border-white/10 px-3 py-2"
            >
              <img
                src={a.dataUrl}
                alt={a.displayIgn}
                className="h-9 w-9 notch-sm border border-white/10 object-cover shrink-0"
              />
              <span className="text-sm text-bone truncate min-w-0">{a.displayIgn}</span>
              <button
                onClick={() => handleRemove(a.ign)}
                className="ml-auto text-xs text-ash hover:text-crimson-bright transition-colors shrink-0"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
