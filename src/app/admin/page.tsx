"use client";

import { useEffect, useState } from "react";
import { Building2, CheckCircle2, ChevronRight, CircleUserRound, ClipboardList, FilePenLine, LayoutDashboard, LogOut, Menu, Plus, Search, Settings, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Project = { id: string; title: string; location: string; status: string; property_type: string; size: string; price: string };
type Inquiry = { id: string; name: string; email: string; message: string; status: string; created_at: string };
type Content = { hero_eyebrow: string; hero_description: string; about_description: string; phone: string; email: string; address: string };
const defaultContent: Content = { hero_eyebrow: "Better thinking. Better addresses.", hero_description: "We create future-ready homes and commercial spaces in the places that matter—designed for the life you have now and the one you are building next.", about_description: "We bring planning, architecture, and customer care into one clear ownership journey. From site selection to handover, every decision is made to create calm, lasting value.", phone: "+880 1611 741 100", email: "hello@nexuslandmark.com", address: "Dhaka, Bangladesh" };

const demoProjects: Project[] = [
  { id: "demo-1", title: "Nexus Parkview", location: "Gulshan, Dhaka", status: "Ongoing", property_type: "Residential", size: "1,850–2,450 sft", price: "On request" },
  { id: "demo-2", title: "Landmark One", location: "Banani, Dhaka", status: "Upcoming", property_type: "Commercial", size: "1,200–8,000 sft", price: "On request" },
];

function ContentEditor({ content, setContent, saveContent, saved }: { content: Content; setContent: (content: Content) => void; saveContent: () => void; saved: boolean }) { const field = (key: keyof Content, label: string, area = false) => <label className="grid gap-2 text-xs font-bold text-[#314b5e]">{label}{area ? <textarea rows={4} value={content[key]} onChange={(event) => setContent({ ...content, [key]: event.target.value })} className="rounded-md border border-[#0c2d49]/10 bg-[#f5f7f9] p-3 text-sm font-normal outline-none focus:border-[#c99554]" /> : <input value={content[key]} onChange={(event) => setContent({ ...content, [key]: event.target.value })} className="rounded-md border border-[#0c2d49]/10 bg-[#f5f7f9] p-3 text-sm font-normal outline-none focus:border-[#c99554]" />}</label>; return <main className="min-h-screen bg-[#f5f7f9] p-6 text-[#092945] lg:p-10"><div className="mx-auto max-w-4xl rounded-lg border border-[#0c2d49]/10 bg-white p-6"><p className="text-xs font-bold uppercase tracking-widest text-[#bc8140]">Homepage CMS</p><h2 className="mt-1 font-serif text-3xl">Edit website information</h2><p className="mt-2 text-sm leading-6 text-[#557084]">Update these fields and save them to publish the information used by Nexus Landmark.</p><div className="mt-8 grid gap-5 md:grid-cols-2">{field("hero_eyebrow", "Hero label")}{field("phone", "Phone number")}{field("hero_description", "Hero description", true)}{field("about_description", "About description", true)}{field("email", "Email address")}{field("address", "Office address")}</div><button onClick={saveContent} className="mt-7 rounded-md bg-[#092945] px-5 py-3 text-sm font-bold text-white">{saved ? "Saved successfully" : "Save website information"}</button></div></main>; }

export default function AdminDashboard() {
  const router = useRouter();
  const [section, setSection] = useState("Overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(demoProjects);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [content, setContent] = useState<Content>(defaultContent);
  const [contentSaved, setContentSaved] = useState(false);

  useEffect(() => {
    async function load() {
      if (!supabase) return;
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) { router.replace("/admin/login"); return; }
      const [{ data: projectData }, { data: inquiryData }, { data: contentData }] = await Promise.all([
        supabase.from("properties").select("id,title,location,status,property_type,size,price").order("created_at", { ascending: false }),
        supabase.from("inquiries").select("id,name,email,message,status,created_at").order("created_at", { ascending: false }),
        supabase.from("site_content").select("content").eq("id", "homepage").maybeSingle(),
      ]);
      if (projectData) setProjects(projectData);
      if (inquiryData) setInquiries(inquiryData);
      if (contentData?.content) setContent({ ...defaultContent, ...contentData.content });
    }
    load();
  }, [router]);

  async function signOut() { if (supabase) await supabase.auth.signOut(); router.push("/admin/login"); }
  async function addDemoProject() {
    if (!newTitle.trim()) return;
    const project = { id: `local-${Date.now()}`, title: newTitle, location: "Dhaka, Bangladesh", status: "Upcoming", property_type: "Residential", size: "To be announced", price: "On request" };
    if (supabase) {
      const { data } = await supabase.from("properties").insert(project).select().single();
      if (data) setProjects((current) => [data, ...current]);
    } else setProjects((current) => [project, ...current]);
    setNewTitle(""); setShowForm(false);
  }

  async function saveContent() {
    if (supabase) await supabase.from("site_content").upsert({ id: "homepage", content, updated_at: new Date().toISOString() });
    setContentSaved(true); setTimeout(() => setContentSaved(false), 2500);
  }

  const nav = [{ name: "Overview", icon: LayoutDashboard }, { name: "Content", icon: FilePenLine }, { name: "Properties", icon: Building2 }, { name: "Inquiries", icon: ClipboardList }];
  if (section === "Content") return <ContentEditor content={content} setContent={setContent} saveContent={saveContent} saved={contentSaved} />;
  return <main className="min-h-screen bg-[#f5f7f9] text-[#092945]"><aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#092945] p-6 text-white transition-transform lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}><div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="grid h-9 w-9 place-items-center rounded bg-[#c99554] text-[#092945]"><Building2 size={18} /></span><span className="font-serif text-lg">Nexus <span className="text-[#d7a263]">Landmark</span></span></div><button className="lg:hidden" onClick={() => setMenuOpen(false)}><X size={18} /></button></div><p className="mb-5 mt-12 text-[10px] font-bold uppercase tracking-[.2em] text-white/40">Workspace</p><div className="grid gap-2">{nav.map(({ name, icon: Icon }) => <button key={name} onClick={() => { setSection(name); setMenuOpen(false); }} className={`flex items-center gap-3 rounded-md px-3 py-3 text-left text-sm font-semibold transition ${section === name ? "bg-white/10 text-[#d7a263]" : "text-white/65 hover:bg-white/5 hover:text-white"}`}><Icon size={17} />{name}</button>)}</div><div className="absolute bottom-6 left-6 right-6 grid gap-2 border-t border-white/10 pt-5"><button className="flex items-center gap-3 px-3 py-2 text-left text-sm text-white/60"><Settings size={17} /> Settings</button><button onClick={signOut} className="flex items-center gap-3 px-3 py-2 text-left text-sm text-white/60 hover:text-white"><LogOut size={17} /> Sign out</button></div></aside><div className="lg:pl-64"><header className="flex h-[76px] items-center justify-between border-b border-[#0c2d49]/10 bg-white px-6 lg:px-10"><button className="lg:hidden" onClick={() => setMenuOpen(true)}><Menu /></button><div className="hidden lg:block"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#bc8140]">Admin workspace</p><h1 className="mt-1 font-serif text-xl">{section}</h1></div><div className="flex items-center gap-4"><button className="hidden text-[#557084] sm:block"><Search size={18} /></button><div className="flex items-center gap-2 border-l border-[#0c2d49]/10 pl-4"><CircleUserRound size={22} className="text-[#bc8140]" /><span className="hidden text-xs font-bold sm:block">Administrator</span></div></div></header><div className="p-6 lg:p-10"><div className="mb-8 lg:hidden"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#bc8140]">Admin workspace</p><h1 className="mt-1 font-serif text-3xl">{section}</h1></div>{section === "Overview" && <Overview projects={projects} inquiries={inquiries} onProjects={() => setSection("Properties")} onInquiries={() => setSection("Inquiries")} />}{section === "Properties" && <Properties projects={projects} showForm={showForm} setShowForm={setShowForm} newTitle={newTitle} setNewTitle={setNewTitle} addProject={addDemoProject} />}{section === "Inquiries" && <Inquiries inquiries={inquiries} />}</div></div></main>;
}

function Overview({ projects, inquiries, onProjects, onInquiries }: { projects: Project[]; inquiries: Inquiry[]; onProjects: () => void; onInquiries: () => void }) { return <><div className="grid gap-5 sm:grid-cols-3"><Stat label="Total projects" value={projects.length.toString()} icon={<Building2 />} /><Stat label="New inquiries" value={inquiries.filter((item) => item.status === "New").length.toString()} icon={<ClipboardList />} /><Stat label="Published status" value="Live" icon={<CheckCircle2 />} /></div><div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_.8fr]"><div className="rounded-lg border border-[#0c2d49]/10 bg-white p-6"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-[#bc8140]">Portfolio</p><h2 className="mt-1 font-serif text-2xl">Recent properties</h2></div><button onClick={onProjects} className="text-xs font-bold text-[#bc8140]">Manage <ChevronRight size={14} className="inline" /></button></div><div className="mt-6 grid gap-3">{projects.slice(0, 3).map((project) => <div key={project.id} className="flex items-center justify-between rounded-md bg-[#f5f7f9] p-4"><div><h3 className="text-sm font-bold">{project.title}</h3><p className="mt-1 text-xs text-[#557084]">{project.location} · {project.property_type}</p></div><span className="rounded-full bg-[#e7f4ed] px-3 py-1 text-[10px] font-bold text-[#31714d]">{project.status}</span></div>)}</div></div><div className="rounded-lg border border-[#0c2d49]/10 bg-[#c99554] p-7 text-white"><p className="text-xs font-bold uppercase tracking-widest text-white/70">Need attention</p><h2 className="mt-2 font-serif text-3xl">{inquiries.length ? `${inquiries.length} customer inquiries` : "Your inbox is clear"}</h2><p className="mt-3 text-sm leading-6 text-white/75">Respond quickly and turn interest into the next Nexus Landmark address.</p><button onClick={onInquiries} className="mt-7 rounded-md bg-[#092945] px-4 py-3 text-xs font-bold">View inquiries <ChevronRight size={14} className="inline" /></button></div></div></>; }

function Stat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) { return <div className="rounded-lg border border-[#0c2d49]/10 bg-white p-5"><span className="mb-8 grid h-9 w-9 place-items-center rounded bg-[#f2e7d8] text-[#bc8140]">{icon}</span><strong className="block font-serif text-3xl">{value}</strong><span className="mt-1 block text-xs text-[#557084]">{label}</span></div>; }

function Properties({ projects, showForm, setShowForm, newTitle, setNewTitle, addProject }: { projects: Project[]; showForm: boolean; setShowForm: (value: boolean) => void; newTitle: string; setNewTitle: (value: string) => void; addProject: () => void }) { return <div className="rounded-lg border border-[#0c2d49]/10 bg-white p-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-xs font-bold uppercase tracking-widest text-[#bc8140]">Content manager</p><h2 className="mt-1 font-serif text-3xl">Properties</h2></div><button onClick={() => setShowForm(!showForm)} className="rounded-md bg-[#092945] px-4 py-3 text-xs font-bold text-white"><Plus size={15} className="mr-1 inline" /> Add property</button></div>{showForm && <div className="mt-6 flex flex-col gap-3 rounded-md bg-[#f5f7f9] p-4 sm:flex-row"><input value={newTitle} onChange={(event) => setNewTitle(event.target.value)} placeholder="Property name" className="flex-1 rounded border border-[#0c2d49]/10 bg-white px-3 py-3 text-sm outline-none" /><button onClick={addProject} className="rounded bg-[#c99554] px-5 py-3 text-xs font-bold text-white">Save property</button></div>}<div className="mt-7 overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead><tr className="border-b border-[#0c2d49]/10 text-[10px] uppercase tracking-wider text-[#557084]"><th className="pb-3">Property</th><th className="pb-3">Type</th><th className="pb-3">Status</th><th className="pb-3">Size</th><th className="pb-3">Action</th></tr></thead><tbody>{projects.map((project) => <tr key={project.id} className="border-b border-[#0c2d49]/5"><td className="py-4 font-bold">{project.title}<span className="mt-1 block text-xs font-normal text-[#557084]">{project.location}</span></td><td className="py-4 text-[#557084]">{project.property_type}</td><td className="py-4"><span className="rounded-full bg-[#e7f4ed] px-3 py-1 text-[10px] font-bold text-[#31714d]">{project.status}</span></td><td className="py-4 text-[#557084]">{project.size}</td><td className="py-4 text-xs font-bold text-[#bc8140]">Edit <ChevronRight size={13} className="inline" /></td></tr>)}</tbody></table></div></div>; }

function Inquiries({ inquiries }: { inquiries: Inquiry[] }) { return <div className="rounded-lg border border-[#0c2d49]/10 bg-white p-6"><p className="text-xs font-bold uppercase tracking-widest text-[#bc8140]">Customer interest</p><h2 className="mt-1 font-serif text-3xl">Inquiries</h2>{inquiries.length === 0 ? <div className="py-20 text-center"><ClipboardList className="mx-auto text-[#c99554]" size={35} /><p className="mt-4 font-serif text-xl">No inquiries yet</p><p className="mt-2 text-sm text-[#557084]">New contact requests will appear here.</p></div> : <div className="mt-7 grid gap-3">{inquiries.map((item) => <div key={item.id} className="rounded-md bg-[#f5f7f9] p-4"><div className="flex justify-between"><strong className="text-sm">{item.name}</strong><span className="text-xs text-[#557084]">{item.status}</span></div><p className="mt-1 text-xs text-[#bc8140]">{item.email}</p><p className="mt-3 text-sm text-[#557084]">{item.message}</p></div>)}</div>}</div>; }
