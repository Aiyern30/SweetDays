import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit2 } from "lucide-react";

export default async function QuizViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return notFound();

  // Fetch the session
  const { data: session } = await supabase
    .from("quiz_sessions")
    .select("*")
    .eq("id", id)
    .single();

  if (!session) return notFound();

  // Fetch questions
  const { data: questions } = await supabase
    .from("quiz_questions")
    .select("*")
    .eq("session_id", session.id)
    .order("display_order", { ascending: true });

  return (
    <div className="min-h-screen pb-32 pt-10 px-4">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-pink-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/quiz">
            <Button
              variant="ghost"
              className="text-rose-500 hover:bg-rose-50 mb-4 -ml-4"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Quizzes
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">
              {session.title}
            </h1>
            <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs uppercase tracking-widest font-bold">
              {session.status}
            </span>
          </div>
          <p className="text-rose-500 mt-2">
            Total Questions: {session.total_questions}
          </p>
        </div>

        <div className="space-y-6">
          {questions?.map((q, i) => (
            <div
              key={q.id}
              className="p-5 bg-white border border-rose-200 rounded-xl shadow-lg shadow-rose-100/50"
            >
              <h3 className="font-semibold text-rose-900 mb-2">
                <span className="text-pink-400 mr-2">{i + 1}.</span>
                {q.question_text}
              </h3>
              <p className="text-xs text-rose-400 uppercase tracking-wider mb-4">
                Type: {q.question_type}
              </p>

              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm border border-emerald-100 flex items-start gap-2">
                <span className="font-bold shrink-0">Correct Answer:</span>
                <span className="break-all">{q.correct_option}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
