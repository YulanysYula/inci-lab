"use client";

import { useRef, useState } from "react";

interface Props {
  onText: (text: string) => void;
}

/**
 * OCR button — accepts an image and runs Tesseract in the browser.
 * Tesseract.js loads its workers from CDN by default, so no server work needed.
 * We import lazily so the (large) Tesseract bundle isn't pulled into the
 * initial page load.
 */
export function ScanButton({ onText }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setBusy(true);
    setError(null);
    setProgress(0);

    try {
      const Tesseract = (await import("tesseract.js")).default;
      const { data } = await Tesseract.recognize(file, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text" && typeof m.progress === "number") {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });
      onText(data.text);
    } catch (err) {
      console.error(err);
      setError("Couldn't read the image. Try a sharper photo with good lighting.");
    } finally {
      setBusy(false);
      setProgress(0);
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="btn-ghost inline-flex items-center gap-2"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 7V5a2 2 0 0 1 2-2h2M21 7V5a2 2 0 0 0-2-2h-2M3 17v2a2 2 0 0 0 2 2h2M21 17v2a2 2 0 0 1-2 2h-2"/>
          <path d="M7 12h10"/>
        </svg>
        {busy ? `Scanning ${progress}%` : "Scan label"}
      </button>
      {error && <p className="text-xs text-rose-700 mt-2">{error}</p>}
    </>
  );
}
