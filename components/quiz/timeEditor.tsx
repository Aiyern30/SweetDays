"use client";

import { SectionLabel } from "./sharedUI";

interface TimeEditorProps {
  correctOption: string;
  onCorrectChange: (val: string) => void;
}

export function TimeEditor({
  correctOption,
  onCorrectChange,
}: TimeEditorProps) {
  return (
    <div>
      <SectionLabel>Your Answer</SectionLabel>
      <input
        type="time"
        value={correctOption}
        onChange={(e) => onCorrectChange(e.target.value)}
        className="w-full bg-white border border-rose-200 rounded-lg px-3 py-2 text-sm text-rose-900 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/20"
      />
      <p className="text-xs text-rose-500 mt-1.5">
        Your partner picks a time — it will be compared to yours.
      </p>
    </div>
  );
}
