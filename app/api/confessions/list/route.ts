import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await (await supabase).auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = new URL(request.url);
    const statusFilter = url.searchParams.get("status");

    // Get available statuses for the filter bar
    const { data: statusData, error: statusError } = await (await supabase)
      .from("confessions")
      .select("relationship_status")
      .eq("sender_id", user.id);

    const availableStatuses = [
      "All",
      ...Array.from(
        new Set(statusData?.map((s) => s.relationship_status) || []),
      ),
    ];

    // Build the main query
    let query = (await supabase)
      .from("confessions")
      .select("*")
      .eq("sender_id", user.id)
      .order("created_at", { ascending: false });

    // Apply filter in SQL
    if (statusFilter && statusFilter !== "All") {
      query = query.eq("relationship_status", statusFilter);
    }

    const { data: confessions, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ confessions, availableStatuses });
  } catch (error) {
    console.error("Error fetching confessions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
