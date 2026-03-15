import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import * as brevo from "@getbrevo/brevo";

// Initialize Brevo API
const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY || "",
);

// We use GET so it can easily be triggered by standard cron services
export async function GET(req: Request) {
  // 1. Basic Security: Protect this route from random people triggering it.
  // In your .env, you should add: CRON_SECRET=your_secret_password
  const authHeader = req.headers.get("authorization");
  if (
    process.env.NODE_ENV === "production" &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();

    // 2. We only want to target people who haven't logged in for exactly 5 days.
    // By checking between 5 and 6 days, we ensure they only receive the email ONCE,
    // assuming this cron job runs once per day.
    const now = new Date();
    const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
    const sixDaysAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);

    // Get all users via the Admin API (bypasses Row Level Security)
    const {
      data: { users },
      error: usersError,
    } = await supabase.auth.admin.listUsers();

    if (usersError) throw usersError;

    // Filter to find users in the 5-day inactivity window
    const inactiveUsers = users.filter((user) => {
      if (!user.last_sign_in_at) return false;
      const lastSignIn = new Date(user.last_sign_in_at);
      return lastSignIn <= fiveDaysAgo && lastSignIn > sixDaysAgo;
    });

    if (inactiveUsers.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No users found in the 5-day inactivity window.",
      });
    }

    // 3. For each inactive user, look up their profile and relationship to customize the email
    const emailsSent = [];

    for (const user of inactiveUsers) {
      // Get their profile name
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, username")
        .eq("id", user.id)
        .single();

      const userName = profile?.display_name || profile?.username || "there";

      // (Optional) check if they are in an active relationship to personalize the message
      const { data: relationship } = await supabase
        .from("relationships")
        .select("id")
        .or(`partner1_id.eq.${user.id},partner2_id.eq.${user.id}`)
        .eq("status", "active")
        .maybeSingle();

      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || "https://sweetdays.vercel.app/";

      // 4. Send the reminder email using Brevo
      const sendSmtpEmail = new brevo.SendSmtpEmail();
      sendSmtpEmail.subject = "We miss you on LoveSick! 💕";
      sendSmtpEmail.to = [{ email: user.email! }];
      sendSmtpEmail.sender = {
        name: "LoveSick Team",
        email: "aiyern30@gmail.com", // Your verified sender address
      };

      sendSmtpEmail.htmlContent = `
        <div style="font-family: Arial, sans-serif; text-align: center; color: #333; padding: 20px;">
          <h2 style="color: #f43f5e;">Hello ${userName}!</h2>
          <p>It's been a few days since you last checked in on <strong>LoveSick</strong>.</p>
          ${
            relationship
              ? "<p>Your partner might have left some new memories, moods, or confessions for you to read. Don't leave them waiting!</p>"
              : "<p>Ready to invite your partner or create a beautiful memory together?</p>"
          }
          <div style="margin: 30px 0;">
            <a href="${baseUrl}/dashboard" style="background-color: #f43f5e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Return to LoveSick
            </a>
          </div>
          <p style="font-size: 12px; color: #888;">Keep the romance alive! ❤️</p>
        </div>
      `;

      // Send it!
      try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        emailsSent.push(user.email);
      } catch (emailErr) {
        console.error("Failed to email", user.email, emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Checked inactive users and sent ${emailsSent.length} emails.`,
      emails: emailsSent,
    });
  } catch (error: any) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
