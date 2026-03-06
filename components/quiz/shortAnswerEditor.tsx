/* eslint-disable react/no-unescaped-entities */
"use client";

import { SectionLabel } from "./sharedUI";

interface ShortAnswerEditorProps {
  correctOption: string;
  onCorrectChange: (val: string) => void;
}

export function ShortAnswerEditor({
  correctOption,
  onCorrectChange,
}: ShortAnswerEditorProps) {
  return (
    <div>
      <SectionLabel>Your Answer</SectionLabel>
      <input
        value={correctOption}
        onChange={(e) => onCorrectChange(e.target.value)}
        placeholder="Type your answer..."
        className="w-full bg-zinc-800/60 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/20"
      />
      <p className="text-xs text-zinc-600 mt-1.5">
        Your partner's short answer will be compared to this.
      </p>
    </div>
  );
}
