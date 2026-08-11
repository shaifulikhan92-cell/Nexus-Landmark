"use client";

import { ChangeEvent, useEffect, useState } from "react";
import {
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Edit2,
  FilePenLine,
  ImagePlus,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  Trash2,
  Upload,
  X,
  ExternalLink,
  Quote,
  Sparkles,
  Layers,
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export type Property = {
  id: string;
  title: string;
  location: string;
  description: string;
  property_type: string;
  status: string;
  size: string;
  price: string;
  image_url: string;
};

export type GalleryItem = {
  id: string;
  label: string;
  title: string;
  image_url: string;
};

export type Testimonial = {
  id: string;
  quote: string;
  customer_name: string;
  customer_role: string;
};

export type ServiceStory = {
  id: string;
  title: string;
  description: string;
  image_url?: string;
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  property_title?: string;
  status: "New" | "Contacted" | "Closed";
  created_at: string;
};

export type SiteContent = Record<string, string>;

const defaultContent: SiteContent = {
  brand_name: "Nexus Landmark",
  brand_subtitle: "Properties & Development",
  top_bar_text: "NEXUS LANDMARK — CREATING ADDRESSES WITH PURPOSE",
  hero_eyebrow: "Better thinking. Better addresses.",
  hero_title: "Spaces that",
  hero_title_accent: "move you forward.",
  hero_description: "We create future-ready homes and commercial spaces in the places that matter—designed for the life you have now and the one you are building next.",
  hero_image_url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=90",
  hero_primary_cta: "Explore projects",
  hero_secondary_cta: "Why Nexus Landmark",
  hero_stat_number: "12+",
  hero_stat_label: "Years of trusted work",
  hero_featured_label: "Featured address",
  hero_featured_title: "Nexus Parkview · Gulshan",
  about_eyebrow: "A more considered approach",
  about_title: "A better address begins with",
  about_title_accent: "better thinking.",
  about_description: "We bring planning, architecture, and customer care into one clear ownership journey. From site selection to handover, every decision is made to create calm, lasting value.",
  about_stat1_number: "12+",
  about_stat1_label: "Premium floors delivered",
  about_stat2_number: "100%",
  about_stat2_label: "Accountable service",
  portfolio_eyebrow: "Our portfolio",
  portfolio_title: "Addresses with intention.",
  gallery_eyebrow: "See the detail",
  gallery_title: "A visual language of care.",
  journal_eyebrow: "The Nexus journal",
  journal_title: "Stories behind the spaces.",
  journal_description: "Walk through our projects, meet the people behind them, and see how considered decisions become lasting places.",
  testimonial_quote: "The process felt clear from day one. The design is premium, but more importantly, it works beautifully for our family.",
  testimonial_author: "Farzana Chowdhury, Nexus homeowner",
  cta_eyebrow: "Your next address starts here",
  cta_title: "Ready to choose a place that feels like yours?",
  cta_description: "Request a consultation, project brochure, or a private site visit with our team.",
  phone: "01711994449",
  email: "hello@nexuslandmark.com",
  address: "Dhaka, Bangladesh",
  footer_tagline: "Premium residential and commercial developments shaped by design intelligence, local insight, and long-term trust."
};

const defaultProperties: Property[] = [
  {
    id: "demo-1",
    title: "Nexus Parkview",
    location: "Gulshan, Dhaka",
    description: "A calm, contemporary family residence shaped around light, space, and everyday ease.",
    property_type: "Residential",
    status: "Ongoing",
    size: "1,850–2,450 sft",
    price: "On request",
    image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85"
  },
  {
    id: "demo-2",
    title: "Landmark One",
    location: "Banani, Dhaka",
    description: "A confident commercial address for ambitious businesses, retail, and lifestyle brands.",
    property_type: "Commercial",
    status: "Upcoming",
    size: "1,200–8,000 sft",
    price: "On request",
    image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85"
  }
];

export default function AdminDashboard() {
  const router = useRouter();
  const [section, setSection] = useState<string>("Overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Dynamic Data State
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [properties, setProjects] = useState<Property[]>(defaultProperties);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [services, setServices] = useState<ServiceStory[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  // Edit Modals State
  const [editProperty, setEditProperty] = useState<Property | null>(null);
  const [editGallery, setEditGallery] = useState<GalleryItem | null>(null);
  const [editTestimonial, setEditTestimonial] = useState<Testimonial | null>(null);
  const [editService, setEditService] = useState<ServiceStory | null>(null);

  // Forms
  const [newProp, setNewProp] = useState<Omit<Property, "id">>({
    title: "",
    location: "",
    description: "",
    property_type: "Residential",
    status: "Upcoming",
    size: "",
    price: "",
    image_url: ""
  });

  const [newGallery, setNewGallery] = useState<Omit<GalleryItem, "id">>({
    label: "Exterior",
    title: "",
    image_url: ""
  });

  const [newTestimonial, setNewTestimonial] = useState<Omit<Testimonial, "id">>({
    quote: "",
    customer_name: "",
    customer_role: ""
  });

  const [newService, setNewService] = useState<Omit<ServiceStory, "id">>({
    title: "",
    description: "",
    image_url: ""
  });

  // Sync to LocalStorage & Supabase
  useEffect(() => {
    // 1. Try LocalStorage cached state for instant offline preview & state sync
    try {
      const cachedContent = localStorage.getItem("nexus_site_content");
      if (cachedContent) setContent(JSON.parse(cachedContent));
      const cachedProps = localStorage.getItem("nexus_properties");
      if (cachedProps) setProjects(JSON.parse(cachedProps));
      const cachedGallery = localStorage.getItem("nexus_gallery");
      if (cachedGallery) setGallery(JSON.parse(cachedGallery));
      const cachedTestimonials = localStorage.getItem("nexus_testimonials");
      if (cachedTestimonials) setTestimonials(JSON.parse(cachedTestimonials));
      const cachedServices = localStorage.getItem("nexus_services");
      if (cachedServices) setServices(JSON.parse(cachedServices));
      const cachedInquiries = localStorage.getItem("nexus_inquiries");
      if (cachedInquiries) setInquiries(JSON.parse(cachedInquiries));
    } catch (e) {
      console.error(e);
    }

    // 2. Fetch from Supabase
    async function loadData() {
      if (!supabase) return;
      const [cRes, pRes, gRes, tRes, sRes, iRes] = await Promise.all([
        supabase.from("site_content").select("content").eq("id", "homepage").maybeSingle(),
        supabase.from("properties").select("*").order("created_at", { ascending: false }),
        supabase.from("gallery_items").select("*").order("sort_order"),
        supabase.from("testimonials").select("*").order("created_at", { ascending: false }),
        supabase.from("services").select("*").order("sort_order"),
        supabase.from("inquiries").select("*").order("created_at", { ascending: false })
      ]);

      if (cRes.data?.content) {
        const data = cRes.data.content as SiteContent;
        setContent((prev) => ({ ...prev, ...data }));
        localStorage.setItem("nexus_site_content", JSON.stringify(data));
      }
      if (pRes.data?.length) {
        setProjects(pRes.data);
        localStorage.setItem("nexus_properties", JSON.stringify(pRes.data));
      }
      if (gRes.data?.length) {
        setGallery(gRes.data);
        localStorage.setItem("nexus_gallery", JSON.stringify(gRes.data));
      }
      if (tRes.data?.length) {
        setTestimonials(tRes.data);
        localStorage.setItem("nexus_testimonials", JSON.stringify(tRes.data));
      }
      if (sRes.data?.length) {
        setServices(sRes.data);
        localStorage.setItem("nexus_services", JSON.stringify(sRes.data));
      }
      if (iRes.data?.length) {
        setInquiries(iRes.data);
        localStorage.setItem("nexus_inquiries", JSON.stringify(iRes.data));
      }
    }
    loadData();
  }, []);

  function notify(text: string) {
    setMessage(text);
    setTimeout(() => setMessage(""), 3500);
  }

  // --- Save utilities ---
  const savePropsLocal = (items: Property[]) => {
    setProjects(items);
    localStorage.setItem("nexus_properties", JSON.stringify(items));
  };

  const saveGalleryLocal = (items: GalleryItem[]) => {
    setGallery(items);
    localStorage.setItem("nexus_gallery", JSON.stringify(items));
  };

  const saveTestimonialsLocal = (items: Testimonial[]) => {
    setTestimonials(items);
    localStorage.setItem("nexus_testimonials", JSON.stringify(items));
  };

  const saveServicesLocal = (items: ServiceStory[]) => {
    setServices(items);
    localStorage.setItem("nexus_services", JSON.stringify(items));
  };

  const saveInquiriesLocal = (items: Inquiry[]) => {
    setInquiries(items);
    localStorage.setItem("nexus_inquiries", JSON.stringify(items));
  };

  async function handleFileUpload(file: File, callback: (url: string) => void) {
    setIsUploading(true);
    if (supabase) {
      const path = `uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "-")}`;
      const { error } = await supabase.storage.from("site-assets").upload(path, file, { upsert: true });
      if (!error) {
        const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
        callback(data.publicUrl);
        setIsUploading(false);
        notify("Image uploaded!");
        return;
      }
    }
    const localUrl = URL.createObjectURL(file);
    callback(localUrl);
    setIsUploading(false);
    notify("Image uploaded (preview ready)");
  }

  async function saveSiteContent() {
    localStorage.setItem("nexus_site_content", JSON.stringify(content));
    if (supabase) {
      await supabase.from("site_content").upsert({ id: "homepage", content, updated_at: new Date().toISOString() });
    }
    notify("A-Z Website Information Saved Successfully!");
  }

  // --- Property Actions ---
  async function addProperty() {
    if (!newProp.title || !newProp.location) {
      notify("Title and Location are required.");
      return;
    }
    let item: Property = { ...newProp, id: `prop-${Date.now()}` };
    if (supabase) {
      const { data } = await supabase.from("properties").insert(newProp).select().single();
      if (data) item = data;
    }
    savePropsLocal([item, ...properties]);
    setNewProp({ title: "", location: "", description: "", property_type: "Residential", status: "Upcoming", size: "", price: "", image_url: "" });
    notify("Property published!");
  }

  async function updatePropertySave() {
    if (!editProperty) return;
    if (supabase) await supabase.from("properties").update(editProperty).eq("id", editProperty.id);
    savePropsLocal(properties.map((p) => (p.id === editProperty.id ? editProperty : p)));
    setEditProperty(null);
    notify("Property updated!");
  }

  async function deleteProperty(id: string) {
    if (!window.confirm("Delete property?")) return;
    if (supabase) await supabase.from("properties").delete().eq("id", id);
    savePropsLocal(properties.filter((p) => p.id !== id));
    notify("Property deleted.");
  }

  // --- Gallery Actions ---
  async function addGalleryItem() {
    if (!newGallery.title || !newGallery.image_url) {
      notify("Title and Image URL are required.");
      return;
    }
    let item: GalleryItem = { ...newGallery, id: `g-${Date.now()}` };
    if (supabase) {
      const { data } = await supabase.from("gallery_items").insert(newGallery).select().single();
      if (data) item = data;
    }
    saveGalleryLocal([...gallery, item]);
    setNewGallery({ label: "Exterior", title: "", image_url: "" });
    notify("Gallery item added!");
  }

  async function updateGallerySave() {
    if (!editGallery) return;
    if (supabase) await supabase.from("gallery_items").update(editGallery).eq("id", editGallery.id);
    saveGalleryLocal(gallery.map((g) => (g.id === editGallery.id ? editGallery : g)));
    setEditGallery(null);
    notify("Gallery item updated!");
  }

  async function deleteGalleryItem(id: string) {
    if (!window.confirm("Delete gallery photo?")) return;
    if (supabase) await supabase.from("gallery_items").delete().eq("id", id);
    saveGalleryLocal(gallery.filter((g) => g.id !== id));
    notify("Gallery item deleted.");
  }

  // --- Testimonials Actions ---
  async function addTestimonialItem() {
    if (!newTestimonial.quote || !newTestimonial.customer_name) {
      notify("Quote and Customer Name required.");
      return;
    }
    let item: Testimonial = { ...newTestimonial, id: `t-${Date.now()}` };
    if (supabase) {
      const { data } = await supabase.from("testimonials").insert({ ...newTestimonial, published: true }).select().single();
      if (data) item = data;
    }
    saveTestimonialsLocal([item, ...testimonials]);
    setNewTestimonial({ quote: "", customer_name: "", customer_role: "" });
    notify("Testimonial added!");
  }

  async function updateTestimonialSave() {
    if (!editTestimonial) return;
    if (supabase) await supabase.from("testimonials").update(editTestimonial).eq("id", editTestimonial.id);
    saveTestimonialsLocal(testimonials.map((t) => (t.id === editTestimonial.id ? editTestimonial : t)));
    setEditTestimonial(null);
    notify("Testimonial updated!");
  }

  async function deleteTestimonialItem(id: string) {
    if (!window.confirm("Delete testimonial?")) return;
    if (supabase) await supabase.from("testimonials").delete().eq("id", id);
    saveTestimonialsLocal(testimonials.filter((t) => t.id !== id));
    notify("Testimonial deleted.");
  }

  // --- Services Actions ---
  async function addServiceItem() {
    if (!newService.title || !newService.description) {
      notify("Title and Description required.");
      return;
    }
    let item: ServiceStory = { ...newService, id: `s-${Date.now()}` };
    if (supabase) {
      const { data } = await supabase.from("services").insert({ ...newService, published: true }).select().single();
      if (data) item = data;
    }
    saveServicesLocal([...services, item]);
    setNewService({ title: "", description: "", image_url: "" });
    notify("Service story added!");
  }

  async function updateServiceSave() {
    if (!editService) return;
    if (supabase) await supabase.from("services").update(editService).eq("id", editService.id);
    saveServicesLocal(services.map((s) => (s.id === editService.id ? editService : s)));
    setEditService(null);
    notify("Service story updated!");
  }

  async function deleteServiceItem(id: string) {
    if (!window.confirm("Delete story?")) return;
    if (supabase) await supabase.from("services").delete().eq("id", id);
    saveServicesLocal(services.filter((s) => s.id !== id));
    notify("Service story deleted.");
  }

  // --- Inquiries Actions ---
  async function updateInquiryStatus(id: string, status: Inquiry["status"]) {
    if (supabase) await supabase.from("inquiries").update({ status }).eq("id", id);
    saveInquiriesLocal(inquiries.map((i) => (i.id === id ? { ...i, status } : i)));
    notify(`Inquiry updated to ${status}`);
  }

  async function deleteInquiryItem(id: string) {
    if (!window.confirm("Delete lead?")) return;
    if (supabase) await supabase.from("inquiries").delete().eq("id", id);
    saveInquiriesLocal(inquiries.filter((i) => i.id !== id));
    notify("Inquiry deleted.");
  }

  async function signOut() {
    if (supabase) await supabase.auth.signOut();
    router.push("/admin/login");
  }

  const nav = [
    { name: "Overview", icon: LayoutDashboard },
    { name: "Content", icon: FilePenLine },
    { name: "Properties", icon: Building2 },
    { name: "Gallery", icon: ImagePlus },
    { name: "Testimonials", icon: Quote },
    { name: "Services", icon: Layers },
    { name: "Inquiries", icon: ClipboardList }
  ];

  return (
    <main className="min-h-screen bg-[#f5f7f9] text-[#092945]">
      {/* Sidebar matching user screenshot */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#092945] p-6 text-white transition-transform lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Nexus Landmark" className="h-10 w-auto object-contain rounded bg-white/10 p-1" />
            <span className="font-serif text-lg">Nexus <span className="text-[#d7a263]">Landmark</span></span>
          </div>
          <button className="lg:hidden" onClick={() => setMenuOpen(false)}><X size={18} /></button>
        </div>

        <p className="mb-4 mt-10 text-[10px] font-bold uppercase tracking-[.2em] text-white/40">Workspace</p>
        
        <div className="grid gap-1">
          {nav.map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => { setSection(name); setMenuOpen(false); }}
              className={`flex items-center justify-between rounded-md px-3.5 py-3 text-left text-sm font-semibold transition ${
                section === name ? "bg-white/10 text-[#d7a263]" : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3"><Icon size={17} />{name}</span>
              {name === "Inquiries" && inquiries.filter((i) => i.status === "New").length > 0 && (
                <span className="rounded-full bg-[#bc8140] px-2 py-0.5 text-[10px] font-bold text-white">
                  {inquiries.filter((i) => i.status === "New").length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="absolute bottom-6 left-6 right-6 grid gap-2 border-t border-white/10 pt-5">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-3 py-2 text-left text-sm text-white/70 hover:text-white">
            <ExternalLink size={17} /> Public Website ↗
          </a>
          <button onClick={signOut} className="flex items-center gap-3 px-3 py-2 text-left text-sm text-white/60 hover:text-white">
            <LogOut size={17} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="lg:pl-64">
        <header className="flex h-[76px] items-center justify-between border-b border-[#0c2d49]/10 bg-white px-6 lg:px-10">
          <button className="lg:hidden" onClick={() => setMenuOpen(true)}><Menu /></button>
          <div className="hidden lg:block">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#bc8140]">Admin Workspace</p>
            <h1 className="mt-0.5 font-serif text-xl">{section}</h1>
          </div>
          <div className="flex items-center gap-4">
            {message && (
              <span className="rounded-md bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-700 border border-emerald-200 shadow-sm">
                <Check size={13} className="mr-1 inline" /> {message}
              </span>
            )}
            <a href="/" target="_blank" rel="noreferrer" className="rounded-md bg-[#092945] px-4 py-2 text-xs font-bold text-white hover:bg-[#bc8140]">
              View Live Website ↗
            </a>
          </div>
        </header>

        <div className="p-6 lg:p-10">
          {/* SECTION 1: OVERVIEW */}
          {section === "Overview" && (
            <>
              <div className="grid gap-5 sm:grid-cols-3">
                <Stat label="Total Projects" value={properties.length.toString()} icon={<Building2 />} />
                <Stat label="New Inquiries" value={inquiries.filter((item) => item.status === "New").length.toString()} icon={<ClipboardList />} />
                <Stat label="Frontend Status" value="A-Z Editable & Live" icon={<CheckCircle2 />} />
              </div>
              <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
                <div className="rounded-lg border border-[#0c2d49]/10 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#bc8140]">Portfolio</p>
                      <h2 className="mt-1 font-serif text-2xl">Recent Properties</h2>
                    </div>
                    <button onClick={() => setSection("Properties")} className="text-xs font-bold text-[#bc8140] hover:underline">
                      Manage <ChevronRight size={14} className="inline" />
                    </button>
                  </div>
                  <div className="mt-6 grid gap-3">
                    {properties.slice(0, 4).map((p) => (
                      <div key={p.id} className="flex items-center justify-between rounded-md bg-[#f5f7f9] p-4 border border-[#0c2d49]/5">
                        <div>
                          <h3 className="text-sm font-bold text-[#092945]">{p.title}</h3>
                          <p className="mt-0.5 text-xs text-[#557084]">{p.location} · {p.property_type}</p>
                        </div>
                        <span className="rounded-full bg-[#e7f4ed] px-3 py-1 text-[10px] font-bold text-[#31714d]">
                          {p.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-[#0c2d49]/10 bg-[#c99554] p-7 text-white shadow-md flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-white/75">Inbox Status</p>
                    <h2 className="mt-2 font-serif text-3xl">
                      {inquiries.filter((i) => i.status === "New").length > 0
                        ? `${inquiries.filter((i) => i.status === "New").length} Customer Leads`
                        : "Your inbox is clear"}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-white/80">
                      Manage requests, phone numbers, and visit bookings sent from the website.
                    </p>
                  </div>
                  <button onClick={() => setSection("Inquiries")} className="mt-6 w-fit rounded-md bg-[#092945] px-5 py-3 text-xs font-bold text-white transition hover:bg-white hover:text-[#092945]">
                    View Inquiries <ChevronRight size={14} className="inline ml-1" />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* SECTION 2: CONTENT (A-Z Frontend Website Content) */}
          {section === "Content" && (
            <div className="rounded-lg border border-[#0c2d49]/10 bg-white p-6 lg:p-8 shadow-sm">
              <div className="flex items-center justify-between border-b pb-4 mb-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#bc8140]">Homepage CMS</p>
                  <h2 className="mt-1 font-serif text-3xl">Edit Website Information (A-Z)</h2>
                  <p className="mt-1 text-sm text-[#557084]">All fields updated here control the public website copy, hero image, and header/footer info.</p>
                </div>
                <button onClick={saveSiteContent} className="rounded-md bg-[#092945] px-6 py-3 text-xs font-bold text-white transition hover:bg-[#bc8140]">
                  Save Website Information
                </button>
              </div>

              <div className="grid gap-8">
                {/* 1. Header & Brand */}
                <SectionGroup title="1. Brand & Header Info">
                  <Input text="Brand Name" value={content.brand_name || ""} onChange={(v) => setContent({ ...content, brand_name: v })} />
                  <Input text="Brand Subtitle" value={content.brand_subtitle || ""} onChange={(v) => setContent({ ...content, brand_subtitle: v })} />
                  <Input text="Top Announcement Bar" value={content.top_bar_text || ""} onChange={(v) => setContent({ ...content, top_bar_text: v })} />
                </SectionGroup>

                {/* 2. Hero Section */}
                <SectionGroup title="2. Hero Main Banner Section">
                  <Input text="Hero Eyebrow Tag" value={content.hero_eyebrow || ""} onChange={(v) => setContent({ ...content, hero_eyebrow: v })} />
                  <Input text="Hero Title Line 1" value={content.hero_title || ""} onChange={(v) => setContent({ ...content, hero_title: v })} />
                  <Input text="Hero Title Accent (Gold)" value={content.hero_title_accent || ""} onChange={(v) => setContent({ ...content, hero_title_accent: v })} />
                  <Textarea text="Hero Description Paragraph" value={content.hero_description || ""} onChange={(v) => setContent({ ...content, hero_description: v })} />
                  <div className="col-span-full">
                    <Input text="Hero Image URL" value={content.hero_image_url || ""} onChange={(v) => setContent({ ...content, hero_image_url: v })} />
                    <UploadButton onFile={(f) => handleFileUpload(f, (url) => setContent({ ...content, hero_image_url: url }))} loading={isUploading} />
                  </div>
                  <Input text="Primary CTA Button Label" value={content.hero_primary_cta || ""} onChange={(v) => setContent({ ...content, hero_primary_cta: v })} />
                  <Input text="Secondary CTA Button Label" value={content.hero_secondary_cta || ""} onChange={(v) => setContent({ ...content, hero_secondary_cta: v })} />
                  <Input text="Stat Badge Number" value={content.hero_stat_number || ""} onChange={(v) => setContent({ ...content, hero_stat_number: v })} />
                  <Input text="Stat Badge Label" value={content.hero_stat_label || ""} onChange={(v) => setContent({ ...content, hero_stat_label: v })} />
                  <Input text="Featured Banner Label" value={content.hero_featured_label || ""} onChange={(v) => setContent({ ...content, hero_featured_label: v })} />
                  <Input text="Featured Banner Title" value={content.hero_featured_title || ""} onChange={(v) => setContent({ ...content, hero_featured_title: v })} />
                </SectionGroup>

                {/* 3. About Section */}
                <SectionGroup title="3. About Us Section">
                  <Input text="About Eyebrow" value={content.about_eyebrow || ""} onChange={(v) => setContent({ ...content, about_eyebrow: v })} />
                  <Input text="About Title Main" value={content.about_title || ""} onChange={(v) => setContent({ ...content, about_title: v })} />
                  <Input text="About Title Accent" value={content.about_title_accent || ""} onChange={(v) => setContent({ ...content, about_title_accent: v })} />
                  <Textarea text="About Full Description" value={content.about_description || ""} onChange={(v) => setContent({ ...content, about_description: v })} />
                  <Input text="Stat 1 Counter" value={content.about_stat1_number || ""} onChange={(v) => setContent({ ...content, about_stat1_number: v })} />
                  <Input text="Stat 1 Label" value={content.about_stat1_label || ""} onChange={(v) => setContent({ ...content, about_stat1_label: v })} />
                  <Input text="Stat 2 Counter" value={content.about_stat2_number || ""} onChange={(v) => setContent({ ...content, about_stat2_number: v })} />
                  <Input text="Stat 2 Label" value={content.about_stat2_label || ""} onChange={(v) => setContent({ ...content, about_stat2_label: v })} />
                </SectionGroup>

                {/* 4. Section Headlines */}
                <SectionGroup title="4. Section Headlines & Subtitles">
                  <Input text="Portfolio Eyebrow" value={content.portfolio_eyebrow || ""} onChange={(v) => setContent({ ...content, portfolio_eyebrow: v })} />
                  <Input text="Portfolio Title" value={content.portfolio_title || ""} onChange={(v) => setContent({ ...content, portfolio_title: v })} />
                  <Input text="Gallery Eyebrow" value={content.gallery_eyebrow || ""} onChange={(v) => setContent({ ...content, gallery_eyebrow: v })} />
                  <Input text="Gallery Title" value={content.gallery_title || ""} onChange={(v) => setContent({ ...content, gallery_title: v })} />
                  <Input text="Journal Eyebrow" value={content.journal_eyebrow || ""} onChange={(v) => setContent({ ...content, journal_eyebrow: v })} />
                  <Input text="Journal Title" value={content.journal_title || ""} onChange={(v) => setContent({ ...content, journal_title: v })} />
                  <Textarea text="Journal Description" value={content.journal_description || ""} onChange={(v) => setContent({ ...content, journal_description: v })} />
                </SectionGroup>

                {/* 5. Contact & Footer */}
                <SectionGroup title="5. Contact Banner & Office Info">
                  <Input text="CTA Banner Eyebrow" value={content.cta_eyebrow || ""} onChange={(v) => setContent({ ...content, cta_eyebrow: v })} />
                  <Input text="CTA Banner Title" value={content.cta_title || ""} onChange={(v) => setContent({ ...content, cta_title: v })} />
                  <Textarea text="CTA Banner Description" value={content.cta_description || ""} onChange={(v) => setContent({ ...content, cta_description: v })} />
                  <Input text="Phone Number" value={content.phone || ""} onChange={(v) => setContent({ ...content, phone: v })} />
                  <Input text="Email Address" value={content.email || ""} onChange={(v) => setContent({ ...content, email: v })} />
                  <Input text="Office Address" value={content.address || ""} onChange={(v) => setContent({ ...content, address: v })} />
                  <Textarea text="Footer Tagline" value={content.footer_tagline || ""} onChange={(v) => setContent({ ...content, footer_tagline: v })} />
                </SectionGroup>
              </div>

              <button onClick={saveSiteContent} className="mt-8 rounded-md bg-[#092945] px-8 py-3.5 text-sm font-bold text-white hover:bg-[#bc8140]">
                Save Website Information
              </button>
            </div>
          )}

          {/* SECTION 3: PROPERTIES */}
          {section === "Properties" && (
            <div className="grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
              <div className="rounded-lg border border-[#0c2d49]/10 bg-white p-6 shadow-sm">
                <h2 className="font-serif text-2xl">Add Property</h2>
                <div className="mt-5 grid gap-4">
                  <Input text="Title *" value={newProp.title} onChange={(v) => setNewProp({ ...newProp, title: v })} />
                  <Input text="Location *" value={newProp.location} onChange={(v) => setNewProp({ ...newProp, location: v })} />
                  <Textarea text="Description" value={newProp.description} onChange={(v) => setNewProp({ ...newProp, description: v })} />
                  <div className="grid grid-cols-2 gap-4">
                    <label className="grid gap-1 text-xs font-bold">
                      Type
                      <select value={newProp.property_type} onChange={(e) => setNewProp({ ...newProp, property_type: e.target.value })} className="rounded border p-2.5 text-sm">
                        <option>Residential</option>
                        <option>Commercial</option>
                      </select>
                    </label>
                    <label className="grid gap-1 text-xs font-bold">
                      Status
                      <select value={newProp.status} onChange={(e) => setNewProp({ ...newProp, status: e.target.value })} className="rounded border p-2.5 text-sm">
                        <option>Ongoing</option>
                        <option>Upcoming</option>
                        <option>Completed</option>
                      </select>
                    </label>
                  </div>
                  <Input text="Size (e.g. 1,850-2,450 sft)" value={newProp.size} onChange={(v) => setNewProp({ ...newProp, size: v })} />
                  <Input text="Price Tag (e.g. On request)" value={newProp.price} onChange={(v) => setNewProp({ ...newProp, price: v })} />
                  <div>
                    <Input text="Image URL" value={newProp.image_url} onChange={(v) => setNewProp({ ...newProp, image_url: v })} />
                    <UploadButton onFile={(f) => handleFileUpload(f, (url) => setNewProp({ ...newProp, image_url: url }))} loading={isUploading} />
                  </div>
                  <button onClick={addProperty} className="rounded-md bg-[#092945] py-3 text-sm font-bold text-white hover:bg-[#bc8140]">
                    <Plus size={16} className="mr-1 inline" /> Save & Publish Property
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-[#0c2d49]/10 bg-white p-6 shadow-sm">
                <h2 className="font-serif text-2xl">Published Properties ({properties.length})</h2>
                <div className="mt-5 grid gap-4">
                  {properties.map((p) => (
                    <div key={p.id} className="flex items-center justify-between rounded-lg bg-[#f5f7f9] p-4 border border-[#0c2d49]/5">
                      <div className="flex items-center gap-3">
                        {p.image_url && <img src={p.image_url} alt={p.title} className="h-12 w-12 rounded object-cover" />}
                        <div>
                          <strong className="text-sm font-serif">{p.title}</strong>
                          <p className="text-xs text-[#557084]">{p.location} · {p.property_type}</p>
                          <span className="rounded-full bg-[#e7f4ed] px-2 py-0.5 text-[10px] font-bold text-[#31714d]">{p.status}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditProperty(p)} className="rounded bg-white px-3 py-1.5 text-xs font-bold border"><Edit2 size={13} /></button>
                        <button onClick={() => deleteProperty(p.id)} className="rounded bg-white p-1.5 text-red-500 border"><Trash2 size={15} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: GALLERY */}
          {section === "Gallery" && (
            <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
              <div className="rounded-lg border border-[#0c2d49]/10 bg-white p-6 shadow-sm">
                <h2 className="font-serif text-2xl">Add Gallery Photo</h2>
                <div className="mt-5 grid gap-4">
                  <Input text="Category Label" value={newGallery.label} onChange={(v) => setNewGallery({ ...newGallery, label: v })} />
                  <Input text="Title *" value={newGallery.title} onChange={(v) => setNewGallery({ ...newGallery, title: v })} />
                  <div>
                    <Input text="Image URL *" value={newGallery.image_url} onChange={(v) => setNewGallery({ ...newGallery, image_url: v })} />
                    <UploadButton onFile={(f) => handleFileUpload(f, (url) => setNewGallery({ ...newGallery, image_url: url }))} loading={isUploading} />
                  </div>
                  <button onClick={addGalleryItem} className="rounded-md bg-[#092945] py-3 text-sm font-bold text-white hover:bg-[#bc8140]">
                    Add to Gallery
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-[#0c2d49]/10 bg-white p-6 shadow-sm">
                <h2 className="font-serif text-2xl">Gallery Photos ({gallery.length})</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {gallery.map((g) => (
                    <div key={g.id} className="relative overflow-hidden rounded-lg border bg-white p-2">
                      <img src={g.image_url} alt={g.title} className="h-32 w-full object-cover rounded" />
                      <div className="flex items-center justify-between mt-2 px-1">
                        <span className="text-xs font-bold">{g.title}</span>
                        <div className="flex gap-1">
                          <button onClick={() => setEditGallery(g)} className="text-[#092945]"><Edit2 size={13} /></button>
                          <button onClick={() => deleteGalleryItem(g.id)} className="text-red-500"><Trash2 size={13} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: TESTIMONIALS */}
          {section === "Testimonials" && (
            <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
              <div className="rounded-lg border border-[#0c2d49]/10 bg-white p-6 shadow-sm">
                <h2 className="font-serif text-2xl">Add Customer Review</h2>
                <div className="mt-5 grid gap-4">
                  <Textarea text="Quote *" value={newTestimonial.quote} onChange={(v) => setNewTestimonial({ ...newTestimonial, quote: v })} />
                  <Input text="Customer Name *" value={newTestimonial.customer_name} onChange={(v) => setNewTestimonial({ ...newTestimonial, customer_name: v })} />
                  <Input text="Role / Title" value={newTestimonial.customer_role} onChange={(v) => setNewTestimonial({ ...newTestimonial, customer_role: v })} />
                  <button onClick={addTestimonialItem} className="rounded-md bg-[#092945] py-3 text-sm font-bold text-white hover:bg-[#bc8140]">
                    Publish Review
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-[#0c2d49]/10 bg-white p-6 shadow-sm">
                <h2 className="font-serif text-2xl">Customer Reviews ({testimonials.length})</h2>
                <div className="mt-5 grid gap-4">
                  {testimonials.map((t) => (
                    <div key={t.id} className="flex justify-between rounded-lg bg-[#f5f7f9] p-4 border">
                      <div>
                        <p className="italic text-sm">“{t.quote}”</p>
                        <span className="mt-2 block text-xs font-bold text-[#bc8140]">— {t.customer_name} ({t.customer_role})</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditTestimonial(t)}><Edit2 size={14} /></button>
                        <button onClick={() => deleteTestimonialItem(t.id)} className="text-red-500"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: SERVICES */}
          {section === "Services" && (
            <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
              <div className="rounded-lg border border-[#0c2d49]/10 bg-white p-6 shadow-sm">
                <h2 className="font-serif text-2xl">Add Service Story</h2>
                <div className="mt-5 grid gap-4">
                  <Input text="Title *" value={newService.title} onChange={(v) => setNewService({ ...newService, title: v })} />
                  <Textarea text="Description *" value={newService.description} onChange={(v) => setNewService({ ...newService, description: v })} />
                  <div>
                    <Input text="Banner Image URL" value={newService.image_url || ""} onChange={(v) => setNewService({ ...newService, image_url: v })} />
                    <UploadButton onFile={(f) => handleFileUpload(f, (url) => setNewService({ ...newService, image_url: url }))} loading={isUploading} />
                  </div>
                  <button onClick={addServiceItem} className="rounded-md bg-[#092945] py-3 text-sm font-bold text-white hover:bg-[#bc8140]">
                    Publish Story
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-[#0c2d49]/10 bg-white p-6 shadow-sm">
                <h2 className="font-serif text-2xl">Service Stories ({services.length})</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {services.map((s) => (
                    <div key={s.id} className="rounded-lg border bg-white p-4 shadow-sm">
                      <h4 className="font-serif font-bold text-[#092945]">{s.title}</h4>
                      <p className="mt-1 text-xs text-[#557084]">{s.description}</p>
                      <div className="mt-3 flex justify-end gap-2 border-t pt-2">
                        <button onClick={() => setEditService(s)}><Edit2 size={13} /></button>
                        <button onClick={() => deleteServiceItem(s.id)} className="text-red-500"><Trash2 size={13} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 7: INQUIRIES */}
          {section === "Inquiries" && (
            <div className="rounded-lg border border-[#0c2d49]/10 bg-white p-6 shadow-sm">
              <h2 className="font-serif text-2xl mb-4">Customer Inquiries ({inquiries.length})</h2>
              {inquiries.length === 0 ? (
                <div className="py-16 text-center">
                  <Inbox className="mx-auto text-gray-300" size={40} />
                  <p className="mt-3 font-serif text-lg text-gray-600">No customer inquiries yet.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {inquiries.map((iq) => (
                    <div key={iq.id} className={`rounded-lg p-5 border ${iq.status === "New" ? "bg-amber-50/60 border-amber-200" : "bg-[#f5f7f9]"}`}>
                      <div className="flex justify-between items-center">
                        <strong className="text-base font-serif">{iq.name}</strong>
                        <div className="flex items-center gap-2">
                          <select value={iq.status} onChange={(e) => updateInquiryStatus(iq.id, e.target.value as Inquiry["status"])} className="rounded border px-2 py-1 text-xs font-bold">
                            <option value="New">Status: New</option>
                            <option value="Contacted">Status: Contacted</option>
                            <option value="Closed">Status: Closed</option>
                          </select>
                          <button onClick={() => deleteInquiryItem(iq.id)} className="text-red-600"><Trash2 size={15} /></button>
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-[#bc8140]">Target: {iq.property_title || "General Inquiry"}</p>
                      <div className="mt-2 text-xs text-[#557084]">Email: {iq.email} | Phone: {iq.phone || "N/A"}</div>
                      {iq.message && <p className="mt-3 rounded bg-white p-3 text-xs text-[#092945] border">{iq.message}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* --- EDIT MODALS --- */}
      {editProperty && (
        <Modal title="Edit Property" onClose={() => setEditProperty(null)} onSave={updatePropertySave}>
          <Input text="Property Title" value={editProperty.title} onChange={(v) => setEditProperty({ ...editProperty, title: v })} />
          <Input text="Location" value={editProperty.location} onChange={(v) => setEditProperty({ ...editProperty, location: v })} />
          <Textarea text="Description" value={editProperty.description} onChange={(v) => setEditProperty({ ...editProperty, description: v })} />
          <div className="grid grid-cols-2 gap-4">
            <label className="grid gap-1 text-xs font-bold">
              Type
              <select value={editProperty.property_type} onChange={(e) => setEditProperty({ ...editProperty, property_type: e.target.value })} className="rounded border p-2 text-sm">
                <option>Residential</option>
                <option>Commercial</option>
              </select>
            </label>
            <label className="grid gap-1 text-xs font-bold">
              Status
              <select value={editProperty.status} onChange={(e) => setEditProperty({ ...editProperty, status: e.target.value })} className="rounded border p-2 text-sm">
                <option>Ongoing</option>
                <option>Upcoming</option>
                <option>Completed</option>
              </select>
            </label>
          </div>
          <Input text="Size" value={editProperty.size} onChange={(v) => setEditProperty({ ...editProperty, size: v })} />
          <Input text="Price" value={editProperty.price} onChange={(v) => setEditProperty({ ...editProperty, price: v })} />
          <div>
            <Input text="Image URL" value={editProperty.image_url} onChange={(v) => setEditProperty({ ...editProperty, image_url: v })} />
            <UploadButton onFile={(f) => handleFileUpload(f, (url) => setEditProperty({ ...editProperty, image_url: url }))} loading={isUploading} />
          </div>
        </Modal>
      )}

      {editGallery && (
        <Modal title="Edit Gallery Item" onClose={() => setEditGallery(null)} onSave={updateGallerySave}>
          <Input text="Label" value={editGallery.label} onChange={(v) => setEditGallery({ ...editGallery, label: v })} />
          <Input text="Title" value={editGallery.title} onChange={(v) => setEditGallery({ ...editGallery, title: v })} />
          <div>
            <Input text="Image URL" value={editGallery.image_url} onChange={(v) => setEditGallery({ ...editGallery, image_url: v })} />
            <UploadButton onFile={(f) => handleFileUpload(f, (url) => setEditGallery({ ...editGallery, image_url: url }))} loading={isUploading} />
          </div>
        </Modal>
      )}

      {editTestimonial && (
        <Modal title="Edit Testimonial" onClose={() => setEditTestimonial(null)} onSave={updateTestimonialSave}>
          <Textarea text="Quote" value={editTestimonial.quote} onChange={(v) => setEditTestimonial({ ...editTestimonial, quote: v })} />
          <Input text="Customer Name" value={editTestimonial.customer_name} onChange={(v) => setEditTestimonial({ ...editTestimonial, customer_name: v })} />
          <Input text="Role" value={editTestimonial.customer_role} onChange={(v) => setEditTestimonial({ ...editTestimonial, customer_role: v })} />
        </Modal>
      )}

      {editService && (
        <Modal title="Edit Service Story" onClose={() => setEditService(null)} onSave={updateServiceSave}>
          <Input text="Title" value={editService.title} onChange={(v) => setEditService({ ...editService, title: v })} />
          <Textarea text="Description" value={editService.description} onChange={(v) => setEditService({ ...editService, description: v })} />
          <div>
            <Input text="Image URL" value={editService.image_url || ""} onChange={(v) => setEditService({ ...editService, image_url: v })} />
            <UploadButton onFile={(f) => handleFileUpload(f, (url) => setEditService({ ...editService, image_url: url }))} loading={isUploading} />
          </div>
        </Modal>
      )}
    </main>
  );
}

// Helpers
function SectionGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-[#0c2d49]/10 bg-[#f8f9fb] p-5">
      <h3 className="font-serif text-lg font-bold text-[#092945] mb-4">{title}</h3>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </div>
  );
}

function Input({ text, value, onChange }: { text: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="grid gap-1 text-xs font-bold text-[#314b5e]">
      {text}
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="rounded-md border border-[#0c2d49]/15 bg-white p-2.5 text-sm font-normal outline-none focus:border-[#bc8140]" />
    </label>
  );
}

function Textarea({ text, value, onChange }: { text: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="grid gap-1 text-xs font-bold text-[#314b5e] col-span-full">
      {text}
      <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className="rounded-md border border-[#0c2d49]/15 bg-white p-2.5 text-sm font-normal outline-none focus:border-[#bc8140]" />
    </label>
  );
}

function UploadButton({ onFile, loading }: { onFile: (file: File) => void; loading: boolean }) {
  return (
    <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded border border-dashed border-gray-300 bg-white p-2 text-xs font-bold text-[#557084] hover:bg-gray-50">
      <Upload size={14} />
      {loading ? "Uploading..." : "Upload Local Image"}
      <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) onFile(file); }} className="hidden" />
    </label>
  );
}

function Modal({ title, children, onClose, onSave }: { title: string; children: React.ReactNode; onClose: () => void; onSave: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-black"><X size={18} /></button>
        <h3 className="font-serif text-2xl text-[#092945] mb-4">{title}</h3>
        <div className="grid gap-4 max-h-[70vh] overflow-y-auto pr-1">{children}</div>
        <div className="mt-6 flex justify-end gap-3 border-t pt-4">
          <button onClick={onClose} className="rounded px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100">Cancel</button>
          <button onClick={onSave} className="rounded bg-[#092945] px-5 py-2 text-xs font-bold text-white hover:bg-[#bc8140]">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-[#0c2d49]/10 bg-white p-5 shadow-sm">
      <span className="mb-6 grid h-10 w-10 place-items-center rounded-lg bg-[#f2e7d8] text-[#bc8140]">{icon}</span>
      <strong className="block font-serif text-3xl text-[#092945]">{value}</strong>
      <span className="mt-1 block text-xs font-semibold text-[#557084]">{label}</span>
    </div>
  );
}
