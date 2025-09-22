"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Heart,
  Shield,
  Users,
  ArrowRight,
  Play,
  Star,
  Zap,
  Eye,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

/**
 * HandcraftedLandingWithGradient.tsx
 * Handcrafted landing page with subtle layered gradient background and floating elements.
 *
 * Drop in place of your previous landing component.
 */

/* ---------------- data ---------------- */
const IMPACT_STATS = {
  totalDonations: 2847293,
  livesImpacted: 156789,
  activeNGOs: 247,
  citiesCovered: 89,
};

const FEATURES = [
  {
    title: "Easy item donations",
    desc: "List clothes, food or household items with a couple of photos. Pick an NGO and we’ll handle the rest.",
    icon: <Heart className="w-5 h-5" />,
  },
  {
    title: "Secure financial giving",
    desc: "Donate money to verified partners. Transparent receipts and simple records for your bookkeeping.",
    icon: <Shield className="w-5 h-5" />,
  },
  {
    title: "Local campaigns",
    desc: "Find nearby drives run by NGOs and neighbours. Join with one click and coordinate drop-offs.",
    icon: <Users className="w-5 h-5" />,
  },
  {
    title: "Real confirmations",
    desc: "When NGOs receive donations we generate a PDF receipt and send it to your email — no guesswork.",
    icon: <Eye className="w-5 h-5" />,
  },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Donor, Pune",
    rating: 5,
    quote:
      "I donated two bags of clothes. The NGO picked them up, confirmed, and I got a receipt the same week. Simple and trustworthy.",
    avatar: "PS",
  },
  {
    name: "Rajan Mehra",
    role: "Volunteer, Delhi",
    rating: 5,
    quote:
      "We ran a neighbourhood drive — the platform made coordination easier and the NGO reporting helped track impact.",
    avatar: "RM",
  },
  {
    name: "Meera Joshi",
    role: "Teacher, Mumbai",
    rating: 4,
    quote:
      "I recommended this to parents — kids loved donating toys. The team followed up politely and reliably.",
    avatar: "MJ",
  },
];

const CAUSES = [
  { name: "Emergency Food Relief", raised: 89, donors: 1247 },
  { name: "Education for All", raised: 76, donors: 892 },
  { name: "Healthcare Access", raised: 92, donors: 1456 },
  { name: "Disaster Relief", raised: 64, donors: 734 },
];

/* ---------------- helpers ---------------- */
function SmallStars({ n = 5 }: { n?: number }) {
  return (
    <div className="flex items-center gap-1 text-yellow-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < n ? "opacity-100" : "opacity-30"}`} />
      ))}
    </div>
  );
}

function SoftCounter({ n }: { n: number }) {
  // gentle counter
  const [val, setVal] = useState(0);
  useEffect(() => {
    let mounted = true;
    let t = 0;
    const step = Math.max(1, Math.floor(n / 30));
    const id = setInterval(() => {
      t += step;
      if (!mounted) return;
      if (t >= n) {
        setVal(n);
        clearInterval(id);
      } else {
        setVal(t);
      }
    }, 30);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [n]);
  return <span>{val.toLocaleString()}</span>;
}

/* ---------------- Section reveal (very subtle) ---------------- */
function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---------------- main ---------------- */
export default function HandcraftedLandingWithGradient() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];
  const baseSpeed = 60; // pixels per second
  const duration = trackWidth ? (trackWidth / 2) / baseSpeed : 30;

  // floaty motion for decorative shapes (mouse parallax)
  useEffect(() => {
    const id = setInterval(() => setTestimonialIndex((i) => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (!bgRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      // subtle transform on background container
      bgRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 to-white text-slate-900">
      {/* Decorative layered gradient + shapes (behind content) */}
      <div
        ref={bgRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{ transition: "transform 0.15s ease-out" }}
      >
        {/* base soft gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50 via-transparent to-pink-50 opacity-70 mix-blend-multiply" />

        {/* radial glows */}
        <div className="absolute left-[-10%] top-[-10%] w-96 h-96 rounded-full bg-gradient-to-br from-purple-200/40 to-pink-200/10 blur-3xl opacity-80" />
        <div className="absolute right-[-8%] top-20 w-72 h-72 rounded-full bg-gradient-to-br from-emerald-200/30 to-cyan-200/10 blur-3xl opacity-70" />
        <div className="absolute left-8 bottom-[-10%] w-80 h-80 rounded-full bg-gradient-to-br from-yellow-200/30 to-orange-200/10 blur-3xl opacity-65" />

        {/* subtle diagonal stripe overlay */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.02" />
              <stop offset="50%" stopColor="#fff" stopOpacity="0.01" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.01" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#g)" />
        </svg>
      </div>

      {/* page */}
      <header className="relative z-20">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg border border-slate-200 grid place-items-center font-semibold text-indigo-700 bg-white/80 shadow-sm">GW</div>
            <div>
              <div className="font-semibold">GoodWorks</div>
              <div className="text-xs text-slate-500">Trusted donations — locally.</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-700">
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#causes" className="hover:text-slate-900">Causes</a>
            <a href="#stories" className="hover:text-slate-900">Stories</a>
            <a href="#help" className="hover:text-slate-900">Help</a>
            <Button onClick={() => (window.location.href = "/dashboard")} className="ml-2">Open Dashboard</Button>
          </nav>

          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* mobile nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden max-w-6xl mx-auto px-4"
            >
              <div className="bg-white rounded-lg border p-4 shadow-sm">
                <a className="block py-2" href="#features">Features</a>
                <a className="block py-2" href="#causes">Causes</a>
                <a className="block py-2" href="#stories">Stories</a>
                <a className="block py-2" href="#help">Help</a>
                <div className="pt-3">
                  <Button onClick={() => (window.location.href = "/dashboard")} className="w-full">Open Dashboard</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="relative z-20">
        {/* hero */}
        <section className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
              Give simply. Track honestly.
            </h1>
            <p className="mt-4 text-slate-700 max-w-xl">
              GoodWorks is a web-first donation platform built for people — donors, volunteers and NGOs. No frills, clear steps: donate, schedule pickup, receive confirmation, and download receipts.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => (window.location.href = "/dashboard")} className="flex items-center gap-2 shadow-md">
                Open Dashboard <ArrowRight className="w-4 h-4" />
              </Button>

              <Button variant="outline" onClick={() => window.scrollTo({ top: 720, behavior: "smooth" })}>
                See how it works
              </Button>
            </div>

            <div className="mt-6 text-sm text-slate-500">
              <div>Rated <span className="font-semibold text-slate-700">4.8</span> by donors like you</div>
              <div className="mt-2">Help: <a className="text-indigo-600">support@goodworks.example</a> · Mon–Sat, 9am–6pm</div>
            </div>

            {/* quick snapshot cards */}
            <div className="mt-8 grid grid-cols-3 gap-3 max-w-sm">
              <div className="bg-white/80 backdrop-blur rounded-lg border p-3 text-center shadow-sm">
                <div className="text-xs text-slate-500">Donations</div>
                <div className="font-semibold text-lg"><SoftCounter n={Math.floor(IMPACT_STATS.totalDonations / 100000)} />L+</div>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-lg border p-3 text-center shadow-sm">
                <div className="text-xs text-slate-500">Lives</div>
                <div className="font-semibold text-lg"><SoftCounter n={Math.floor(IMPACT_STATS.livesImpacted / 1000)} />K+</div>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-lg border p-3 text-center shadow-sm">
                <div className="text-xs text-slate-500">NGOs</div>
                <div className="font-semibold text-lg">{IMPACT_STATS.activeNGOs}+</div>
              </div>
            </div>
          </div>

          {/* subtle right column card stack */}
          <div className="space-y-4">
            <Card className="transform -translate-y-2">
              <CardHeader>
                <CardTitle className="text-lg">Recent confirmations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">Seva Foundation</div>
                    <div className="text-xs text-slate-500">Clothes donation — confirmed</div>
                  </div>
                  <div className="text-xs text-slate-500">2 days ago</div>
                </div>

                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">Local Kitchen</div>
                    <div className="text-xs text-slate-500">Food kits scheduled</div>
                  </div>
                  <div className="text-xs text-slate-500">Today</div>
                </div>

                <div className="text-xs text-slate-500">Tip: after confirmation you can download a receipt from your dashboard.</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-50 border">
              <CardHeader>
                <CardTitle className="text-lg">Top causes nearby</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {CAUSES.map((c) => (
                    <div key={c.name} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-slate-500">Supported by neighbours</div>
                      </div>
                      <div className="w-36">
                        <Progress value={c.raised} className="h-2" />
                        <div className="text-xs text-slate-500 mt-1">{c.raised}% · {c.donors} donors</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1">How donations work</Button>
              <Button variant="outline" className="flex-1" onClick={() => (window.location.href = "/dashboard")}>Open Dashboard</Button>
            </div>
          </div>
        </section>

        {/* features */}
        <section id="features" className="max-w-6xl mx-auto px-6 py-14">
          <Reveal>
            <h2 className="text-2xl font-bold mb-4">What you get</h2>
            <p className="text-slate-600 mb-8 max-w-2xl">We designed GoodWorks to avoid jargon. These are the practical things you'll actually use.</p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURES.map((f) => (
                <Card key={f.title} className="h-full">
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-indigo-50 grid place-items-center text-indigo-700">{f.icon}</div>
                      <div>
                        <div className="font-semibold">{f.title}</div>
                        <div className="text-sm text-slate-500 mt-1">{f.desc}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Reveal>
        </section>
<section id="stories" className="max-w-6xl mx-auto px-6 py-14">
          <Reveal>
            <h2 className="text-2xl font-bold mb-6">Voices from our community</h2>

            {/* carousel viewport */}
            <div className="relative overflow-hidden rounded-lg">
              {/* motion track — duplicated items for seamless loop */}
              <motion.div
                ref={trackRef}
                className="flex gap-6 items-stretch py-6"
                // animate from 0 to -halfWidth and loop
                animate={
                  trackWidth
                    ? { x: [-0, -(trackWidth / 2)] }
                    : { x: 0 }
                }
                transition={
                  trackWidth
                    ? { duration, ease: "linear", repeat: Infinity }
                    : { duration: 1 }
                }
                style={{ willChange: "transform" }}
              >
                {doubled.map((t, i) => (
                  <Card key={`${t.name}-${i}`} className="min-w-[320px] max-w-[320px] flex-shrink-0">
                    <CardContent>
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarFallback className="bg-indigo-600">{t.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{t.name}</div>
                          <div className="text-xs text-slate-500">{t.role}</div>
                          <div className="mt-2 text-sm text-slate-700 italic">“{t.quote}”</div>
                          <div className="mt-3"><SmallStars n={t.rating} /></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>

              {/* subtle left/right fading masks to soften edges */}
              <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white/100 to-white/0 opacity-90" />
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white/100 to-white/0 opacity-90" />
            </div>
          </Reveal>
        </section>

        {/* small FAQ / support */}
        <section id="help" className="max-w-6xl mx-auto px-6 py-12">
          <Reveal>
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Questions?</h3>
                  <p className="text-sm text-slate-500 mt-1">We keep support simple — email or chat during office hours.</p>
                  <div className="text-sm text-slate-600 mt-3">support@goodworks.example · Mon–Sat, 9am–6pm</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-500">Prefer a quick guide?</div>
                  <Button variant="outline" className="mt-3" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Read quick start</Button>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      {/* footer */}
      <footer className="relative z-20 max-w-6xl mx-auto px-6 py-8 text-sm text-slate-600">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-semibold">GoodWorks</div>
            <div className="text-xs">Made with ❤️ by a small team — built for people who actually donate.</div>
          </div>

          <div className="flex items-center gap-6">
            <div>© {new Date().getFullYear()}</div>
            <div className="text-xs">Terms · Privacy · Contact</div>
          </div>
        </div>
      </footer>
    </div>
  );
}