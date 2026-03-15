import { QABuilder } from "@/components/qa/QABuilder";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Q&A",
  description: "Create heartfelt questions for your partner to answer. A deeper way to connect and understand each other.",
  keywords: ["create Q&A", "couple questions", "partner quiz", "heartfelt questions", "relationship activity"],
};

export default function NewQAPage() {
  return (
    <div className="min-h-screen bg-rose-50/30">
      {/* Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-rose-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-10 pb-32">
        <SectionHeader
          icon={<MessageCircle className="w-6 h-6 text-white" />}
          title="New Q&A"
          description="Write heartfelt questions for your partner to answer."
          button={
            <a href="/qa_questions">
              <Button
                variant="ghost"
                className="text-gray-500 hover:text-gray-700"
              >
                Cancel
              </Button>
            </a>
          }
        />

        <div className="mt-10">
          <QABuilder />
        </div>
      </div>
    </div>
  );
}
