import { getQuizzes } from "@/lib/quiz-actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Plus, Users } from "lucide-react";
import { DashboardQuizCard } from "@/components/quiz/DashboardQuizCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const dynamic = "force-dynamic";

export default async function QuizDashboard() {
  const { success, quizzes, error, userId } = await getQuizzes();

  if (!success || !userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50/30 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-rose-100 text-center max-w-sm w-full">
          <p className="text-rose-600 font-medium">
            {error || "Please log in to view quizzes"}
          </p>
          <Link href="/login" className="mt-4 block">
            <Button className="w-full bg-pink-600 hover:bg-pink-500">
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const ownQuizzes = quizzes?.filter((q) => q.created_by === userId) || [];
  const partnerQuizzes =
    quizzes?.filter((q) => q.created_by !== userId && q.status !== "draft") ||
    [];

  return (
    <div className="min-h-screen pb-32">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-pink-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-violet-600/8 blur-[100px] rounded-full" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-10">
        <SectionHeader
          icon={<Heart className="w-6 h-6 text-white" />}
          title="Your Quizzes"
          description={"Manage your created quizzes or start a new challenge!"}
          button={
            <Link href="/quiz/new">
              <Button className="bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-900/20 w-full md:w-auto">
                <Plus size={16} className="mr-2" />
                Create Quiz
              </Button>
            </Link>
          }
        />

        {!success ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">
            Error loading quizzes: {error}
          </div>
        ) : !quizzes || quizzes.length === 0 ? (
          <div className="text-center py-20 px-4 border-2 border-dashed border-rose-200 rounded-2xl bg-white/50 backdrop-blur-sm">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={24} className="text-pink-400" />
            </div>
            <h3 className="text-lg font-semibold text-rose-900 mb-2">
              No quizzes yet!
            </h3>
            <p className="text-rose-500 text-sm max-w-sm mx-auto mb-6">
              Create your first quiz and test how well your partner knows you.
            </p>
            <Link href="/quiz/new">
              <Button
                variant="outline"
                className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-800"
              >
                Create your first quiz
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-12 pt-8">
            {/* Own Quizzes Section */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Heart size={20} className="text-pink-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Created by You
                </h2>
              </div>
              {ownQuizzes.length === 0 ? (
                <div className="text-center py-10 px-4 border-2 border-dashed border-rose-200 rounded-2xl bg-white/50 backdrop-blur-sm">
                  <p className="text-rose-500 text-sm">
                    You haven't created any quizzes yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ownQuizzes.map((quiz) => (
                    <DashboardQuizCard
                      key={quiz.id}
                      quiz={quiz}
                      userId={userId!}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Partner Quizzes Section */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-violet-100 rounded-lg">
                  <Users size={20} className="text-violet-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Created by Partner
                </h2>
              </div>
              {partnerQuizzes.length === 0 ? (
                <div className="text-center py-10 px-4 border-2 border-dashed border-violet-200 rounded-2xl bg-white/50 backdrop-blur-sm">
                  <p className="text-violet-500 text-sm">
                    Your partner hasn't created any quizzes yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {partnerQuizzes.map((quiz) => (
                    <DashboardQuizCard
                      key={quiz.id}
                      quiz={quiz}
                      userId={userId!}
                      isPartnerQuiz
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
