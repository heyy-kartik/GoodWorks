"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarButton,
} from "@/components/ui/resizable-navbar";
import React, { useEffect, useRef, useState } from "react";
import { Heart, Shield, Users, ArrowRight, Star, Eye } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

/**
 * HandcraftedLandingWithGradient.tsx
 
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
  {
    name: "Arun Patel",
    role: "Donor, Ahmedabad",
    rating: 5,
    quote: "Easy to use, quick confirmation and helpful receipts for tax time.",
    avatar: "AP",
  },
  {
    name: "Sneha Rao",
    role: "Volunteer, Bangalore",
    rating: 5,
    quote: "Great platform for running local drives — saved us so much time.",
    avatar: "SR",
  },
  {
    name: "Vikram Singh",
    role: "NGO Volunteer, Lucknow",
    rating: 4,
    quote: "Smooth coordination with donors and clear pickup slots.",
    avatar: "VS",
  },
  {
    name: "Kavita Mehta",
    role: "Teacher, Kolkata",
    rating: 5,
    quote:
      "We used this for school supply drives — parents loved the simplicity.",
    avatar: "KM",
  },
  {
    name: "Rohit Deshmukh",
    role: "Donor, Pune",
    rating: 5,
    quote:
      "Transparent updates and receipts made me trust the platform immediately.",
    avatar: "RD",
  },
  {
    name: "Nisha Gupta",
    role: "Donor, Jaipur",
    rating: 4,
    quote: "Pickup scheduling worked well and the volunteers were punctual.",
    avatar: "NG",
  },
  {
    name: "Sahil Verma",
    role: "Corporate CSR, Gurgaon",
    rating: 5,
    quote:
      "Our CSR drives have become more streamlined; reporting is excellent.",
    avatar: "SV",
  },
  {
    name: "Leena Kapoor",
    role: "Donor, Chandigarh",
    rating: 5,
    quote:
      "I love the local campaigns feature — it's great to see neighborhood drives.",
    avatar: "LK",
  },
  {
    name: "Praveen Nair",
    role: "Volunteer, Kochi",
    rating: 5,
    quote: "The platform helped us organize disaster-relief donations quickly.",
    avatar: "PN",
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
        <Star
          key={i}
          className={`w-4 h-4 ${i < n ? "opacity-100" : "opacity-30"}`}
        />
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
function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
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
  // Navigation items for the navbar
  const navItems = [
    { name: "Features", link: "#features" },
    { name: "Causes", link: "#causes" },
    { name: "Stories", link: "#stories" },
    { name: "Help", link: "#help" },
  ];

  // Mobile nav state
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const bgRef = useRef<HTMLDivElement | null>(null);

  // carousel refs for width measuring
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [trackWidth, setTrackWidth] = useState(0);

  // duplicated array for seamless loop
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];

  // speed control
  const baseSpeed = 60; // pixels per second
  const duration = trackWidth ? trackWidth / 2 / baseSpeed : 30;

  // subtle background parallax with mouse
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (!bgRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      bgRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  // measure track width once mounted & on resize
  useEffect(() => {
    function measure() {
      if (!trackRef.current) {
        setTrackWidth(0);
        return;
      }
      // scrollWidth of the whole track (contains doubled items)
      const w = trackRef.current.scrollWidth;
      setTrackWidth(w);
    }
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [doubled.length]);

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
        <svg
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
        >
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
      <Navbar className="fixed top-0 ">
        <NavBody>
          {/* Logo */}
          <div className="flex items-center gap-3 backdrop-blur-lg">
            <div className="w-10 h-10 rounded-lg border border-slate-200 grid place-items-center font-semibold text-indigo-700 bg-white/80 shadow-sm">
              GW
            </div>
            <div>
              <div className="font-semibold">GoodWorks </div>
              <div className="text-xs text-slate-500">
                Trusted donations — locally.
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <NavItems items={navItems} />

          {/* CTA Button */}
          <NavbarButton
            onClick={() => (window.location.href = "/dashboard")}
            variant="primary"
          >
            Open Dashboard
          </NavbarButton>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            {/* Mobile Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg border border-slate-200 grid place-items-center font-semibold text-indigo-700 bg-white/80 shadow-sm">
                GW
              </div>
              <div>
                <div className="font-semibold">GoodWorks</div>
                <div className="text-xs text-slate-500">
                  Trusted donations — locally.
                </div>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <MobileNavToggle
              isOpen={isMobileNavOpen}
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            />
          </MobileNavHeader>

          {/* Mobile Menu */}
          <MobileNavMenu
            isOpen={isMobileNavOpen}
            onClose={() => setIsMobileNavOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                className="block py-2 text-slate-700 hover:text-indigo-600 transition-colors"
                onClick={() => setIsMobileNavOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="pt-4 border-t border-slate-200">
              <NavbarButton
                onClick={() => {
                  window.location.href = "/dashboard";
                  setIsMobileNavOpen(false);
                }}
                variant="primary"
                className="w-full"
              >
                Open Dashboard
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      <main className="relative z-20 m-10">
        {/* Hero Image Section */}
        <section className="max-w-6xl mx-auto px-6 py-8">
          <Reveal>
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-100 to-slate-200 border shadow-sm">
              {/* Background pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/80 via-white/40 to-pink-50/80" />

              {/* Content overlay */}
              <div className="relative z-10 flex items-center justify-between p-8 md:p-12 min-h-[320px]">
                <div className="max-w-2xl">
                  <h2 className="text-2xl md:text-4xl font-bold mb-4 text-slate-800">
                    Every donation creates hope
                  </h2>
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                    Thousands of children and families in our communities wait
                    for basic necessities. Your contribution—whether clothes,
                    food, or funds—directly impacts lives and builds stronger
                    communities.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button
                      onClick={() => (window.location.href = "/dashboard")}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3"
                    >
                      Start Donating Today
                    </Button>
                    <Button
                      variant="outline"
                      className="border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-3"
                      onClick={() =>
                        window.scrollTo({ top: 800, behavior: "smooth" })
                      }
                    >
                      See Our Impact
                    </Button>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="hidden lg:flex items-center justify-center relative">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-indigo-100 to-pink-100 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-white/80 flex items-center justify-center shadow-lg">
                      <Heart className="w-16 h-16 text-indigo-600" />
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-pink-200 rounded-full animate-pulse" />
                  <div className="absolute -bottom-6 -left-6 w-6 h-6 bg-indigo-200 rounded-full animate-pulse delay-500" />
                  <div className="absolute top-8 -left-8 w-4 h-4 bg-yellow-200 rounded-full animate-pulse delay-1000" />
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* hero */}
        <section className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
              Give simply. Track honestly.
            </h1>
            <p className="mt-4 text-slate-700 max-w-xl">
              GoodWorks is a web-first donation platform built for people —
              donors, volunteers and NGOs. No frills, clear steps: donate,
              schedule pickup, receive confirmation, and download receipts.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                onClick={() => (window.location.href = "/dashboard")}
                className="flex items-center gap-2 shadow-md"
              >
                Open Dashboard <ArrowRight className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  window.scrollTo({ top: 720, behavior: "smooth" })
                }
              >
                See how it works
              </Button>
            </div>

            <div className="mt-6 text-sm text-slate-500">
              <div>
                Rated <span className="font-semibold text-slate-700">4.8</span>{" "}
                by donors like you
              </div>
              <div className="mt-2">
                Help:{" "}
                <a className="text-indigo-600">support@goodworks.example</a> ·
                Mon–Sat, 9am–6pm
              </div>
            </div>

            {/* quick snapshot cards */}
            <div className="mt-8 grid grid-cols-3 gap-3 max-w-sm">
              <div className="bg-white/80 backdrop-blur rounded-lg border p-3 text-center shadow-sm">
                <div className="text-xs text-slate-500">Donations</div>
                <div className="font-semibold text-lg">
                  <SoftCounter
                    n={Math.floor(IMPACT_STATS.totalDonations / 100000)}
                  />
                  L+
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-lg border p-3 text-center shadow-sm">
                <div className="text-xs text-slate-500">Lives</div>
                <div className="font-semibold text-lg">
                  <SoftCounter
                    n={Math.floor(IMPACT_STATS.livesImpacted / 1000)}
                  />
                  K+
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-lg border p-3 text-center shadow-sm">
                <div className="text-xs text-slate-500">NGOs</div>
                <div className="font-semibold text-lg">
                  {IMPACT_STATS.activeNGOs}+
                </div>
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
                    <div className="text-xs text-slate-500">
                      Clothes donation — confirmed
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">2 days ago</div>
                </div>

                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">Local Kitchen</div>
                    <div className="text-xs text-slate-500">
                      Food kits scheduled
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">Today</div>
                </div>

                <div className="text-xs text-slate-500">
                  Tip: after confirmation you can download a receipt from your
                  dashboard.
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-50 border">
              <CardHeader>
                <CardTitle className="text-lg">Top causes nearby</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {CAUSES.map((c) => (
                    <div
                      key={c.name}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-slate-500">
                          Supported by neighbours
                        </div>
                      </div>
                      <div className="w-36">
                        <Progress value={c.raised} className="h-2" />
                        <div className="text-xs text-slate-500 mt-1">
                          {c.raised}% · {c.donors} donors
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1">
                How donations work
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => (window.location.href = "/dashboard")}
              >
                Open Dashboard
              </Button>
            </div>
          </div>
        </section>

        {/* features */}
        <section id="features" className="max-w-6xl mx-auto px-6 py-14">
          <Reveal>
            <h2 className="text-2xl font-bold mb-4">What you get</h2>
            <p className="text-slate-600 mb-8 max-w-2xl">
              We designed GoodWorks to avoid jargon. These are the practical
              things you&apos;ll actually use.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURES.map((f) => (
                <Card key={f.title} className="h-full">
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-indigo-50 grid place-items-center text-indigo-700">
                        {f.icon}
                      </div>
                      <div>
                        <div className="font-semibold">{f.title}</div>
                        <div className="text-sm text-slate-500 mt-1">
                          {f.desc}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Reveal>
        </section>

        {/* causes */}
        <section id="causes" className="max-w-6xl mx-auto px-6 py-14">
          <Reveal>
            <h2 className="text-2xl font-bold mb-4">Top causes nearby</h2>
            <p className="text-slate-600 mb-8 max-w-2xl">
              Support meaningful causes in your community. Join thousands of
              donors making a real difference.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {CAUSES.map((c) => (
                <Card key={c.name} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{c.name}</h3>
                      <p className="text-sm text-slate-500">
                        Supported by {c.donors} donors
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-indigo-600">
                        {c.raised}%
                      </div>
                      <div className="text-xs text-slate-500">completed</div>
                    </div>
                  </div>
                  <Progress value={c.raised} className="h-3 mb-4" />
                  <Button variant="outline" className="w-full">
                    Support This Cause
                  </Button>
                </Card>
              ))}
            </div>
          </Reveal>
        </section>

        {/* stories/testimonials */}
        <section id="stories" className="max-w-6xl mx-auto px-6 py-14">
          <Reveal>
            <h2 className="text-2xl font-bold mb-6">
              Voices from our community
            </h2>

            {/* carousel viewport */}
            <div className="relative overflow-hidden rounded-lg">
              {/* motion track — duplicated items for seamless loop */}
              <motion.div
                ref={trackRef}
                className="flex gap-6 items-stretch py-6"
                // animate from 0 to -halfWidth and loop
                animate={trackWidth ? { x: [0, -(trackWidth / 2)] } : { x: 0 }}
                transition={
                  trackWidth
                    ? { duration, ease: "linear", repeat: Infinity }
                    : { duration: 1 }
                }
                style={{ willChange: "transform" }}
              >
                {doubled.map((t, i) => (
                  <Card
                    key={`${t.name}-${i}`}
                    className="min-w-[320px] max-w-[320px] flex-shrink-0"
                  >
                    <CardContent>
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarFallback className="bg-indigo-600">
                            {t.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{t.name}</div>
                          <div className="text-xs text-slate-500">{t.role}</div>
                          <div className="mt-2 text-sm text-slate-700 italic">
                            “{t.quote}”
                          </div>
                          <div className="mt-3">
                            <SmallStars n={t.rating} />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>

              {/* subtle left/right fading masks to soften edges */}
              <div
                className="pointer-events-none absolute left-0 top-0 bottom-0 w-12"
                style={{
                  background:
                    "linear-gradient(90deg, white 0%, rgba(255,255,255,0) 100%)",
                  opacity: 0.9,
                }}
              />
              <div
                className="pointer-events-none absolute right-0 top-0 bottom-0 w-12"
                style={{
                  background:
                    "linear-gradient(270deg, white 0%, rgba(255,255,255,0) 100%)",
                  opacity: 0.9,
                }}
              />
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
                  <p className="text-sm text-slate-500 mt-1">
                    We keep support simple — email or chat during office hours.
                  </p>
                  <div className="text-sm text-slate-600 mt-3">
                    support@goodworks.example · Mon–Sat, 9am–6pm
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-500">
                    Prefer a quick guide?
                  </div>
                  <Button
                    variant="outline"
                    className="mt-3"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  >
                    Read quick start
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      {/* footer */}
      <footer className="relative z-20 w-full border-t bg-white/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md border border-slate-200 grid place-items-center font-bold text-indigo-700 bg-white/90 shadow-sm">
                  GW
                </div>
                <div>
                  <div className="font-bold text-slate-800 font-">
                    GoodWorks
                  </div>
                  <div className="text-xs text-slate-500">
                    Trusted donations — locally
                  </div>
                </div>
              </div>
              <p className="text-[15px] text-slate-600 leading-relaxed font-poppins ">
                Connecting donors with verified NGOs to create meaningful impact
                in local communities across India.
              </p>
              <div className="text-sm font-poppins text-slate-500">
                Made with <span className="text-pink-500">♥</span> by a
                dedicated team
              </div>
            </div>

            {/* Our Services */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800">Our Services</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="hover:text-indigo-600 transition-colors cursor-pointer ">
                  Item Donations
                </li>
                <li className="hover:text-indigo-600 transition-colors cursor-pointer">
                  Financial Giving
                </li>
                <li className="hover:text-indigo-600 transition-colors cursor-pointer">
                  Local Campaigns
                </li>
                <li className="hover:text-indigo-600 transition-colors cursor-pointer">
                  NGO Partnership
                </li>
                <li className="hover:text-indigo-600 transition-colors cursor-pointer">
                  Volunteer Coordination
                </li>
              </ul>
            </div>

            {/* Focus Areas */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800">Focus Areas</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="hover:text-indigo-600 transition-colors cursor-pointer">
                  Education Support
                </li>
                <li className="hover:text-indigo-600 transition-colors cursor-pointer">
                  Healthcare Access
                </li>
                <li className="hover:text-indigo-600 transition-colors cursor-pointer">
                  Food Security
                </li>
                <li className="hover:text-indigo-600 transition-colors cursor-pointer">
                  Disaster Relief
                </li>
                <li className="hover:text-indigo-600 transition-colors cursor-pointer">
                  Community Development
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800">Quick Links</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <a
                    href="/about"
                    className="hover:text-indigo-600 transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/how-it-works"
                    className="hover:text-indigo-600 transition-colors"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="/ngo-partners"
                    className="hover:text-indigo-600 transition-colors"
                  >
                    NGO Partners
                  </a>
                </li>
                <li>
                  <a
                    href="/impact"
                    className="hover:text-indigo-600 transition-colors"
                  >
                    Our Impact
                  </a>
                </li>
                <li>
                  <a
                    href="/support"
                    className="hover:text-indigo-600 transition-colors"
                  >
                    Support Center
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-slate-200 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-6">
              <a
                href="/terms"
                className="hover:text-indigo-600 transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="/privacy"
                className="hover:text-indigo-600 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="mailto:support@goodworks.example"
                className="hover:text-indigo-600 transition-colors"
              >
                Contact Us
              </a>
            </div>

            <div className="text-xs text-slate-400">
              © {new Date().getFullYear()} GoodWorks. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
