"use client";
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import React, { JSX, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  Shield,
  Users,
  ArrowRight,
  Star,
  Eye,
  Sun,
  Moon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import Image from "next/image";
import Link from "next/link";

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
  { name: "Priya Sharma", role: "Donor, Pune", rating: 5, quote: "I donated two bags of clothes. The NGO picked them up, confirmed, and I got a receipt the same week. Simple and trustworthy.", avatar: "PS" },
  { name: "Rajan Mehra", role: "Volunteer, Delhi", rating: 5, quote: "We ran a neighbourhood drive — the platform made coordination easier and the NGO reporting helped track impact.", avatar: "RM" },
  { name: "Meera Joshi", role: "Teacher, Mumbai", rating: 4, quote: "I recommended this to parents — kids loved donating toys. The team followed up politely and reliably.", avatar: "MJ" },
  { name: "Arun Patel", role: "Donor, Ahmedabad", rating: 5, quote: "Easy to use, quick confirmation and helpful receipts for tax time.", avatar: "AP" },
  { name: "Sneha Rao", role: "Volunteer, Bangalore", rating: 5, quote: "Great platform for running local drives — saved us so much time.", avatar: "SR" },
  { name: "Vikram Singh", role: "NGO Volunteer, Lucknow", rating: 4, quote: "Smooth coordination with donors and clear pickup slots.", avatar: "VS" },
  { name: "Kavita Mehta", role: "Teacher, Kolkata", rating: 5, quote: "We used this for school supply drives — parents loved the simplicity.", avatar: "KM" },
  { name: "Rohit Deshmukh", role: "Donor, Pune", rating: 5, quote: "Transparent updates and receipts made me trust the platform immediately.", avatar: "RD" },
  { name: "Nisha Gupta", role: "Donor, Jaipur", rating: 4, quote: "Pickup scheduling worked well and the volunteers were punctual.", avatar: "NG" },
  { name: "Sahil Verma", role: "Corporate CSR, Gurgaon", rating: 5, quote: "Our CSR drives have become more streamlined; reporting is excellent.", avatar: "SV" },
  { name: "Leena Kapoor", role: "Donor, Chandigarh", rating: 5, quote: "I love the local campaigns feature — it's great to see neighborhood drives.", avatar: "LK" },
  { name: "Praveen Nair", role: "Volunteer, Kochi", rating: 5, quote: "The platform helped us organize disaster-relief donations quickly.", avatar: "PN" },
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
    <div className="flex items-center gap-1 text-yellow-400" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < n ? "opacity-100" : "opacity-30"}`} />
      ))}
    </div>
  );
}

function SoftCounter({ n }: { n: number }) {
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

/* ---------------- Theme toggle ---------------- */
function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const dark = resolvedTheme === "dark";
  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="p-2 rounded-full bg-white/90 dark:bg-slate-800 shadow border border-slate-200 dark:border-slate-700"
      title={dark ? "Switch to light" : "Switch to dark"}
    >
      {dark ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
    </button>
  );
}

/* ---------------- main ---------------- */
export default function HandcraftedLandingWithGradient(): JSX.Element {
  const router = useRouter();

  // central handler for Sign in -> pushes to /sign-in
  const goSignIn = () => {
    router.push("/sign-in");
  };

  const navItems = [
    { name: "Features", link: "#features" },
    { name: "Causes", link: "#causes" },
    { name: "Stories", link: "#stories" },
    { name: "Help", link: "#help" },
  ];

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const bgRef = useRef<HTMLDivElement | null>(null);

  // carousel
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];
  const baseSpeed = 60;
  const halfWidth = trackWidth ? trackWidth / 2 : 0;
  const duration = halfWidth ? Math.max(10, halfWidth / baseSpeed) : 30;
  const [paused, setPaused] = useState(false);

  // parallax
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (!bgRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 18;
      const y = (e.clientY / window.innerHeight - 0.5) * 12;
      bgRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  // measure track
  useEffect(() => {
    function measure() {
      if (!trackRef.current) {
        setTrackWidth(0);
        return;
      }
      setTrackWidth(trackRef.current.scrollWidth);
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
      {/* theme toggle in top-right */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* decorative background */}
      <div ref={bgRef} aria-hidden className="pointer-events-none fixed inset-0 -z-10" style={{ transition: "transform 0.12s ease-out" }}>
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50 via-transparent to-pink-50 opacity-70 mix-blend-multiply" />
        <div className="absolute left-[-12%] top-[-12%] w-96 h-96 rounded-full bg-gradient-to-br from-purple-200/40 to-pink-200/10 blur-3xl opacity-85" />
        <div className="absolute right-[-8%] top-20 w-72 h-72 rounded-full bg-gradient-to-br from-emerald-200/30 to-cyan-200/10 blur-3xl opacity-70" />
        <div className="absolute left-8 bottom-[-10%] w-80 h-80 rounded-full bg-gradient-to-br from-yellow-200/30 to-orange-200/10 blur-3xl opacity-65" />
      </div>

      {/* ---------- Fixed, responsive Navbar (Clerk-ready) ---------- */}
      <Navbar className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 w-[min(98%,1200px)]">
        <NavBody className="flex items-center justify-between gap-4 bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-slate-200/60 px-4 py-3">
          {/* Left: logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg border border-slate-200 grid place-items-center font-semibold text-indigo-700 bg-white shadow-sm">
              GW
            </div>
            <div className="hidden sm:block">
              <div className="font-semibold text-slate-900">GoodWorks</div>
              <div className="text-xs text-slate-500">Trusted donations — locally.</div>
            </div>
          </div>

          {/* Center: nav links (hidden on small screens) */}
          <div className="hidden md:flex items-center gap-6">
            <NavItems items={navItems} className="flex items-center gap-6 text-sm text-slate-700" />
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-3">
            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-3">
              {/* Show Sign in only for SignedOut users */}
              <SignedOut>
                {/* Next Link wrapping the Button (no legacyBehavior) */}
                <Link href="/sign-in" className="inline-block">
                  <Button className="px-4 py-2">Sign in</Button>
                </Link>
              </SignedOut>

              <SignedIn>
                <NavbarButton onClick={() => (window.location.href = "/dashboard")} variant="primary" className="px-4 py-2">
                  Open Dashboard
                </NavbarButton>

                <div className="ml-1">
                  <ClerkLoaded>
                    <UserButton afterSignOutUrl="/" />
                  </ClerkLoaded>
                  <ClerkLoading>
                    <div className="w-9 h-9 rounded-full bg-slate-100" />
                  </ClerkLoading>
                </div>
              </SignedIn>
            </div>

            {/* Mobile menu toggle (visible on mobile) */}
            <div className="md:hidden">
              <MobileNavToggle
                isOpen={isMobileNavOpen}
                onClick={() => setIsMobileNavOpen((s) => !s)}
                aria-label={isMobileNavOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileNavOpen}
              />
            </div>
          </div>
        </NavBody>

        {/* Mobile navigation area */}
        <MobileNav>
          <MobileNavHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg border border-slate-200 grid place-items-center font-semibold text-indigo-700 bg-white shadow-sm">GW</div>
              <div>
                <div className="font-semibold">GoodWorks</div>
                <div className="text-xs text-slate-500">Trusted donations — locally.</div>
              </div>
            </div>

            {/* Toggle */}
            <MobileNavToggle isOpen={isMobileNavOpen} onClick={() => setIsMobileNavOpen((s) => !s)} />
          </MobileNavHeader>

          <MobileNavMenu isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)}>
            <div className="py-2">
              {navItems.map((item, idx) => (
                <a key={idx} href={item.link} className="block py-2 text-slate-700 hover:text-indigo-600 transition-colors" onClick={() => setIsMobileNavOpen(false)}>
                  {item.name}
                </a>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 mt-3 space-y-3">
              {/* Show mobile Sign in only when SignedOut */}
              <SignedOut>
                <div className="flex gap-2">
                  <Button
                    className="w-full"
                    onClick={() => {
                      setIsMobileNavOpen(false);
                      goSignIn();
                    }}
                  >
                    Sign in
                  </Button>
                </div>
              </SignedOut>

              <SignedIn>
                <NavbarButton
                  onClick={() => {
                    setIsMobileNavOpen(false);
                    window.location.href = "/dashboard";
                  }}
                  variant="primary"
                  className="w-full"
                >
                  Open Dashboard
                </NavbarButton>

                <div className="flex items-center gap-2">
                  <ClerkLoaded>
                    <UserButton afterSignOutUrl="/" />
                  </ClerkLoaded>
                  <ClerkLoading>
                    <div className="w-9 h-9 rounded-full bg-slate-100" />
                  </ClerkLoading>
                </div>
              </SignedIn>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* rest of page (hero, features, causes, testimonials, help, footer) */}
      <main className="relative z-20 mt-28">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 py-8">
          <div className="relative rounded-2xl overflow-hidden border shadow-sm">
            <Image
              src="/poor-img.jpg"
              alt="Child receiving a donation"
              width={1920}
              height={360}
              className="w-full h-[360px] object-cover object-center brightness-[0.65] dark:brightness-[0.5]"
            />
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-4xl mx-auto px-6 text-white">
                <h1 className="text-3xl md:text-5xl font-extrabold leading-tight drop-shadow-lg">Being a life-saver for someone</h1>
                <p className="mt-4 text-lg max-w-2xl">Need help? Every small donation counts. Contribute food, clothes, or money and bring a smile to someone’s face today.</p>
                <div className="mt-6 flex gap-4">
                  <Button className="bg-rose-600 hover:bg-rose-700 text-white shadow-lg">Donate Now</Button>
                  <Button variant="outline" className="border-white text-black/90 hover:bg-white/10">Discover</Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* core content */}
        <section className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Give simply. Track honestly.</h2>
            <p className="mt-4 text-slate-700 max-w-xl">GoodWorks is a web-first donation platform built for people — donors, volunteers and NGOs. No frills, clear steps: donate, schedule pickup, receive confirmation, and download receipts.</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => (window.location.href = "/dashboard")} className="flex items-center gap-2 shadow-md">Open Dashboard <ArrowRight className="w-4 h-4" /></Button>
              <Button variant="outline" onClick={() => window.scrollTo({ top: 720, behavior: "smooth" })}>See how it works</Button>
            </div>

            <div className="mt-6 text-sm text-slate-500">
              <div>Rated <span className="font-semibold text-slate-700">4.8</span> by donors like you</div>
              <div className="mt-2">Help: <a className="text-indigo-600" href="mailto:support@goodworks.example">support@goodworks.example</a> · Mon–Sat, 9am–6pm</div>
            </div>

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

          <div className="space-y-4">
            <Card className="transform -translate-y-2">
              <CardHeader><CardTitle className="text-lg">Recent confirmations</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <div><div className="font-medium">Seva Foundation</div><div className="text-xs text-slate-500">Clothes donation — confirmed</div></div>
                  <div className="text-xs text-slate-500">2 days ago</div>
                </div>
                <div className="flex justify-between">
                  <div><div className="font-medium">Local Kitchen</div><div className="text-xs text-slate-500">Food kits scheduled</div></div>
                  <div className="text-xs text-slate-500">Today</div>
                </div>
                <div className="text-xs text-slate-500">Tip: after confirmation you can download a receipt from your dashboard.</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-50 border">
              <CardHeader><CardTitle className="text-lg">Top causes nearby</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {CAUSES.map((c) => (
                    <div key={c.name} className="flex items-center justify-between">
                      <div><div className="font-medium">{c.name}</div><div className="text-xs text-slate-500">Supported by neighbours</div></div>
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
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">What you get</h2>
            <p className="text-slate-600">We designed GoodWorks to avoid jargon. These are the practical things you&apos;ll actually use.</p>
          </div>

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
        </section>

        {/* causes */}
        <section id="causes" className="max-w-6xl mx-auto px-6 py-14">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Top causes nearby</h2>
            <p className="text-slate-600">Support meaningful causes in your community.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {CAUSES.map((c) => (
              <Card key={c.name}>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{c.name}</h3>
                      <p className="text-xs text-slate-500">Supported by {c.donors} donors</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-indigo-600">{c.raised}%</div>
                      <div className="text-xs text-slate-500">completed</div>
                    </div>
                  </div>
                  <Progress value={c.raised} className="h-3 mb-4" />
                  <Button variant="outline" className="w-full">Support This Cause</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* testimonials */}
        <section id="stories" className="max-w-6xl mx-auto px-6 py-14">
          <div className="mb-6"><h2 className="text-2xl font-bold">Voices from our community</h2></div>

          <div className="relative overflow-hidden rounded-lg" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            <motion.div
              ref={trackRef}
              className="flex gap-6 items-stretch py-6"
              animate={paused ? {} : (trackWidth ? { x: [0, -(trackWidth / 2)] } : { x: 0 })}
              transition={trackWidth && !paused ? { duration, ease: "linear", repeat: Infinity } : undefined}
              style={{ willChange: "transform" }}
            >
              {doubled.map((t, i) => (
                <Card key={`${t.name}-${i}`} className="min-w-[320px] max-w-[320px] flex-shrink-0">
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <Avatar><AvatarFallback className="bg-indigo-600">{t.avatar}</AvatarFallback></Avatar>
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

            {/* soft masks */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12" style={{ background: "linear-gradient(90deg, white 0%, rgba(255,255,255,0) 100%)", opacity: 0.92 }} />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12" style={{ background: "linear-gradient(270deg, white 0%, rgba(255,255,255,0) 100%)", opacity: 0.92 }} />
          </div>
        </section>

        {/* help */}
        <section id="help" className="max-w-6xl mx-auto px-6 py-12">
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
        </section>
      </main>

      <footer className="relative z-20 w-full border-t bg-white/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md border grid place-items-center font-bold text-indigo-700 bg-white/90 shadow-sm">GW</div>
                <div>
                  <div className="font-bold text-slate-800">GoodWorks</div>
                  <div className="text-xs text-slate-500">Trusted donations — locally</div>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Connecting donors with verified NGOs to create meaningful impact in local communities across India.</p>
              <div className="text-sm text-slate-500">Made with <span className="text-pink-500">♥</span> by a dedicated team</div>
            </div>

            <div>
              <h3 className="font-bold text-slate-800">Our Services</h3>
              <ul className="space-y-2 text-sm text-slate-600 mt-3">
                <li className="hover:text-indigo-600 transition-colors cursor-pointer">Item Donations</li>
                <li className="hover:text-indigo-600 transition-colors cursor-pointer">Financial Giving</li>
                <li className="hover:text-indigo-600 transition-colors cursor-pointer">Local Campaigns</li>
                <li className="hover:text-indigo-600 transition-colors cursor-pointer">NGO Partnership</li>
                <li className="hover:text-indigo-600 transition-colors cursor-pointer">Volunteer Coordination</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800">Focus Areas</h3>
              <ul className="space-y-2 text-sm text-slate-600 mt-3">
                <li className="hover:text-indigo-600 transition-colors cursor-pointer">Education Support</li>
                <li className="hover:text-indigo-600 transition-colors cursor-pointer">Healthcare Access</li>
                <li className="hover:text-indigo-600 transition-colors cursor-pointer">Food Security</li>
                <li className="hover:text-indigo-600 transition-colors cursor-pointer">Disaster Relief</li>
                <li className="hover:text-indigo-600 transition-colors cursor-pointer">Community Development</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800">Quick Links</h3>
              <ul className="space-y-2 text-sm text-slate-600 mt-3">
                <li><a href="/about" className="hover:text-indigo-600 transition-colors">About Us</a></li>
                <li><a href="/how-it-works" className="hover:text-indigo-600 transition-colors">How It Works</a></li>
                <li><a href="/ngo-partners" className="hover:text-indigo-600 transition-colors">NGO Partners</a></li>
                <li><a href="/impact" className="hover:text-indigo-600 transition-colors">Our Impact</a></li>
                <li><a href="/support" className="hover:text-indigo-600 transition-colors">Support Center</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-6">
              <a href="/terms" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
              <a href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
              <a href="mailto:support@goodworks.example" className="hover:text-indigo-600 transition-colors">Contact Us</a>
            </div>
            <div className="text-xs text-slate-400">© {new Date().getFullYear()} GoodWorks. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}