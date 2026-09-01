import { createClient } from "@supabase/supabase-js";

// The publishable key is safe for browser use. Environment variables still
// take priority for local and hosted configuration.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mgtnrxbxzkafuqrutopm.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_cuK5MM9BVInKCzxl3CY0lw_wUDJoYEk";

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
