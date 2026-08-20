"use client";

import { useState, useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  Types matching content.json shape                                  */
/* ------------------------------------------------------------------ */

interface Service {
  number: string;
  title: string;
  description: string;
  detail: string;
  href: string;
}

interface Project {
  slug: string;
  title: string;
  category: string;
  description: string;
  color: string;
  accent: string;
  thumbnail?: string;
  placeholder?: boolean;
}

interface Review {
  quote: string;
  name: string;
  role: string;
  company: string;
  placeholder?: boolean;
}

interface FAQ {
  question: string;
  answer: string;
}

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

interface Contact {
  phone: string;
  phoneTel: string;
  whatsapp: string;
  email: string;
  location: string;
  locationDetail: string;
}

interface Differentiator {
  title: string;
  description: string;
}

interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

interface SiteContent {
  services: Service[];
  projects: Project[];
  reviews: Review[];
  faqs: FAQ[];
  stats: Stat[];
  contact: Contact;
  differentiators: Differentiator[];
  processSteps: ProcessStep[];
}

/* ------------------------------------------------------------------ */
/*  Tabs                                                               */
/* ------------------------------------------------------------------ */

const TABS = ["Services", "Projects", "Reviews", "FAQ", "Stats", "Contact"] as const;
type Tab = (typeof TABS)[number];

/* ------------------------------------------------------------------ */
/*  Reusable style constants                                           */
/* ------------------------------------------------------------------ */

const INPUT =
  "w-full rounded-md border border-white/10 bg-[#1a1a1a] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#FFD400] focus:outline-none focus:ring-1 focus:ring-[#FFD400]/40 transition-colors";
const TEXTAREA = `${INPUT} resize-y min-h-[72px]`;
const CARD =
  "rounded-lg border border-white/10 bg-[#141414] p-4 space-y-3 relative";
const LABEL = "block text-xs font-medium text-white/50 mb-1";
const BTN_PRIMARY =
  "inline-flex items-center gap-2 rounded-md bg-[#FFD400] px-4 py-2 text-sm font-semibold text-[#0E0E0E] hover:bg-[#ffe44d] transition-colors cursor-pointer";
const BTN_SECONDARY =
  "inline-flex items-center gap-2 rounded-md border border-white/10 bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:border-white/20 transition-colors cursor-pointer";
const BTN_DANGER =
  "absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-md text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer";

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AdminPage() {
  /* Auth state */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  /* Content state */
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(false);

  /* UI state */
  const [activeTab, setActiveTab] = useState<Tab>("Services");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [saving, setSaving] = useState(false);

  /* ---- Toast ---------------------------------------------------- */
  const showToast = useCallback((msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }, []);

  /* ---- Fetch content -------------------------------------------- */
  const fetchContent = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content");
      if (!res.ok) throw new Error("Failed to load content");
      const data: SiteContent = await res.json();
      setContent(data);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Load failed", false);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  /* ---- Login ---------------------------------------------------- */
  const handleLogin = async () => {
    setAuthError("");
    setAuthLoading(true);
    try {
      /* Validate password by attempting a no-op PUT */
      const current = await fetch("/api/admin/content");
      if (!current.ok) throw new Error("Cannot reach API");
      const body = await current.json();

      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-email": email,
          "x-admin-password": password,
        },
        body: JSON.stringify(body),
      });
      if (res.status === 401) {
        setAuthError("Invalid email or password");
        return;
      }
      if (!res.ok) throw new Error("Server error");
      setAuthed(true);
      setContent(body);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setAuthLoading(false);
    }
  };

  /* Content is populated directly by handleLogin (it already fetches the
     payload it validates against), and can be refreshed on demand via the
     Reload button, so no load-on-mount effect is needed. */

  /* ---- Save ----------------------------------------------------- */
  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-email": email,
          "x-admin-password": password,
        },
        body: JSON.stringify(content),
      });
      if (res.status === 401) {
        showToast("Session expired — please log in again", false);
        setAuthed(false);
        return;
      }
      if (!res.ok) throw new Error("Save failed");
      showToast("Changes saved", true);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Save failed", false);
    } finally {
      setSaving(false);
    }
  };

  /* ---- Helpers for updating nested state ------------------------ */
  const updateService = (i: number, key: keyof Service, val: string) => {
    if (!content) return;
    const next = [...content.services];
    next[i] = { ...next[i], [key]: val };
    setContent({ ...content, services: next });
  };

  const updateProject = (i: number, key: keyof Project, val: string) => {
    if (!content) return;
    const next = [...content.projects];
    next[i] = { ...next[i], [key]: val };
    setContent({ ...content, projects: next });
  };

  const updateReview = (i: number, key: keyof Review, val: string | boolean) => {
    if (!content) return;
    const next = [...content.reviews];
    next[i] = { ...next[i], [key]: val };
    setContent({ ...content, reviews: next });
  };

  const updateFaq = (i: number, key: keyof FAQ, val: string) => {
    if (!content) return;
    const next = [...content.faqs];
    next[i] = { ...next[i], [key]: val };
    setContent({ ...content, faqs: next });
  };

  const updateStat = (i: number, key: keyof Stat, val: string | number) => {
    if (!content) return;
    const next = [...content.stats];
    next[i] = { ...next[i], [key]: val };
    setContent({ ...content, stats: next });
  };

  const updateContact = (key: keyof Contact, val: string) => {
    if (!content) return;
    setContent({ ...content, contact: { ...content.contact, [key]: val } });
  };

  /* ---- Add / Delete helpers ------------------------------------- */
  const addService = () => {
    if (!content) return;
    setContent({
      ...content,
      services: [
        ...content.services,
        { number: String(content.services.length + 1).padStart(2, "0"), title: "", description: "", detail: "", href: "#" },
      ],
    });
  };

  const removeService = (i: number) => {
    if (!content || !confirm("Delete this service?")) return;
    setContent({ ...content, services: content.services.filter((_, idx) => idx !== i) });
  };

  const addProject = () => {
    if (!content) return;
    setContent({
      ...content,
      projects: [
        ...content.projects,
        { slug: "", title: "", category: "", description: "", color: "#FFD400", accent: "#FAFAFA" },
      ],
    });
  };

  const removeProject = (i: number) => {
    if (!content || !confirm("Delete this project?")) return;
    setContent({ ...content, projects: content.projects.filter((_, idx) => idx !== i) });
  };

  const addReview = () => {
    if (!content) return;
    setContent({
      ...content,
      reviews: [...content.reviews, { quote: "", name: "", role: "", company: "", placeholder: false }],
    });
  };

  const removeReview = (i: number) => {
    if (!content || !confirm("Delete this review?")) return;
    setContent({ ...content, reviews: content.reviews.filter((_, idx) => idx !== i) });
  };

  const addFaq = () => {
    if (!content) return;
    setContent({ ...content, faqs: [...content.faqs, { question: "", answer: "" }] });
  };

  const removeFaq = (i: number) => {
    if (!content || !confirm("Delete this FAQ?")) return;
    setContent({ ...content, faqs: content.faqs.filter((_, idx) => idx !== i) });
  };

  const addStat = () => {
    if (!content) return;
    setContent({ ...content, stats: [...content.stats, { value: 0, suffix: "", label: "" }] });
  };

  const removeStat = (i: number) => {
    if (!content || !confirm("Delete this stat?")) return;
    setContent({ ...content, stats: content.stats.filter((_, idx) => idx !== i) });
  };

  /* ================================================================ */
  /*  LOGIN SCREEN                                                     */
  /* ================================================================ */

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0E0E0E] px-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">EdgeBrain Admin</h1>
            <p className="mt-1 text-sm text-white/40">Sign in to manage site content</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-4"
          >
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className={INPUT}
                autoFocus
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={INPUT}
              />
            </div>
            {authError && <p className="text-sm text-red-400">{authError}</p>}
            <button type="submit" disabled={authLoading || !email || !password} className={`${BTN_PRIMARY} w-full justify-center disabled:opacity-50`}>
              {authLoading ? "Checking..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ================================================================ */
  /*  LOADING STATE                                                    */
  /* ================================================================ */

  if (loading || !content) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0E0E0E]">
        <p className="text-white/50">Loading content...</p>
      </div>
    );
  }

  /* ================================================================ */
  /*  TAB CONTENT RENDERERS                                            */
  /* ================================================================ */

  const renderServices = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Services ({content.services.length})</h3>
        <button onClick={addService} className={BTN_PRIMARY}>+ Add Service</button>
      </div>
      {content.services.map((s, i) => (
        <div key={i} className={CARD}>
          <button onClick={() => removeService(i)} className={BTN_DANGER} title="Delete">x</button>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Number</label>
              <input className={INPUT} value={s.number} onChange={(e) => updateService(i, "number", e.target.value)} />
            </div>
            <div>
              <label className={LABEL}>Title</label>
              <input className={INPUT} value={s.title} onChange={(e) => updateService(i, "title", e.target.value)} />
            </div>
          </div>
          <div>
            <label className={LABEL}>Description</label>
            <textarea className={TEXTAREA} value={s.description} onChange={(e) => updateService(i, "description", e.target.value)} />
          </div>
          <div>
            <label className={LABEL}>Detail</label>
            <textarea className={TEXTAREA} value={s.detail} onChange={(e) => updateService(i, "detail", e.target.value)} />
          </div>
          <div>
            <label className={LABEL}>Href</label>
            <input className={INPUT} value={s.href} onChange={(e) => updateService(i, "href", e.target.value)} />
          </div>
        </div>
      ))}
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Projects ({content.projects.length})</h3>
        <button onClick={addProject} className={BTN_PRIMARY}>+ Add Project</button>
      </div>
      {content.projects.map((p, i) => (
        <div key={i} className={CARD}>
          <button onClick={() => removeProject(i)} className={BTN_DANGER} title="Delete">x</button>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Slug</label>
              <input className={INPUT} value={p.slug} onChange={(e) => updateProject(i, "slug", e.target.value)} />
            </div>
            <div>
              <label className={LABEL}>Title</label>
              <input className={INPUT} value={p.title} onChange={(e) => updateProject(i, "title", e.target.value)} />
            </div>
          </div>
          <div>
            <label className={LABEL}>Category</label>
            <input className={INPUT} value={p.category} onChange={(e) => updateProject(i, "category", e.target.value)} />
          </div>
          <div>
            <label className={LABEL}>Description</label>
            <textarea className={TEXTAREA} value={p.description} onChange={(e) => updateProject(i, "description", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Color</label>
              <div className="flex gap-2 items-center">
                <input className={INPUT} value={p.color} onChange={(e) => updateProject(i, "color", e.target.value)} />
                <span className="w-8 h-8 rounded border border-white/10 shrink-0" style={{ backgroundColor: p.color }} />
              </div>
            </div>
            <div>
              <label className={LABEL}>Accent</label>
              <div className="flex gap-2 items-center">
                <input className={INPUT} value={p.accent} onChange={(e) => updateProject(i, "accent", e.target.value)} />
                <span className="w-8 h-8 rounded border border-white/10 shrink-0" style={{ backgroundColor: p.accent }} />
              </div>
            </div>
          </div>
          <div>
            <label className={LABEL}>Thumbnail</label>
            <div className="flex gap-3 items-center">
              {p.thumbnail ? (
                <img src={p.thumbnail} alt="" className="w-20 h-14 rounded object-cover border border-white/10" />
              ) : (
                <div className="w-20 h-14 rounded border border-dashed border-white/20 flex items-center justify-center text-white/20 text-xs">No img</div>
              )}
              <label className={`${BTN_SECONDARY} cursor-pointer`}>
                Upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file || !p.slug) return;
                    const fd = new FormData();
                    fd.append("file", file);
                    fd.append("slug", p.slug);
                    try {
                      const res = await fetch("/api/admin/upload", {
                        method: "POST",
                        headers: { "x-admin-email": email, "x-admin-password": password },
                        body: fd,
                      });
                      if (!res.ok) throw new Error("Upload failed");
                      const data = await res.json();
                      updateProject(i, "thumbnail", data.url);
                      showToast("Image uploaded", true);
                    } catch {
                      showToast("Upload failed", false);
                    }
                  }}
                />
              </label>
              {p.thumbnail && (
                <button onClick={() => updateProject(i, "thumbnail", "")} className="text-xs text-red-400 hover:text-red-300">Remove</button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Reviews ({content.reviews.length})</h3>
        <button onClick={addReview} className={BTN_PRIMARY}>+ Add Review</button>
      </div>
      {content.reviews.map((r, i) => (
        <div key={i} className={CARD}>
          <button onClick={() => removeReview(i)} className={BTN_DANGER} title="Delete">x</button>
          <div>
            <label className={LABEL}>Quote</label>
            <textarea className={TEXTAREA} value={r.quote} onChange={(e) => updateReview(i, "quote", e.target.value)} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={LABEL}>Name</label>
              <input className={INPUT} value={r.name} onChange={(e) => updateReview(i, "name", e.target.value)} />
            </div>
            <div>
              <label className={LABEL}>Role</label>
              <input className={INPUT} value={r.role} onChange={(e) => updateReview(i, "role", e.target.value)} />
            </div>
            <div>
              <label className={LABEL}>Company</label>
              <input className={INPUT} value={r.company} onChange={(e) => updateReview(i, "company", e.target.value)} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-white/50 cursor-pointer">
            <input
              type="checkbox"
              checked={!!r.placeholder}
              onChange={(e) => updateReview(i, "placeholder", e.target.checked)}
              className="accent-[#FFD400]"
            />
            Placeholder review
          </label>
        </div>
      ))}
    </div>
  );

  const renderFaq = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">FAQ ({content.faqs.length})</h3>
        <button onClick={addFaq} className={BTN_PRIMARY}>+ Add FAQ</button>
      </div>
      {content.faqs.map((f, i) => (
        <div key={i} className={CARD}>
          <button onClick={() => removeFaq(i)} className={BTN_DANGER} title="Delete">x</button>
          <div>
            <label className={LABEL}>Question</label>
            <input className={INPUT} value={f.question} onChange={(e) => updateFaq(i, "question", e.target.value)} />
          </div>
          <div>
            <label className={LABEL}>Answer</label>
            <textarea className={TEXTAREA} value={f.answer} onChange={(e) => updateFaq(i, "answer", e.target.value)} />
          </div>
        </div>
      ))}
    </div>
  );

  const renderStats = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Stats ({content.stats.length})</h3>
        <button onClick={addStat} className={BTN_PRIMARY}>+ Add Stat</button>
      </div>
      {content.stats.map((s, i) => (
        <div key={i} className={CARD}>
          <button onClick={() => removeStat(i)} className={BTN_DANGER} title="Delete">x</button>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={LABEL}>Value</label>
              <input
                type="number"
                className={INPUT}
                value={s.value}
                onChange={(e) => updateStat(i, "value", Number(e.target.value))}
              />
            </div>
            <div>
              <label className={LABEL}>Suffix</label>
              <input className={INPUT} value={s.suffix} onChange={(e) => updateStat(i, "suffix", e.target.value)} placeholder="e.g. + or %" />
            </div>
            <div>
              <label className={LABEL}>Label</label>
              <input className={INPUT} value={s.label} onChange={(e) => updateStat(i, "label", e.target.value)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderContact = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Contact Info</h3>
      <div className={CARD}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={LABEL}>Phone (display)</label>
            <input className={INPUT} value={content.contact.phone} onChange={(e) => updateContact("phone", e.target.value)} placeholder="+1 (555) 123-4567" />
          </div>
          <div>
            <label className={LABEL}>Phone (tel: link)</label>
            <input className={INPUT} value={content.contact.phoneTel} onChange={(e) => updateContact("phoneTel", e.target.value)} placeholder="+15551234567" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={LABEL}>WhatsApp</label>
            <input className={INPUT} value={content.contact.whatsapp} onChange={(e) => updateContact("whatsapp", e.target.value)} placeholder="https://wa.me/..." />
          </div>
          <div>
            <label className={LABEL}>Email</label>
            <input className={INPUT} value={content.contact.email} onChange={(e) => updateContact("email", e.target.value)} />
          </div>
        </div>
        <div>
          <label className={LABEL}>Location</label>
          <input className={INPUT} value={content.contact.location} onChange={(e) => updateContact("location", e.target.value)} />
        </div>
        <div>
          <label className={LABEL}>Location Detail</label>
          <input className={INPUT} value={content.contact.locationDetail} onChange={(e) => updateContact("locationDetail", e.target.value)} />
        </div>
      </div>
    </div>
  );

  const tabContent: Record<Tab, () => React.JSX.Element> = {
    Services: renderServices,
    Projects: renderProjects,
    Reviews: renderReviews,
    FAQ: renderFaq,
    Stats: renderStats,
    Contact: renderContact,
  };

  /* ================================================================ */
  /*  MAIN DASHBOARD                                                   */
  /* ================================================================ */

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 rounded-lg px-4 py-3 text-sm font-medium shadow-lg transition-all ${
            toast.ok ? "bg-green-600/90 text-white" : "bg-red-600/90 text-white"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="border-b border-white/10 bg-[#0E0E0E] sticky top-0 z-40">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-white">
            <span className="text-[#FFD400]">EB</span> Admin
          </h1>
          <button
            onClick={() => {
              setAuthed(false);
              setPassword("");
              setContent(null);
            }}
            className={BTN_SECONDARY}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="border-b border-white/10 bg-[#0E0E0E] sticky top-[65px] z-30">
        <div className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab
                  ? "border-[#FFD400] text-[#FFD400]"
                  : "border-transparent text-white/50 hover:text-white/80"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content area */}
      <div className="mx-auto max-w-5xl px-4 py-6">{tabContent[activeTab]()}</div>

      {/* Sticky save bar */}
      <div className="sticky bottom-0 border-t border-white/10 bg-[#0E0E0E]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-end gap-3 px-4 py-3">
          <button onClick={fetchContent} className={BTN_SECONDARY} disabled={saving}>
            Discard Changes
          </button>
          <button onClick={handleSave} className={BTN_PRIMARY} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
