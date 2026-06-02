// Realme inline SVG — not available on Simple Icons CDN
const RealmeLogo = () => (
  <svg viewBox="0 0 120 36" width="72" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text
      x="0" y="28"
      fontFamily="Arial Black, Arial, sans-serif"
      fontWeight="900"
      fontSize="28"
      fontStyle="italic"
      fill="#111827"
      letterSpacing="-1"
    >
      realme
    </text>
  </svg>
);

type Brand = {
  name: string;
  slug?: string;
  color?: string;
  hoverBg: string;
  hoverBorder: string;
  customLogo?: React.ReactNode;
};

const brands: Brand[] = [
  {
    name: "Apple",
    slug: "apple",
    color: "#000000",
    hoverBg: "hover:bg-slate-900/5",
    hoverBorder: "hover:border-slate-400",
  },
  {
    name: "Samsung",
    slug: "samsung",
    color: "#1428A0",
    hoverBg: "hover:bg-blue-50",
    hoverBorder: "hover:border-blue-300",
  },
  {
    name: "OnePlus",
    slug: "oneplus",
    color: "#F5010C",
    hoverBg: "hover:bg-red-50",
    hoverBorder: "hover:border-red-300",
  },
  {
    name: "Xiaomi",
    slug: "xiaomi",
    color: "#FF6900",
    hoverBg: "hover:bg-orange-50",
    hoverBorder: "hover:border-orange-300",
  },
  {
    name: "Vivo",
    slug: "vivo",
    color: "#415FFF",
    hoverBg: "hover:bg-indigo-50",
    hoverBorder: "hover:border-indigo-300",
  },
  {
    name: "Oppo",
    slug: "oppo",
    color: "#1D6F42",
    hoverBg: "hover:bg-green-50",
    hoverBorder: "hover:border-green-300",
  },
  {
    name: "Realme",
    hoverBg: "hover:bg-slate-100",
    hoverBorder: "hover:border-slate-300",
    customLogo: <RealmeLogo />,
  },
  {
    name: "Google Pixel",
    slug: "google",
    color: "#4285F4",
    hoverBg: "hover:bg-blue-50",
    hoverBorder: "hover:border-blue-300",
  },
];

import React from "react";

export default function Brands() {
  return (
    <section id="brands" className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Brands We Repair
          </h2>
          <p className="text-lg text-slate-500">
            We fix all major smartphone brands with genuine OEM parts — same day, at your door.
          </p>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-4 md:gap-6 items-center justify-items-center">
          {brands.map((brand) => (
            <div
              key={brand.name}
              title={brand.name}
              className={`group relative flex items-center justify-center w-full aspect-square max-w-[110px] bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-110 ${brand.hoverBg} ${brand.hoverBorder}`}
            >
              {brand.customLogo ? (
                <div className="flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  {brand.customLogo}
                </div>
              ) : (
                <img
                  src={`https://cdn.simpleicons.org/${brand.slug}/${brand.color!.replace("#", "")}`}
                  alt={brand.name}
                  width={44}
                  height={44}
                  className="object-contain transition-transform duration-300 group-hover:scale-110"
                />
              )}

              {/* Tooltip on hover */}
              <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10 shadow-lg">
                {brand.name}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
