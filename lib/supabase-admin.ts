// File: lib/supabase-admin.ts

import { createClient } from "@supabase/supabase-js"
import type { Database } from "./supabase" // assuming your types are in supabase.ts

const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export { supabaseAdmin }
