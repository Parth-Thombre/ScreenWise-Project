import { createClient } from "@supabase/supabase-js"
import type { Database } from "./supabase" // uses types defined in supabase.ts

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("❌ Missing Supabase service role key or URL in environment.")
}

export const supabaseAdmin = createClient<Database>(supabaseUrl, serviceRoleKey)
