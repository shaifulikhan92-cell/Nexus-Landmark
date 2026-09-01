"use client";

import { useEffect, useState, FormEvent } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  CirclePlay,
  Compass,
  Home,
  MapPin,
  Menu as MenuIcon,
  Phone,
  Quote,
  ShieldCheck,
  Sparkles,
  X,
  Send,
  Info,
  Maximize2,
  Mail,
  User,
  Check
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// --- Types ---
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
  customer_role?: string;
};

export type ServiceStory = {
  id: string;
  title: string;
  description: string;
  icon?: string;
  image_url?: string;
};

export type BoardMember = {
  id: string;
  name: string;
  designation: string;
  image_url?: string;
  bio?: string;
  sort_order?: number;
};

export type SiteContent = {
  brand_name: string;
  brand_subtitle: string;
  logo_url?: string;
  top_bar_text: string;
  hero_eyebrow: string;
  hero_title: string;
  hero_title_accent: string;
  hero_description: string;
  hero_image_url: string;
  hero_primary_cta: string;
  hero_secondary_cta: string;
  hero_stat_number: string;
  hero_stat_label: string;
  hero_featured_label: string;
  hero_featured_title: string;
  about_eyebrow: string;
  about_title: string;
  about_title_accent: string;
  about_description: string;
  about_stat1_number: string;
  about_stat1_label: string;
  about_stat2_number: string;
  about_stat2_label: string;
  portfolio_eyebrow: string;
  portfolio_title: string;
  board_eyebrow: string;
  board_title: string;
  board_description: string;
  gallery_eyebrow: string;
  gallery_title: string;
  journal_eyebrow: string;
  journal_title: string;
  journal_description: string;
  testimonial_quote: string;
  testimonial_author: string;
  cta_eyebrow: string;
  cta_title: string;
  cta_description: string;
  phone: string;
  email: string;
  address: string;
  footer_tagline: string;
};

// --- Defaults ---
const defaultSiteContent: SiteContent = {
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
  board_eyebrow: "Leadership & Vision",
  board_title: "Board of Directors",
  board_description: "Leadership with development, finance, structural engineering, and design expertise.",
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
    bio: "Leading operations, strategic planning, and long-term project delivery across residential and commercial developments at Nexus Landmark.",
    sort_order: 1
  },
  {
    id: "bm-2",
    name: "Shah Forhan Khan",
    designation: "Chairman",
    image_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=85",
    bio: "Our vision is to build more than that buildings; We aim to create lasting values, trust and happiness. With innovation, integrity and excellence.",
    sort_order: 2
  },
  {
    id: "bm-3",
    name: "S.M.Anisur Rahman",
    designation: "Vice Chairman",
    image_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=85",
    bio: "Guiding executive strategy, architectural direction, and strategic partnerships for Nexus Landmark properties.",
    sort_order: 3
  },
  {
    id: "bm-4",
    name: "Tanvir Hasan",
    designation: "Director, Operations",
    image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85",
    bio: "Overseeing site execution, engineering safety compliance, customer relations, and corporate governance.",
    sort_order: 4
  }
];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState("All projects");

  // Dynamic CMS state
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [properties, setProperties] = useState<Property[]>(defaultProperties);
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>(defaultBoardMembers);
  const [gallery, setGallery] = useState<GalleryItem[]>(defaultGallery);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [services, setServices] = useState<ServiceStory[]>(defaultServices);

  // Modals state
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryPropTitle, setInquiryPropTitle] = useState("");
  const [activeLightbox, setActiveLightbox] = useState<GalleryItem | null>(null);

  // Inquiry form inputs & state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  useEffect(() => {
    // 1. Load Supabase data first (source of truth — works on ALL devices)
    if (supabase) {
      Promise.all([
        supabase.from("site_content").select("content").eq("id", "homepage").maybeSingle(),
        supabase.from("properties").select("*").order("created_at", { ascending: false }),
        supabase.from("gallery_items").select("*").order("sort_order"),
        supabase.from("testimonials").select("*").eq("published", true).order("created_at", { ascending: false }),
        supabase.from("services").select("*").eq("published", true).order("sort_order"),
        supabase.from("board_members").select("*").eq("published", true).order("sort_order")
      ]).then(([contentRes, propRes, galleryRes, testRes, servRes, boardRes]) => {
        if (contentRes.data?.content) {
          setContent((prev) => ({ ...prev, ...(contentRes.data!.content as Partial<SiteContent>) }));
        }
        if (propRes.data?.length) setProperties(propRes.data);
        if (galleryRes.data?.length) setGallery(galleryRes.data);
        if (testRes.data?.length) setTestimonials(testRes.data);
        if (servRes.data?.length) setServices(servRes.data);
        // Supabase is the shared source of truth, so every device receives
        // the same board records managed in the CMS.
        const publicBoardMembers = boardRes.data ?? [];
        if (publicBoardMembers.length > 0) {
          setBoardMembers(publicBoardMembers);
        }
      }).catch(console.error);
    }

    // 2. Also apply any CMS live-edit overrides from localStorage (desktop admin real-time sync only)
    const applyCmsOverrides = () => {
      try {
        const cachedContent = localStorage.getItem("nexus_site_content");
        if (cachedContent) setContent((prev) => ({ ...prev, ...JSON.parse(cachedContent) }));
        const cachedProps = localStorage.getItem("nexus_properties");
        if (cachedProps) { const p = JSON.parse(cachedProps); if (p?.length) setProperties(p); }
        const cachedGallery = localStorage.getItem("nexus_gallery");
        if (cachedGallery) { const g = JSON.parse(cachedGallery); if (g?.length) setGallery(g); }
        const cachedTestimonials = localStorage.getItem("nexus_testimonials");
        if (cachedTestimonials) { const t = JSON.parse(cachedTestimonials); if (t?.length) setTestimonials(t); }
        const cachedServices = localStorage.getItem("nexus_services");
        if (cachedServices) { const s = JSON.parse(cachedServices); if (s?.length) setServices(s); }
        // Board members: only use localStorage if it has MORE members than default (meaning CMS just saved them)
        const cachedBoard = localStorage.getItem("nexus_board_members");
        if (cachedBoard) {
          const parsed = JSON.parse(cachedBoard);
          if (parsed?.length > defaultBoardMembers.length) setBoardMembers(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener("nexus_content_updated", applyCmsOverrides);
    return () => {
      window.removeEventListener("nexus_content_updated", applyCmsOverrides);
    };
  }, []);

  const visibleProperties = filter === "All projects"
    ? properties
    : properties.filter((p) => p.status === filter);

  const go = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const openInquiryModal = (propertyTitle?: string) => {
    if (propertyTitle) setInquiryPropTitle(propertyTitle);
    else setInquiryPropTitle("");
    setInquirySuccess(false);
    setInquiryModalOpen(true);
  };

  async function handleInquirySubmit(e: FormEvent) {
    e.preventDefault();
    if (!formName || !formEmail) return;
    setInquirySubmitting(true);
    
    if (supabase) {
      await supabase.from("inquiries").insert({
        name: formName,
        email: formEmail,
        phone: formPhone,
        message: formMessage,
        property_title: inquiryPropTitle || "General Inquiry",
        status: "New"
      });
    }

    setInquirySubmitting(false);
    setInquirySuccess(true);
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormMessage("");
    setTimeout(() => {
      setInquiryModalOpen(false);
      setInquirySuccess(false);
    }, 2500);
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f8f9fb] text-[#0c2d49]">
      {/* Top Banner */}
      <div className="bg-[#092945] px-6 py-2 text-center text-[11px] font-medium tracking-[.12em] text-white/75">
        {content.top_bar_text}
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 border-b border-[#0c2d49]/10 bg-white/95 shadow-[0_10px_35px_rgba(8,36,61,.08)] backdrop-blur-xl">
        <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-5 px-6 lg:px-10">
          <button onClick={() => go("top")} className="flex items-center gap-3 text-left">
            <img
              src={content.logo_url || "/logo.png"}
              alt={content.brand_name}
              className="h-12 w-auto max-w-[60px] object-contain"
            />
            <span className="block">
              <span className="block font-serif text-[19px] font-semibold leading-none text-[#092945]">
                {content.brand_name.split(" ")[0]} <span className="text-[#bc8140]">{content.brand_name.split(" ").slice(1).join(" ") || "Landmark"}</span>
              </span>
              <span className="mt-1 block text-[9px] font-bold uppercase tracking-[.22em] text-[#557084]">
                {content.brand_subtitle}
              </span>
            </span>
          </button>

          <nav className="hidden items-center gap-7 text-[13px] font-semibold text-[#314b5e] lg:flex">
            <button onClick={() => go("about")} className="transition hover:text-[#bc8140]">About</button>
            <button onClick={() => go("projects")} className="transition hover:text-[#bc8140]">Projects</button>
            <button onClick={() => go("board")} className="transition hover:text-[#bc8140]">Board</button>
            <button onClick={() => go("gallery")} className="transition hover:text-[#bc8140]">Gallery</button>
            <button onClick={() => go("stories")} className="transition hover:text-[#bc8140]">Stories</button>
            <button onClick={() => go("contact")} className="transition hover:text-[#bc8140]">Contact</button>
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <a href={`tel:${content.phone.replace(/\s+/g, '')}`} className="flex items-center gap-2 text-xs font-semibold text-[#314b5e] hover:text-[#bc8140]">
              <Phone size={14} className="text-[#bc8140]" /> {content.phone}
            </a>
            <button
              onClick={() => openInquiryModal()}
              className="rounded-md bg-[#bc8140] px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#092945]"
            >
              Book a visit <ArrowRight size={14} className="ml-1 inline" />
            </button>
          </div>

          <button className="lg:hidden" aria-label="Open navigation" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <MenuIcon />}
          </button>

          {menuOpen && (
            <div className="fixed inset-x-0 top-[76px] z-50 max-h-[calc(100vh-76px)] overflow-y-auto border-b border-[#0c2d49]/10 bg-white p-6 shadow-2xl lg:hidden">
              <div className="flex flex-col gap-5 text-sm font-semibold text-[#092945]">
                <button onClick={() => go("about")} className="text-left py-1 hover:text-[#bc8140]">About</button>
                <button onClick={() => go("projects")} className="text-left py-1 hover:text-[#bc8140]">Projects</button>
                <button onClick={() => go("board")} className="text-left py-1 hover:text-[#bc8140]">Board</button>
                <button onClick={() => go("gallery")} className="text-left py-1 hover:text-[#bc8140]">Gallery</button>
                <button onClick={() => go("stories")} className="text-left py-1 hover:text-[#bc8140]">Stories</button>
                <button onClick={() => go("contact")} className="text-left py-1 hover:text-[#bc8140]">Contact</button>
                <div className="pt-3 border-t">
                  <button
                    onClick={() => { setMenuOpen(false); openInquiryModal(); }}
                    className="w-full rounded-md bg-[#bc8140] py-3 text-center text-xs font-bold text-white shadow-sm"
                  >
                    Book a visit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="top" className="relative overflow-hidden bg-[#092945]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-6 sm:py-16 lg:grid-cols-[.92fr_1.08fr] lg:px-10 lg:py-24">
          <div className="relative z-10">
            <p className="mb-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.25em] text-[#d7a263] sm:text-xs">
              <Sparkles size={14} /> {content.hero_eyebrow}
            </p>
            <h1 className="font-serif text-4xl leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-7xl">
              {content.hero_title}<br />
              <span className="italic text-[#d7a263]">{content.hero_title_accent}</span>
            </h1>
            <p className="mt-5 text-sm leading-7 text-white/70 sm:text-base">
              {content.hero_description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                onClick={() => go("projects")}
                className="rounded-md bg-[#c99554] px-6 py-4 text-sm font-bold text-white transition hover:bg-white hover:text-[#092945]"
              >
                {content.hero_primary_cta} <ArrowRight size={16} className="ml-2 inline" />
              </button>
              <button
                onClick={() => go("about")}
                className="rounded-md border border-white/25 px-6 py-4 text-sm font-bold text-white transition hover:bg-white hover:text-[#092945]"
              >
                {content.hero_secondary_cta}
              </button>
            </div>
          </div>

          <div className="relative h-[320px] sm:h-[420px] lg:h-[570px]">
            <div className="absolute inset-0 overflow-hidden rounded-lg shadow-2xl">
              <img
                src={content.hero_image_url}
                alt="Nexus Landmark signature residence"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute bottom-4 left-3 flex max-w-[180px] items-center gap-3 rounded-lg bg-white p-3 shadow-2xl sm:bottom-[-20px] sm:left-5 sm:max-w-[240px] sm:gap-4 sm:p-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f2e7d8] text-[#bc8140] sm:h-11 sm:w-11">
                <ShieldCheck size={18} />
              </span>
              <span>
                <strong className="block font-serif text-xl text-[#092945] sm:text-2xl">{content.hero_stat_number}</strong>
                <small className="text-[9px] font-bold uppercase tracking-wider text-[#557084] sm:text-[10px]">{content.hero_stat_label}</small>
              </span>
            </div>
            <div className="absolute right-3 top-4 rounded-lg border border-white/25 bg-[#092945]/85 px-3 py-2 text-xs text-white backdrop-blur sm:right-4 sm:top-5 sm:px-4 sm:py-3">
              <span className="block text-[#d7a263] text-[10px] sm:text-xs">{content.hero_featured_label}</span>
              <strong className="mt-1 block text-xs sm:text-sm">{content.hero_featured_title}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="border-b border-[#0c2d49]/10 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          {/* About Intro + Stats */}
          <div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr]">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[.22em] text-[#bc8140]">
                {content.about_eyebrow}
              </p>
              <h2 className="font-serif text-4xl leading-tight sm:text-5xl text-[#092945]">
                {content.about_title} <span className="italic text-[#bc8140]">{content.about_title_accent}</span>
              </h2>
            </div>
            <div className="grid gap-8 sm:grid-cols-2">
              <p className="text-[15px] leading-7 text-[#557084]">
                {content.about_description}
              </p>
              <div className="grid grid-cols-2 gap-5">
                <div className="border-l-2 border-[#c99554] pl-4">
                  <strong className="font-serif text-3xl text-[#092945]">{content.about_stat1_number}</strong>
                  <span className="mt-1 block text-xs text-[#557084]">{content.about_stat1_label}</span>
                </div>
                <div className="border-l-2 border-[#c99554] pl-4">
                  <strong className="font-serif text-3xl text-[#092945]">{content.about_stat2_number}</strong>
                  <span className="mt-1 block text-xs text-[#557084]">{content.about_stat2_label}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Board of Directors — inside About */}
          <div id="board" className="mt-20 border-t border-[#0c2d49]/10 pt-16">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <p className="mb-3 text-xs font-bold uppercase tracking-[.22em] text-[#bc8140]">
                {content.board_eyebrow || "Leadership & Vision"}
              </p>
              <h2 className="font-serif text-4xl leading-tight sm:text-5xl text-[#092945]">
                {content.board_title || "Board of Directors"}
              </h2>
              <p className="mt-4 text-sm leading-6 text-[#557084]">
                {content.board_description || "Leadership with development, finance, structural engineering, and design expertise."}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...boardMembers].sort((a, b) => {
                const aMD = a.designation.toLowerCase().includes("managing director") || a.designation.toLowerCase().includes("md");
                const bMD = b.designation.toLowerCase().includes("managing director") || b.designation.toLowerCase().includes("md");
                if (aMD && !bMD) return -1;
                if (!aMD && bMD) return 1;
                return (a.sort_order ?? 99) - (b.sort_order ?? 99);
              }).map((member) => (
                <div
                  key={member.id}
                  className="group overflow-hidden rounded-xl border border-[#0c2d49]/10 bg-[#f8f9fb] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-80 overflow-hidden bg-gray-100">
                    <img
                      src={member.image_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=85"}
                      alt={member.name}
                      className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#092945]/80 via-transparent to-transparent opacity-60 transition group-hover:opacity-80" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="inline-block rounded bg-[#bc8140] px-3 py-1 text-[11px] font-bold text-white shadow">
                        {member.designation}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-2xl text-[#092945]">{member.name}</h3>
                    {member.bio && <p className="mt-2 text-xs leading-5 text-[#557084]">{member.bio}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Portfolio Section */}
      <section id="projects" className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[.22em] text-[#bc8140]">
              {content.portfolio_eyebrow}
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl text-[#092945]">
              {content.portfolio_title}
            </h2>
          </div>
          <button onClick={() => openInquiryModal()} className="self-start text-sm font-bold text-[#bc8140] hover:underline sm:self-auto">
            Start a conversation <ArrowRight size={15} className="ml-1 inline" />
          </button>
        </div>

        {/* Filters */}
        <div className="mt-10 flex flex-wrap gap-2 border-b border-[#0c2d49]/10 pb-4">
          {["All projects", "Ongoing", "Upcoming", "Completed"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                filter === item
                  ? "bg-[#092945] text-white"
                  : "text-[#557084] hover:bg-[#eaf0f4]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Properties Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProperties.map((project) => (
            <article
              key={project.id}
              className="group overflow-hidden rounded-lg border border-[#0c2d49]/10 bg-white shadow-[0_10px_30px_rgba(8,36,61,.05)] transition hover:shadow-xl"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={project.image_url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85"}
                  alt={project.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#092945] shadow-sm">
                  {project.status}
                </span>
                <span className="absolute bottom-4 left-4 rounded bg-[#092945]/85 px-3 py-1.5 text-[10px] font-semibold text-white backdrop-blur">
                  {project.property_type}
                </span>
              </div>
              <div className="p-6">
                <p className="flex items-center gap-1 text-xs font-semibold text-[#bc8140]">
                  <MapPin size={13} /> {project.location}
                </p>
                <h3 className="mt-3 font-serif text-2xl text-[#092945]">{project.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#557084] line-clamp-2">{project.description}</p>
                <div className="mt-6 flex items-center justify-between border-t border-[#0c2d49]/10 pt-4">
                  <span className="text-xs font-semibold text-[#557084]">{project.size}</span>
                  <button
                    onClick={() => setSelectedProperty(project)}
                    className="text-xs font-bold text-[#bc8140] hover:text-[#092945]"
                  >
                    View details <ArrowRight size={14} className="ml-1 inline" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>



      {/* Gallery Section */}
      <section id="gallery" className="bg-[#edf2f5] px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[.22em] text-[#bc8140]">
                {content.gallery_eyebrow}
              </p>
              <h2 className="font-serif text-4xl sm:text-5xl text-[#092945]">
                {content.gallery_title}
              </h2>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveLightbox(item)}
                className="group relative h-72 cursor-pointer overflow-hidden rounded-lg shadow-md"
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#092945]/85 via-transparent to-transparent opacity-80 transition group-hover:opacity-95" />
                <div className="absolute bottom-5 left-5 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#d7a263]">{item.label}</span>
                  <h3 className="mt-1 font-serif text-xl">{item.title}</h3>
                </div>
                <div className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white/20 text-white backdrop-blur opacity-0 transition group-hover:opacity-100">
                  <Maximize2 size={15} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journal / Stories Section */}
      <section id="stories" className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[.22em] text-[#bc8140]">
              {content.journal_eyebrow}
            </p>
            <h2 className="font-serif text-4xl leading-tight sm:text-5xl text-[#092945]">
              {content.journal_title}
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-6 text-[#557084]">
              {content.journal_description}
            </p>
            <button
              onClick={() => openInquiryModal()}
              className="mt-8 rounded-md border border-[#0c2d49]/20 px-5 py-3 text-xs font-bold transition hover:bg-[#092945] hover:text-white"
            >
              Watch project stories <CirclePlay size={15} className="ml-2 inline text-[#bc8140]" />
            </button>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {services.map((item) => (
              <div
                key={item.id}
                className="relative min-h-64 overflow-hidden rounded-lg bg-[#092945] p-7 text-white shadow-lg flex flex-col justify-between"
              >
                {item.image_url && (
                  <>
                    <img src={item.image_url} alt={item.title} className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-[#092945]/75" />
                  </>
                )}
                <div className="relative z-10">
                  <span className="text-[10px] uppercase tracking-widest text-[#d7a263]">Story Spotlight</span>
                  <h3 className="mt-4 font-serif text-2xl text-white">{item.title}</h3>
                  <p className="mt-3 text-xs leading-5 text-white/75">{item.description}</p>
                </div>
                <div className="relative z-10 mt-6 flex items-center gap-2 text-xs font-bold text-[#d7a263]">
                  <CirclePlay size={20} /> Read story
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#092945] px-5 py-16 text-white sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <Quote className="mb-5 text-[#d7a263]" size={30} />
            <p className="font-serif text-2xl leading-tight sm:text-3xl lg:text-4xl">
              "{testimonials[0]?.quote || content.testimonial_quote}"
            </p>
            <p className="mt-6 text-xs font-bold uppercase tracking-widest text-[#d7a263]">
              — {testimonials[0]?.customer_name || content.testimonial_author} {testimonials[0]?.customer_role ? `(${testimonials[0].customer_role})` : ""}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:gap-5">
            <div className="border-l border-white/20 p-3 sm:p-5">
              <Home size={18} className="mb-4 text-[#d7a263] sm:mb-8" />
              <strong className="font-serif text-xl sm:text-2xl">Clarity</strong>
              <p className="mt-2 text-[10px] leading-5 text-white/60 sm:text-xs">At every milestone</p>
            </div>
            <div className="border-l border-white/20 p-3 sm:p-5">
              <ShieldCheck size={18} className="mb-4 text-[#d7a263] sm:mb-8" />
              <strong className="font-serif text-xl sm:text-2xl">Care</strong>
              <p className="mt-2 text-[10px] leading-5 text-white/60 sm:text-xs">Long after handover</p>
            </div>
            <div className="border-l border-white/20 p-3 sm:p-5">
              <Building2 size={18} className="mb-4 text-[#d7a263] sm:mb-8" />
              <strong className="font-serif text-xl sm:text-2xl">Value</strong>
              <p className="mt-2 text-[10px] leading-5 text-white/60 sm:text-xs">Built to last</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA / Contact Section */}
      <section id="contact" className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="relative overflow-hidden rounded-lg bg-[#c99554] px-7 py-14 text-center text-white sm:px-12 shadow-xl">
          <div className="absolute -right-10 -top-24 h-72 w-72 rounded-full border-[30px] border-white/10" />
          <p className="relative text-xs font-bold uppercase tracking-[.22em] text-white/75">
            {content.cta_eyebrow}
          </p>
          <h2 className="relative mx-auto mt-4 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
            {content.cta_title}
          </h2>
          <p className="relative mx-auto mt-5 max-w-lg text-sm leading-6 text-white/80">
            {content.cta_description}
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => openInquiryModal()}
              className="rounded-md bg-[#092945] px-6 py-4 text-sm font-bold text-white shadow-md transition hover:bg-white hover:text-[#092945]"
            >
              Book a private visit
            </button>
            <a
              href={`mailto:${content.email}`}
              className="rounded-md border border-white/40 px-6 py-4 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Send an email inquiry
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#0c2d49]/10 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-6 sm:py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-10">
          <div>
            <div className="flex items-center gap-3">
              <img
                src={content.logo_url || "/logo.png"}
                alt={content.brand_name}
                className="h-12 w-auto max-w-[50px] object-contain"
              />
              <span className="font-serif text-xl font-semibold text-[#092945]">
                {content.brand_name.split(" ")[0]} <span className="text-[#bc8140]">{content.brand_name.split(" ").slice(1).join(" ") || "Landmark"}</span>
              </span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-6 text-[#557084]">
              {content.footer_tagline}
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#092945]">Explore</h4>
            <div className="mt-5 grid gap-3 text-sm text-[#557084]">
              <button className="text-left hover:text-[#bc8140]" onClick={() => go("about")}>About us</button>
              <button className="text-left hover:text-[#bc8140]" onClick={() => go("projects")}>Our projects</button>
              <button className="text-left hover:text-[#bc8140]" onClick={() => go("gallery")}>Gallery</button>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#092945]">Contact</h4>
            <div className="mt-5 grid gap-3 text-sm text-[#557084]">
              <span>{content.address}</span>
              <a href={`tel:${content.phone.replace(/\s+/g, '')}`} className="hover:text-[#bc8140]">{content.phone}</a>
              <a href={`mailto:${content.email}`} className="hover:text-[#bc8140]">{content.email}</a>
            </div>
          </div>
        </div>
        <div className="border-t border-[#0c2d49]/10 px-6 py-5 text-center text-xs text-[#557084] lg:px-10">
          © 2026 {content.brand_name}. Designed for better living.
        </div>
      </footer>

      {/* --- Property Details Modal --- */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl sm:p-8">
            <button
              onClick={() => setSelectedProperty(null)}
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
            >
              <X size={18} />
            </button>
            <div className="relative h-64 overflow-hidden rounded-lg">
              <img src={selectedProperty.image_url} alt={selectedProperty.title} className="h-full w-full object-cover" />
              <span className="absolute left-3 top-3 rounded bg-white/90 px-3 py-1 text-xs font-bold text-[#092945]">
                {selectedProperty.status}
              </span>
            </div>
            <div className="mt-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#bc8140]">{selectedProperty.property_type}</span>
              <h2 className="mt-1 font-serif text-3xl text-[#092945]">{selectedProperty.title}</h2>
              <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-[#557084]">
                <MapPin size={14} className="text-[#bc8140]" /> {selectedProperty.location}
              </p>
              <p className="mt-4 text-sm leading-6 text-[#557084]">{selectedProperty.description}</p>
              
              <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg bg-[#f5f7f9] p-4 text-xs">
                <div>
                  <span className="block font-bold text-[#557084]">Available Sizes</span>
                  <span className="mt-1 block font-serif text-base text-[#092945]">{selectedProperty.size || "Contact for specs"}</span>
                </div>
                <div>
                  <span className="block font-bold text-[#557084]">Pricing</span>
                  <span className="mt-1 block font-serif text-base text-[#092945]">{selectedProperty.price || "On Request"}</span>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    const title = selectedProperty.title;
                    setSelectedProperty(null);
                    openInquiryModal(title);
                  }}
                  className="rounded-md bg-[#092945] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#bc8140]"
                >
                  Inquire about {selectedProperty.title}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Customer Inquiry / Visit Modal --- */}
      {inquiryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="bg-[#092945] p-6 text-white">
              <button
                onClick={() => setInquiryModalOpen(false)}
                className="absolute right-4 top-4 text-white/60 hover:text-white"
              >
                <X size={18} />
              </button>
              <span className="text-xs font-bold uppercase tracking-widest text-[#d7a263]">Nexus Landmark</span>
              <h3 className="mt-1 font-serif text-2xl">
                {inquiryPropTitle ? `Inquiry for ${inquiryPropTitle}` : "Book a Visit / Inquiry"}
              </h3>
            </div>

            <div className="p-6">
              {inquirySuccess ? (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                    <Check size={24} />
                  </div>
                  <h4 className="font-serif text-2xl text-[#092945]">Thank You!</h4>
                  <p className="mt-2 text-sm text-[#557084]">Your inquiry has been received. Our team will reach out shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="grid gap-4">
                  <label className="grid gap-1.5 text-xs font-bold text-[#314b5e]">
                    Full Name *
                    <div className="flex items-center gap-2 rounded-md border border-[#0c2d49]/15 px-3 py-2.5">
                      <User size={15} className="text-[#bc8140]" />
                      <input
                        required
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Your name"
                        className="w-full bg-transparent text-sm font-normal outline-none"
                      />
                    </div>
                  </label>

                  <label className="grid gap-1.5 text-xs font-bold text-[#314b5e]">
                    Email Address *
                    <div className="flex items-center gap-2 rounded-md border border-[#0c2d49]/15 px-3 py-2.5">
                      <Mail size={15} className="text-[#bc8140]" />
                      <input
                        required
                        type="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full bg-transparent text-sm font-normal outline-none"
                      />
                    </div>
                  </label>

                  <label className="grid gap-1.5 text-xs font-bold text-[#314b5e]">
                    Phone Number
                    <div className="flex items-center gap-2 rounded-md border border-[#0c2d49]/15 px-3 py-2.5">
                      <Phone size={15} className="text-[#bc8140]" />
                      <input
                        type="tel"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        placeholder="+880 1..."
                        className="w-full bg-transparent text-sm font-normal outline-none"
                      />
                    </div>
                  </label>

                  <label className="grid gap-1.5 text-xs font-bold text-[#314b5e]">
                    Target Property
                    <select
                      value={inquiryPropTitle}
                      onChange={(e) => setInquiryPropTitle(e.target.value)}
                      className="rounded-md border border-[#0c2d49]/15 p-2.5 text-sm font-normal outline-none"
                    >
                      <option value="">General Consultation</option>
                      {properties.map((p) => (
                        <option key={p.id} value={p.title}>{p.title} ({p.location})</option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-1.5 text-xs font-bold text-[#314b5e]">
                    Message
                    <textarea
                      rows={3}
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      placeholder="Tell us about your requirements or preferred time for a visit..."
                      className="rounded-md border border-[#0c2d49]/15 p-3 text-sm font-normal outline-none focus:border-[#bc8140]"
                    />
                  </label>

                  <button
                    disabled={inquirySubmitting}
                    type="submit"
                    className="mt-2 flex items-center justify-center gap-2 rounded-md bg-[#092945] py-3.5 text-sm font-bold text-white transition hover:bg-[#bc8140] disabled:opacity-50"
                  >
                    <Send size={16} /> {inquirySubmitting ? "Submitting..." : "Submit Inquiry"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- Lightbox Modal --- */}
      {activeLightbox && (
        <div
          onClick={() => setActiveLightbox(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
        >
          <div className="relative max-w-4xl overflow-hidden rounded-lg bg-white p-2">
            <button
              onClick={() => setActiveLightbox(null)}
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white"
            >
              <X size={18} />
            </button>
            <img src={activeLightbox.image_url} alt={activeLightbox.title} className="max-h-[80vh] w-full object-contain" />
            <div className="p-4 text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-[#bc8140]">{activeLightbox.label}</span>
              <h3 className="font-serif text-xl text-[#092945]">{activeLightbox.title}</h3>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
