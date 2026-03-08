"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Edit2, Users, Check, X, Heart } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { QuizDeleteButton } from "./QuizDeleteButton";
import { updateQuizTitle, QuizSession } from "@/lib/quiz-actions";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function DashboardQuizCard({
  quiz,
  userId,
  isPartnerQuiz = false,
}: {
  quiz: QuizSession;
  userId: string;
  isPartnerQuiz?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(quiz.title);
  const [isUpdating, setIsUpdating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleUpdate = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle || trimmedTitle === quiz.title) {
      setTitle(quiz.title);
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);
    const result = await updateQuizTitle(quiz.id, trimmedTitle);
    if (result.success) {
      toast.success("Title updated!");
    } else {
      toast.error(result.error || "Failed to update title");
      setTitle(quiz.title);
    }
    setIsUpdating(false);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleUpdate();
    if (e.key === "Escape") {
      setTitle(quiz.title);
      setIsEditing(false);
    }
  };

  const isCreator = quiz.created_by === userId;
  const isCompleted = quiz.match_score !== null || quiz.completed_at !== null;
  const isDraft = quiz.status === "draft";

  // Use violet theme for partner quizzes
  const theme = isPartnerQuiz ? "violet" : "rose";
  const themeBg = isPartnerQuiz
    ? "bg-violet-50 text-violet-700 hover:bg-violet-100"
    : "bg-rose-50 text-rose-700 hover:bg-rose-100";
  const borderClass = isPartnerQuiz
    ? "border-violet-200 hover:border-violet-300 shadow-violet-200/20"
    : "border-rose-200 hover:border-rose-300 shadow-rose-200/20";
  const textClass = isPartnerQuiz ? "text-violet-900" : "text-rose-900";
  const subTextClass = isPartnerQuiz ? "text-violet-500" : "text-rose-500";

  // Status Badge Styles
  const badgeStyles = isCompleted
    ? isPartnerQuiz
      ? "bg-violet-500 text-white"
      : "bg-pink-500 text-white"
    : isDraft
      ? "bg-amber-100 text-amber-700 border border-amber-200"
      : "bg-emerald-100 text-emerald-700 border border-emerald-200";

  return (
    <Card className={cn("bg-white/95 transition-all shadow-xl", borderClass)}>
      <CardContent className="p-5 flex flex-col h-full min-h-[180px]">
        <div className="flex justify-between items-start mb-4 gap-2">
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex items-center gap-1">
                <Input
                  ref={inputRef}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleUpdate}
                  onKeyDown={handleKeyDown}
                  disabled={isUpdating}
                  className={cn(
                    "h-10 py-1 text-lg font-bold border-2 focus-visible:ring-offset-0",
                    isPartnerQuiz
                      ? "text-violet-900 border-violet-300 focus-visible:ring-violet-400"
                      : "text-rose-900 border-rose-300 focus-visible:ring-pink-400",
                  )}
                />
              </div>
            ) : (
              <h3
                className={cn(
                  "font-bold text-lg line-clamp-2 cursor-pointer transition-colors flex items-center gap-2 group",
                  isPartnerQuiz
                    ? "text-violet-900 hover:text-violet-600"
                    : "text-rose-900 hover:text-pink-600",
                )}
                onClick={() => isCreator && !isCompleted && setIsEditing(true)}
              >
                {quiz.title}
                {isCreator && !isCompleted && (
                  <Edit2
                    size={12}
                    className="opacity-0 group-hover:opacity-100 text-rose-400 transition-opacity shrink-0"
                  />
                )}
              </h3>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold shadow-sm",
                badgeStyles,
              )}
            >
              {isCompleted
                ? quiz.match_score !== null
                  ? `${Math.round(quiz.match_score)}% Score`
                  : "Completed"
                : isDraft
                  ? "Draft"
                  : "Published"}
            </span>
          </div>
        </div>

        <div className="mt-auto space-y-4">
          <div
            className={cn(
              "flex items-center justify-between text-[11px] font-medium border-b pb-3",
              subTextClass,
              isPartnerQuiz ? "border-violet-100" : "border-rose-100",
            )}
          >
            <span>{quiz.total_questions} Questions</span>
            <span>{format(new Date(quiz.created_at), "MMM d, yyyy")}</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <Link href={`/quiz/${quiz.id}`} className="flex-1">
              <Button
                variant="secondary"
                className={cn(
                  "w-full h-9 font-bold transition-all active:scale-95",
                  themeBg,
                )}
                size="sm"
              >
                {isCompleted ? (
                  <>
                    <Play size={13} className="mr-1.5" /> View Results
                  </>
                ) : isCreator ? (
                  <>
                    <Edit2 size={13} className="mr-1.5" /> Edit Quiz
                  </>
                ) : (
                  <>
                    <Play size={13} className="mr-1.5" /> Play Quiz
                  </>
                )}
              </Button>
            </Link>
            {isCreator && !isCompleted && (
              <div className="shrink-0">
                <QuizDeleteButton id={quiz.id} />
              </div>
            )}
          </div>

          {isCreator && !isCompleted && !isDraft && (
            <div className="flex items-center gap-1.5 justify-center text-[10px] text-rose-400 font-bold uppercase tracking-wider bg-rose-50/50 py-1 rounded-md border border-rose-100/50">
              <Users size={10} />
              Waiting for Partner
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
