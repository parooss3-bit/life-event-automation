/*
 * Home Page — Service Directory Research Report
 * Design: Contemporary Research Publication with Bold Accents
 * Typography: Fraunces (display) + Outfit (body)
 * Colors: Off-white bg, charcoal text, teal accent, color-coded categories
 */

import { useState, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Cell,
} from "recharts";
import { categories, keyStats, categoryTypes, benefitFactors } from "@/lib/data";
import { RevenueCalculator } from "@/components/RevenueCalculator";
import { SearchBar } from "@/components/SearchBar";
import { CategoryComparison } from "@/components/CategoryComparison";
import { PremiumUpsell } from "@/components/PremiumUpsell";
import { AffiliateRecommendations } from "@/components/AffiliateRecommendations";

const HERO_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663424042290/CrmQHjUTDYyXeQgzWQPgrV/hero-banner-5h42jyGWDMG6s9odYuaPGD.webp";

function useIntersectionObserver(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, visible } = useIntersectionObserver(0.3);
  useEffect(() => {
    if (!visible) return;
    const duration = 1200;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [visible, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

function StatCard({ stat, delay }: { stat: typeof keyStats[0]; delay: number }) {
  const { ref, visible } = useIntersectionObserver();
  return (
    <div
      ref={ref}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      <div className="font-display text-4xl font-bold text-[#0D7A6B] mb-2 leading-none">
        {stat.value}
      </div>
      <p className="text-gray-700 text-sm leading-snug mb-2">{stat.label}</p>
      <span className="text-xs text-gray-400 font-medium">{stat.source}</span>
    </div>
  );
}

function CategoryCard({ cat, delay }: { cat: typeof categories[0]; delay: number }) {
  const [expanded, setExpanded] = useState(false);
  const { ref, visible } = useIntersectionObserver();
  return (
    <div
      ref={ref}
      className="category-card bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
        borderLeft: `4px solid ${cat.borderColor}`,
      }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{cat.icon}</span>
            <div>
              <h3 className="font-display font-semibold text-gray-900 text-base leading-tight">
                {cat.name}
              </h3>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block"
                style={{ backgroundColor: cat.bgColor, color: cat.color }}
              >
                {cat.type.charAt(0).toUpperCase() + cat.type.slice(1)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-display font-bold text-xl" style={{ color: cat.color }}>
              {cat.directoryBenefitScore}
            </div>
            <div className="text-xs text-gray-400">score</div>
          </div>
        </div>

        {/* Benefit Score Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Directory Benefit Score</span>
            <span>{cat.directoryBenefitScore}/100</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: visible ? `${cat.directoryBenefitScore}%` : "0%",
                backgroundColor: cat.color,
                transitionDelay: `${delay + 200}ms`,
              }}
            />
          </div>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
          {cat.description}
        </p>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="text-center p-2 rounded-lg" style={{ backgroundColor: cat.bgColor }}>
            <div className="font-bold text-xs" style={{ color: cat.color }}>
              {cat.marketSize}
            </div>
            <div className="text-xs text-gray-500">Market</div>
          </div>
          <div className="text-center p-2 rounded-lg" style={{ backgroundColor: cat.bgColor }}>
            <div className="font-bold text-xs" style={{ color: cat.color }}>
              {cat.avgMonthlySearches}
            </div>
            <div className="text-xs text-gray-500">Searches/mo</div>
          </div>
          <div className="text-center p-2 rounded-lg" style={{ backgroundColor: cat.bgColor }}>
            <div className="font-bold text-xs" style={{ color: cat.color }}>
              {cat.revenuePerListing}
            </div>
            <div className="text-xs text-gray-500">Listing Rev.</div>
          </div>
        </div>

        {/* Expand toggle */}
        <button
          className="mt-3 text-xs font-medium flex items-center gap-1 transition-colors"
          style={{ color: cat.color }}
        >
          {expanded ? "▲ Less detail" : "▼ More detail"}
        </button>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div
          className="px-5 pb-5 border-t"
          style={{ borderColor: cat.bgColor, backgroundColor: cat.bgColor + "60" }}
        >
          <div className="pt-4">
            <h4 className="font-semibold text-gray-800 text-sm mb-2">Why It Works</h4>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">{cat.whyItWorks}</p>

            <h4 className="font-semibold text-gray-800 text-sm mb-2">Sub-Services</h4>
            <div className="flex flex-wrap gap-1.5">
              {cat.subServices.map((s) => (
                <span
                  key={s}
                  className="text-xs px-2 py-1 rounded-full border"
                  style={{ borderColor: cat.color + "40", color: cat.color, backgroundColor: "white" }}
                >
                  {s}
                </span>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {cat.stats.map((st) => (
                <div key={st.label} className="text-center">
                  <div className="font-display font-bold text-sm" style={{ color: cat.color }}>
                    {st.value}
                  </div>
                  <div className="text-xs text-gray-500">{st.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const CHART_COLORS = categories.map((c) => c.color);

function BenefitScoreChart() {
  const { ref, visible } = useIntersectionObserver(0.1);
  const data = categories.map((c) => ({
    name: c.name.split(" ")[0],
    score: c.directoryBenefitScore,
    color: c.color,
  }));
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      <ResponsiveContainer width="100%" height={340}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#555", fontFamily: "Outfit" }}
            angle={-35}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            domain={[70, 100]}
            tick={{ fontSize: 11, fill: "#888", fontFamily: "Outfit" }}
          />
          <Tooltip
            contentStyle={{
              fontFamily: "Outfit",
              fontSize: 13,
              borderRadius: 8,
              border: "1px solid #e5e7eb",
            }}
            formatter={(v) => [`${v}/100`, "Benefit Score"]}
          />
          <Bar dataKey="score" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={CHART_COLORS[i]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function RadarChartSection() {
  const { ref, visible } = useIntersectionObserver(0.1);
  const radarData = [
    { subject: "Market Size", Healthcare: 95, HomeImprovement: 75, Professional: 90, Restaurants: 70 },
    { subject: "Search Volume", Healthcare: 90, HomeImprovement: 72, Professional: 85, Restaurants: 88 },
    { subject: "Listing Revenue", Healthcare: 92, HomeImprovement: 88, Professional: 95, Restaurants: 60 },
    { subject: "Benefit Score", Healthcare: 94, HomeImprovement: 92, Professional: 90, Restaurants: 95 },
    { subject: "Customer LTV", Healthcare: 90, HomeImprovement: 88, Professional: 92, Restaurants: 55 },
  ];
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.7s ease 0.2s",
      }}
    >
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontSize: 11, fill: "#555", fontFamily: "Outfit" }}
          />
          <Radar name="Healthcare" dataKey="Healthcare" stroke="#0D7A6B" fill="#0D7A6B" fillOpacity={0.15} />
          <Radar name="Home Improvement" dataKey="HomeImprovement" stroke="#1A6B3C" fill="#1A6B3C" fillOpacity={0.15} />
          <Radar name="Professional" dataKey="Professional" stroke="#1E4D8C" fill="#1E4D8C" fillOpacity={0.15} />
          <Radar name="Restaurants" dataKey="Restaurants" stroke="#D4470A" fill="#D4470A" fillOpacity={0.15} />
          <Tooltip
            contentStyle={{
              fontFamily: "Outfit",
              fontSize: 12,
              borderRadius: 8,
              border: "1px solid #e5e7eb",
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-4 mt-2">
        {[
          { label: "Healthcare", color: "#0D7A6B" },
          { label: "Home Improvement", color: "#1A6B3C" },
          { label: "Professional", color: "#1E4D8C" },
          { label: "Restaurants", color: "#D4470A" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 text-sm text-gray-600">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function BenefitFactorCard({ factor, delay }: { factor: typeof benefitFactors[0]; delay: number }) {
  const { ref, visible } = useIntersectionObserver();
  const impactColor =
    factor.impact === "Very High"
      ? "#0D7A6B"
      : factor.impact === "High"
      ? "#1E4D8C"
      : "#D4820A";
  return (
    <div
      ref={ref}
      className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      <div className="text-3xl mb-3">{factor.icon}</div>
      <h3 className="font-display font-semibold text-gray-900 mb-2">{factor.title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed mb-3">{factor.description}</p>
      <span
        className="text-xs font-semibold px-2.5 py-1 rounded-full"
        style={{ backgroundColor: impactColor + "15", color: impactColor }}
      >
        Impact: {factor.impact}
      </span>
    </div>
  );
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"cards" | "chart">("cards");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof categories>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Search through categories and their sub-services
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(query) ||
        cat.keyBenefit.toLowerCase().includes(query) ||
        cat.subServices.some((s) => s.toLowerCase().includes(query))
    );
    setSearchResults(results);
  }, [searchQuery]);

  const handleSelectSearchResult = (categoryId: string) => {
    setActiveFilter("all");
    setSearchQuery("");
    setShowSearchResults(false);
    // Scroll to the category
    setTimeout(() => {
      const element = document.getElementById(`category-${categoryId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  const filteredCategories =
    activeFilter === "all"
      ? categories
      : categories.filter((c) => c.type === activeFilter);

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ minHeight: 480 }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A2A24]/90 via-[#0A2A24]/70 to-transparent" />
        <div className="relative container py-20 md:py-28">
          <div className="max-w-2xl animate-fade-up">
            <span className="inline-block text-[#4ECDC4] text-sm font-semibold tracking-widest uppercase mb-4">
              Research Report · 2025
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Service Businesses That Benefit from{" "}
              <em className="not-italic text-[#4ECDC4]">Directory Websites</em>
            </h1>
            <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-xl">
              A comprehensive analysis of 12 service industry categories — ranked by directory benefit score, market size, and revenue potential.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#categories"
                className="inline-flex items-center gap-2 bg-[#0D7A6B] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#0B6A5C] transition-colors"
              >
                Explore Categories ↓
              </a>
              <a
                href="#charts"
                className="inline-flex items-center gap-2 bg-white/15 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-white/25 transition-colors border border-white/30"
              >
                View Charts ↓
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── KEY STATS ── */}
      <section className="py-14 bg-[#FAFAF8]">
        <div className="container">
          <div className="text-center mb-10">
            <span className="text-[#0D7A6B] text-sm font-semibold tracking-widest uppercase">
              By the Numbers
            </span>
            <h2 className="font-display text-3xl font-bold text-gray-900 mt-2">
              The Directory Opportunity
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {keyStats.map((s, i) => (
              <StatCard key={i} stat={s} delay={i * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY DIRECTORIES WORK ── */}
      <section className="py-14 bg-white">
        <div className="container">
          <div className="text-center mb-10">
            <span className="text-[#0D7A6B] text-sm font-semibold tracking-widest uppercase">
              Key Factors
            </span>
            <h2 className="font-display text-3xl font-bold text-gray-900 mt-2">
              Why Certain Businesses Benefit Most
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm leading-relaxed">
              Not all service businesses benefit equally. These six factors determine how much a directory listing can transform a business's growth trajectory.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefitFactors.map((f, i) => (
              <BenefitFactorCard key={f.title} factor={f} delay={i * 80} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CHARTS ── */}
      <section id="charts" className="py-14 bg-[#FAFAF8]">
        <div className="container">
          <div className="text-center mb-10">
            <span className="text-[#0D7A6B] text-sm font-semibold tracking-widest uppercase">
              Data Visualization
            </span>
            <h2 className="font-display text-3xl font-bold text-gray-900 mt-2">
              Directory Benefit Analysis
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-display font-semibold text-gray-900 mb-1">
                Benefit Score by Category
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Composite score (0–100) based on search volume, market size, listing revenue, and customer LTV.
              </p>
              <BenefitScoreChart />
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-display font-semibold text-gray-900 mb-1">
                Top 4 Categories — Multi-Dimensional Comparison
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Radar chart comparing the top four categories across five key dimensions.
              </p>
              <RadarChartSection />
            </div>
          </div>
        </div>
      </section>

      {/* ── SEARCH & FILTER ── */}
      <section className="py-14 bg-white">
        <div className="container">
          <div className="text-center mb-8">
            <span className="text-[#0D7A6B] text-sm font-semibold tracking-widest uppercase">
              Quick Discovery
            </span>
            <h2 className="font-display text-3xl font-bold text-gray-900 mt-2">
              Find Your Category
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm leading-relaxed">
              Search by service name to instantly find the most relevant category for your directory business.
            </p>
          </div>
          <SearchBar
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
            searchResults={searchResults}
            showResults={showSearchResults}
            onShowResults={setShowSearchResults}
            onSelectCategory={handleSelectSearchResult}
          />
        </div>
      </section>

      {/* ── REVENUE CALCULATOR ── */}
      <section id="calculator" className="py-14 bg-[#FAFAF8]">
        <div className="container">
          <div className="text-center mb-8">
            <span className="text-[#0D7A6B] text-sm font-semibold tracking-widest uppercase">
              Monetization
            </span>
            <h2 className="font-display text-3xl font-bold text-gray-900 mt-2">
              Estimate Your Revenue
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm leading-relaxed">
              Use the calculator below to estimate your potential monthly earnings based on the number of listings you plan to offer.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <RevenueCalculator />
          </div>
        </div>
      </section>

      {/* ── CATEGORY COMPARISON ── */}
      <section id="comparison" className="py-14 bg-white">
        <div className="container">
          <div className="text-center mb-8">
            <span className="text-[#0D7A6B] text-sm font-semibold tracking-widest uppercase">
              Analysis Tools
            </span>
            <h2 className="font-display text-3xl font-bold text-gray-900 mt-2">
              Compare Categories
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm leading-relaxed">
              Select multiple categories to compare metrics and download a side-by-side analysis report.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <CategoryComparison />
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section id="categories" className="py-14 bg-white">
        <div className="container">
          <div className="text-center mb-8">
            <span className="text-[#0D7A6B] text-sm font-semibold tracking-widest uppercase">
              12 Categories
            </span>
            <h2 className="font-display text-3xl font-bold text-gray-900 mt-2">
              Service Business Categories
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm leading-relaxed">
              Click any card to expand details, sub-services, and key statistics. Filter by category type below.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categoryTypes.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveFilter(t.id)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  backgroundColor: activeFilter === t.id ? "#0D7A6B" : "#F3F4F6",
                  color: activeFilter === t.id ? "white" : "#374151",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex justify-end mb-6">
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("cards")}
                className="px-3 py-1.5 rounded-md text-sm font-medium transition-all"
                style={{
                  backgroundColor: activeTab === "cards" ? "white" : "transparent",
                  color: activeTab === "cards" ? "#0D7A6B" : "#6B7280",
                  boxShadow: activeTab === "cards" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                }}
              >
                Cards
              </button>
              <button
                onClick={() => setActiveTab("chart")}
                className="px-3 py-1.5 rounded-md text-sm font-medium transition-all"
                style={{
                  backgroundColor: activeTab === "chart" ? "white" : "transparent",
                  color: activeTab === "chart" ? "#0D7A6B" : "#6B7280",
                  boxShadow: activeTab === "chart" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                }}
              >
                Chart
              </button>
            </div>
          </div>

          {activeTab === "cards" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCategories.map((cat, i) => (
                <div key={cat.id} id={`category-${cat.id}`}>
                  <CategoryCard cat={cat} delay={i * 60} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#FAFAF8] rounded-xl p-6 border border-gray-100">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={filteredCategories.map((c) => ({
                    name: c.name,
                    score: c.directoryBenefitScore,
                    color: c.color,
                  }))}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                  <XAxis
                    type="number"
                    domain={[70, 100]}
                    tick={{ fontSize: 11, fill: "#888", fontFamily: "Outfit" }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#555", fontFamily: "Outfit" }}
                    width={115}
                  />
                  <Tooltip
                    contentStyle={{
                      fontFamily: "Outfit",
                      fontSize: 13,
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                    }}
                    formatter={(v) => [`${v}/100`, "Benefit Score"]}
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                    {filteredCategories.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </section>

      {/* ── SUMMARY TABLE ── */}
      <section className="py-14 bg-[#FAFAF8]">
        <div className="container">
          <div className="text-center mb-10">
            <span className="text-[#0D7A6B] text-sm font-semibold tracking-widest uppercase">
              Quick Reference
            </span>
            <h2 className="font-display text-3xl font-bold text-gray-900 mt-2">
              All Categories at a Glance
            </h2>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-700">Category</th>
                    <th className="text-left px-4 py-3.5 font-semibold text-gray-700">Type</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-gray-700">Benefit Score</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-gray-700">Market Size</th>
                    <th className="text-right px-4 py-3.5 font-semibold text-gray-700">Listing Revenue</th>
                    <th className="text-left px-4 py-3.5 font-semibold text-gray-700">Key Benefit</th>
                  </tr>
                </thead>
                <tbody>
                  {[...categories]
                    .sort((a, b) => b.directoryBenefitScore - a.directoryBenefitScore)
                    .map((cat, i) => (
                      <tr
                        key={cat.id}
                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <span className="text-lg">{cat.icon}</span>
                            <span className="font-medium text-gray-900">{cat.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className="text-xs font-medium px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: cat.bgColor, color: cat.color }}
                          >
                            {cat.type.charAt(0).toUpperCase() + cat.type.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${cat.directoryBenefitScore}%`,
                                  backgroundColor: cat.color,
                                }}
                              />
                            </div>
                            <span className="font-semibold" style={{ color: cat.color }}>
                              {cat.directoryBenefitScore}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-right text-gray-700">{cat.marketSize}</td>
                        <td className="px-4 py-3.5 text-right text-gray-700">{cat.revenuePerListing}</td>
                        <td className="px-4 py-3.5 text-gray-600">{cat.keyBenefit}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── MONETIZATION SECTIONS ── */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container">
          {/* Premium Upsell Banner */}
          <PremiumUpsell variant="banner" position="after-charts" />
        </div>
      </section>

      {/* Affiliate Recommendations */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container">
          <AffiliateRecommendations position="after-comparison" />
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0A2A24] text-white py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <h3 className="font-display text-xl font-bold mb-2">
                Service Directory Research
              </h3>
              <p className="text-white/60 text-sm max-w-sm leading-relaxed">
                A comprehensive analysis of service business categories and their potential to benefit from online directory websites.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3 text-white/80">Sources</h4>
              <ul className="text-white/50 text-xs space-y-1">
                <li>Ideal Directories — Business Category Analysis</li>
                <li>BrightLocal — Local SEO Statistics 2024</li>
                <li>Jasmine Directory — Niche Market Research</li>
                <li>RadiusTheme — Directory Niche Guide</li>
                <li>Business Research Company — Market Data</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/10 text-white/40 text-xs">
            Research compiled March 2025. Data reflects publicly available market research and industry analysis.
          </div>
        </div>
      </footer>
    </div>
  );
}
