import { createClient } from "@supabase/supabase-js";

// This is the public browser key for the active Nexus Landmark project.
// It is intentionally public; RLS protects all database writes.
const supabaseUrl = "https://mgtnrxbxzkafuqrutopm.supabase.co";
const supabaseAnonKey = "sb_publishable_cuK5MM9BVInKCzxl3CY0lw_wUDJoYEk";

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
