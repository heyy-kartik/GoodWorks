"use client";

import React, { useMemo, useState } from "react";
import {
  Download,
  CheckCircle,
  XCircle,
  Trash,
  PlusCircle,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

/* ---------------- Types & Mock Data ---------------- */

type DonationStatus = "Created" | "Accepted" | "In Progress" | "Completed" | "Rejected";

type Donation = {
  id: string;
  donorName: string;
  ngoName: string;
  type: "Cloth" | "Food" | "Money" | "Other";
  qty: string;
  status: DonationStatus;
  requestedAt: string;
  receiptUrl?: string | null;
};

type Campaign = {
  id: string;
  title: string;
  location?: string;
  progress: number; // 0-100
  active: boolean;
};

type UserAccount = {
  id: string;
  name: string;
  email: string;
  role: "Donor" | "NGO" | "Admin" | "Volunteer";
  active: boolean;
};

const MOCK_DONATIONS: Donation[] = [
  { id: "d_101", donorName: "Priya Sharma", ngoName: "Seva Foundation", type: "Cloth", qty: "3 bags", status: "Created", requestedAt: "2025-09-20" },
  { id: "d_102", donorName: "Rajan Mehra", ngoName: "Local Kitchen", type: "Food", qty: "20 meals", status: "Accepted", requestedAt: "2025-09-19", receiptUrl: "/receipts/d_102.pdf" },
  { id: "d_103", donorName: "Vikram Singh", ngoName: "HelpHands", type: "Money", qty: "₹2000", status: "In Progress", requestedAt: "2025-09-18" },
  { id: "d_104", donorName: "Nisha Gupta", ngoName: "Goonj", type: "Cloth", qty: "1 bag", status: "Completed", requestedAt: "2025-09-12", receiptUrl: "/receipts/d_104.pdf" },
];

const MOCK_CAMPAIGNS: Campaign[] = [
  { id: "c_01", title: "Winter Blanket Drive", location: "Pune", progress: 48, active: true },
  { id: "c_02", title: "School Supplies", location: "Mumbai", progress: 22, active: true },
  { id: "c_03", title: "Healthcare Kits", location: "Bengaluru", progress: 78, active: false },
];

const MOCK_USERS: UserAccount[] = [
  { id: "u_1", name: "Priya Sharma", email: "priya@example.com", role: "Donor", active: true },
  { id: "u_2", name: "Seva Foundation", email: "seva@ngo.org", role: "NGO", active: true },
  { id: "u_3", name: "Rajan Mehra", email: "rajan@example.com", role: "Volunteer", active: true },
  { id: "u_4", name: "Ghost User", email: "ghost@example.com", role: "Donor", active: false },
];

/* ---------------- Small helpers ---------------- */

function statusColor(s: DonationStatus) {
  switch (s) {
    case "Created":
      return "bg-yellow-100 text-yellow-800";
    case "Accepted":
      return "bg-blue-100 text-blue-800";
    case "In Progress":
      return "bg-indigo-100 text-indigo-800";
    case "Completed":
      return "bg-green-100 text-green-800";
    case "Rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function downloadCSV(filename: string, rows: string[][]) {
  const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ---------------- Component ---------------- */

export default function AdminDashboard(): JSX.Element {
  // local state (mock DB)
  const [donations, setDonations] = useState<Donation[]>(MOCK_DONATIONS);
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [users, setUsers] = useState<UserAccount[]>(MOCK_USERS);

  // UI controls
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<DonationStatus | "All">("All");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  // derived counts
  const stats = useMemo(() => {
    const total = donations.length;
    const pending = donations.filter(d => d.status === "Created").length;
    const completed = donations.filter(d => d.status === "Completed").length;
    const ngos = new Set(donations.map(d => d.ngoName)).size;
    return { total, pending, completed, ngos };
  }, [donations]);

  // filtered donations
  const filtered = useMemo(() => {
    let list = donations.slice();
    if (filterStatus !== "All") list = list.filter(d => d.status === filterStatus);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(d => (`${d.donorName} ${d.ngoName} ${d.type} ${d.qty}`).toLowerCase().includes(q));
    }
    return list;
  }, [donations, filterStatus, query]);

  // pagination slice
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  /* ---------------- Actions (local) ---------------- */
  function approveDonation(id: string) {
    setDonations(prev => prev.map(d => (d.id === id ? { ...d, status: "Accepted" } : d)));
  }
  function rejectDonation(id: string) {
    if (!confirm("Reject this donation request?")) return;
    setDonations(prev => prev.map(d => (d.id === id ? { ...d, status: "Rejected" } : d)));
  }
  function markCompleted(id: string) {
    setDonations(prev => prev.map(d => (d.id === id ? { ...d, status: "Completed", receiptUrl: `/receipts/${id}.pdf` } : d)));
  }
  function deleteDonation(id: string) {
    if (!confirm("Delete donation permanently?")) return;
    setDonations(prev => prev.filter(d => d.id !== id));
  }

  function toggleCampaignActive(id: string) {
    setCampaigns(prev => prev.map(c => (c.id === id ? { ...c, active: !c.active } : c)));
  }
  function updateCampaignProgress(id: string, amount: number) {
    setCampaigns(prev => prev.map(c => (c.id === id ? { ...c, progress: Math.max(0, Math.min(100, c.progress + amount)) } : c)));
  }
  function createCampaign() {
    const id = `c_${Date.now()}`;
    setCampaigns(prev => [{ id, title: "New Campaign", location: "Unknown", progress: 0, active: true }, ...prev]);
  }
  function removeCampaign(id: string) {
    if (!confirm("Remove this campaign?")) return;
    setCampaigns(prev => prev.filter(c => c.id !== id));
  }

  function toggleUserActive(id: string) {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, active: !u.active } : u)));
  }
  function removeUser(id: string) {
    if (!confirm("Remove user account?")) return;
    setUsers(prev => prev.filter(u => u.id !== id));
  }

  function exportDonationsCSV() {
    const rows = [
      ["id", "donorName", "ngoName", "type", "qty", "status", "requestedAt", "receiptUrl"],
      ...donations.map(d => [d.id, d.donorName, d.ngoName, d.type, d.qty, d.status, d.requestedAt, d.receiptUrl || ""]),
    ];
    downloadCSV(`donations_export_${Date.now()}.csv`, rows);
  }

  /* ---------------- small UI helpers ---------------- */
  function StatusBadge({ status }: { status: DonationStatus }) {
    return <span className={`px-2 py-1 rounded text-xs ${statusColor(status)}`}>{status}</span>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-slate-600">Overview & management — mock data (no API).</p>
          </div>

          <div className="flex items-center gap-3">
            <Input placeholder="Search donations, NGO or donor..." value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} />
            <Select onValueChange={(v) => { setFilterStatus(v as DonationStatus | "All"); setPage(1); }} defaultValue="All">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All statuses</SelectItem>
                <SelectItem value="Created">Created</SelectItem>
                <SelectItem value="Accepted">Accepted</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={exportDonationsCSV} variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" /> Export CSV
            </Button>
          </div>
        </div>

        {/* top stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total donations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stats.total}</div>
              <div className="text-sm text-slate-500 mt-1">{stats.ngos} NGOs receiving donations</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stats.pending}</div>
              <div className="text-sm text-slate-500 mt-1">Requests awaiting admin/NGO action</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Completed receipts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stats.completed}</div>
              <div className="text-sm text-slate-500 mt-1">Donations finished with receipts</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Active campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{campaigns.filter(c => c.active).length}</div>
              <div className="text-sm text-slate-500 mt-1">Ongoing drives</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: donations list */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Donations</CardTitle>
                <div className="text-sm text-slate-500">{filtered.length} results</div>
              </CardHeader>

              <CardContent>
                <ScrollArea className="h-[420px]">
                  <div className="space-y-3">
                    {paged.map(d => (
                      <div key={d.id} className="p-3 bg-white rounded-lg border flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarFallback>{d.donorName.split(" ").map(n=>n[0]).slice(0,2).join("")}</AvatarFallback>
                          </Avatar>

                          <div>
                            <div className="font-semibold">{d.donorName} <span className="text-xs text-slate-500">→ {d.ngoName}</span></div>
                            <div className="text-sm text-slate-500">{d.type} • {d.qty} • {d.requestedAt}</div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <StatusBadge status={d.status} />
                          <div className="flex gap-2">
                            {d.status === "Created" && (
                              <>
                                <Button size="sm" onClick={() => approveDonation(d.id)} className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4" /> Approve
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => rejectDonation(d.id)} className="flex items-center gap-2">
                                  <XCircle className="w-4 h-4" /> Reject
                                </Button>
                              </>
                            )}

                            {d.status !== "Completed" && d.status !== "Rejected" && (
                              <Button size="sm" variant="outline" onClick={() => markCompleted(d.id)}>Mark Completed</Button>
                            )}

                            <Button size="sm" variant="destructive" onClick={() => deleteDonation(d.id)}><Trash className="w-4 h-4" /></Button>
                          </div>

                          {d.receiptUrl && (
                            <a href={d.receiptUrl} className="text-xs text-indigo-600" target="_blank" rel="noreferrer">View receipt</a>
                          )}
                        </div>
                      </div>
                    ))}

                    {filtered.length === 0 && <div className="text-sm text-slate-500 p-4">No donations match your filters.</div>}
                  </div>
                </ScrollArea>

                {/* pagination */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-slate-500">Page {page} of {Math.max(1, Math.ceil(filtered.length / pageSize))}</div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setPage(p => Math.max(1, p-1))}><ChevronLeft /></Button>
                    <Button size="sm" variant="ghost" onClick={() => setPage(p => p + 1)}><ChevronRight /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: campaigns & user mgmt */}
          <aside className="space-y-4">
            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Campaigns</CardTitle>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={createCampaign} className="flex items-center gap-2"><PlusCircle className="w-4 h-4" /> New</Button>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {campaigns.map(c => (
                    <div key={c.id} className="p-3 bg-white rounded border">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{c.title}</div>
                          <div className="text-xs text-slate-500">{c.location}</div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-semibold">{c.progress}%</div>
                          <div className="text-xs text-slate-500">{c.active ? "Active" : "Paused"}</div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <Progress value={c.progress} className="h-2 flex-1" />
                        <Button size="sm" onClick={() => updateCampaignProgress(c.id, 10)}>+10</Button>
                        <Button size="sm" onClick={() => updateCampaignProgress(c.id, -10)}>-10</Button>
                        <Button size="sm" variant="ghost" onClick={() => toggleCampaignActive(c.id)}>{c.active ? "Pause" : "Start"}</Button>
                        <Button size="sm" variant="destructive" onClick={() => removeCampaign(c.id)}><Trash /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-2">
                  {users.map(u => (
                    <div key={u.id} className="flex items-center justify-between p-2 bg-white rounded border">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{u.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{u.name}</div>
                          <div className="text-xs text-slate-500">{u.email} • {u.role}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className={`${u.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} px-2 py-1`}>{u.active ? "Active" : "Inactive"}</Badge>
                        <Button size="sm" variant="outline" onClick={() => toggleUserActive(u.id)}>{u.active ? "Disable" : "Enable"}</Button>
                        <Button size="sm" variant="destructive" onClick={() => removeUser(u.id)}><Trash /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Button onClick={exportDonationsCSV} variant="outline" className="flex items-center gap-2"><Download /> Export donations</Button>
                <Button onClick={() => alert("Pretend sending an admin announcement...")} variant="ghost">Send announcement</Button>
                <Button onClick={() => { setDonations(MOCK_DONATIONS); setCampaigns(MOCK_CAMPAIGNS); setUsers(MOCK_USERS); }} variant="link">Reset mock data</Button>
              </CardContent>
            </Card>
          </aside>
        </div>

        <Separator />

        {/* footer / notes */}
        <div className="text-xs text-slate-500 mt-4">
          <div>Tip: This is a mock admin UI. Hook actions to real API calls and replace mock arrays when integrating.</div>
        </div>
      </div>
    </div>
  );
}