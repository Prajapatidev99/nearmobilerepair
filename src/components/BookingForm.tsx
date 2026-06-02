import React, { useState } from "react";
import { CheckCircle2, Loader2, ArrowRight, ArrowLeft, Copy, Check, UserCircle, LogIn, IndianRupee } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateMobile } from "../lib/auth";
import { createBooking } from "../lib/db";

// Instant price estimate lookup
const PRICE_RANGES: Record<string, Record<string, string>> = {
  Display: {
    Apple:        "₹1,500 – ₹5,500",
    Samsung:      "₹800 – ₹3,500",
    OnePlus:      "₹1,200 – ₹3,000",
    Xiaomi:       "₹600 – ₹1,800",
    Vivo:         "₹600 – ₹1,800",
    Oppo:         "₹600 – ₹1,800",
    Realme:       "₹500 – ₹1,500",
    "Google Pixel": "₹1,500 – ₹4,000",
    default:      "₹600 – ₹3,500",
  },
  Battery: {
    Apple:        "₹1,200 – ₹2,500",
    Samsung:      "₹499 – ₹1,200",
    OnePlus:      "₹499 – ₹999",
    Xiaomi:       "₹399 – ₹799",
    Vivo:         "₹399 – ₹799",
    Oppo:         "₹399 – ₹799",
    Realme:       "₹349 – ₹699",
    "Google Pixel": "₹899 – ₹1,800",
    default:      "₹399 – ₹899",
  },
  Charging: { default: "₹299 – ₹799" },
  Camera:   { default: "₹499 – ₹1,500" },
  "Speaker/Mic": { default: "₹249 – ₹699" },
  Software: { default: "₹199 – ₹599" },
  Other:    { default: "Get quote on WhatsApp" },
};

function getPriceEstimate(brand: string, issue: string): string | null {
  const issueMap = PRICE_RANGES[issue];
  if (!issueMap) return null;
  return issueMap[brand] || issueMap["default"] || null;
}

export default function BookingForm() {
  const { user, openAuth, refreshUser } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [copied, setCopied] = useState(false);
  const [phoneImage, setPhoneImage] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    brand: "",
    otherBrand: "",
    model: "",
    issue: "",
    otherIssue: "",
    address: "",
    timeSlot: "",
    paymentMethod: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneImage(e.target.files?.[0] ?? null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { openAuth("login"); return; }
    setLoading(true);
    try {
      const payload = { ...formData };
      if (payload.brand === "Other" && payload.otherBrand) payload.brand = payload.otherBrand;
      if (payload.issue === "Other" && payload.otherIssue) payload.issue = payload.otherIssue;
      payload.name = payload.name || user.name;
      payload.mobile = payload.mobile || user.mobile;

      if (!payload.mobile || payload.mobile.length !== 10) {
        alert("Please provide a valid 10-digit mobile number.");
        setLoading(false);
        return;
      }

      if (user && !user.mobile && formData.mobile) {
        updateMobile(user.uid!, formData.mobile);
        refreshUser();
      }

      const id = await createBooking(payload);
      setBookingId(id);
      setSuccess(true);
      setStep(1);
      setFormData({ name: "", mobile: "", brand: "", otherBrand: "", model: "", issue: "", otherIssue: "", address: "", timeSlot: "", paymentMethod: "" });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const brandForDisplay = formData.brand === "Other" ? formData.otherBrand : formData.brand;
  const issueForDisplay = formData.issue === "Other" ? formData.otherIssue : formData.issue;
  const priceEstimate = getPriceEstimate(formData.brand, formData.issue);

  // Success screen
  if (success) {
    const waText = encodeURIComponent(
      `Hi! I just booked a repair for my ${brandForDisplay} ${formData.model}. My Booking ID is ${bookingId}. Please confirm the details.`
    );
    return (
      <div className="bg-white p-8 md:p-12 rounded-[32px] shadow-2xl border border-slate-100 text-center w-full max-w-md relative z-10 flex flex-col items-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 mb-6">
          <CheckCircle2 size={32} className="text-emerald-500" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h3>
        <p className="text-sm text-slate-500 mb-6">
          Our technician will call you shortly to confirm the exact time and repair details.
        </p>

        {bookingId && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 w-full">
            <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">Your Booking ID</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-black text-slate-900 tracking-widest">{bookingId}</span>
              <button onClick={copyToClipboard} className="text-slate-400 hover:text-blue-600 transition-colors" title="Copy">
                {copied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 w-full">
          {/* WhatsApp confirmation */}
          <a
            href={`https://wa.me/919974221322?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
          >
            <img src="https://cdn.simpleicons.org/whatsapp/ffffff" width="18" height="18" alt="WhatsApp" />
            Send Booking to WhatsApp
          </a>
          <Link
            to="/status"
            className="w-full bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 text-center"
          >
            Track Repair Status
          </Link>
          <button
            onClick={() => { setSuccess(false); setBookingId(""); }}
            className="w-full text-slate-500 font-bold px-8 py-3 rounded-xl hover:text-slate-900 transition-colors"
          >
            Book Another Repair
          </button>
        </div>
      </div>
    );
  }

  const isStep1Valid = formData.brand && formData.model && formData.issue &&
    (formData.brand !== "Other" || formData.otherBrand) &&
    (formData.issue !== "Other" || formData.otherIssue);

  const handleContinueToStep2 = () => {
    if (!user) { openAuth("register"); return; }
    setFormData(prev => ({
      ...prev,
      name: prev.name || user.name,
      mobile: prev.mobile || user.mobile,
    }));
    setStep(2);
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-2xl border border-slate-100 w-full max-w-md relative z-10">
      <div className="mb-6">
        <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
          {step === 1 ? "Check Repair Price" : "Complete Booking"}
        </h3>
        <p className="text-sm text-slate-500">
          {step === 1 ? "Select device & issue for an instant quote." : "Tell us where to reach you."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {step === 1 ? (
          <div className="space-y-4">
            {/* Brand */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Device Brand</label>
              <select required name="brand" value={formData.brand} onChange={handleChange}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-blue-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all bg-slate-50 text-sm focus:bg-white">
                <option value="">Select Brand</option>
                {["Apple","Samsung","OnePlus","Xiaomi","Vivo","Oppo","Realme","Google Pixel","Other"].map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              {formData.brand === "Other" && (
                <input required type="text" name="otherBrand" value={formData.otherBrand} onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-slate-200 hover:border-blue-400 focus:ring-2 focus:ring-blue-600 outline-none transition-all bg-slate-50 text-sm focus:bg-white mt-2"
                  placeholder="Type your brand" />
              )}
            </div>

            {/* Model */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Device Model</label>
              <input required type="text" name="model" value={formData.model} onChange={handleChange}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-blue-400 focus:ring-2 focus:ring-blue-600 outline-none transition-all bg-slate-50 text-sm focus:bg-white"
                placeholder="e.g. iPhone 13 Pro" />
            </div>

            {/* Issue */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Issue Type</label>
              <select required name="issue" value={formData.issue} onChange={handleChange}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-blue-400 focus:ring-2 focus:ring-blue-600 outline-none transition-all bg-slate-50 text-sm focus:bg-white">
                <option value="">Select Issue</option>
                <option value="Display">Display Replacement</option>
                <option value="Battery">Battery Issue</option>
                <option value="Charging">Charging Port</option>
                <option value="Camera">Camera Repair</option>
                <option value="Speaker/Mic">Speaker / Mic</option>
                <option value="Software">Software Issue</option>
                <option value="Other">Other</option>
              </select>
              {formData.issue === "Other" && (
                <input required type="text" name="otherIssue" value={formData.otherIssue} onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-slate-200 hover:border-blue-400 focus:ring-2 focus:ring-blue-600 outline-none transition-all bg-slate-50 text-sm focus:bg-white mt-2"
                  placeholder="Describe your issue" />
              )}
            </div>

            {/* Instant price estimate */}
            {isStep1Valid && priceEstimate && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <IndianRupee size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">Estimated Price</p>
                  <p className="text-lg font-black text-blue-900">{priceEstimate}</p>
                  <p className="text-xs text-blue-600">for {brandForDisplay} — {issueForDisplay}</p>
                </div>
              </div>
            )}

            {/* Image upload */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Device Image (Optional)</label>
              <input type="file" accept="image/*" onChange={handleImageChange}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors" />
              {phoneImage && (
                <div className="mt-3 relative w-32 h-32 rounded-xl overflow-hidden border border-slate-200">
                  <img src={URL.createObjectURL(phoneImage)} alt="Device preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* WhatsApp quote */}
            {isStep1Valid && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex flex-col gap-3 mt-2">
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Get Exact Quote on WhatsApp</p>
                <a
                  href={`https://wa.me/919974221322?text=${encodeURIComponent(`Hi, I'd like to check the repair cost for my ${brandForDisplay} ${formData.model} (${issueForDisplay}).${phoneImage ? ' I have a picture of the phone.' : ''}`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full text-center text-sm font-bold text-white bg-emerald-600 py-2.5 rounded-lg hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-md shadow-emerald-100"
                >
                  <img src="https://cdn.simpleicons.org/whatsapp/ffffff" width="16" height="16" alt="WhatsApp" />
                  Get Price on WhatsApp
                </a>
              </div>
            )}

            {/* Auth notice */}
            {!user && isStep1Valid && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-3">
                <LogIn size={18} className="text-amber-600 shrink-0" />
                <p className="text-xs text-amber-800 font-medium">
                  You'll need to <button type="button" onClick={() => openAuth("register")} className="underline font-bold">register/login</button> to complete booking.
                </p>
              </div>
            )}

            {user && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-3">
                <UserCircle size={18} className="text-blue-600 shrink-0" />
                <p className="text-xs text-blue-800 font-medium">
                  Booking as <strong>{user.name}</strong> {user.mobile ? `(+91 ${user.mobile})` : `(${user.email})`}
                </p>
              </div>
            )}

            <button type="button" onClick={handleContinueToStep2} disabled={!isStep1Valid}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold mt-4 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed">
              {!user ? <><LogIn size={18} /> Login & Continue</> : <>Continue to Book <ArrowRight size={18} /></>}
            </button>

            <div className="pt-4 border-t border-slate-100 text-center">
              <p className="text-sm font-medium text-slate-500">
                Or Call / WhatsApp: <a href="tel:+919974221322" className="text-blue-600 font-bold ml-1 hover:underline">+91 9974221322</a>
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {user && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-3">
                <UserCircle size={20} className="text-blue-600 shrink-0" />
                <div>
                  <p className="text-xs text-blue-500 font-medium">Booking as</p>
                  <p className="font-bold text-blue-900 text-sm">{user.name} · {user.mobile ? `+91 ${user.mobile}` : user.email}</p>
                </div>
              </div>
            )}

            {user && !user.mobile && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Mobile Number</label>
                <div className="flex items-center mt-1 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-600 bg-slate-50 focus-within:bg-white transition">
                  <span className="pl-4 pr-2 text-slate-500 font-bold text-sm">+91</span>
                  <input required type="tel" name="mobile" value={formData.mobile} onChange={(e) => setFormData(p => ({...p, mobile: e.target.value.replace(/\D/g, '').slice(0, 10)}))} maxLength={10}
                    className="w-full py-3 pr-4 outline-none bg-transparent text-sm font-medium"
                    placeholder="10-digit mobile number" />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Preferred Time Slot</label>
              <select required name="timeSlot" value={formData.timeSlot} onChange={handleChange}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-blue-400 focus:ring-2 focus:ring-blue-600 outline-none transition-all bg-slate-50 text-sm focus:bg-white">
                <option value="">Select Time</option>
                <option value="Morning (9AM - 12PM)">Morning (9AM – 12PM)</option>
                <option value="Afternoon (12PM - 4PM)">Afternoon (12PM – 4PM)</option>
                <option value="Evening (4PM - 8PM)">Evening (4PM – 8PM)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Full Address (Ahmedabad Only)</label>
              <textarea required name="address" value={formData.address} onChange={handleChange} rows={3}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-blue-400 focus:ring-2 focus:ring-blue-600 outline-none transition-all bg-slate-50 text-sm focus:bg-white resize-none"
                placeholder="House/Flat No, Building, Street, Area, Pincode" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Payment Method</label>
              <select required name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-blue-400 focus:ring-2 focus:ring-blue-600 outline-none transition-all bg-slate-50 text-sm focus:bg-white">
                <option value="">Select Payment Method</option>
                <option value="Online">Online (UPI / Wallet)</option>
                <option value="Card">Credit / Debit Card</option>
                <option value="Cash">Cash on Repair</option>
              </select>
            </div>

            <div className="bg-amber-50 text-amber-800 p-3 flex rounded-xl items-center text-xs font-medium border border-amber-200">
              ⚠️ Payment is only required after your phone is repaired and in your hands.
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold mt-4 shadow-xl shadow-blue-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70">
              {loading ? <Loader2 className="animate-spin" /> : "Confirm Booking"}
            </button>

            <button type="button" onClick={() => setStep(1)}
              className="w-full py-3 text-slate-500 font-bold text-sm flex justify-center items-center gap-2 hover:text-slate-900 transition-colors">
              <ArrowLeft size={16} /> Back to Price Check
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
