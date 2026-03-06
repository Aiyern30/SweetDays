"use client";

import { ChoiceOption } from "@/types/quiz";
import { Plus, ChevronDown } from "lucide-react";
import { SectionLabel } from "./sharedUI";

const KEYS = ["A", "B", "C", "D", "E", "F"];

interface DropdownEditorProps {
  options: ChoiceOption[];
  correctOption: string;
  onChange: (opts: ChoiceOption[]) => void;
  onCorrectChange: (key: string) => void;
}

export function DropdownEditor({
  options,
  correctOption,
  onChange,
  onCorrectChange,
}: DropdownEditorProps) {
  const updateLabel = (idx: number, label: string) =>
    onChange(options.map((o, i) => (i === idx ? { ...o, label } : o)));

  const addOption = () => {
    if (options.length >= 6) return;
    onChange([...options, { key: KEYS[options.length], label: "" }]);
  };

  const removeOption = (idx: number) => {
    if (options.length <= 2) return;
    const next = options.filter((_, i) => i !== idx);
    onChange(next);
    if (correctOption === options[idx].key) onCorrectChange(next[0].key);
  };

  const selectedOption = options.find((o) => o.key === correctOption);

  return (
    <div>
      <SectionLabel>Dropdown options</SectionLabel>
      <div className="space-y-2 mb-3">
        {options.map((opt, idx) => (
          <div key={opt.key} className="flex items-center gap-2">
            <span className="w-6 text-center text-xs text-rose-500 font-mono shrink-0">
              {idx + 1}
            </span>
            <input
              value={opt.label}
              onChange={(e) => updateLabel(idx, e.target.value)}
              placeholder={`Option ${idx + 1}`}
              className="flex-1 bg-white border border-rose-200 rounded-lg px-3 py-1.5 text-sm text-rose-900 placeholder:text-rose-300 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/20"
            />
            <button
              onClick={() => removeOption(idx)}
              disabled={options.length <= 2}
              className="text-rose-400 hover:text-red-500 disabled:opacity-20 transition-colors"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {options.length < 6 && (
        <button
          onClick={addOption}
          className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-pink-500 transition-colors mb-4"
        >
          <Plus size={12} /> Add option
        </button>
      )}

      {/* Preview + correct answer selector */}
      <SectionLabel>Your Answer (select from preview)</SectionLabel>
      <div className="relative">
        <select
          value={correctOption}
          onChange={(e) => onCorrectChange(e.target.value)}
          className="w-full appearance-none bg-white border border-rose-200 rounded-lg px-3 py-2 text-sm text-rose-900 focus:outline-none focus:border-pink-400 pr-8"
        >
          {options.map((opt) => (
            <option key={opt.key} value={opt.key} className="bg-white text-rose-900">
              {opt.label || `Option ${opt.key}`}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-rose-500 pointer-events-none"
        />
      </div>
    </div>
  );
}
