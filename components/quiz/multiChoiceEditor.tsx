"use client";

import { ChoiceOption } from "@/types/quiz";
import { Plus } from "lucide-react";
import { SectionLabel, OptionInput } from "./sharedUI";

const KEYS = ["A", "B", "C", "D", "E", "F"];

interface MultipleChoiceEditorProps {
  options: ChoiceOption[];
  correctOption: string; // single key e.g. "A"
  onChange: (opts: ChoiceOption[]) => void;
  onCorrectChange: (key: string) => void;
}

export function MultipleChoiceEditor({
  options,
  correctOption,
  onChange,
  onCorrectChange,
}: MultipleChoiceEditorProps) {
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

  return (
    <div>
      <SectionLabel>Options — click a letter to mark your answer</SectionLabel>
      <div className="space-y-2">
        {options.map((opt, idx) => (
          <OptionInput
            key={opt.key}
            label={opt.key}
            value={opt.label}
            isSelected={correctOption === opt.key}
            onSelect={() => onCorrectChange(opt.key)}
            onChange={(val) => updateLabel(idx, val)}
            onDelete={() => removeOption(idx)}
            canDelete={options.length > 2}
            selectIcon={null}
          />
        ))}
      </div>

      {options.length < 6 && (
        <button
          onClick={addOption}
          className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-pink-500 transition-colors mt-2"
        >
          <Plus size={12} /> Add option
        </button>
      )}
    </div>
  );
}
