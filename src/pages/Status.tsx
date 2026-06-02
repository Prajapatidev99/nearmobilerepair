import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Search, Package, Clock, CheckCircle2, XCircle,
  ChevronRight, Loader2, Star, UserCircle, LogIn
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { getUserBookings, getBookingById, addBookingFeedback } from "../lib/db";

export default function Status() {
  const { user, openAuth } = useAuth();

  const [bookingId, setBookingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState<any>(null);
  const [userBookings, setUserBookings] = useState<any[]>([]);

  // Feedback
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  // Auto-load bookings when user is logged in
  useEffect(() => {
    if (user) {
      fetchUserBookings(user.mobile);
    } else {
      setUserBookings([]);
    }
  }, [user]);

  const fetchUserBookings = async (mobile: string) => {
    setLoading(true);
    setError("");
    try {
      const data = await getUserBookings(mobile);
      setUserBookings(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch your bookings.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId.trim()) return;
    setLoading(true);
    setError("");
    setBooking(null);
    try {
      const data = await getBookingById(bookingId.trim());
      if (!data) throw new Error("Booking not found. Please check your Booking ID.");
      setBooking(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch booking status.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":   return <Clock className="text-amber-500" size={28} />;
      case "confirmed": return <Package className="text-blue-500" size={28} />;
      case "completed": return <CheckCircle2 className="text-emerald-500" size={28} />;
      case "cancelled": return <XCircle className="text-red-500" size={28} />;
      default:          return <Clock className="text-slate-500" size={28} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":   return "Pending Confirmation";
      case "confirmed": return "Repair Scheduled";
      case "completed": return "Repair Completed";
      case "cancelled": return "Cancelled";
      default:          return "Unknown Status";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":   return "bg-amber-50 text-amber-700 border-amber-200";
      case "confirmed": return "bg-blue-50 text-blue-700 border-blue-200";
      case "completed": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "cancelled": return "bg-red-50 text-red-700 border-red-200";
      default:          return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const submitFeedback = async () => {
    if (!booking || rating === 0) return;
    setLoadingFeedback(true);
    try {
      await addBookingFeedback(booking.id, rating, reviewText);
      setBooking({ ...booking, reviewSubmitted: true });
    } catch (err) {
      console.error(err);
      alert("Failed to submit feedback.");
    } finally {
      setLoadingFeedback(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Helmet>
        <title>Track Repair Status | NearMobileRepair</title>
        <meta name="description" content="Track your doorstep mobile repair status with your booking ID." />
      </Helmet>

      <Header />

      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">Track Your Repair</h1>
          <p className="text-slate-500">Enter your Booking ID below, or login to see all your bookings.</p>
        </div>

        {/* Logged-in user panel */}
        {user ? (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-8 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-blue-900">{user.name}</p>
              <p className="text-sm text-blue-600">+91 {user.mobile} · {userBookings.length} booking{userBookings.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-8 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
              <UserCircle size={28} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-900">View all your bookings at once</p>
              <p className="text-sm text-slate-500">Login to see all repairs linked to your number.</p>
            </div>
            <button
              onClick={() => openAuth("login")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-blue-700 transition-colors"
            >
              <LogIn size={16} /> Login
            </button>
          </div>
        )}

        {/* Search by Booking ID */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative flex items-center shadow-lg rounded-2xl bg-white overflow-hidden border border-slate-200">
            <div className="pl-6 text-slate-400">
              <Search size={22} />
            </div>
            <input
              type="text"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              placeholder="Enter Booking ID (e.g., 6tx8k2)"
              className="w-full p-5 pl-4 outline-none text-slate-900 bg-transparent font-medium"
            />
            <button
              type="submit"
              disabled={loading || !bookingId}
              className="px-8 py-5 bg-blue-600 text-white font-bold hover:bg-blue-700 transition disabled:opacity-50 flex items-center h-full whitespace-nowrap"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Track"}
            </button>
          </div>
          {error && (
            <p className="text-red-500 font-medium mt-4 text-center bg-red-50 px-4 py-3 rounded-xl border border-red-100">
              {error}
            </p>
          )}
        </form>

        {/* Single booking result */}
        {booking && (
          <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-xl border border-slate-100 flex flex-col gap-8 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6 justify-between border-b border-slate-100 pb-8">
              <div className="text-center md:text-left">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Booking #{booking.id}</p>
                <h2 className="text-2xl font-bold text-slate-900">{booking.brand} {booking.model}</h2>
                <p className="text-slate-500 mt-1">Issue: {booking.issue}</p>
              </div>
              <div className={`px-6 py-3 rounded-full border font-bold flex items-center gap-3 ${getStatusColor(booking.status)}`}>
                {getStatusIcon(booking.status)}
                {getStatusText(booking.status)}
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              <div className="absolute top-0 bottom-0 left-6 w-0.5 bg-slate-100 hidden sm:block" />
              <div className="space-y-6 sm:space-y-8 relative">
                {[
                  { label: "Booking Received", desc: "We have received your repair request.", active: ["pending","confirmed","completed"].includes(booking.status) },
                  { label: "Repair Scheduled", desc: "Our technician is assigned and will arrive as per schedule.", active: ["confirmed","completed"].includes(booking.status) },
                  { label: "Repair Completed", desc: "Your device has been repaired successfully.", active: booking.status === "completed", isLast: true },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-4 sm:gap-6">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10 ${step.active ? (step.isLast ? "bg-emerald-500 text-white" : "bg-blue-600 text-white") : "bg-slate-100 text-slate-400"}`}>
                      <CheckCircle2 size={22} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{step.label}</h4>
                      <p className="text-sm text-slate-500">{step.desc}</p>
                    </div>
                  </div>
                ))}

                {/* Feedback Form */}
                {booking.status === "completed" && !booking.reviewSubmitted && (
                  <div className="mt-6 ml-0 sm:ml-16 bg-white shadow-md border border-slate-100 rounded-3xl p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Rate Your Repair</h3>
                    <p className="text-sm text-slate-500 mb-4">How was your experience with {booking.brand} {booking.model}?</p>
                    <div className="flex gap-2 text-slate-200 mb-4">
                      {[1, 2, 3, 4, 5].map(v => (
                        <button key={v} type="button" onClick={() => setRating(v)}
                          className={`hover:text-yellow-400 transition-colors ${rating >= v ? "text-yellow-400" : ""}`}>
                          <Star size={34} fill={rating >= v ? "currentColor" : "none"} />
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={reviewText} onChange={e => setReviewText(e.target.value)}
                      placeholder="Write your feedback... (Optional)"
                      className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none text-sm mb-4 bg-slate-50 resize-none"
                      rows={3}
                    />
                    <button onClick={submitFeedback} disabled={rating === 0 || loadingFeedback}
                      className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition disabled:opacity-50 flex items-center justify-center gap-2">
                      {loadingFeedback ? <Loader2 className="animate-spin" size={18} /> : "Submit Feedback"}
                    </button>
                  </div>
                )}

                {booking.status === "completed" && booking.reviewSubmitted && (
                  <div className="mt-6 ml-0 sm:ml-16 bg-emerald-50 border border-emerald-100 rounded-3xl p-6 text-center">
                    <CheckCircle2 className="mx-auto text-emerald-500 mb-2" size={28} />
                    <h3 className="font-bold text-emerald-900">Thank you for your review!</h3>
                    <p className="text-sm text-emerald-700">We appreciate your feedback.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* User's all bookings */}
        {userBookings.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-lg">Your Bookings</h3>
            {userBookings.map(b => (
              <div key={b.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-mono text-slate-400 mb-1">#{b.id}</p>
                  <h4 className="text-lg font-bold text-slate-900">{b.brand} {b.model}</h4>
                  <p className="text-sm text-slate-500">{b.issue}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-4 py-1.5 rounded-full border text-xs font-bold ${getStatusColor(b.status)}`}>
                    {getStatusText(b.status)}
                  </span>
                  <button
                    onClick={() => { setBooking(b); setBookingId(b.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1"
                  >
                    Details <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {user && userBookings.length === 0 && !loading && !error && (
          <div className="text-center py-16">
            <Package size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">No bookings found for your account.</p>
            <a href="/#book" className="mt-4 inline-block px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors text-sm">
              Book a Repair
            </a>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
