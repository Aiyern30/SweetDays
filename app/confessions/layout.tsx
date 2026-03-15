import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Confessions",
  description:
    "View, manage, and send your animated digital love letters and confessions. Create beautiful envelope-style messages with photos, themes, and music for your partner.",
  keywords: [
    "love confession",
    "love letter",
    "digital love letter",
    "romantic message",
    "heartfelt confession",
    "animated envelope",
    "couple confessions",
    "sweetdays confessions",
    "love notes",
  ],
};

export default function ConfessionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
