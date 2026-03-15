import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner Invitation",
  description:
    "Accept your partner's invitation to join SweetDays. Connect your accounts and start sharing memories, milestones, and sweet moments together.",
  keywords: [
    "partner invite",
    "relationship invite",
    "couple app invitation",
    "connect with partner",
    "sweetdays invite",
    "relationship app invite",
  ],
};

export default function InviteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
