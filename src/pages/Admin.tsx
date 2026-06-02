import { useEffect, useState, useMemo } from "react";
import { Booking } from "../types";
import {
  Loader2, MessageCircle, Search, Users, ClipboardList,
  CheckCircle2, Clock, XCircle, Package, TrendingUp,
  LogOut, RefreshCw, Smartphone
} from "lucide-react";
import { AuthUser } from "../lib/auth";
import { getAllBookings, updateBookingStatus, getAllUsersFromFirestore } from "../lib/db";

type Tab = "bookings" | "users";
type StatusFilter = "all" | "pending" | "confirmed" | "completed" | "cancelled";

const STATUS_COLORS: Record<string, string> = {
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  confirmed:  "bg-blue-100 text-blue-700 border-blue-200",
  cancelled:  "bg-red-100 text-red-700 border-red-200",
  pending:    "bg-amber-100 text-amber-700 border-amber-200",
};

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>("bookings");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<AuthUser[]>([]);

  const login = () => {
    if (password === "Dev@9974") {
      setIsAuthenticated(true);
      fetchBookings();
      getAllUsersFromFirestore().then(setUsers);
    } else {
      alert("Invalid password");
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getAllBookings();
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateBookingStatus(id, status as any);
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  // Stats
  const stats = useMemo(() => ({
    total:     bookings.length,
    pending:   bookings.filter(b => b.status === "pending").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    completed: bookings.filter(b => b.status === "completed").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length,
    revenue:   bookings.filter(b => b.status === "completed").length * 800,
  }), [bookings]);

  // Filtered bookings
  const filtered = useMemo(() => {
    return bookings
      .filter(b => statusFilter === "all" || b.status === statusFilter)
      .filter(b => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          b.name?.toLowerCase().includes(q) ||
          b.mobile?.includes(q) ||
          b.brand?.toLowerCase().includes(q) ||
          b.model?.toLowerCase().includes(q) ||
          b.id?.includes(q)
        );
      });
  }, [bookings, statusFilter, search]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-[28px] shadow-2xl w-full max-w-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
              <Smartphone size={20} className="text-white" />
            </div>
            <div>
              <p className="font-black text-slate-900 text-lg leading-none">NearMobile<span className="text-blue-600">Repair</span></p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Admin Dashboard</p>
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Sign in</h2>
          <p className="text-sm text-slate-500 mb-6">Enter your admin password to continue.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 mb-4 focus:ring-2 focus:ring-blue-600 outline-none text-sm"
            placeholder="Password"
          />
          <button
            onClick={login}
            className="w-full bg-slate-900 text-white rounded-xl py-3.5 font-bold hover:bg-black transition-colors shadow-lg"
          >
            Login to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar + Main layout */}
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-slate-900 text-white md:min-h-screen flex flex-col">
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Smartphone size={16} className="text-white" />
              </div>
              <span className="font-black text-base">NMR <span className="text-blue-400">Admin</span></span>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            <button
              onClick={() => setTab("bookings")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${tab === "bookings" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
            >
              <ClipboardList size={18} /> Bookings
            </button>
            <button
              onClick={() => setTab("users")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${tab === "users" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
            >
              <Users size={18} /> Registered Users
            </button>
          </nav>
          <div className="p-4 border-t border-slate-800">
            <button
              onClick={() => setIsAuthenticated(false)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          {tab === "bookings" && (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900">Bookings Dashboard</h1>
                  <p className="text-slate-500 text-sm mt-1">Manage and track all repair bookings</p>
                </div>
                <button
                  onClick={fetchBookings}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
                >
                  <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
                  Refresh
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Total Bookings", value: stats.total, icon: <ClipboardList size={20}/>, color: "bg-slate-900 text-white" },
                  { label: "Pending", value: stats.pending, icon: <Clock size={20}/>, color: "bg-amber-100 text-amber-700" },
                  { label: "Completed", value: stats.completed, icon: <CheckCircle2 size={20}/>, color: "bg-emerald-100 text-emerald-700" },
                  { label: "Est. Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: <TrendingUp size={20}/>, color: "bg-blue-100 text-blue-700" },
                ].map((s, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${s.color}`}>
                      {s.icon}
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">{s.label}</p>
                      <p className="text-2xl font-extrabold text-slate-900">{s.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, mobile, brand, model…"
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 bg-white shadow-sm"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {(["all","pending","confirmed","completed","cancelled"] as StatusFilter[]).map(s => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-3 py-2 text-xs font-bold rounded-lg capitalize transition-colors ${statusFilter === s ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bookings Table */}
              {loading ? (
                <div className="flex justify-center p-20">
                  <Loader2 className="animate-spin text-blue-600" size={40} />
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider">
                          <th className="px-5 py-4 font-semibold">Date</th>
                          <th className="px-5 py-4 font-semibold">Customer</th>
                          <th className="px-5 py-4 font-semibold">Device & Issue</th>
                          <th className="px-5 py-4 font-semibold">Time Slot</th>
                          <th className="px-5 py-4 font-semibold">Payment</th>
                          <th className="px-5 py-4 font-semibold">Status</th>
                          <th className="px-5 py-4 font-semibold">Update</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filtered.map(b => (
                          <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
                              <p className="font-bold text-slate-700">{new Date(b.createdAt).toLocaleDateString('en-IN')}</p>
                              <p className="text-slate-400">{new Date(b.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                              <p className="text-[10px] font-mono bg-slate-100 text-slate-500 rounded px-1.5 py-0.5 mt-1 inline-block">#{b.id}</p>
                            </td>
                            <td className="px-5 py-4">
                              <p className="font-bold text-slate-900">{b.name}</p>
                              <p className="text-sm text-slate-500">{b.mobile}</p>
                              <p className="text-xs text-slate-400 mt-1 max-w-[180px] truncate" title={b.address}>{b.address}</p>
                              <a
                                href={`https://wa.me/91${b.mobile}?text=${encodeURIComponent(`Hello ${b.name}, your repair booking for ${b.brand} ${b.model} is now ${b.status.toUpperCase()}. Track at https://nearmobilerepair.com/status`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1.5 inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 text-xs font-bold"
                              >
                                <MessageCircle size={12} /> WhatsApp
                              </a>
                            </td>
                            <td className="px-5 py-4">
                              <p className="font-bold text-slate-900">{b.brand} {b.model}</p>
                              <p className="text-sm text-red-500 font-medium">{b.issue}</p>
                              {b.rating && (
                                <p className="text-xs text-yellow-500 mt-1">{'⭐'.repeat(b.rating)} {b.review ? `"${b.review.substring(0, 30)}..."` : ''}</p>
                              )}
                            </td>
                            <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">{b.timeSlot}</td>
                            <td className="px-5 py-4">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                                {b.paymentMethod || 'N/A'}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[b.status] || ''}`}>
                                {b.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <select
                                value={b.status}
                                onChange={(e) => updateStatus(b.id, e.target.value)}
                                className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-600 bg-white font-medium"
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                        {filtered.length === 0 && (
                          <tr>
                            <td colSpan={7} className="px-5 py-16 text-center">
                              <Package size={36} className="mx-auto text-slate-300 mb-3" />
                              <p className="text-slate-500 font-medium">No bookings found.</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  {filtered.length > 0 && (
                    <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-400 font-medium">
                      Showing {filtered.length} of {bookings.length} bookings
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {tab === "users" && (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-slate-900">Registered Users</h1>
                <p className="text-slate-500 text-sm mt-1">All users who have registered on the platform</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Total Users</p>
                    <p className="text-2xl font-extrabold text-slate-900">{users.length}</p>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Users with Bookings</p>
                    <p className="text-2xl font-extrabold text-slate-900">
                      {users.filter(u => bookings.some(b => b.mobile === u.mobile)).length}
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">New Today</p>
                    <p className="text-2xl font-extrabold text-slate-900">
                      {users.filter(u => {
                        const d = new Date(u.createdAt);
                        const today = new Date();
                        return d.toDateString() === today.toDateString();
                      }).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider">
                        <th className="px-5 py-4 font-semibold">#</th>
                        <th className="px-5 py-4 font-semibold">Name</th>
                        <th className="px-5 py-4 font-semibold">Mobile</th>
                        <th className="px-5 py-4 font-semibold">Registered</th>
                        <th className="px-5 py-4 font-semibold">Total Bookings</th>
                        <th className="px-5 py-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {users.map((u, i) => {
                        const userBookings = bookings.filter(b => b.mobile === u.mobile);
                        return (
                          <tr key={u.mobile} className="hover:bg-slate-50/60 transition-colors">
                            <td className="px-5 py-4 text-xs text-slate-400 font-mono">{i + 1}</td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                                  {u.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-bold text-slate-900">{u.name}</span>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-sm text-slate-600 font-medium">+91 {u.mobile}</td>
                            <td className="px-5 py-4 text-xs text-slate-500">
                              {new Date(u.createdAt).toLocaleDateString('en-IN')}
                            </td>
                            <td className="px-5 py-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${userBookings.length > 0 ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}>
                                {userBookings.length} booking{userBookings.length !== 1 ? "s" : ""}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <a
                                href={`https://wa.me/91${u.mobile}?text=${encodeURIComponent(`Hello ${u.name}, this is NearMobileRepair Ahmedabad. How can we help you today?`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 text-xs font-bold"
                              >
                                <MessageCircle size={14} /> WhatsApp
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                      {users.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-5 py-16 text-center">
                            <Users size={36} className="mx-auto text-slate-300 mb-3" />
                            <p className="text-slate-500 font-medium">No registered users yet.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
