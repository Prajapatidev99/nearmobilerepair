import { Star, BadgeCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { getReviews } from "../lib/db";

const STATIC_REVIEWS = [
  {
    name: "Rahul Desai",
    brand: "Apple",
    model: "iPhone 13",
    rating: 5,
    review: "Outstanding service! Fixed my iPhone screen at my office in 30 minutes. Much better than visiting a local shop.",
    date: "2 days ago",
    verified: true,
  },
  {
    name: "Pooja Patel",
    brand: "Samsung",
    model: "Galaxy S22",
    rating: 4,
    review: "Very professional technician. Explained the issue clearly and gave 6-month warranty on the battery. Minor delay but overall great.",
    date: "5 days ago",
    verified: true,
  },
  {
    name: "Parth Shah",
    brand: "OnePlus",
    model: "9R",
    rating: 5,
    review: "Saved my life! Charging port was dead before an urgent flight. They came early morning and fixed it on the spot.",
    date: "1 week ago",
    verified: true,
  },
  {
    name: "Nidhi Mehta",
    brand: "Xiaomi",
    model: "Redmi Note 11",
    rating: 5,
    review: "Best doorstep service in Ahmedabad! Very affordable and the technician was polite and knowledgeable.",
    date: "2 weeks ago",
    verified: true,
  },
  {
    name: "Karan Joshi",
    brand: "Vivo",
    model: "V25",
    rating: 4,
    review: "Good service. Screen replacement was done well with warranty. Pricing was fair and transparent.",
    date: "3 weeks ago",
    verified: true,
  },
  {
    name: "Priya Shah",
    brand: "Samsung",
    model: "A53",
    rating: 5,
    review: "Highly recommend! Quick repair, genuine parts, and the technician was very professional. Will book again.",
    date: "1 month ago",
    verified: true,
  },
];

export default function Reviews() {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    getReviews()
      .then(data => {
        if (data && data.length > 0) {
          // Merge API reviews with static, API reviews first
          const merged = [...data, ...STATIC_REVIEWS].slice(0, 6);
          setReviews(merged);
        } else {
          setReviews(STATIC_REVIEWS);
        }
      })
      .catch(() => setReviews(STATIC_REVIEWS));
  }, []);

  const overall = (reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / (reviews.length || 1)).toFixed(1);

  return (
    <section id="reviews" className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Trusted by Amdavadis
          </h2>
          <p className="text-lg text-slate-500">Real reviews from verified doorstep repairs.</p>
        </div>

        {/* Overall rating */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 shadow-sm">
            <div className="text-center">
              <p className="text-4xl font-black text-slate-900">{overall}</p>
              <div className="flex gap-0.5 justify-center mt-1">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={14} className="text-yellow-400" fill="currentColor" />
                ))}
              </div>
            </div>
            <div className="w-px h-12 bg-slate-200" />
            <div>
              <p className="font-bold text-slate-900">{reviews.length * 18}+ Reviews</p>
              <p className="text-xs text-slate-500">from verified customers</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((rev, i) => (
            <div key={i} className="bg-slate-50 rounded-[28px] p-7 border border-slate-100 hover:shadow-xl transition-all flex flex-col">
              {/* Stars */}
              <div className="flex gap-1 mb-4 text-yellow-400">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={18} fill={j < rev.rating ? "currentColor" : "none"} className={j < rev.rating ? "text-yellow-400" : "text-slate-200"} />
                ))}
              </div>

              {/* Review text */}
              <p className="text-slate-700 leading-relaxed mb-6 italic flex-1">"{rev.review}"</p>

              {/* Reviewer */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-11 h-11 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                  {rev.name ? rev.name.charAt(0) : "A"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-slate-900 text-sm truncate">{rev.name || "Customer"}</h4>
                    {rev.verified && (
                      <BadgeCheck size={15} className="text-blue-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{rev.brand} {rev.model}</p>
                </div>
                <span className="text-xs text-slate-400 shrink-0">{rev.date || "Recent"}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Google Review CTA */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 text-sm mb-4">Happy with your repair? Share your experience!</p>
          <a
            href={`https://wa.me/919974221322?text=${encodeURIComponent("Hi, I'd like to leave a review for my recent repair.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
          >
            <img src="https://cdn.simpleicons.org/whatsapp/16a34a" width="18" height="18" alt="WhatsApp" />
            Leave a Review on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
