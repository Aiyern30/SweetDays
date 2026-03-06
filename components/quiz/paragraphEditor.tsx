"use client";

import { SectionLabel } from "./sharedUI";

interface ParagraphEditorProps {
  correctOption: string;
  onCorrectChange: (val: string) => void;
}

export function ParagraphEditor({
  correctOption,
  onCorrectChange,
}: ParagraphEditorProps) {
  return (
    <div>
      <SectionLabel>Your Answer</SectionLabel>
      <textarea
        value={correctOption}
        onChange={(e) => onCorrectChange(e.target.value)}
        placeholder="Write your longer answer here..."
        rows={3}
        className="w-full bg-zinc-800/60 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/20 resize-none leading-relaxed"
      />
      <p className="text-xs text-zinc-600 mt-1.5">
        Your partner writes a long-form answer. Use this for open reflections.
      </p>
    </div>
  );
}
