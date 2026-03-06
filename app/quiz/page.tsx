/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  CheckSquare,
  ToggleLeft,
  AlignLeft,
  SlidersHorizontal,
  Sparkles,
  Send,
  Heart,
  MessageCircleQuestion,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type QuestionType = "mcq" | "true_false" | "free_text" | "slider";

interface MCQOption {
  key: string;
  label: string;
}

interface SliderConfig {
  min: number;
  max: number;
  label: string;
}

interface Question {
  id: string;
  question_text: string;
  question_type: QuestionType;
  options: MCQOption[] | SliderConfig | null;
  correct_option: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const QUESTION_TYPES: {
  value: QuestionType;
  label: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    value: "mcq",
    label: "Multiple Choice",
    icon: <CheckSquare size={14} />,
    color: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  },
  {
    value: "true_false",
    label: "True / False",
    icon: <ToggleLeft size={14} />,
    color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
  {
    value: "free_text",
    label: "Free Text",
    icon: <AlignLeft size={14} />,
    color: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  },
  {
    value: "slider",
    label: "Slider",
    icon: <SlidersHorizontal size={14} />,
    color: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  },
];

const MCQ_KEYS = ["A", "B", "C", "D"];

const DEFAULT_MCQ_OPTIONS: MCQOption[] = [
  { key: "A", label: "" },
  { key: "B", label: "" },
];

const DEFAULT_SLIDER: SliderConfig = { min: 1, max: 10, label: "Rate it" };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

function makeQuestion(): Question {
  return {
    id: genId(),
    question_text: "",
    question_type: "mcq",
    options: DEFAULT_MCQ_OPTIONS,
    correct_option: "A",
  };
}

function getTypeInfo(type: QuestionType) {
  return QUESTION_TYPES.find((t) => t.value === type)!;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: QuestionType }) {
  const info = getTypeInfo(type);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        info.color,
      )}
    >
      {info.icon}
      {info.label}
    </span>
  );
}

function MCQEditor({
  options,
  correctOption,
  onChange,
  onCorrectChange,
}: {
  options: MCQOption[];
  correctOption: string;
  onChange: (opts: MCQOption[]) => void;
  onCorrectChange: (key: string) => void;
}) {
  const updateLabel = (idx: number, label: string) => {
    const next = options.map((o, i) => (i === idx ? { ...o, label } : o));
    onChange(next);
  };

  const addOption = () => {
    if (options.length >= 4) return;
    const key = MCQ_KEYS[options.length];
    onChange([...options, { key, label: "" }]);
  };

  const removeOption = (idx: number) => {
    if (options.length <= 2) return;
    const next = options.filter((_, i) => i !== idx);
    onChange(next);
    if (correctOption === options[idx].key) onCorrectChange(next[0].key);
  };

  return (
    <div className="space-y-2 mt-3">
      <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-2">
        Answer Options
      </p>
      {options.map((opt, idx) => (
        <div key={opt.key} className="flex items-center gap-2">
          {/* Correct answer selector */}
          <button
            onClick={() => onCorrectChange(opt.key)}
            className={cn(
              "w-7 h-7 rounded-full text-xs font-bold border-2 shrink-0 transition-all duration-200",
              correctOption === opt.key
                ? "bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-500/30"
                : "border-zinc-600 text-zinc-500 hover:border-zinc-400",
            )}
          >
            {opt.key}
          </button>
          <Input
            value={opt.label}
            onChange={(e) => updateLabel(idx, e.target.value)}
            placeholder={`Option ${opt.key}`}
            className="bg-zinc-800/60 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus:border-pink-500/50 focus:ring-pink-500/20 h-9 text-sm"
          />
          <button
            onClick={() => removeOption(idx)}
            disabled={options.length <= 2}
            className="text-zinc-600 hover:text-red-400 disabled:opacity-30 transition-colors shrink-0"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      {options.length < 4 && (
        <button
          onClick={addOption}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-pink-400 transition-colors mt-1"
        >
          <Plus size={12} /> Add option
        </button>
      )}
      <p className="text-xs text-zinc-600 mt-1">
        ● Circle = correct answer (your answer)
      </p>
    </div>
  );
}

function TrueFalseEditor({
  correctOption,
  onCorrectChange,
}: {
  correctOption: string;
  onCorrectChange: (val: string) => void;
}) {
  return (
    <div className="mt-3 space-y-2">
      <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-2">
        Your Answer
      </p>
      <div className="flex gap-3">
        {["true", "false"].map((val) => (
          <button
            key={val}
            onClick={() => onCorrectChange(val)}
            className={cn(
              "flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 capitalize",
              correctOption === val
                ? val === "true"
                  ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/20"
                  : "bg-red-500/20 border-red-500 text-red-300 shadow-lg shadow-red-500/20"
                : "border-zinc-700 text-zinc-500 hover:border-zinc-500",
            )}
          >
            {val === "true" ? "✓ True" : "✗ False"}
          </button>
        ))}
      </div>
    </div>
  );
}

function FreeTextEditor({
  correctOption,
  onCorrectChange,
}: {
  correctOption: string;
  onCorrectChange: (val: string) => void;
}) {
  return (
    <div className="mt-3">
      <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-2">
        Expected Answer (your answer)
      </p>
      <Input
        value={correctOption}
        onChange={(e) => onCorrectChange(e.target.value)}
        placeholder="e.g. Paris, Coffee, 2019..."
        className="bg-zinc-800/60 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus:border-pink-500/50 focus:ring-pink-500/20 text-sm"
      />
      <p className="text-xs text-zinc-600 mt-1.5">
        Your partner's answer will be compared to this.
      </p>
    </div>
  );
}

function SliderEditor({
  config,
  correctOption,
  onConfigChange,
  onCorrectChange,
}: {
  config: SliderConfig;
  correctOption: string;
  onConfigChange: (c: SliderConfig) => void;
  onCorrectChange: (val: string) => void;
}) {
  const value = parseInt(correctOption) || config.min;

  return (
    <div className="mt-3 space-y-3">
      <div className="flex gap-3">
        <div className="flex-1">
          <Label className="text-xs text-zinc-500 uppercase tracking-wider">
            Min
          </Label>
          <Input
            type="number"
            value={config.min}
            onChange={(e) =>
              onConfigChange({ ...config, min: parseInt(e.target.value) || 1 })
            }
            className="bg-zinc-800/60 border-zinc-700 text-zinc-100 focus:border-pink-500/50 h-9 text-sm mt-1"
          />
        </div>
        <div className="flex-1">
          <Label className="text-xs text-zinc-500 uppercase tracking-wider">
            Max
          </Label>
          <Input
            type="number"
            value={config.max}
            onChange={(e) =>
              onConfigChange({
                ...config,
                max: parseInt(e.target.value) || 10,
              })
            }
            className="bg-zinc-800/60 border-zinc-700 text-zinc-100 focus:border-pink-500/50 h-9 text-sm mt-1"
          />
        </div>
        <div className="flex-1">
          <Label className="text-xs text-zinc-500 uppercase tracking-wider">
            Label
          </Label>
          <Input
            value={config.label}
            onChange={(e) =>
              onConfigChange({ ...config, label: e.target.value })
            }
            placeholder="Rate it"
            className="bg-zinc-800/60 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus:border-pink-500/50 h-9 text-sm mt-1"
          />
        </div>
      </div>
      <div>
        <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-3">
          Your Answer:{" "}
          <span className="text-pink-400 font-bold text-sm">{value}</span>
        </p>
        <Slider
          min={config.min}
          max={config.max}
          step={1}
          value={[value]}
          onValueChange={([v]: number[]) => onCorrectChange(String(v))}
          className="**:[[role=slider]]:bg-pink-500 **:[[role=slider]]:border-pink-400 [&_.relative]:bg-zinc-700 [&_[data-orientation=horizontal]_.absolute]:bg-pink-500"
        />
        <div className="flex justify-between text-xs text-zinc-600 mt-1">
          <span>{config.min}</span>
          <span>{config.max}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Question Card ─────────────────────────────────────────────────────────────

function QuestionCard({
  question,
  index,
  onUpdate,
  onDelete,
}: {
  question: Question;
  index: number;
  onUpdate: (q: Question) => void;
  onDelete: () => void;
}) {
  const updateType = (type: QuestionType) => {
    let options: Question["options"] = null;
    let correct = "";

    if (type === "mcq") {
      options = DEFAULT_MCQ_OPTIONS;
      correct = "A";
    } else if (type === "true_false") {
      options = null;
      correct = "true";
    } else if (type === "free_text") {
      options = null;
      correct = "";
    } else if (type === "slider") {
      options = { ...DEFAULT_SLIDER };
      correct = "5";
    }

    onUpdate({
      ...question,
      question_type: type,
      options,
      correct_option: correct,
    });
  };

  return (
    <Card className="bg-zinc-900/80 border-zinc-800 shadow-xl shadow-black/30 hover:border-zinc-700 transition-all duration-200 group">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          {/* Drag handle + number */}
          <div className="flex flex-col items-center gap-1 pt-1 shrink-0">
            <GripVertical
              size={16}
              className="text-zinc-700 group-hover:text-zinc-500 transition-colors cursor-grab"
            />
            <span className="text-xs font-bold text-zinc-600 w-5 text-center">
              {index + 1}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            {/* Top row: type selector + delete */}
            <div className="flex items-center justify-between mb-3 gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 focus:outline-none">
                    <TypeBadge type={question.question_type} />
                    <ChevronDown size={12} className="text-zinc-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-zinc-900 border-zinc-700 shadow-2xl">
                  {QUESTION_TYPES.map((t) => (
                    <DropdownMenuItem
                      key={t.value}
                      onClick={() => updateType(t.value)}
                      className={cn(
                        "flex items-center gap-2 text-sm cursor-pointer",
                        question.question_type === t.value
                          ? "text-zinc-100"
                          : "text-zinc-400",
                      )}
                    >
                      {t.icon}
                      {t.label}
                      {question.question_type === t.value && (
                        <span className="ml-auto text-pink-500">✓</span>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <button
                onClick={onDelete}
                className="text-zinc-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={15} />
              </button>
            </div>

            {/* Question text */}
            <Textarea
              value={question.question_text}
              onChange={(e: any) =>
                onUpdate({ ...question, question_text: e.target.value })
              }
              placeholder="Type your question here..."
              rows={2}
              className="bg-zinc-800/60 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/20 resize-none text-sm leading-relaxed"
            />

            {/* Type-specific editor */}
            {question.question_type === "mcq" && (
              <MCQEditor
                options={question.options as MCQOption[]}
                correctOption={question.correct_option}
                onChange={(opts) => onUpdate({ ...question, options: opts })}
                onCorrectChange={(key) =>
                  onUpdate({ ...question, correct_option: key })
                }
              />
            )}

            {question.question_type === "true_false" && (
              <TrueFalseEditor
                correctOption={question.correct_option}
                onCorrectChange={(val) =>
                  onUpdate({ ...question, correct_option: val })
                }
              />
            )}

            {question.question_type === "free_text" && (
              <FreeTextEditor
                correctOption={question.correct_option}
                onCorrectChange={(val) =>
                  onUpdate({ ...question, correct_option: val })
                }
              />
            )}

            {question.question_type === "slider" && (
              <SliderEditor
                config={question.options as SliderConfig}
                correctOption={question.correct_option}
                onConfigChange={(cfg) =>
                  onUpdate({ ...question, options: cfg })
                }
                onCorrectChange={(val) =>
                  onUpdate({ ...question, correct_option: val })
                }
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function QuizBuilderPage() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([makeQuestion()]);
  const [isPublishing, setIsPublishing] = useState(false);

  const addQuestion = () => {
    setQuestions((prev) => [...prev, makeQuestion()]);
  };

  const updateQuestion = (id: string, updated: Question) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? updated : q)));
  };

  const deleteQuestion = (id: string) => {
    if (questions.length === 1) return;
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handlePublish = async () => {
    setIsPublishing(true);

    // Build payload matching your DB schema
    const payload = {
      title,
      status: "published",
      total_questions: questions.length,
      questions: questions.map((q, i) => ({
        question_text: q.question_text,
        question_type: q.question_type,
        options:
          q.question_type === "mcq"
            ? q.options
            : q.question_type === "slider"
              ? q.options
              : null,
        correct_option: q.correct_option,
        display_order: i,
      })),
    };

    console.log("Submitting quiz payload:", JSON.stringify(payload, null, 2));

    // TODO: Replace with your Supabase insert
    // const { data: session } = await supabase
    //   .from("quiz_sessions")
    //   .insert({ title, relationship_id, created_by: user.id, status: "published", total_questions: questions.length })
    //   .select().single();
    //
    // await supabase.from("quiz_questions").insert(
    //   questions.map((q, i) => ({ ...q, session_id: session.id, created_by: user.id, display_order: i }))
    // );

    await new Promise((r) => setTimeout(r, 1200));
    setIsPublishing(false);
    alert("Quiz published! 🎉");
  };

  const completedCount = questions.filter(
    (q) => q.question_text.trim() && q.correct_option,
  ).length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-pink-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-100 h-75 bg-violet-600/8 blur-[100px] rounded-full" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 py-10 pb-32">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Heart size={16} className="text-pink-500" fill="currentColor" />
            <span className="text-xs text-zinc-500 uppercase tracking-widest font-medium">
              双人默契大比拼
            </span>
          </div>
          <h1 className="text-3xl font-bold text-zinc-50 tracking-tight mb-1">
            Create a Quiz
          </h1>
          <p className="text-zinc-500 text-sm">
            Write questions for your partner — let's see how well they know you
            💕
          </p>
        </div>

        {/* Quiz title */}
        <div className="mb-8">
          <Label className="text-xs text-zinc-500 uppercase tracking-wider mb-2 block">
            Quiz Title
          </Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. How well do you know me? 💘"
            className="bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus:border-pink-500/60 focus:ring-1 focus:ring-pink-500/20 text-base h-12"
          />
        </div>

        {/* Questions */}
        <div className="space-y-4 mb-6">
          {questions.map((q, i) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={i}
              onUpdate={(updated) => updateQuestion(q.id, updated)}
              onDelete={() => deleteQuestion(q.id)}
            />
          ))}
        </div>

        {/* Add question button */}
        <button
          onClick={addQuestion}
          className="w-full py-3.5 rounded-xl border-2 border-dashed border-zinc-700 text-zinc-500 hover:border-pink-500/50 hover:text-pink-400 hover:bg-pink-500/5 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium"
        >
          <Plus size={16} />
          Add Question
        </button>
      </div>

      {/* Sticky footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-800">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MessageCircleQuestion size={15} className="text-zinc-500" />
            <span className="text-sm text-zinc-500">
              <span className="text-zinc-200 font-semibold">
                {completedCount}
              </span>
              /{questions.length} questions ready
            </span>
            {completedCount === questions.length && questions.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-emerald-400">
                <Sparkles size={12} /> All set!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-zinc-700 text-zinc-400 hover:text-zinc-200 bg-transparent"
              onClick={() => console.log("Save draft")}
            >
              Save Draft
            </Button>
            <Button
              size="sm"
              onClick={handlePublish}
              disabled={isPublishing || !title.trim() || completedCount === 0}
              className="bg-pink-600 hover:bg-pink-500 text-white font-semibold px-5 shadow-lg shadow-pink-900/40 disabled:opacity-40"
            >
              {isPublishing ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Publishing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send size={13} />
                  Send to Partner
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
