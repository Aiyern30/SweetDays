"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteQuiz } from "@/lib/quiz-actions";

export function QuizDeleteButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this quiz? This action cannot be undone.",
      )
    )
      return;

    setIsDeleting(true);
    const result = await deleteQuiz(id);

    if (result.success) {
      alert("Quiz deleted successfully");
    } else {
      alert(result.error || "Failed to delete quiz");
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
      className={
        isDeleting
          ? "opacity-50 border-rose-200 text-rose-300"
          : "border-rose-200 text-rose-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200"
      }
    >
      <Trash2 size={13} />
    </Button>
  );
}
