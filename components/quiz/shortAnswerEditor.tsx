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
        className="w-full bg-white border border-rose-200 rounded-lg px-3 py-2 text-sm text-rose-900 placeholder:text-rose-300 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/20"
      />
      <p className="text-xs text-rose-500 mt-1.5">
        Your partner's short answer will be compared to this.
      </p>
    </div>
  );
}
