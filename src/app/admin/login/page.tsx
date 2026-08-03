"use client";

import { FormEvent, useState } from "react";
import { ArrowLeft, Building2, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!supabase) {
      setError("Supabase is not connected yet. Add the Supabase environment variables in Vercel and .env.local first.");
      return;
    }
    setLoading(true);
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (loginError) {
      setError(loginError.message);
      return;
    }
    router.push("/admin");
  }

  return <main className="flex min-h-screen items-center justify-center bg-[#edf2f5] px-6 py-12">
    <div className="grid w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-[0_20px_70px_rgba(8,36,61,.12)] md:grid-cols-2">
      <div className="hidden bg-[#092945] p-10 text-white md:block"><Link href="/" className="flex items-center gap-2 text-sm text-white/70"><ArrowLeft size={15} /> Back to website</Link><div className="mt-28"><span className="grid h-12 w-12 place-items-center rounded-lg bg-[#c99554] text-[#092945]"><Building2 /></span><h1 className="mt-7 font-serif text-4xl leading-tight">The Nexus<br /><span className="italic text-[#d7a263]">control room.</span></h1><p className="mt-5 max-w-xs text-sm leading-6 text-white/60">Manage your properties, inquiries, and public story from one calm workspace.</p></div></div>
      <div className="p-8 sm:p-12"><Link href="/" className="mb-14 flex items-center gap-2 text-sm text-[#557084] md:hidden"><ArrowLeft size={15} /> Back to website</Link><div className="mb-9"><div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-[#f2e7d8] text-[#bc8140]"><ShieldCheck size={21} /></div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#bc8140]">Admin portal</p><h2 className="mt-2 font-serif text-3xl text-[#092945]">Welcome back.</h2><p className="mt-2 text-sm text-[#557084]">Sign in to manage Nexus Landmark.</p></div><form onSubmit={handleSubmit} className="grid gap-5"><label className="grid gap-2 text-xs font-bold text-[#314b5e]">Email address<div className="flex items-center gap-3 rounded-md border border-[#0c2d49]/15 px-4 py-3"><Mail size={16} className="text-[#bc8140]" /><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@nexuslandmark.com" className="w-full bg-transparent text-sm outline-none" /></div></label><label className="grid gap-2 text-xs font-bold text-[#314b5e]">Password<div className="flex items-center gap-3 rounded-md border border-[#0c2d49]/15 px-4 py-3"><LockKeyhole size={16} className="text-[#bc8140]" /><input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" className="w-full bg-transparent text-sm outline-none" /></div></label>{error && <p className="rounded-md bg-red-50 p-3 text-xs leading-5 text-red-700">{error}</p>}<button disabled={loading} className="rounded-md bg-[#092945] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#bc8140] disabled:opacity-50">{loading ? "Signing in…" : "Sign in to dashboard"}</button></form></div>
    </div>
  </main>;
}
