import { createClient } from "@supabase/supabase-js";

export async function handler() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const now = new Date().toISOString();

  // Find held numbers where the hold has expired
  const { data: expiredNumbers, error } = await supabase
    .from("numbers")
    .select("id, board_id, number, status, hold_expires_at")
    .eq("status", "held")
    .lt("hold_expires_at", now);

  if (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }

  if (!expiredNumbers || expiredNumbers.length === 0) {
    return { statusCode: 200, body: JSON.stringify({ released: 0 }) };
  }

  const ids = expiredNumbers.map((n) => n.id);

  // Release them back to available
  const { error: updErr } = await supabase
    .from("numbers")
    .update({
      status: "available",
      hold_expires_at: null,
      hold_id: null  // Clear hold link when releasing
    })
    .in("id", ids);

  if (updErr) {
    return { statusCode: 500, body: JSON.stringify({ error: updErr.message }) };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      released: ids.length,
      sample: expiredNumbers.slice(0, 10).map((x) => x.number)
    })
  };
}
