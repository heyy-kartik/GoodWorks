"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  PlusCircle,
  Gift,
  CreditCard,
  Users,
  Bell,
  Search,
  ArrowRight,
  Clock,
  FileText,
  MapPin,
} from "lucide-react";

import { SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";


/* ---------------- Types & Local dataset ---------------- */

type Status = "Created" | "Accepted" | "In Progress" | "Completed" | "Rejected";

type MyDonation = {
  id: string;
  ngoName: string;
  type: string;
  qty: string;
  status: Status;
  createdAt: string;
  receiptUrl?: string | null;
  timeline?: { status: Status; at: string; note?: string }[];
};

type Campaign = { id: string; title: string; progress: number; location?: string };

const STORAGE_KEY = "demo_donations_v1";

const MOCK_DONOR = { id: "donor_101", name: "Venkatesh", initials: "V", email: "venkatesh@example.com" };

const seedDonations: MyDonation[] = [
  { id: "m1", ngoName: "Seva Foundation", type: "Cloth", qty: "3 bags", status: "Completed", createdAt: "2025-09-05", receiptUrl: "/receipts/m1.pdf", timeline: [{ status: "Created", at: "2025-09-01" }, { status: "Accepted", at: "2025-09-02" }, { status: "Completed", at: "2025-09-05" }] },
  { id: "m2", ngoName: "CareForAll", type: "Food", qty: "15 meals", status: "In Progress", createdAt: "2025-09-12", timeline: [{ status: "Created", at: "2025-09-12" }, { status: "Accepted", at: "2025-09-13" }, { status: "In Progress", at: "2025-09-14" }] },
  { id: "m3", ngoName: "HelpHands", type: "Money", qty: "₹500", status: "Created", createdAt: "2025-09-20", timeline: [{ status: "Created", at: "2025-09-20" }] },
];

const seedCampaigns: Campaign[] = [
  { id: "s1", title: "Winter Blanket Drive", progress: 48, location: "Pune" },
  { id: "s2", title: "School Supplies Donation", progress: 22, location: "Pimpri-Chinchwad" },
];

/* ---------------- Small UI helpers ---------------- */

function StatusPill({ status }: { status: Status }) {
  const map: Record<Status, string> = {
    Created: "bg-yellow-100 text-yellow-800",
    Accepted: "bg-blue-100 text-blue-800",
    "In Progress": "bg-indigo-100 text-indigo-800",
    Completed: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
  };
  return <Badge className={cn("px-2 py-1 text-xs rounded-md", map[status])}>{status}</Badge>;
}

/* ---------------- Utility: save/load localStorage ---------------- */

function loadDonations(): MyDonation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedDonations;
    return JSON.parse(raw);
  } catch {
    return seedDonations;
  }
}

function saveDonations(list: MyDonation[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {}
}

/* ---------------- Component ---------------- */


export default function DonorLandingPretty() {
  const [user] = useState(MOCK_DONOR);
  const [donations, setDonations] = useState<MyDonation[]>(() => {
    if (typeof window === "undefined") return seedDonations;
    return loadDonations();
  });
  const [campaigns] = useState<Campaign[]>(seedCampaigns);

  // search & filter
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"All" | "Pending" | "Completed" | "Money">("All");

  // modal & drawer
  const [makeOpen, setMakeOpen] = useState(false);
  const [detail, setDetail] = useState<MyDonation | null>(null);

  // make donation form (multi-step UI simplified)
  const [formStep, setFormStep] = useState(1);
  const [form, setForm] = useState<{ type: string; qty: string; ngo: string; notes?: string }>({ type: "Cloth", qty: "", ngo: "Seva Foundation", notes: "" });          

  // computed stats
  const totalDonations = donations.length;
  const completedCount = donations.filter(d => d.status === "Completed").length;
  const itemsDonated = donations.filter(d => d.type !== "Money").length;
  const moneyDonated = donations.filter(d => d.type === "Money").reduce((s, d) => {
    // parse rupee amounts if present like "₹500"
    const n = Number((d.qty || "").replace(/[₹, ]/g, "")) || 0;
    return s + n;
  }, 0);

  // Persist donations whenever changed
  useEffect(() => {
    saveDonations(donations);
  }, [donations]);

  // Demo life-cycle: when a new donation with status Created is added, auto-advance it:
  useEffect(() => {
    // find items that are Created and have no auto timers set
    const created = donations.filter(d => d.status === "Created");
    created.forEach((d, idx) => {
      // schedule advance only once per item (we'll attach a temporary timeline note on advance so it won't double-run)
      const alreadyScheduled = d.timeline && d.timeline.some(t => t.note === "auto-scheduled");
      if (!alreadyScheduled) {
        // mark timeline with a placeholder so we know it's scheduled
        setDonations(prev => prev.map(p => p.id === d.id ? { ...p, timeline: [...(p.timeline || []), { status: d.status, at: p.createdAt, note: "auto-scheduled" }] } : p));
        // Advance flow: Accepted after 4s, In Progress after 6s, Completed after 10s
        setTimeout(() => advanceStatusLocal(d.id, "Accepted", "NGO accepted donation"), 4000 + idx * 1000);
        setTimeout(() => advanceStatusLocal(d.id, "In Progress", "Pickup started"), 7000 + idx * 1000);
        setTimeout(() => advanceStatusLocal(d.id, "Completed", "Donation received & processed"), 11000 + idx * 1000);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [donations]);

  function advanceStatusLocal(id: string, to: Status, note?: string) {
    setDonations(prev => prev.map(d => {
      if (d.id !== id) return d;
      const now = new Date().toISOString().slice(0, 10);
      const newTimeline = [...(d.timeline || []), { status: to, at: now, note }];
      const receiptUrl = to === "Completed" ? `/receipts/${id}.pdf` : d.receiptUrl;
      return { ...d, status: to, timeline: newTimeline, receiptUrl };
    }));
  }

  function quickCreate(type: string) {
    const newDonation: MyDonation = {
      id: `local_${Date.now()}`,
      ngoName: form.ngo,
      type,
      qty: type === "Money" ? "₹500" : type === "Cloth" ? "2 bags" : "5 meals",
      status: "Created",
      createdAt: new Date().toISOString().slice(0, 10),
      timeline: [{ status: "Created", at: new Date().toISOString().slice(0, 10) }],
    };
    setDonations(p => [newDonation, ...p]);
    // small accessible feedback
    setTimeout(() => window?.alert?.("Donation created — demo mode (local). NGO will review soon."), 200);
  }

  function openMakeFor(type?: string) {
    if (type) setForm(f => ({ ...f, type }));
    setFormStep(1);
    setMakeOpen(true);
  }

  function submitMakeForm() {
    // basic validation
    if (!form.qty.trim()) {
      window.alert("Enter quantity or amount");
      return;
    }
    const newDonation: MyDonation = {
      id: `local_${Date.now()}`,
      ngoName: form.ngo,
      type: form.type,
      qty: form.qty,
      status: "Created",
      createdAt: new Date().toISOString().slice(0, 10),
      timeline: [{ status: "Created", at: new Date().toISOString().slice(0, 10) }],
    };
    setDonations(p => [newDonation, ...p]);
    setMakeOpen(false);
    setForm({ type: "Cloth", qty: "", ngo: "Seva Foundation", notes: "" });
    setTimeout(() => window?.alert?.("Donation created — demo (local)."), 200);
  }

  function filteredList() {
    const q = query.trim().toLowerCase();
    return donations.filter(d => {
      if (filter === "Completed" && d.status !== "Completed") return false;
      if (filter === "Pending" && d.status === "Completed") return false;
      if (filter === "Money" && d.type !== "Money") return false;
      if (!q) return true;
      return (d.ngoName + " " + d.type + " " + d.qty).toLowerCase().includes(q);
    });
  }

  // pretty small components inside
  const KPI = ({ title, value, subtitle }: { title: string; value: string | number; subtitle?: string }) => (
    <div className="bg-gradient-to-br from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-800/30 p-4 rounded-lg shadow-sm hover:shadow-md transition">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
    </div>
  );

  // details drawer
  function DonationDetailDrawer({ donation, onClose }: { donation: MyDonation | null; onClose: () => void }) {
    if (!donation) return null;
    return (
      <div className="fixed inset-0 z-50 flex">
        <div className="absolute inset-0 bg-black/30" onClick={onClose} />
        <div className="ml-auto w-full sm:w-[520px] bg-white dark:bg-slate-900 h-full shadow-xl p-4 overflow-auto">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">{donation.type} • {donation.qty}</h3>
              <div className="text-sm text-muted-foreground">To {donation.ngoName} • {donation.createdAt}</div>
            </div>
            <div>
              <StatusPill status={donation.status} />
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-3">
            <div>
              <div className="text-sm font-medium">Timeline</div>
              <div className="mt-2 space-y-2">
                {(donation.timeline || []).slice().reverse().map((t, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="text-xs text-muted-foreground w-24">{t.at}</div>
                    <div>
                      <div className="font-semibold">{t.status}</div>
                      {t.note && <div className="text-sm text-muted-foreground">{t.note}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              {(donation.status === "Created" || donation.status === "Accepted") && (
                <Button onClick={() => {
                  advanceStatusLocal(donation.id, "In Progress", "Pickup scheduled (demo)");
                }}>
                  <MapPin className="w-4 h-4 mr-1" /> Schedule Pickup
                </Button>
              )}

              {donation.status === "Completed" && donation.receiptUrl && (
                <a href={donation.receiptUrl} className="inline-flex">
                  <Button variant="outline"><FileText className="w-4 h-4 mr-1" /> Download Receipt</Button>
                </a>
              )}
            </div>
          </div>

          <div className="mt-6">
            <Button variant="ghost" onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- Render ---------------- */

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback className="bg-white text-indigo-600">{user.initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-lg font-semibold">Namaste, {user.name}</div>
              <div className="text-sm opacity-90">Your impact at a glance</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white/10 px-3 py-2 rounded-full gap-2">
              <Search className="w-4 h-4 opacity-90" />
              <Input placeholder="Search donations or NGOs" value={query} onChange={(e) => setQuery(e.target.value)} className="bg-transparent border-0 p-0 focus:outline-none" />
            </div>

            <button aria-label="notifications" className="relative inline-flex items-center justify-center p-2 bg-white/10 rounded-full">
              <Bell className="w-5 h-5" />
              {/* small unread dot for demo */}
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-400 rounded-full" />
            </button>

            {/* ADDED: Theme toggle + Clerk sign-in/sign-out */}
            <div className="mt-3 flex items-center gap-3">
              <SignInButton mode="modal">
                <Button className="flex-1">Sign in</Button>
              </SignInButton>
              <SignOutButton>
                <Button variant="ghost">Sign out</Button>
              </SignOutButton>
            </div>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPI title="Total Donations" value={totalDonations} subtitle={`${moneyDonated ? `₹${moneyDonated}` : ""}`} />
          <KPI title="Completed" value={completedCount} />
          <KPI title="Items Donated" value={itemsDonated} />
          <KPI title="Next Pickup" value={"None"} subtitle={"Schedule pickup"} />
        </div>

        {/* CTA tiles */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => openMakeFor("Cloth")} className="p-4 rounded-lg bg-white shadow hover:scale-[1.01] transition transform flex items-center gap-3">
            <Gift className="w-6 h-6 text-indigo-600" />
            <div className="text-sm text-left">
              <div className="font-medium">Donate Items</div>
              <div className="text-xs text-muted-foreground">Cloth / Food / Household</div>
            </div>
            <div className="ml-auto text-indigo-600"><ArrowRight className="w-4 h-4" /></div>
          </button>

          <button onClick={() => openMakeFor("Money")} className="p-4 rounded-lg bg-white shadow hover:scale-[1.01] transition transform flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-amber-600" />
            <div className="text-sm text-left">
              <div className="font-medium">Donate Money</div>
              <div className="text-xs text-muted-foreground">Fast & secure</div>
            </div>
            <div className="ml-auto text-amber-600"><ArrowRight className="w-4 h-4" /></div>
          </button>

          <button onClick={() => openMakeFor("Food")} className="p-4 rounded-lg bg-white shadow hover:scale-[1.01] transition transform flex items-center gap-3">
            <Users className="w-6 h-6 text-emerald-600" />
            <div className="text-sm text-left">
              <div className="font-medium">Join Campaign</div>
              <div className="text-xs text-muted-foreground">Local drives</div>
            </div>
            <div className="ml-auto text-emerald-600"><ArrowRight className="w-4 h-4" /></div>
          </button>

          <button onClick={() => openMakeFor("Other")} className="p-4 rounded-lg bg-white shadow hover:scale-[1.01] transition transform flex items-center gap-3">
            <PlusCircle className="w-6 h-6 text-slate-700" />
            <div className="text-sm text-left">
              <div className="font-medium">Other</div>
              <div className="text-xs text-muted-foreground">Toys, books, supplies</div>
            </div>
            <div className="ml-auto text-slate-700"><ArrowRight className="w-4 h-4" /></div>
          </button>
        </div>

        {/* Recent donations > filters */}
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Donations</CardTitle>
                  <CardDescription>Latest activity — tap to view details</CardDescription>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant={filter === "All" ? undefined : "ghost"} onClick={() => setFilter("All")}>All</Button>
                  <Button size="sm" variant={filter === "Pending" ? undefined : "ghost"} onClick={() => setFilter("Pending")}>Pending</Button>
                  <Button size="sm" variant={filter === "Completed" ? undefined : "ghost"} onClick={() => setFilter("Completed")}>Completed</Button>
                  <Button size="sm" variant={filter === "Money" ? undefined : "ghost"} onClick={() => setFilter("Money")}>Money</Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[360px]">
                  <div className="space-y-3">
                    {filteredList().map(d => (
                      <div key={d.id} role="button" onClick={() => setDetail(d)} className="p-3 bg-white rounded-lg shadow-sm flex items-center justify-between hover:shadow-md transition cursor-pointer">
                        <div>
                          <div className="font-semibold">{d.type} • {d.qty}</div>
                          <div className="text-xs text-muted-foreground">To {d.ngoName} • {d.createdAt}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right text-xs text-muted-foreground">
                            {d.status === "Completed" && d.receiptUrl ? <div>Receipt ready</div> : <div>{d.timeline?.slice(-1)[0]?.at ?? ""}</div>}
                          </div>
                          <StatusPill status={d.status} />
                        </div>
                      </div>
                    ))}

                    {filteredList().length === 0 && (
                      <div className="text-center py-12 text-sm text-muted-foreground">
                        No donations match this filter. Try another filter or make a donation.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Campaigns small list */}
            <Card>
              <CardHeader>
                <CardTitle>Suggested Campaigns</CardTitle>
                <CardDescription>Nearby drives</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {campaigns.map(c => (
                    <div key={c.id} className="p-3 bg-white rounded-md flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{c.title}</div>
                        {c.location && <div className="text-xs text-muted-foreground">{c.location}</div>}
                      </div>
                      <div className="w-36">
                        <Progress value={c.progress} />
                        <div className="text-xs text-muted-foreground mt-1">{c.progress}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column: impact + quick links */}
          <aside className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Impact Summary</CardTitle>
                <CardDescription>Snapshot of your giving</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">Total donations</div>
                    <div className="font-semibold">{totalDonations}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">Items donated</div>
                    <div className="font-semibold">{itemsDonated}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">Money donated</div>
                    <div className="font-semibold">₹{moneyDonated}</div>
                  </div>

                  <Separator />

                  <div className="text-sm text-muted-foreground">Recent pickup</div>
                  <div className="mt-2 text-sm">No pickups scheduled — <button className="text-indigo-600 underline" onClick={() => openMakeFor("Cloth")}>Schedule one</button></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full">View Receipts</Button>
                <Button variant="ghost" className="w-full">Saved Drafts</Button>
                <Button variant="ghost" className="w-full">Help & FAQ</Button>
              </CardContent>
            </Card>
          </aside>
        </div>

        {/* FAB */}
        <div className="fixed bottom-6 right-6 z-50">
          <button aria-label="Create donation" onClick={() => openMakeFor()} className="bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:scale-105 transition transform">
            <PlusCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground pb-8">© {new Date().getFullYear()} GoodWorks — Demo mode</div>
      </div>

      {/* Make Donation Modal (Dialog) */}
      <Dialog open={makeOpen} onOpenChange={setMakeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Make a donation</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {formStep === 1 && (
              <div>
                <div className="text-sm text-muted-foreground">What would you like to donate?</div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button onClick={() => setForm(f => ({ ...f, type: "Cloth" }))} className={`p-3 rounded ${form.type === "Cloth" ? "bg-indigo-50 border border-indigo-200" : "bg-white"}`}>Cloth</button>
                  <button onClick={() => setForm(f => ({ ...f, type: "Food" }))} className={`p-3 rounded ${form.type === "Food" ? "bg-indigo-50 border border-indigo-200" : "bg-white"}`}>Food</button>
                  <button onClick={() => setForm(f => ({ ...f, type: "Money" }))} className={`p-3 rounded ${form.type === "Money" ? "bg-indigo-50 border border-indigo-200" : "bg.white"}`}>Money</button>
                  <button onClick={() => setForm(f => ({ ...f, type: "Other" }))} className={`p-3 rounded ${form.type === "Other" ? "bg-indigo-50 border border-indigo-200" : "bg-white"}`}>Other</button>
                </div>
              </div>
            )}

            {formStep === 2 && (
              <div>
                <div className="text-sm text-muted-foreground">Details</div>
                <Input placeholder="Quantity or amount (e.g. 2 bags, ₹500)" value={form.qty} onChange={(e) => setForm(s => ({ ...s, qty: e.target.value }))} className="mt-2" />
                <Input placeholder="NGO (e.g. Seva Foundation)" value={form.ngo} onChange={(e) => setForm(s => ({ ...s, ngo: e.target.value }))} className="mt-2" />
                <Textarea placeholder="Notes (pickup preference)" value={form.notes} onChange={(e) => setForm(s => ({ ...s, notes: e.target.value }))} className="mt-2" />
              </div>
            )}

            {formStep === 3 && (
              <div>
                <div className="text-sm text-muted-foreground">Review</div>
                <div className="p-3 bg-white rounded mt-2">
                  <div className="font-semibold">{form.type} • {form.qty || "—"}</div>
                  <div className="text-sm text-muted-foreground">NGO: {form.ngo}</div>
                  <div className="text-sm text-muted-foreground">Notes: {form.notes || "-"}</div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <div className="flex w-full justify-between">
              <div>
                {formStep > 1 && <Button variant="ghost" onClick={() => setFormStep(s => s - 1)}>Back</Button>}
              </div>
              <div className="flex gap-2">
                {formStep < 3 && <Button onClick={() => setFormStep(s => s + 1)}>Next</Button>}
                {formStep === 3 && <Button onClick={submitMakeForm}>Submit donation</Button>}
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail drawer */}
      <DonationDetailDrawer donation={detail} onClose={() => setDetail(null)} />
    </div>
  );
}