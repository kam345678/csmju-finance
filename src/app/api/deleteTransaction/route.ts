import { supabaseServiceRole } from "@/lib/supabase/server-only";

export async function POST(req: Request) {
  const { transaction_id } = await req.json();
  try {
    const { data, error } = await supabaseServiceRole
      .from("transactions")
      .delete()
      .eq('transaction_id', transaction_id);

    if (error) {
      console.error("Supabase delete error:", error);
      return new Response(JSON.stringify({ error: error.message || error }), { status: 400 });
    }

    return new Response(JSON.stringify({ data }), { status: 200 });
  } catch (err) {
    console.error("Catch error deleting transaction:", err);
    return new Response(JSON.stringify({ error: err }), { status: 500 });
  }
}