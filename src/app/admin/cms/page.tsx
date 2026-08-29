"use client";

import { ChangeEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Edit2,
  FilePenLine,
  ImagePlus,
  Inbox,
  LogOut,
  Plus,
  Search,
  Trash2,
  Upload,
  User,
  X
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Tab = "content" | "properties" | "gallery" | "testimonials" | "services" | "board" | "inquiries";

export type BoardMember = {
  id: string;
  name: string;
  designation: string;
  image_url?: string;
  bio?: string;
  sort_order?: number;
  published?: boolean;
};

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
  sort_order?: number;
};

export type Testimonial = {
  id: string;
  quote: string;
  customer_name: string;
  customer_role: string;
  published?: boolean;
};

export type ServiceStory = {
  id: string;
  title: string;
  description: string;
  icon?: string;
  image_url?: string;
  published?: boolean;
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
  logo_url: "/logo.png",
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
    id: "prop-1",
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
    id: "prop-2",
    title: "Landmark One",
    location: "Banani, Dhaka",
    description: "A confident commercial address for ambitious businesses, retail, and lifestyle brands.",
    property_type: "Commercial",
    status: "Upcoming",
    size: "1,200–8,000 sft",
    price: "On request",
    image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85"
  },
  {
    id: "prop-3",
    title: "The Grove Residences",
    location: "Uttara, Dhaka",
    description: "Thoughtful apartments with green views, practical planning, and a warm sense of home.",
    property_type: "Residential",
    status: "Completed",
    size: "1,450–1,900 sft",
    price: "On request",
    image_url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85"
  }
];

const defaultGallery: GalleryItem[] = [
  { id: "g-1", label: "Exterior", title: "Architectural expression", image_url: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1000&q=85" },
  { id: "g-2", label: "Interior", title: "Living, refined", image_url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85" },
  { id: "g-3", label: "Progress", title: "Built with care", image_url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=85" }
];

const defaultTestimonials: Testimonial[] = [
  { id: "t-1", quote: "The process felt clear from day one. The design is premium, but more importantly, it works beautifully for our family.", customer_name: "Farzana Chowdhury", customer_role: "Nexus Homeowner" },
  { id: "t-2", quote: "Landmark One gives our corporate office exactly the prestige and architectural quality we needed in Banani.", customer_name: "Tanvir Ahmed", customer_role: "CEO, TechVentures" }
];

const defaultServices: ServiceStory[] = [
  { id: "s-1", title: "Designing for the way Dhaka lives", description: "How local context, airflow, and light shape every Nexus Landmark address.", icon: "Compass", image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=85" },
  { id: "s-2", title: "Inside Nexus Parkview", description: "A private walkthrough of our flagship residence in Gulshan.", icon: "Video", image_url: "https://images.unsplash.com/photo-160066753086-00f18fb6b3ea?auto=format&fit=crop&w=800&q=85" }
];

const defaultBoardMembers: BoardMember[] = [
  {
    id: "bm-1",
    name: "Abdul Qaium (Reyad)",
    designation: "Managing Director",
    image_url: "/board-member.jpg",
    bio: "Leading operations, strategic planning, and long-term project delivery across residential and commercial developments at Nexus Landmark."
  }
];

export default function CmsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("content");
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [properties, setProjects] = useState<Property[]>(defaultProperties);
  const [gallery, setGallery] = useState<GalleryItem[]>(defaultGallery);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [services, setServices] = useState<ServiceStory[]>(defaultServices);
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>(defaultBoardMembers);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Edit Modals
  const [editProperty, setEditProperty] = useState<Property | null>(null);
  const [editGallery, setEditGallery] = useState<GalleryItem | null>(null);
  const [editTestimonial, setEditTestimonial] = useState<Testimonial | null>(null);
  const [editService, setEditService] = useState<ServiceStory | null>(null);
  const [editBoardMember, setEditBoardMember] = useState<BoardMember | null>(null);

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

  const [newBoardMember, setNewBoardMember] = useState<Omit<BoardMember, "id">>({
    name: "",
    designation: "",
    image_url: "",
    bio: ""
  });

  const [newService, setNewService] = useState<Omit<ServiceStory, "id">>({
    title: "",
    description: "",
    icon: "",
    image_url: ""
  });

  useEffect(() => {
    async function loadData() {
      // 1. Initial load from localStorage cache
      try {
        const cachedProps = localStorage.getItem("nexus_properties");
        if (cachedProps) setProjects(JSON.parse(cachedProps));
        const cachedGallery = localStorage.getItem("nexus_gallery");
        if (cachedGallery) setGallery(JSON.parse(cachedGallery));
        const cachedTestimonials = localStorage.getItem("nexus_testimonials");
        if (cachedTestimonials) setTestimonials(JSON.parse(cachedTestimonials));
        const cachedServices = localStorage.getItem("nexus_services");
        if (cachedServices) setServices(JSON.parse(cachedServices));
        const cachedBoard = localStorage.getItem("nexus_board_members");
        if (cachedBoard) {
          const parsed = JSON.parse(cachedBoard);
          if (parsed?.length) setBoardMembers(parsed);
        }
      } catch (e) {
        console.error(e);
      }

      if (!supabase) return;

      // 2. Load from Supabase
      try {
        const [cRes, pRes, gRes, tRes, sRes, bRes, iRes] = await Promise.all([
          supabase.from("site_content").select("content").eq("id", "homepage").maybeSingle(),
          supabase.from("properties").select("*").order("created_at", { ascending: false }),
          supabase.from("gallery_items").select("*").order("sort_order"),
          supabase.from("testimonials").select("*").order("created_at", { ascending: false }),
          supabase.from("services").select("*").order("sort_order"),
          supabase.from("board_members").select("*").order("sort_order"),
          supabase.from("inquiries").select("*").order("created_at", { ascending: false })
        ]);

        const siteContentData = cRes.data?.content as SiteContent | undefined;
        if (siteContentData) setContent({ ...defaultContent, ...siteContentData });
        if (pRes.data && pRes.data.length > 0) setProjects(pRes.data);
        if (gRes.data && gRes.data.length > 0) setGallery(gRes.data);
        if (tRes.data && tRes.data.length > 0) setTestimonials(tRes.data);
        if (sRes.data && sRes.data.length > 0) setServices(sRes.data);
        if (bRes.data && bRes.data.length > 0) setBoardMembers(bRes.data);
        if (iRes.data) setInquiries(iRes.data);
      } catch (err) {
        console.error("Supabase load error:", err);
      }
    }
    loadData();
  }, [router]);

  function notify(text: string) {
    setMessage(text);
    setTimeout(() => setMessage(""), 3500);
  }

  // --- Image Upload Utility ---
  async function handleFileUpload(file: File, callback: (url: string) => void) {
    if (!supabase) {
      notify("Supabase not connected. Using local blob URL preview.");
      const localUrl = URL.createObjectURL(file);
      callback(localUrl);
      return;
    }
    setIsUploading(true);
    const path = `uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "-")}`;
    const { error } = await supabase.storage.from("site-assets").upload(path, file, { upsert: true });
    setIsUploading(false);
    if (error) {
      notify("Upload failed: " + error.message);
      return;
    }
    const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
    callback(data.publicUrl);
    notify("Image uploaded successfully!");
  }

  // --- Content Save ---
  async function saveSiteContent() {
    try {
      localStorage.setItem("nexus_site_content", JSON.stringify(content));
      window.dispatchEvent(new Event("nexus_content_updated"));
    } catch (e) {
      console.error(e);
    }
    if (supabase) {
      const { error } = await supabase.from("site_content").upsert({ id: "homepage", content, updated_at: new Date().toISOString() });
      if (error) {
        console.error("Supabase update error:", error);
        notify("Saved locally! (Supabase notice: " + error.message + ")");
        return;
      }
    }
    notify("A-Z Website Content Saved Successfully!");
  }

  // --- Property CRUD ---
  async function addProperty() {
    if (!newProp.title || !newProp.location) {
      notify("Title and Location are required.");
      return;
    }
    if (supabase) {
      const { data } = await supabase.from("properties").insert(newProp).select().single();
      if (data) setProjects([data, ...properties]);
    } else {
      const item: Property = { ...newProp, id: `demo-${Date.now()}` };
      setProjects([item, ...properties]);
    }
    setNewProp({ title: "", location: "", description: "", property_type: "Residential", status: "Upcoming", size: "", price: "", image_url: "" });
    notify("Property added successfully!");
  }

  async function updatePropertySave() {
    if (!editProperty) return;
    if (supabase) {
      await supabase.from("properties").update(editProperty).eq("id", editProperty.id);
    }
    setProjects(properties.map((p) => (p.id === editProperty.id ? editProperty : p)));
    setEditProperty(null);
    notify("Property updated!");
  }

  async function deleteProperty(id: string) {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    if (supabase) await supabase.from("properties").delete().eq("id", id);
    setProjects(properties.filter((p) => p.id !== id));
    notify("Property deleted.");
  }

  // --- Gallery CRUD ---
  async function addGalleryItem() {
    if (!newGallery.title || !newGallery.image_url) {
      notify("Title and Image URL are required.");
      return;
    }
    if (supabase) {
      const { data } = await supabase.from("gallery_items").insert(newGallery).select().single();
      if (data) setGallery([...gallery, data]);
    } else {
      setGallery([...gallery, { ...newGallery, id: `gdemo-${Date.now()}` }]);
    }
    setNewGallery({ label: "Exterior", title: "", image_url: "" });
    notify("Gallery item added!");
  }

  async function updateGallerySave() {
    if (!editGallery) return;
    if (supabase) await supabase.from("gallery_items").update(editGallery).eq("id", editGallery.id);
    setGallery(gallery.map((g) => (g.id === editGallery.id ? editGallery : g)));
    setEditGallery(null);
    notify("Gallery item updated!");
  }

  async function deleteGalleryItem(id: string) {
    if (!window.confirm("Delete gallery item?")) return;
    if (supabase) await supabase.from("gallery_items").delete().eq("id", id);
    setGallery(gallery.filter((g) => g.id !== id));
    notify("Gallery item deleted.");
  }

  // --- Testimonials CRUD ---
  async function addTestimonialItem() {
    if (!newTestimonial.quote || !newTestimonial.customer_name) {
      notify("Quote and Customer Name are required.");
      return;
    }
    if (supabase) {
      const { data } = await supabase.from("testimonials").insert({ ...newTestimonial, published: true }).select().single();
      if (data) setTestimonials([data, ...testimonials]);
    } else {
      setTestimonials([{ ...newTestimonial, id: `tdemo-${Date.now()}`, published: true }, ...testimonials]);
    }
    setNewTestimonial({ quote: "", customer_name: "", customer_role: "" });
    notify("Testimonial added!");
  }

  async function updateTestimonialSave() {
    if (!editTestimonial) return;
    if (supabase) await supabase.from("testimonials").update(editTestimonial).eq("id", editTestimonial.id);
    setTestimonials(testimonials.map((t) => (t.id === editTestimonial.id ? editTestimonial : t)));
    setEditTestimonial(null);
    notify("Testimonial updated!");
  }

  async function deleteTestimonialItem(id: string) {
    if (!window.confirm("Delete testimonial?")) return;
    if (supabase) await supabase.from("testimonials").delete().eq("id", id);
    setTestimonials(testimonials.filter((t) => t.id !== id));
    notify("Testimonial deleted.");
  }

  // --- Services CRUD ---
  async function addServiceItem() {
    if (!newService.title || !newService.description) {
      notify("Title and Description are required.");
      return;
    }
    if (supabase) {
      const { data } = await supabase.from("services").insert({ ...newService, published: true }).select().single();
      if (data) setServices([...services, data]);
    } else {
      setServices([...services, { ...newService, id: `sdemo-${Date.now()}`, published: true }]);
    }
    setNewService({ title: "", description: "", icon: "", image_url: "" });
    notify("Service story added!");
  }

  async function updateServiceSave() {
    if (!editService) return;
    if (supabase) await supabase.from("services").update(editService).eq("id", editService.id);
    setServices(services.map((s) => (s.id === editService.id ? editService : s)));
    setEditService(null);
    notify("Service story updated!");
  }

  async function deleteServiceItem(id: string) {
    if (!window.confirm("Delete story?")) return;
    if (supabase) await supabase.from("services").delete().eq("id", id);
    setServices(services.filter((s) => s.id !== id));
    notify("Service story deleted.");
  }

  // --- Board Members CRUD ---
  async function addBoardMember() {
    if (!newBoardMember.name || !newBoardMember.designation) {
      notify("Name and Designation are required.");
      return;
    }
    let newItem: BoardMember = {
      ...newBoardMember,
      id: `bm-${Date.now()}`,
      published: true
    };
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("board_members")
          .insert({ ...newBoardMember, published: true })
          .select()
          .single();
        if (data) newItem = data;
        if (error) console.error("Supabase insert error:", error);
      } catch (err) {
        console.error("Supabase insert exception:", err);
      }
    }
    const updated = [newItem, ...boardMembers];
    setBoardMembers(updated);
    localStorage.setItem("nexus_board_members", JSON.stringify(updated));
    window.dispatchEvent(new Event("nexus_content_updated"));
    setNewBoardMember({ name: "", designation: "", image_url: "", bio: "" });
    notify("Board member added successfully!");
  }

  async function updateBoardMemberSave() {
    if (!editBoardMember) return;
    if (supabase) await supabase.from("board_members").update(editBoardMember).eq("id", editBoardMember.id);
    const updated = boardMembers.map((b) => (b.id === editBoardMember.id ? editBoardMember : b));
    setBoardMembers(updated);
    localStorage.setItem("nexus_board_members", JSON.stringify(updated));
    window.dispatchEvent(new Event("nexus_content_updated"));
    setEditBoardMember(null);
    notify("Board member updated!");
  }

  async function deleteBoardMember(id: string) {
    if (!window.confirm("Delete this board member?")) return;
    if (supabase) await supabase.from("board_members").delete().eq("id", id);
    const updated = boardMembers.filter((b) => b.id !== id);
    setBoardMembers(updated);
    localStorage.setItem("nexus_board_members", JSON.stringify(updated));
    window.dispatchEvent(new Event("nexus_content_updated"));
    notify("Board member deleted.");
  }

  // --- Inquiries Status Update ---
  async function updateInquiryStatus(id: string, status: Inquiry["status"]) {
    if (supabase) await supabase.from("inquiries").update({ status }).eq("id", id);
    setInquiries(inquiries.map((i) => (i.id === id ? { ...i, status } : i)));
    notify(`Inquiry status updated to ${status}`);
  }

  async function deleteInquiryItem(id: string) {
    if (!window.confirm("Delete inquiry lead?")) return;
    if (supabase) await supabase.from("inquiries").delete().eq("id", id);
    setInquiries(inquiries.filter((i) => i.id !== id));
    notify("Inquiry lead deleted.");
  }

  async function signOut() {
    if (supabase) await supabase.auth.signOut();
    router.push("/admin/login");
  }

  const tabs: [Tab, string, number?][] = [
    ["content", "Website Content (A-Z)"],
    ["properties", "Properties", properties.length],
    ["gallery", "Gallery", gallery.length],
    ["testimonials", "Testimonials", testimonials.length],
    ["services", "Services & Stories", services.length],
    ["board", "Board of Directors", boardMembers.length],
    ["inquiries", "Customer Inquiries", inquiries.filter((i) => i.status === "New").length]
  ];

  return (
    <main className="min-h-screen bg-[#f5f7f9] text-[#092945]">
      {/* Top Admin Navigation Bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#0c2d49]/10 bg-white px-6 py-4 lg:px-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2 text-sm font-bold text-[#092945] hover:text-[#bc8140]">
            <ArrowLeft size={16} className="text-[#bc8140]" /> Dashboard
          </Link>
          <span className="hidden text-gray-300 sm:inline">|</span>
          <span className="hidden font-serif text-lg text-[#092945] sm:inline">
            Nexus <span className="text-[#bc8140]">Landmark CMS</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-[#0c2d49]/15 px-3 py-1.5 text-xs font-bold transition hover:bg-[#092945] hover:text-white"
          >
            View Live Site ↗
          </a>
          <button onClick={signOut} title="Sign Out" className="text-[#557084] hover:text-red-600">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main CMS Layout */}
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#bc8140]">Master Control Panel</p>
            <h1 className="mt-1 font-serif text-4xl">Content Management System</h1>
            <p className="mt-1 text-sm text-[#557084]">All updates saved here take immediate effect on the public frontend.</p>
          </div>
          {message && (
            <span className="rounded-md bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-700 shadow-sm border border-emerald-200">
              <Check size={14} className="mr-1.5 inline" />
              {message}
            </span>
          )}
        </div>

        {/* Tab Selection */}
        <div className="mb-8 flex gap-2 overflow-x-auto border-b border-[#0c2d49]/10 pb-3">
          {tabs.map(([key, label, count]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-bold transition ${
                tab === key
                  ? "bg-[#092945] text-white shadow-sm"
                  : "bg-white text-[#557084] hover:bg-[#eaf0f4]"
              }`}
            >
              {label}
              {count !== undefined && (
                <span className={`rounded-full px-2 py-0.5 text-[10px] ${tab === key ? "bg-[#bc8140] text-white" : "bg-gray-100 text-gray-700"}`}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: Website Content (A-Z) */}
        {tab === "content" && (
          <div className="rounded-lg border border-[#0c2d49]/10 bg-white p-6 lg:p-8 shadow-sm">
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <div>
                <h2 className="font-serif text-2xl">A-Z Frontend Website Content</h2>
                <p className="text-xs text-[#557084]">Customize titles, subheadings, hero media, stat numbers, contact details, and footer text.</p>
              </div>
              <button
                onClick={saveSiteContent}
                className="rounded-md bg-[#092945] px-6 py-3 text-xs font-bold text-white transition hover:bg-[#bc8140]"
              >
                Save All Changes
              </button>
            </div>

            <div className="grid gap-8">
              {/* Brand & Header Section */}
              <SectionGroup title="1. Brand & Header Info">
                <div className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-6 rounded-lg border border-amber-200/60 bg-amber-50/40 p-4 mb-2">
                  <div className="grid h-16 w-36 place-items-center rounded bg-white p-2 border border-gray-200 shadow-sm">
                    <img
                      src={content.logo_url || "/logo.png"}
                      alt="Brand Logo"
                      className="max-h-12 w-auto object-contain"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#092945]">Primary Brand Logo</h4>
                    <p className="text-xs text-[#557084]">Upload a high-resolution logo asset to display across the site header navbar and footer.</p>
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="flex cursor-pointer items-center gap-2 rounded-md bg-[#092945] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#bc8140]">
                        <Upload size={14} /> Upload New Logo
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, (url) => setContent({ ...content, logo_url: url }));
                          }}
                        />
                      </label>
                      <span className="text-xs text-gray-400">or enter image URL below</span>
                    </div>
                  </div>
                </div>
                <Input text="Logo Image Path / URL" value={content.logo_url || "/logo.png"} onChange={(v) => setContent({ ...content, logo_url: v })} />
                <Input text="Brand Name" value={content.brand_name || ""} onChange={(v) => setContent({ ...content, brand_name: v })} />
                <Input text="Brand Subtitle" value={content.brand_subtitle || ""} onChange={(v) => setContent({ ...content, brand_subtitle: v })} />
                <Input text="Top Announcement Bar" value={content.top_bar_text || ""} onChange={(v) => setContent({ ...content, top_bar_text: v })} />
              </SectionGroup>

              {/* Hero Section */}
              <SectionGroup title="2. Hero Main Banner Section">
                <Input text="Hero Eyebrow Text" value={content.hero_eyebrow || ""} onChange={(v) => setContent({ ...content, hero_eyebrow: v })} />
                <Input text="Hero Title Line 1" value={content.hero_title || ""} onChange={(v) => setContent({ ...content, hero_title: v })} />
                <Input text="Hero Title Accent (Gold)" value={content.hero_title_accent || ""} onChange={(v) => setContent({ ...content, hero_title_accent: v })} />
                <Textarea text="Hero Description" value={content.hero_description || ""} onChange={(v) => setContent({ ...content, hero_description: v })} />
                <div className="col-span-full">
                  <Input text="Hero Image URL" value={content.hero_image_url || ""} onChange={(v) => setContent({ ...content, hero_image_url: v })} />
                  <UploadButton onFile={(f) => handleFileUpload(f, (url) => setContent({ ...content, hero_image_url: url }))} loading={isUploading} />
                </div>
                <Input text="Primary Button Label" value={content.hero_primary_cta || ""} onChange={(v) => setContent({ ...content, hero_primary_cta: v })} />
                <Input text="Secondary Button Label" value={content.hero_secondary_cta || ""} onChange={(v) => setContent({ ...content, hero_secondary_cta: v })} />
                <Input text="Stat Badge Number" value={content.hero_stat_number || ""} onChange={(v) => setContent({ ...content, hero_stat_number: v })} />
                <Input text="Stat Badge Label" value={content.hero_stat_label || ""} onChange={(v) => setContent({ ...content, hero_stat_label: v })} />
                <Input text="Featured Property Badge Label" value={content.hero_featured_label || ""} onChange={(v) => setContent({ ...content, hero_featured_label: v })} />
                <Input text="Featured Property Title" value={content.hero_featured_title || ""} onChange={(v) => setContent({ ...content, hero_featured_title: v })} />
              </SectionGroup>

              {/* About Section */}
              <SectionGroup title="3. About Us Section">
                <Input text="About Eyebrow" value={content.about_eyebrow || ""} onChange={(v) => setContent({ ...content, about_eyebrow: v })} />
                <Input text="About Title Main" value={content.about_title || ""} onChange={(v) => setContent({ ...content, about_title: v })} />
                <Input text="About Title Accent" value={content.about_title_accent || ""} onChange={(v) => setContent({ ...content, about_title_accent: v })} />
                <Textarea text="About Full Description" value={content.about_description || ""} onChange={(v) => setContent({ ...content, about_description: v })} />
                <Input text="Stat 1 Number" value={content.about_stat1_number || ""} onChange={(v) => setContent({ ...content, about_stat1_number: v })} />
                <Input text="Stat 1 Label" value={content.about_stat1_label || ""} onChange={(v) => setContent({ ...content, about_stat1_label: v })} />
                <Input text="Stat 2 Number" value={content.about_stat2_number || ""} onChange={(v) => setContent({ ...content, about_stat2_number: v })} />
                <Input text="Stat 2 Label" value={content.about_stat2_label || ""} onChange={(v) => setContent({ ...content, about_stat2_label: v })} />
              </SectionGroup>

              {/* Portfolio & Journal Headers */}
              <SectionGroup title="4. Section Titles & Headlines">
                <Input text="Portfolio Eyebrow" value={content.portfolio_eyebrow || ""} onChange={(v) => setContent({ ...content, portfolio_eyebrow: v })} />
                <Input text="Portfolio Title" value={content.portfolio_title || ""} onChange={(v) => setContent({ ...content, portfolio_title: v })} />
                <Input text="Gallery Eyebrow" value={content.gallery_eyebrow || ""} onChange={(v) => setContent({ ...content, gallery_eyebrow: v })} />
                <Input text="Gallery Title" value={content.gallery_title || ""} onChange={(v) => setContent({ ...content, gallery_title: v })} />
                <Input text="Journal Eyebrow" value={content.journal_eyebrow || ""} onChange={(v) => setContent({ ...content, journal_eyebrow: v })} />
                <Input text="Journal Title" value={content.journal_title || ""} onChange={(v) => setContent({ ...content, journal_title: v })} />
                <Textarea text="Journal Description" value={content.journal_description || ""} onChange={(v) => setContent({ ...content, journal_description: v })} />
              </SectionGroup>

              {/* Contact & Footer Section */}
              <SectionGroup title="5. Contact CTA & Footer">
                <Input text="CTA Banner Eyebrow" value={content.cta_eyebrow || ""} onChange={(v) => setContent({ ...content, cta_eyebrow: v })} />
                <Input text="CTA Banner Title" value={content.cta_title || ""} onChange={(v) => setContent({ ...content, cta_title: v })} />
                <Textarea text="CTA Banner Description" value={content.cta_description || ""} onChange={(v) => setContent({ ...content, cta_description: v })} />
                <Input text="Phone Number" value={content.phone || ""} onChange={(v) => setContent({ ...content, phone: v })} />
                <Input text="Email Address" value={content.email || ""} onChange={(v) => setContent({ ...content, email: v })} />
                <Input text="Office Address" value={content.address || ""} onChange={(v) => setContent({ ...content, address: v })} />
                <Textarea text="Footer Tagline" value={content.footer_tagline || ""} onChange={(v) => setContent({ ...content, footer_tagline: v })} />
              </SectionGroup>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={saveSiteContent}
                className="rounded-md bg-[#092945] px-8 py-3.5 text-sm font-bold text-white transition hover:bg-[#bc8140]"
              >
                Save Website Information
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Properties Management */}
        {tab === "properties" && (
          <div className="grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
            {/* Add Property Panel */}
            <div className="rounded-lg border border-[#0c2d49]/10 bg-white p-6 shadow-sm">
              <h2 className="font-serif text-2xl">Add New Property</h2>
              <div className="mt-5 grid gap-4">
                <Input text="Property Title *" value={newProp.title} onChange={(v) => setNewProp({ ...newProp, title: v })} />
                <Input text="Location *" value={newProp.location} onChange={(v) => setNewProp({ ...newProp, location: v })} />
                <Textarea text="Description" value={newProp.description} onChange={(v) => setNewProp({ ...newProp, description: v })} />
                <div className="grid grid-cols-2 gap-4">
                  <label className="grid gap-1 text-xs font-bold">
                    Type
                    <select
                      value={newProp.property_type}
                      onChange={(e) => setNewProp({ ...newProp, property_type: e.target.value })}
                      className="rounded border p-2.5 text-sm outline-none"
                    >
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                  </label>
                  <label className="grid gap-1 text-xs font-bold">
                    Status
                    <select
                      value={newProp.status}
                      onChange={(e) => setNewProp({ ...newProp, status: e.target.value })}
                      className="rounded border p-2.5 text-sm outline-none"
                    >
                      <option value="Ongoing">Ongoing</option>
                      <option value="Upcoming">Upcoming</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </label>
                </div>
                <Input text="Size (e.g. 1,850-2,450 sft)" value={newProp.size} onChange={(v) => setNewProp({ ...newProp, size: v })} />
                <Input text="Price Tag (e.g. On request)" value={newProp.price} onChange={(v) => setNewProp({ ...newProp, price: v })} />
                <div>
                  <Input text="Image URL" value={newProp.image_url} onChange={(v) => setNewProp({ ...newProp, image_url: v })} />
                  <UploadButton onFile={(f) => handleFileUpload(f, (url) => setNewProp({ ...newProp, image_url: url }))} loading={isUploading} />
                </div>
                <button
                  onClick={addProperty}
                  className="mt-2 rounded-md bg-[#092945] py-3 text-sm font-bold text-white transition hover:bg-[#bc8140]"
                >
                  <Plus size={16} className="mr-1 inline" /> Publish Property
                </button>
              </div>
            </div>

            {/* Published Properties List */}
            <div className="rounded-lg border border-[#0c2d49]/10 bg-white p-6 shadow-sm">
              <h2 className="font-serif text-2xl">Published Portfolio Properties ({properties.length})</h2>
              <div className="mt-5 grid gap-4">
                {properties.map((p) => (
                  <div key={p.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg bg-[#f5f7f9] p-4 border border-[#0c2d49]/5">
                    <div className="flex items-center gap-3">
                      {p.image_url && <img src={p.image_url} alt={p.title} className="h-14 w-14 rounded object-cover shrink-0" />}
                      <div>
                        <strong className="text-base font-serif">{p.title}</strong>
                        <p className="text-xs text-[#557084]">{p.location} · {p.property_type}</p>
                        <span className="mt-1 inline-block rounded-full bg-[#e7f4ed] px-2.5 py-0.5 text-[10px] font-bold text-[#31714d]">
                          {p.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditProperty(p)}
                        className="flex items-center gap-1 rounded bg-white px-3 py-1.5 text-xs font-bold text-[#092945] border shadow-sm hover:bg-gray-50"
                      >
                        <Edit2 size={13} /> Edit
                      </button>
                      <button
                        onClick={() => deleteProperty(p.id)}
                        className="rounded bg-white p-1.5 text-red-500 border shadow-sm hover:bg-red-50"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Gallery Manager */}
        {tab === "gallery" && (
          <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
            <div className="rounded-lg border border-[#0c2d49]/10 bg-white p-6 shadow-sm">
              <h2 className="font-serif text-2xl">Add Gallery Photo</h2>
              <div className="mt-5 grid gap-4">
                <Input text="Category Label (e.g. Exterior, Interior)" value={newGallery.label} onChange={(v) => setNewGallery({ ...newGallery, label: v })} />
                <Input text="Title / Caption *" value={newGallery.title} onChange={(v) => setNewGallery({ ...newGallery, title: v })} />
                <div>
                  <Input text="Image URL *" value={newGallery.image_url} onChange={(v) => setNewGallery({ ...newGallery, image_url: v })} />
                  <UploadButton onFile={(f) => handleFileUpload(f, (url) => setNewGallery({ ...newGallery, image_url: url }))} loading={isUploading} />
                </div>
                <button
                  onClick={addGalleryItem}
                  className="rounded-md bg-[#092945] py-3 text-sm font-bold text-white transition hover:bg-[#bc8140]"
                >
                  <Plus size={16} className="mr-1 inline" /> Add to Gallery
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-[#0c2d49]/10 bg-white p-6 shadow-sm">
              <h2 className="font-serif text-2xl">Gallery Items ({gallery.length})</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {gallery.map((item) => (
                  <div key={item.id} className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                    <img src={item.image_url} alt={item.title} className="h-36 w-full object-cover" />
                    <div className="p-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#bc8140]">{item.label}</span>
                      <h4 className="font-serif text-sm font-bold text-[#092945]">{item.title}</h4>
                    </div>
                    <div className="absolute right-2 top-2 flex gap-1 bg-white/90 p-1 rounded backdrop-blur">
                      <button onClick={() => setEditGallery(item)} className="p-1 text-gray-700 hover:text-black"><Edit2 size={13} /></button>
                      <button onClick={() => deleteGalleryItem(item.id)} className="p-1 text-red-600 hover:text-red-800"><Trash2 size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Testimonials Manager */}
        {tab === "testimonials" && (
          <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
            <div className="rounded-lg border border-[#0c2d49]/10 bg-white p-6 shadow-sm">
              <h2 className="font-serif text-2xl">Add Customer Review</h2>
              <div className="mt-5 grid gap-4">
                <Textarea text="Quote *" value={newTestimonial.quote} onChange={(v) => setNewTestimonial({ ...newTestimonial, quote: v })} />
                <Input text="Customer Name *" value={newTestimonial.customer_name} onChange={(v) => setNewTestimonial({ ...newTestimonial, customer_name: v })} />
                <Input text="Role / Note (e.g. Nexus Homeowner)" value={newTestimonial.customer_role} onChange={(v) => setNewTestimonial({ ...newTestimonial, customer_role: v })} />
                <button
                  onClick={addTestimonialItem}
                  className="rounded-md bg-[#092945] py-3 text-sm font-bold text-white transition hover:bg-[#bc8140]"
                >
                  <Plus size={16} className="mr-1 inline" /> Publish Review
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-[#0c2d49]/10 bg-white p-6 shadow-sm">
              <h2 className="font-serif text-2xl">Reviews & Testimonials ({testimonials.length})</h2>
              <div className="mt-5 grid gap-4">
                {testimonials.map((t) => (
                  <div key={t.id} className="rounded-lg bg-[#f5f7f9] p-4 border border-[#0c2d49]/5 flex justify-between gap-4">
                    <div>
                      <p className="italic text-sm text-[#092945]">“{t.quote}”</p>
                      <span className="mt-2 block text-xs font-bold text-[#bc8140]">
                        — {t.customer_name} {t.customer_role && `(${t.customer_role})`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditTestimonial(t)} className="p-1 text-[#092945] hover:text-[#bc8140]"><Edit2 size={15} /></button>
                      <button onClick={() => deleteTestimonialItem(t.id)} className="p-1 text-red-600"><Trash2 size={15} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Services & Stories Manager */}
        {tab === "services" && (
          <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
            <div className="rounded-lg border border-[#0c2d49]/10 bg-white p-6 shadow-sm">
              <h2 className="font-serif text-2xl">Add Service Story</h2>
              <div className="mt-5 grid gap-4">
                <Input text="Story Title *" value={newService.title} onChange={(v) => setNewService({ ...newService, title: v })} />
                <Textarea text="Description *" value={newService.description} onChange={(v) => setNewService({ ...newService, description: v })} />
                <div>
                  <Input text="Banner Image URL" value={newService.image_url || ""} onChange={(v) => setNewService({ ...newService, image_url: v })} />
                  <UploadButton onFile={(f) => handleFileUpload(f, (url) => setNewService({ ...newService, image_url: url }))} loading={isUploading} />
                </div>
                <button
                  onClick={addServiceItem}
                  className="rounded-md bg-[#092945] py-3 text-sm font-bold text-white transition hover:bg-[#bc8140]"
                >
                  <Plus size={16} className="mr-1 inline" /> Publish Story
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-[#0c2d49]/10 bg-white p-6 shadow-sm">
              <h2 className="font-serif text-2xl">Service Stories ({services.length})</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {services.map((s) => (
                  <div key={s.id} className="relative rounded-lg border bg-white p-4 shadow-sm flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-[#092945]">{s.title}</h4>
                      <p className="mt-1 text-xs text-[#557084]">{s.description}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-end gap-2 border-t pt-2">
                      <button onClick={() => setEditService(s)} className="p-1 text-[#092945]"><Edit2 size={14} /></button>
                      <button onClick={() => deleteServiceItem(s.id)} className="p-1 text-red-600"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: Board of Directors Manager */}
        {tab === "board" && (
          <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
            {/* Add Board Member Panel */}
            <div className="rounded-lg border border-[#0c2d49]/10 bg-white p-6 shadow-sm">
              <h2 className="font-serif text-2xl">Add Board Member</h2>
              <div className="mt-5 grid gap-4">
                <Input text="Full Name *" value={newBoardMember.name} onChange={(v) => setNewBoardMember({ ...newBoardMember, name: v })} />
                <Input text="Designation / Title *" value={newBoardMember.designation} onChange={(v) => setNewBoardMember({ ...newBoardMember, designation: v })} />
                <Textarea text="Short Bio" value={newBoardMember.bio || ""} onChange={(v) => setNewBoardMember({ ...newBoardMember, bio: v })} />
                <div>
                  <Input text="Photo URL" value={newBoardMember.image_url || ""} onChange={(v) => setNewBoardMember({ ...newBoardMember, image_url: v })} />
                  <UploadButton onFile={(f) => handleFileUpload(f, (url) => setNewBoardMember({ ...newBoardMember, image_url: url }))} loading={isUploading} />
                </div>
                <button
                  onClick={addBoardMember}
                  className="mt-2 rounded-md bg-[#092945] py-3 text-sm font-bold text-white transition hover:bg-[#bc8140]"
                >
                  <Plus size={16} className="mr-1 inline" /> Add Board Member
                </button>
              </div>
            </div>

            {/* Board Members List */}
            <div className="rounded-lg border border-[#0c2d49]/10 bg-white p-6 shadow-sm">
              <h2 className="font-serif text-2xl">Board of Directors ({boardMembers.length})</h2>
              <div className="mt-5 grid gap-4">
                {boardMembers.length === 0 && (
                  <p className="py-8 text-center text-sm text-[#557084]">No board members yet. Add your first one.</p>
                )}
                {boardMembers.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center gap-4 rounded-lg bg-[#f5f7f9] p-4 border border-[#0c2d49]/5"
                  >
                    <div className="shrink-0">
                      {b.image_url ? (
                        <img src={b.image_url} alt={b.name} className="h-14 w-14 rounded-full object-cover border-2 border-white shadow" />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#092945] text-white">
                          <User size={22} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <strong className="block font-serif text-base text-[#092945] truncate">{b.name}</strong>
                      <span className="text-xs font-bold text-[#bc8140]">{b.designation}</span>
                      {b.bio && <p className="mt-1 text-xs text-[#557084] line-clamp-2">{b.bio}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setEditBoardMember(b)}
                        className="flex items-center gap-1 rounded bg-white px-3 py-1.5 text-xs font-bold text-[#092945] border shadow-sm hover:bg-gray-50"
                      >
                        <Edit2 size={13} /> Edit
                      </button>
                      <button
                        onClick={() => deleteBoardMember(b.id)}
                        className="rounded bg-white p-1.5 text-red-500 border shadow-sm hover:bg-red-50"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: Inquiries Manager */}
        {tab === "inquiries" && (
          <div className="rounded-lg border border-[#0c2d49]/10 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <div>
                <h2 className="font-serif text-2xl">Customer Inquiries & Site Visit Leads</h2>
                <p className="text-xs text-[#557084]">Manage incoming inquiries sent by visitors on your website.</p>
              </div>
            </div>

            {inquiries.length === 0 ? (
              <div className="py-16 text-center">
                <Inbox className="mx-auto text-gray-300" size={40} />
                <p className="mt-3 font-serif text-lg text-gray-600">No customer inquiries yet.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {inquiries.map((iq) => (
                  <div
                    key={iq.id}
                    className={`rounded-lg p-5 border transition ${
                      iq.status === "New" ? "bg-amber-50/60 border-amber-200" : "bg-[#f5f7f9] border-[#0c2d49]/10"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div>
                        <strong className="text-base font-serif text-[#092945]">{iq.name}</strong>
                        <span className="ml-3 text-xs font-semibold text-[#bc8140]">Target: {iq.property_title || "General"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={iq.status}
                          onChange={(e) => updateInquiryStatus(iq.id, e.target.value as Inquiry["status"])}
                          className="rounded border border-gray-300 bg-white px-3 py-1 text-xs font-bold outline-none"
                        >
                          <option value="New">Status: New</option>
                          <option value="Contacted">Status: Contacted</option>
                          <option value="Closed">Status: Closed</option>
                        </select>
                        <button onClick={() => deleteInquiryItem(iq.id)} className="p-1 text-red-600 hover:text-red-800">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 grid gap-1 text-xs text-[#557084] sm:grid-cols-2">
                      <div>Email: <a href={`mailto:${iq.email}`} className="font-semibold text-[#092945] underline">{iq.email}</a></div>
                      <div>Phone: <span className="font-semibold text-[#092945]">{iq.phone || "N/A"}</span></div>
                    </div>

                    {iq.message && (
                      <p className="mt-3 rounded bg-white p-3 text-xs text-[#092945] border border-gray-100">
                        {iq.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- EDIT PROPERTY MODAL --- */}
      {editProperty && (
        <Modal title="Edit Property" onClose={() => setEditProperty(null)} onSave={updatePropertySave}>
          <Input text="Property Title" value={editProperty.title} onChange={(v) => setEditProperty({ ...editProperty, title: v })} />
          <Input text="Location" value={editProperty.location} onChange={(v) => setEditProperty({ ...editProperty, location: v })} />
          <Textarea text="Description" value={editProperty.description} onChange={(v) => setEditProperty({ ...editProperty, description: v })} />
          <div className="grid grid-cols-2 gap-4">
            <label className="grid gap-1 text-xs font-bold">
              Type
              <select
                value={editProperty.property_type}
                onChange={(e) => setEditProperty({ ...editProperty, property_type: e.target.value })}
                className="rounded border p-2.5 text-sm"
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
              </select>
            </label>
            <label className="grid gap-1 text-xs font-bold">
              Status
              <select
                value={editProperty.status}
                onChange={(e) => setEditProperty({ ...editProperty, status: e.target.value })}
                className="rounded border p-2.5 text-sm"
              >
                <option value="Ongoing">Ongoing</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
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

      {/* --- EDIT GALLERY MODAL --- */}
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

      {/* --- EDIT TESTIMONIAL MODAL --- */}
      {editTestimonial && (
        <Modal title="Edit Testimonial" onClose={() => setEditTestimonial(null)} onSave={updateTestimonialSave}>
          <Textarea text="Quote" value={editTestimonial.quote} onChange={(v) => setEditTestimonial({ ...editTestimonial, quote: v })} />
          <Input text="Customer Name" value={editTestimonial.customer_name} onChange={(v) => setEditTestimonial({ ...editTestimonial, customer_name: v })} />
          <Input text="Customer Role" value={editTestimonial.customer_role} onChange={(v) => setEditTestimonial({ ...editTestimonial, customer_role: v })} />
        </Modal>
      )}

      {/* --- EDIT SERVICE MODAL --- */}
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

      {/* --- EDIT BOARD MEMBER MODAL --- */}
      {editBoardMember && (
        <Modal title="Edit Board Member" onClose={() => setEditBoardMember(null)} onSave={updateBoardMemberSave}>
          <Input text="Full Name" value={editBoardMember.name} onChange={(v) => setEditBoardMember({ ...editBoardMember, name: v })} />
          <Input text="Designation / Title" value={editBoardMember.designation} onChange={(v) => setEditBoardMember({ ...editBoardMember, designation: v })} />
          <Textarea text="Short Bio" value={editBoardMember.bio || ""} onChange={(v) => setEditBoardMember({ ...editBoardMember, bio: v })} />
          <div>
            <Input text="Photo URL" value={editBoardMember.image_url || ""} onChange={(v) => setEditBoardMember({ ...editBoardMember, image_url: v })} />
            <UploadButton onFile={(f) => handleFileUpload(f, (url) => setEditBoardMember({ ...editBoardMember, image_url: url }))} loading={isUploading} />
          </div>
        </Modal>
      )}
    </main>
  );
}

// --- UI Helper Components ---
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
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-[#0c2d49]/15 bg-white p-2.5 text-sm font-normal outline-none focus:border-[#bc8140]"
      />
    </label>
  );
}

function Textarea({ text, value, onChange }: { text: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="grid gap-1 text-xs font-bold text-[#314b5e] col-span-full">
      {text}
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-[#0c2d49]/15 bg-white p-2.5 text-sm font-normal outline-none focus:border-[#bc8140]"
      />
    </label>
  );
}

function UploadButton({ onFile, loading }: { onFile: (file: File) => void; loading: boolean }) {
  return (
    <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded border border-dashed border-gray-300 bg-white p-2 text-xs font-bold text-[#557084] hover:bg-gray-50">
      <Upload size={14} />
      {loading ? "Uploading..." : "Upload Local Image"}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
        }}
        className="hidden"
      />
    </label>
  );
}

function Modal({ title, children, onClose, onSave }: { title: string; children: React.ReactNode; onClose: () => void; onSave: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-black">
          <X size={18} />
        </button>
        <h3 className="font-serif text-2xl text-[#092945] mb-4">{title}</h3>
        <div className="grid gap-4 max-h-[70vh] overflow-y-auto pr-1">{children}</div>
        <div className="mt-6 flex justify-end gap-3 border-t pt-4">
          <button onClick={onClose} className="rounded px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100">
            Cancel
          </button>
          <button onClick={onSave} className="rounded bg-[#092945] px-5 py-2 text-xs font-bold text-white hover:bg-[#bc8140]">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
