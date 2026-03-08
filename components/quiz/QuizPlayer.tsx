"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitQuizResponses } from "@/lib/quiz-actions";
import {
  Question,
  ChoiceOption,
  LinearScaleConfig,
  RatingConfig,
} from "@/types/quiz";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  Send,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizPlayerProps {
  quiz: { id: string; title: string; questions: Question[] };
}

export function QuizPlayer({ quiz }: QuizPlayerProps) {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const question = quiz.questions[currentIdx];
  const isLast = currentIdx === quiz.questions.length - 1;

  const handleResponse = (val: string) => {
    setResponses((prev) => ({ ...prev, [question.id]: val }));
  };

  const handleCheckboxToggle = (key: string) => {
    const current = responses[question.id]
      ? responses[question.id].split(",")
      : [];
    if (current.includes(key)) {
      handleResponse(current.filter((k) => k !== key).join(","));
    } else {
      handleResponse([...current, key].join(","));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const payload = Object.entries(responses).map(([qid, val]) => ({
      question_id: qid,
      selected_option: val,
    }));

    try {
      const res = await submitQuizResponses(quiz.id, payload);
      if (res.success) {
        setScore(res.matchScore || 0);
      } else {
        alert(res.error || "Failed to submit answers.");
      }
    } catch (e) {
      alert("Error submitting answers.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (score !== null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50/30 p-4">
        <Card className="max-w-md w-full text-center border-rose-200 shadow-xl">
          <CardContent className="pt-10 pb-10 px-6">
            <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-pink-500" />
            </div>
            <h2 className="text-3xl font-bold text-rose-900 mb-2">
              Quiz Completed!
            </h2>
            <p className="text-rose-600 mb-8">
              You scored{" "}
              <span className="font-bold text-pink-500 text-xl">
                {Math.round(score)}%
              </span>{" "}
              match!
            </p>
            <Button
              className="w-full bg-pink-600 hover:bg-pink-500 text-white"
              onClick={() => router.push("/quiz")}
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderInput = () => {
    const val = responses[question.id] || "";

    switch (question.question_type) {
      case "short_answer":
        return (
          <Input
            value={val}
            onChange={(e) => handleResponse(e.target.value)}
            placeholder="Your answer..."
            className="border-rose-200 focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
          />
        );
      case "paragraph":
        return (
          <Textarea
            value={val}
            onChange={(e) => handleResponse(e.target.value)}
            placeholder="Your answer..."
            rows={4}
            className="border-rose-200 focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
          />
        );
      case "multiple_choice": {
        const options = question.options as ChoiceOption[] | null;
        return (
          <div className="space-y-3">
            {options?.map((opt) => (
              <button
                key={opt.key}
                onClick={() => handleResponse(opt.key)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-200",
                  val === opt.key
                    ? "border-pink-500 bg-pink-50 text-pink-900 font-medium shadow-md shadow-pink-100"
                    : "border-rose-100 bg-white hover:border-rose-300 hover:bg-rose-50 text-rose-800",
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                      val === opt.key ? "border-pink-500" : "border-rose-300",
                    )}
                  >
                    {val === opt.key && (
                      <div className="w-2.5 h-2.5 bg-pink-500 rounded-full" />
                    )}
                  </div>
                  {opt.label}
                </div>
              </button>
            ))}
          </div>
        );
      }
      case "dropdown": {
        const options = question.options as ChoiceOption[] | null;
        return (
          <select
            value={val}
            onChange={(e) => handleResponse(e.target.value)}
            className="w-full bg-white border border-rose-200 rounded-lg px-3 py-2.5 text-rose-900 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
          >
            <option value="" disabled>
              Select an option
            </option>
            {options?.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      }
      case "checkboxes": {
        const options = question.options as ChoiceOption[] | null;
        const selected = val ? val.split(",") : [];
        return (
          <div className="space-y-3">
            {options?.map((opt) => {
              const checked = selected.includes(opt.key);
              return (
                <button
                  key={opt.key}
                  onClick={() => handleCheckboxToggle(opt.key)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-200",
                    checked
                      ? "border-pink-500 bg-pink-50 text-pink-900 font-medium shadow-md shadow-pink-100"
                      : "border-rose-100 bg-white hover:border-rose-300 hover:bg-rose-50 text-rose-800",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-5 h-5 rounded-[4px] border-2 flex items-center justify-center",
                        checked
                          ? "border-pink-500 bg-pink-500"
                          : "border-rose-300",
                      )}
                    >
                      {checked && (
                        <div className="w-2.5 h-2.5 bg-white scale-x-[0.5] scale-y-[0.8] rotate-45 border-b-2 border-r-2" />
                      )}
                    </div>
                    {opt.label}
                  </div>
                </button>
              );
            })}
          </div>
        );
      }
      case "linear_scale": {
        const cfg = question.options as LinearScaleConfig;
        const numbers = Array.from(
          { length: cfg.max - cfg.min + 1 },
          (_, i) => cfg.min + i,
        );
        return (
          <div>
            <div className="flex flex-wrap justify-between gap-2 mb-2">
              {numbers.map((num) => {
                const checked = val === String(num);
                return (
                  <button
                    key={num}
                    onClick={() => handleResponse(String(num))}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all border-2",
                      checked
                        ? "bg-pink-500 border-pink-500 text-white shadow-lg"
                        : "bg-white border-rose-200 text-rose-600 hover:border-pink-300",
                    )}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-rose-400 font-medium">
              <span>{cfg.min_label}</span>
              <span>{cfg.max_label}</span>
            </div>
          </div>
        );
      }
      case "rating": {
        const cfg = question.options as RatingConfig;
        const max = cfg.max || 5;
        const currentRating = val ? parseInt(val, 10) : 0;
        return (
          <div className="flex items-center gap-2">
            {Array.from({ length: max }, (_, i) => i + 1).map((num) => {
              const active = num <= currentRating;
              const Icon = cfg.icon === "heart" ? Heart : Star;
              return (
                <button
                  key={num}
                  onClick={() => handleResponse(String(num))}
                  className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                >
                  <Icon
                    fill={active ? "#ec4899" : "transparent"}
                    className={cn(
                      "w-8 h-8 transition-colors duration-200",
                      active
                        ? "text-pink-500"
                        : "text-rose-200 hover:text-pink-300",
                    )}
                  />
                </button>
              );
            })}
          </div>
        );
      }
      case "date":
        return (
          <Input
            type="date"
            value={val}
            onChange={(e) => handleResponse(e.target.value)}
            className="border-rose-200 focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
          />
        );
      case "time":
        return (
          <Input
            type="time"
            value={val}
            onChange={(e) => handleResponse(e.target.value)}
            className="border-rose-200 focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
          />
        );
      default:
        return null;
    }
  };

  const progress = ((currentIdx + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-rose-50/30 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-rose-100 py-4 px-6 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-rose-900 truncate pr-4">
            {quiz.title}
          </h1>
          <div className="text-sm font-medium text-rose-500 whitespace-nowrap">
            {currentIdx + 1} / {quiz.questions.length}
          </div>
        </div>
        <div className="max-w-3xl mx-auto mt-3 h-1.5 bg-rose-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-pink-500 transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto p-4 py-8">
        {/* Question Card */}
        <Card className="bg-white/95 border-rose-200 shadow-xl shadow-rose-200/20 mb-8 w-full shrink-0">
          <CardContent className="p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-semibold text-rose-950 mb-8 leading-relaxed">
              {question.question_text || "Untitled Question"}
            </h2>
            <div className="min-h-[120px]">{renderInput()}</div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4 mt-auto">
          <Button
            variant="outline"
            className="border-rose-200 text-rose-700 w-full sm:w-auto"
            onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
            disabled={currentIdx === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {!isLast ? (
            <Button
              className="bg-pink-600 hover:bg-pink-500 text-white shadow-lg w-full sm:w-auto"
              onClick={() => setCurrentIdx((p) => p + 1)}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg w-full sm:w-auto"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? "Submitting..." : "Submit Answers"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
