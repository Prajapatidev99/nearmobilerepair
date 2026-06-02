import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import USPs from "../components/USPs";
import Services from "../components/Services";
import Pricing from "../components/Pricing";
import Brands from "../components/Brands";

import Process from "../components/Process";
import Reviews from "../components/Reviews";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";

export default function Home() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handler = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "NearMobileRepair",
    "description": "Doorstep mobile repair service in Ahmedabad. Same-day screen, battery, charging port and camera repairs at your home.",
    "telephone": "+91-9974221322",
    "url": "https://nearmobilerepair.com",
    "areaServed": "Ahmedabad, Gujarat, India",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Ahmedabad",
      "addressRegion": "Gujarat",
      "addressCountry": "IN"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "1200"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
        "opens": "09:00",
        "closes": "20:00"
      }
    ],
    "sameAs": ["https://wa.me/919974221322"]
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Doorstep Mobile Repair in Ahmedabad | NearMobileRepair</title>
        <meta name="description" content="Get professional doorstep mobile repair services in Ahmedabad. Affordable, quick, and reliable combo and battery replacements directly at your home." />
        <meta name="keywords" content="mobile repair ahmedabad, doorstep phone repair, screen replacement ahmedabad, mobile battery repair, iphone repair ahmedabad, samsung repair ahmedabad, navrangpura mobile repair, bopal phone repair" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Doorstep Mobile Repair in Ahmedabad | NearMobileRepair" />
        <meta property="og:description" content="Affordable & professional doorstep mobile repair in Ahmedabad. Instant price check and booking on WhatsApp." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Doorstep Mobile Repair in Ahmedabad | NearMobileRepair" />
        <meta name="twitter:description" content="Book expert doorstep mobile repair across Ahmedabad today. Instant quote and reliable service." />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Header />
      <main>
        <Hero />
        <Stats />
        <USPs />
        <Services />
        <Pricing />
        <Brands />
        <Process />
        <Reviews />
        <FAQ />
      </main>
      <Footer />

      {/* Floating WhatsApp CTA */}
      <a
        href="https://wa.me/919974221322"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-fab fixed bottom-6 right-6 z-50 inline-flex items-center justify-center w-16 h-16 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-transform"
        style={{ background: "#25D366" }}
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        <img src="https://cdn.simpleicons.org/whatsapp/ffffff" alt="WhatsApp" width="30" height="30" style={{ display: "block" }} />
      </a>

      {/* Back to Top button */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full bg-slate-900 text-white shadow-xl flex items-center justify-center hover:bg-slate-700 transition-all hover:scale-110 active:scale-95"
          aria-label="Back to top"
          title="Back to top"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      )}
    </div>
  );
}
