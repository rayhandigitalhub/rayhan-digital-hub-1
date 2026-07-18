import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion, useInView, MotionConfig } from "framer-motion";
import {
  Menu,
  Moon,
  Sun,
  X,
  ArrowRight,
  TrendingUp,
  Users,
  Search,
  Share2,
  Target,
  Facebook,
  Sparkles,
  ClipboardCheck,
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Send,
  Linkedin,
  MessageCircle,
  Instagram,
  BookOpen,
  Clock,
  Calendar,
  Award,
  Compass,
  Briefcase,
  CheckCircle2,
  ArrowUpRight,
  Heart,
  Globe,
  Loader2,
  BadgeCheck,
  ShieldCheck,
  Trophy,
  HelpCircle,
  ChevronDown,
  ExternalLink,
  Building2,
  Zap,
  Rocket,
  Layers,
  Gauge,
  ArrowUp,
} from "lucide-react";

import { siteConfig } from "./siteConfig";

const NAV_ITEMS = siteConfig.nav;

const NAVBAR_HEIGHT = 80;

// ---------------------------------------------------------------------
// scrollToSection — single shared smooth-scroll helper, offset for the
// sticky navbar height. Previously this exact logic was copy-pasted
// into Navbar, Hero, Services, Portfolio, CTABanner, and Footer; it now
// lives in one place so behavior (and any future easing/offset tweak)
// stays in sync everywhere it's used.
// ---------------------------------------------------------------------
function scrollToSection(e, id) {
  if (e && e.preventDefault) e.preventDefault();
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT + 1;
  window.scrollTo({ top, behavior: "smooth" });
}

// ---------------------------------------------------------------------
// useCountUp — shared count-up-on-scroll-into-view hook. Previously
// duplicated (with only a duration constant differing) between
// StatCounter (Hero) and StatCard (Stats section).
// ---------------------------------------------------------------------
function useCountUp(value, duration = 1500) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const startTime = performance.now();
    let frameId;
    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * value));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [inView, value, duration]);

  return { ref, count };
}

// ---------------------------------------------------------------------
// Seo.tsx — semantic <head> + structured data manager.
//
// Sets document title, meta description/keywords, canonical URL, Open
// Graph and Twitter Card tags, and injects Person + ProfessionalService
// JSON-LD schema — all derived from siteConfig so a single edit there
// keeps every surface (browser tab, Google result, social share card,
// rich snippet) in sync. Framework-agnostic: works today in a plain
// Vite/CRA app and drops in cleanly if this is later wrapped by
// Next.js `generateMetadata` or a Headless WordPress `yoast_head_json`
// response — only this component would need to change.
// ---------------------------------------------------------------------
function upsertMetaTag(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLinkTag(rel, href) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function upsertJsonLd(id, data) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function upsertStylesheetLink(href, id) {
  if (document.getElementById(id)) return;
  const preconnect1 = document.createElement("link");
  preconnect1.rel = "preconnect";
  preconnect1.href = "https://fonts.googleapis.com";
  document.head.appendChild(preconnect1);

  const preconnect2 = document.createElement("link");
  preconnect2.rel = "preconnect";
  preconnect2.href = "https://fonts.gstatic.com";
  preconnect2.crossOrigin = "anonymous";
  document.head.appendChild(preconnect2);

  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

function upsertGlobalStyle(id, css) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("style");
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = css;
}

function Seo() {
  useEffect(() => {
    const { brand, contact, seo, socials } = siteConfig;

    document.title = seo.title;
    document.documentElement.lang = "en";

    // Premium display typeface, loaded once and applied globally via
    // element selectors — keeps every existing heading className intact
    // while giving the desktop layout a more considered type system:
    // Manrope (display, tight/geometric) for headings + eyebrows,
    // the existing UI sans for body copy and controls.
    upsertStylesheetLink(
      "https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&display=swap",
      "font-manrope"
    );
    upsertGlobalStyle(
      "premium-typography",
      "h1,h2,h3,.font-display{font-family:'Manrope',ui-sans-serif,system-ui,sans-serif;letter-spacing:-0.01em;}" +
        "@media (prefers-reduced-motion: no-preference){html{scroll-behavior:smooth;}}" +
        "::selection{background:rgba(245,158,11,0.25);}" +
        // Visible keyboard-focus ring on every interactive element. The
        // site previously relied on default browser focus styling (which
        // Tailwind's reset dims/removes in places), leaving keyboard users
        // with little or no indication of focus. :focus-visible keeps this
        // out of the way for mouse/touch users.
        "a:focus-visible,button:focus-visible,input:focus-visible,textarea:focus-visible,[tabindex]:focus-visible{outline:2px solid #f59e0b;outline-offset:2px;border-radius:6px;}"
    );

    // Responsive viewport — normally set in index.html, added defensively
    // here so the page still renders correctly at mobile widths if this
    // component is ever mounted into a shell that omits it.
    upsertMetaTag("name", "viewport", "width=device-width, initial-scale=1");

    upsertMetaTag("name", "description", seo.description);
    upsertMetaTag("name", "keywords", seo.keywords.join(", "));
    upsertMetaTag("name", "author", brand.name);
    upsertMetaTag("name", "robots", "index, follow");
    upsertMetaTag("name", "theme-color", seo.themeColor);

    // Canonical URL — prevents duplicate-content SEO issues.
    upsertLinkTag("canonical", seo.siteUrl + "/");

    // Open Graph (Facebook, LinkedIn, WhatsApp link previews).
    upsertMetaTag("property", "og:type", "website");
    upsertMetaTag("property", "og:title", seo.title);
    upsertMetaTag("property", "og:description", seo.description);
    upsertMetaTag("property", "og:url", seo.siteUrl + "/");
    upsertMetaTag("property", "og:image", seo.ogImage);
    upsertMetaTag("property", "og:image:width", "1200");
    upsertMetaTag("property", "og:image:height", "630");
    upsertMetaTag("property", "og:image:alt", seo.title);
    upsertMetaTag("property", "og:locale", seo.locale);
    upsertMetaTag("property", "og:site_name", brand.business);

    // Twitter Card.
    upsertMetaTag("name", "twitter:card", "summary_large_image");
    upsertMetaTag("name", "twitter:title", seo.title);
    upsertMetaTag("name", "twitter:description", seo.description);
    upsertMetaTag("name", "twitter:image", seo.ogImage);
    upsertMetaTag("name", "twitter:image:alt", seo.title);
    upsertMetaTag("name", "twitter:site", seo.twitterHandle);

    // Person schema — powers the Knowledge Panel / rich results for
    // Rayhan's name searches.
    upsertJsonLd("schema-person", {
      "@context": "https://schema.org",
      "@type": "Person",
      name: brand.name,
      jobTitle: brand.roles[0],
      description: seo.description,
      url: seo.siteUrl,
      image: seo.ogImage,
      email: contact.email,
      telephone: contact.phoneHref,
      address: {
        "@type": "PostalAddress",
        addressLocality: contact.address.locality,
        addressRegion: contact.address.region,
        addressCountry: contact.address.countryCode,
      },
      worksFor: {
        "@type": "Organization",
        name: brand.business,
      },
      sameAs: socials.map((s) => s.href),
    });

    // Organization schema — separate from Person so the business itself
    // (as opposed to its founder) can appear in brand-name searches,
    // sitelinks search box eligibility, and Merchant/Knowledge panels.
    upsertJsonLd("schema-organization", {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: brand.business,
      founder: {
        "@type": "Person",
        name: brand.name,
      },
      foundingDate: String(brand.foundedYear),
      description: seo.description,
      url: seo.siteUrl,
      logo: seo.ogImage,
      email: contact.email,
      telephone: contact.phoneHref,
      sameAs: socials.map((s) => s.href),
    });

    // LocalBusiness schema — powers map-pin / "near me" rich results:
    // address, geo-coordinates, and a click-to-call phone number.
    upsertJsonLd("schema-local-business", {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: brand.business,
      image: seo.ogImage,
      url: seo.siteUrl,
      email: contact.email,
      telephone: contact.phoneHref,
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        streetAddress: contact.address.line1,
        addressLocality: contact.address.locality,
        addressRegion: contact.address.region,
        postalCode: contact.address.postalCode,
        addressCountry: contact.address.countryCode,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: contact.address.lat,
        longitude: contact.address.lng,
      },
      areaServed: "Worldwide (remote)",
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Saturday",
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
        ],
        opens: "10:00",
        closes: "19:00",
      },
      sameAs: socials.map((s) => s.href),
    });

    // FAQPage schema — sourced from the same siteConfig.faqs list that
    // renders the FAQ section, so questions/answers can never drift
    // out of sync between the visible UI and the structured data.
    upsertJsonLd(
      "schema-faq",
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: siteConfig.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }
    );

    // BreadcrumbList schema — this is a one-page site, so each "page"
    // is an in-page section anchor. Still valid per Google's guidance
    // for single-page sites and gives search results a breadcrumb trail.
    upsertJsonLd("schema-breadcrumb", {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [{ id: "home", name: "Home" }, ...siteConfig.nav.filter((n) => n.id !== "home")].map(
        (item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.label || item.name,
          item: seo.siteUrl + "/" + (item.id === "home" ? "" : "#" + item.id),
        })
      ),
    });
  }, []);

  return null;
}

// ---------------------------------------------------------------------
// Navbar.tsx (defined here, not a separate file — Claude Artifacts
// renders a single file and cannot resolve relative module imports
// like `./Navbar`. Copy this block out verbatim into its own
// Navbar.tsx once this is moved into a real Next.js project.)
// ---------------------------------------------------------------------
function Navbar({ isDark, onToggleDark }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState(NAV_ITEMS[0].id);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Scroll detection: switches the navbar into its solid/elevated state.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section detection via IntersectionObserver.
  useEffect(() => {
    const sections = NAV_ITEMS.map((item) =>
      document.getElementById(item.id)
    ).filter(Boolean);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: `-${NAVBAR_HEIGHT}px 0px -60% 0px`,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Keyboard support: close the drawer on Escape and return focus to the
  // menu button that opened it, so keyboard users aren't trapped or lost.
  const menuButtonRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!mobileOpen) return;
    closeButtonRef.current?.focus();
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  // Smooth scroll, offset for the sticky navbar height.
  const handleNavClick = (e, id) => {
    scrollToSection(e, id);
    setMobileOpen(false);
  };

  const shellClasses = isDark
    ? scrolled
      ? "border-b border-neutral-800 bg-neutral-950/85 backdrop-blur-md shadow-sm"
      : "border-b border-transparent bg-neutral-950/60 backdrop-blur-sm"
    : scrolled
    ? "border-b border-neutral-200 bg-white/85 backdrop-blur-md shadow-sm"
    : "border-b border-transparent bg-white/60 backdrop-blur-sm";

  return (
    <motion.header
      initial={{ y: -96, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={"sticky top-0 z-50 w-full transition-colors duration-300 " + shellClasses}
    >
      <div className="mx-auto flex h-20 max-w-[1320px] items-center justify-between px-6 lg:px-12 xl:px-16">
        {/* Brand */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, "home")}
          className="group flex flex-col leading-tight"
        >
          <span
            className={
              "text-lg font-extrabold tracking-tight transition-colors group-hover:text-amber-700 sm:text-xl " +
              (isDark ? "text-white" : "text-neutral-900")
            }
          >
            {siteConfig.brand.name}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-700">
            Founder, {siteConfig.brand.business}
          </span>
        </a>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.id}
                href={"#" + item.id}
                onClick={(e) => handleNavClick(e, item.id)}
                aria-current={isActive ? "true" : undefined}
                className={
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 " +
                  (isActive
                    ? "text-amber-700"
                    : isDark
                    ? "text-neutral-300 hover:text-white"
                    : "text-neutral-600 hover:text-neutral-900")
                }
              >
                {isActive && (
                  <motion.span
                    layoutId="active-nav-pill"
                    className="absolute inset-0 rounded-full bg-amber-500/10"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Toggle dark mode"
            onClick={onToggleDark}
            className={
              "flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-200 hover:border-amber-500 hover:bg-amber-500/10 hover:text-amber-700 " +
              (isDark
                ? "border-neutral-700 text-neutral-200"
                : "border-neutral-200 text-neutral-700")
            }
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isDark ? "sun" : "moon"}
                initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex items-center justify-center"
              >
                {isDark ? (
                  <Sun className="h-[18px] w-[18px]" />
                ) : (
                  <Moon className="h-[18px] w-[18px]" />
                )}
              </motion.span>
            </AnimatePresence>
          </button>

          <button
            type="button"
            ref={menuButtonRef}
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className={
              "flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-amber-500/10 hover:text-amber-700 lg:hidden " +
              (isDark ? "text-neutral-200" : "text-neutral-700")
            }
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <React.Fragment>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
              className="fixed inset-0 z-40 bg-neutral-900/40 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              key="drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className={
                "fixed inset-y-0 right-0 z-50 flex w-3/4 max-w-xs flex-col border-l p-6 shadow-lg lg:hidden " +
                (isDark
                  ? "border-neutral-800 bg-neutral-950"
                  : "border-neutral-200 bg-white")
              }
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col leading-tight">
                  <span
                    className={
                      "text-base font-extrabold " +
                      (isDark ? "text-white" : "text-neutral-900")
                    }
                  >
                    {siteConfig.brand.name}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-700">
                    Founder, {siteConfig.brand.business}
                  </span>
                </div>
                <button
                  type="button"
                  ref={closeButtonRef}
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                  className={
                    "rounded-full p-1.5 hover:bg-amber-500/10 hover:text-amber-700 " +
                    (isDark ? "text-neutral-300" : "text-neutral-600")
                  }
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav aria-label="Mobile" className="mt-8 flex flex-col gap-1">
                {NAV_ITEMS.map((item, i) => {
                  const isActive = activeId === item.id;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.25 }}
                    >
                      <a
                        href={"#" + item.id}
                        onClick={(e) => handleNavClick(e, item.id)}
                        aria-current={isActive ? "true" : undefined}
                        className={
                          "block rounded-lg px-3 py-3 text-base font-medium transition-colors " +
                          (isActive
                            ? "bg-amber-500/10 text-amber-700"
                            : isDark
                            ? "text-neutral-300 hover:text-white"
                            : "text-neutral-700 hover:text-neutral-900")
                        }
                      >
                        {item.label}
                      </a>
                    </motion.div>
                  );
                })}
              </nav>
            </motion.div>
          </React.Fragment>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// ---------------------------------------------------------------------
// Hero.tsx (defined here for the same single-file reason as Navbar —
// Claude Artifacts cannot resolve a separate `./Hero` import. Copy this
// block out verbatim into its own Hero.tsx once this moves into a real
// Next.js project.)
// ---------------------------------------------------------------------
function StatCounter({ value, suffix, label, icon: Icon, isDark }) {
  const { ref, count } = useCountUp(value, 1400);

  return (
    <div ref={ref} className="flex items-center gap-3">
      {Icon && (
        <span
          className={
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl xl:h-10 xl:w-10 " +
            (isDark ? "bg-amber-500/10 text-amber-400" : "bg-amber-100 text-amber-700")
          }
        >
          <Icon className="h-4 w-4 xl:h-[18px] xl:w-[18px]" />
        </span>
      )}
      <div className="flex flex-col">
        <span
          className={
            "text-2xl font-extrabold tracking-tight sm:text-3xl xl:text-4xl " +
            (isDark ? "text-white" : "text-neutral-900")
          }
        >
          {count}
          {suffix}
        </span>
        <span
          className={
            "text-xs font-medium xl:text-sm " +
            (isDark ? "text-neutral-400" : "text-neutral-500")
          }
        >
          {label}
        </span>
      </div>
    </div>
  );
}

const heroContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

function Hero({ isDark }) {
  const scrollTo = scrollToSection;

  return (
    <section
      id="home"
      className={
        "relative flex min-h-[92vh] items-center overflow-hidden pt-20 lg:min-h-screen " +
        (isDark ? "bg-neutral-950" : "bg-[#FBF6EF]")
      }
    >
      {/* Decorative ambient glow + dotted texture */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-amber-400/20 blur-3xl xl:h-[36rem] xl:w-[36rem]" />
        <div className="absolute -right-32 bottom-0 h-[32rem] w-[32rem] rounded-full bg-rose-500/10 blur-3xl xl:h-[38rem] xl:w-[38rem]" />
        <svg
          className={"absolute right-[6%] top-[14%] hidden h-40 w-40 xl:block " + (isDark ? "opacity-[0.08]" : "opacity-[0.15]")}
          viewBox="0 0 120 120"
          fill="none"
        >
          {Array.from({ length: 6 }).map((_, row) =>
            Array.from({ length: 6 }).map((_, col) => (
              <circle key={row + "-" + col} cx={row * 22 + 6} cy={col * 22 + 6} r="2" className="fill-amber-500" />
            ))
          )}
        </svg>
      </div>

      <div className="relative mx-auto grid w-full max-w-[1200px] grid-cols-1 items-center gap-16 px-6 py-20 lg:max-w-[1320px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-10 lg:py-24 xl:max-w-[1440px] xl:gap-20 xl:px-12 2xl:max-w-[1520px]">
        {/* Left column — text */}
        <motion.div
          variants={heroContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={heroItemVariants}
            className={
              "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] backdrop-blur-sm xl:text-[13px] " +
              (isDark
                ? "border-amber-800/50 bg-amber-500/10 text-amber-400"
                : "border-amber-200 bg-amber-100/80 text-amber-700")
            }
          >
            <motion.span
              className="h-2 w-2 rounded-full bg-amber-500"
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
            Currently booking Q3 growth projects
          </motion.div>

          <motion.h1
            variants={heroItemVariants}
            className={
              "mt-7 text-[2.6rem] font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl xl:text-[4.75rem] " +
              (isDark ? "text-white" : "text-neutral-900")
            }
          >
            Turning search traffic
            <br />
            into{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
                real revenue
              </span>
              <motion.svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
              >
                <motion.path
                  d="M2 9 C 50 2, 150 2, 198 9"
                  stroke="url(#heroUnderline)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
                <defs>
                  <linearGradient id="heroUnderline" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#f43f5e" />
                  </linearGradient>
                </defs>
              </motion.svg>
            </span>
            .
          </motion.h1>

          <motion.div
            variants={heroItemVariants}
            className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2"
          >
            <span
              className={
                "text-base font-bold sm:text-lg xl:text-xl " +
                (isDark ? "text-neutral-200" : "text-neutral-800")
              }
            >
              {siteConfig.brand.name} — Founder, {siteConfig.brand.business}
            </span>
          </motion.div>

          <motion.div
            variants={heroItemVariants}
            className="mt-3 flex flex-wrap items-center gap-2"
          >
            {siteConfig.brand.roles.map((role, i) => (
              <span
                key={role}
                className={
                  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold " +
                  (i === 0
                    ? isDark
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-amber-100 text-amber-700"
                    : isDark
                    ? "bg-neutral-900 text-neutral-400"
                    : "bg-neutral-100 text-neutral-600")
                }
              >
                {role}
              </span>
            ))}
          </motion.div>

          <motion.p
            variants={heroItemVariants}
            className={
              "mt-5 max-w-xl text-base leading-relaxed sm:text-lg xl:max-w-2xl xl:text-lg " +
              (isDark ? "text-neutral-400" : "text-neutral-600")
            }
          >
            I plan and run SEO, paid media, and social strategy for brands
            that are done guessing. Every campaign is built around one
            question: does this move pipeline, not just impressions.
          </motion.p>

          <motion.div variants={heroItemVariants} className="mt-9 flex flex-wrap items-center gap-4">
            <motion.a
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              href="#contact"
              onClick={(e) => scrollTo(e, "contact")}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-rose-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-shadow duration-200 hover:shadow-xl hover:shadow-amber-500/35 xl:px-8 xl:py-4 xl:text-base"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Free Consultation
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
              <motion.span
                className="absolute inset-0 -z-0 bg-white/25"
                initial={{ x: "-120%", skewX: -12 }}
                whileHover={{ x: "120%" }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
            </motion.a>
            <motion.a
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              href="#portfolio"
              onClick={(e) => scrollTo(e, "portfolio")}
              className={
                "inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-sm font-semibold backdrop-blur-sm transition-colors duration-200 xl:px-8 xl:py-4 xl:text-base " +
                (isDark
                  ? "border-neutral-700 bg-neutral-900/40 text-neutral-200 hover:border-amber-500 hover:text-amber-400"
                  : "border-neutral-300 bg-white/50 text-neutral-800 hover:border-amber-500 hover:text-amber-700")
              }
            >
              See the Results
            </motion.a>
          </motion.div>

          <motion.div
            variants={heroItemVariants}
            className={
              "mt-16 inline-flex max-w-fit flex-wrap items-center gap-x-10 gap-y-6 rounded-2xl border px-7 py-6 backdrop-blur-sm xl:gap-x-14 xl:px-9 xl:py-7 " +
              (isDark ? "border-neutral-800 bg-neutral-900/40" : "border-neutral-200 bg-white/60")
            }
          >
            <StatCounter value={5} suffix="+" label="Years Experience" icon={Briefcase} isDark={isDark} />
            <StatCounter value={120} suffix="+" label="Projects Completed" icon={Layers} isDark={isDark} />
            <StatCounter value={95} suffix="+" label="Happy Clients" icon={Users} isDark={isDark} />
          </motion.div>
        </motion.div>

        {/* Right column — profile visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="relative mx-auto flex justify-center lg:justify-end"
        >
          <div className="relative h-72 w-72 sm:h-[22rem] sm:w-[22rem] xl:h-[26rem] xl:w-[26rem]">
            {/* Rotating conic ring */}
            <motion.div
              className="absolute -inset-4 rounded-[2.8rem] opacity-70"
              style={{
                background: "conic-gradient(from 0deg, #f59e0b, #fb923c, #f43f5e, #f59e0b)",
                filter: "blur(2px)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500"
              animate={{ rotate: [0, 2.5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <div
              className={
                "absolute inset-[6px] flex items-center justify-center overflow-hidden rounded-[2.2rem] backdrop-blur-sm " +
                (isDark ? "bg-neutral-950/95" : "bg-white/95")
              }
            >
              <span className="bg-gradient-to-br from-amber-500 to-rose-500 bg-clip-text text-7xl font-extrabold text-transparent xl:text-8xl">
                {siteConfig.brand.initials}
              </span>
            </div>

            {/* Floating badge — ranking */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: [0, -8, 0] }}
              transition={{
                opacity: { duration: 0.6, delay: 0.7 },
                y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              }}
              whileHover={{ scale: 1.06 }}
              className={
                "absolute -left-8 top-8 flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold shadow-xl backdrop-blur-md xl:-left-12 " +
                (isDark
                  ? "border-neutral-800 bg-neutral-900/90 text-white"
                  : "border-neutral-100 bg-white/90 text-neutral-800")
              }
            >
              <TrendingUp className="h-4 w-4 text-amber-500" />
              Page-1 rankings
            </motion.div>

            {/* Floating badge — clients */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: [0, 8, 0] }}
              transition={{
                opacity: { duration: 0.6, delay: 0.9 },
                y: { duration: 3.4, repeat: Infinity, ease: "easeInOut" },
              }}
              whileHover={{ scale: 1.06 }}
              className={
                "absolute -right-6 bottom-12 flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold shadow-xl backdrop-blur-md xl:-right-10 " +
                (isDark
                  ? "border-neutral-800 bg-neutral-900/90 text-white"
                  : "border-neutral-100 bg-white/90 text-neutral-800")
              }
            >
              <Users className="h-4 w-4 text-rose-500" />
              95+ Happy Clients
            </motion.div>

            {/* Floating badge — engagement, desktop-only accent */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: [0, 6, 0] }}
              transition={{
                opacity: { duration: 0.6, delay: 1.05 },
                x: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              }}
              className={
                "absolute right-1 top-1/2 hidden -translate-y-1/2 items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold shadow-xl backdrop-blur-md xl:flex xl:translate-x-[60%] " +
                (isDark
                  ? "border-neutral-800 bg-neutral-900/90 text-white"
                  : "border-neutral-100 bg-white/90 text-neutral-800")
              }
            >
              <Sparkles className="h-4 w-4 text-amber-500" />
              Certified strategist
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#brands"
        onClick={(e) => scrollTo(e, "brands")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className={
          "absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] lg:flex " +
          (isDark ? "text-neutral-500" : "text-neutral-400")
        }
      >
        Scroll
        <motion.span
          className={"flex h-9 w-5 items-start justify-center rounded-full border pt-1.5 " + (isDark ? "border-neutral-700" : "border-neutral-300")}
        >
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-amber-500"
            animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.span>
      </motion.a>
    </section>
  );
}

// ---------------------------------------------------------------------
// ClientLogos.tsx (Brands Worked With)
// ---------------------------------------------------------------------
const BRANDS = [
  "NovaWear Fashion",
  "BrightPath Academy",
  "Urban Bites Café",
  "GreenLeaf Organics",
  "TechNest Software",
  "Dr. Farah Rahman Nutrition",
];

function ClientLogos({ isDark }) {
  return (
    <section
      id="brands"
      className={"border-y py-12 " + (isDark ? "border-neutral-800 bg-neutral-950" : "border-neutral-100 bg-white")}
    >
      <div className="mx-auto max-w-[1320px] px-6 lg:px-12 xl:px-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className={"text-center text-xs font-semibold uppercase tracking-[0.2em] " + (isDark ? "text-neutral-600" : "text-neutral-400")}
        >
          Trusted by growing brands
        </motion.p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
          {BRANDS.map((brand, i) => (
            <motion.div
              key={brand}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
              className={
                "flex items-center gap-2 text-sm font-bold tracking-tight grayscale transition-all duration-300 hover:grayscale-0 " +
                (isDark ? "text-neutral-500 hover:text-neutral-200" : "text-neutral-400 hover:text-neutral-700")
              }
            >
              <Building2 className="h-4 w-4 text-amber-500 opacity-60" />
              {brand}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------
// Stats.tsx
// ---------------------------------------------------------------------
const STATS = [
  { icon: Briefcase, value: 120, suffix: "+", label: "Projects Completed" },
  { icon: Users, value: 95, suffix: "+", label: "Happy Clients" },
  { icon: TrendingUp, value: 10000, suffix: "+", label: "Leads Generated" },
  { icon: Rocket, value: 5, suffix: "+", label: "Years of Experience" },
];

function StatCard({ stat, index, isDark }) {
  const { ref, count } = useCountUp(stat.value, 1500);
  const Icon = stat.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className={
        "group relative overflow-hidden rounded-2xl border p-7 text-center shadow-sm transition-all duration-300 hover:shadow-xl " +
        (isDark
          ? "border-neutral-800 bg-neutral-900/60 backdrop-blur-sm hover:border-amber-500/40"
          : "border-neutral-200 bg-white/70 backdrop-blur-sm hover:border-amber-300 hover:shadow-amber-500/10")
      }
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-rose-500 text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
        <Icon className="h-6 w-6" />
      </div>
      <p className={"mt-5 text-3xl font-extrabold sm:text-4xl " + (isDark ? "text-white" : "text-neutral-900")}>
        {count.toLocaleString()}
        {stat.suffix}
      </p>
      <p className={"mt-1.5 text-sm font-medium " + (isDark ? "text-neutral-400" : "text-neutral-500")}>
        {stat.label}
      </p>
    </motion.div>
  );
}

function Stats({ isDark }) {
  return (
    <section id="stats" className={"relative overflow-hidden py-20 " + (isDark ? "bg-neutral-950" : "bg-[#FBF6EF]")}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/3 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-[1320px] px-6 lg:px-12 xl:px-16">
        <div className="grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4">
          {STATS.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} isDark={isDark} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------
// Services.tsx (defined here for the same single-file reason as Navbar
// and Hero — Claude Artifacts cannot resolve a separate `./Services`
// import. Copy this block out verbatim into its own Services.tsx once
// this moves into a real Next.js project.)
// ---------------------------------------------------------------------
const SERVICES = [
  {
    icon: Search,
    title: "Search Engine Optimization (SEO)",
    description:
      "Sustainable, white-hat SEO that grows organic traffic and keeps you ranking on page one long-term.",
  },
  {
    icon: Share2,
    title: "Social Media Marketing (SMM)",
    description:
      "Strategy-driven content and community management that builds a loyal, engaged audience across platforms.",
  },
  {
    icon: Target,
    title: "Google Ads Management",
    description:
      "High-ROI search and display campaigns, built on precise keyword targeting and continuous conversion tracking.",
  },
  {
    icon: Facebook,
    title: "Facebook Ads",
    description:
      "Meta ad campaigns engineered around your ideal audience — turning scroll-by attention into real customers.",
  },
  {
    icon: Sparkles,
    title: "Personal Branding",
    description:
      "Position yourself as the go-to authority in your niche with a cohesive, credible online presence.",
  },
  {
    icon: ClipboardCheck,
    title: "Website SEO Audit",
    description:
      "A full technical and content audit that uncovers exactly what's holding your site back — and how to fix it.",
  },
];

function ServiceCard({ service, index, isDark, onLearnMore }) {
  const Icon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className={
        "group relative rounded-2xl border p-7 shadow-sm transition-all duration-300 hover:shadow-xl " +
        (isDark
          ? "border-neutral-800 bg-neutral-900 hover:border-amber-500/50 hover:shadow-amber-500/5"
          : "border-neutral-200 bg-white hover:border-amber-300 hover:shadow-amber-500/10")
      }
    >
      <div
        className={
          "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-rose-500 text-white transition-transform duration-300 group-hover:scale-110"
        }
      >
        <Icon className="h-6 w-6" />
      </div>

      <h3
        className={
          "mt-5 text-lg font-bold leading-snug " +
          (isDark ? "text-white" : "text-neutral-900")
        }
      >
        {service.title}
      </h3>

      <p
        className={
          "mt-2 text-sm leading-relaxed " +
          (isDark ? "text-neutral-400" : "text-neutral-600")
        }
      >
        {service.description}
      </p>

      <button
        type="button"
        onClick={onLearnMore}
        className={
          "mt-5 inline-flex items-center gap-1.5 text-sm font-semibold transition-transform duration-200 group-hover:translate-x-1 " +
          (isDark ? "text-amber-400" : "text-amber-700")
        }
      >
        Discuss This Service
        <ArrowRight className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

function Services({ isDark }) {
  const scrollTo = scrollToSection;

  return (
    <section
      id="services"
      className={
        "relative overflow-hidden py-24 lg:py-28 xl:py-32 " +
        (isDark ? "bg-neutral-950" : "bg-white")
      }
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1320px] px-6 lg:px-12 xl:px-16">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <span
            className={
              "inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] " +
              (isDark
                ? "border-amber-800/60 bg-amber-500/10 text-amber-400"
                : "border-amber-200 bg-amber-100 text-amber-700")
            }
          >
            Services
          </span>

          <h2
            className={
              "mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.75rem] " +
              (isDark ? "text-white" : "text-neutral-900")
            }
          >
            What I Can{" "}
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
              Help You With
            </span>
          </h2>

          <p
            className={
              "mt-4 text-base leading-relaxed sm:text-lg " +
              (isDark ? "text-neutral-400" : "text-neutral-600")
            }
          >
            Professional digital marketing solutions designed to increase
            visibility, traffic, leads, and revenue.
          </p>
        </motion.div>

        {/* Service cards */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {SERVICES.map((service, index) => (
            <ServiceCard
              key={service.title}
              service={service}
              index={index}
              isDark={isDark}
              onLearnMore={(e) => scrollTo(e, "contact")}
            />
          ))}
        </div>

        {/* CTA box */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={
            "mt-16 flex flex-col items-center gap-6 rounded-2xl border px-8 py-12 text-center sm:flex-row sm:justify-between sm:text-left " +
            (isDark
              ? "border-neutral-800 bg-neutral-900"
              : "border-amber-200 bg-gradient-to-br from-amber-50 to-rose-50")
          }
        >
          <h3
            className={
              "text-2xl font-extrabold tracking-tight sm:text-3xl " +
              (isDark ? "text-white" : "text-neutral-900")
            }
          >
            Ready to Grow Your Business?
          </h3>

          <a
            href="#contact"
            onClick={(e) => scrollTo(e, "contact")}
            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-500/30"
          >
            Book Free Consultation
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------
// Process.tsx (SEO / Growth Process Timeline)
// ---------------------------------------------------------------------
const PROCESS_STEPS = [
  {
    icon: Search,
    title: "Discovery & Audit",
    description: "A full technical, on-page, and competitor audit to uncover exactly what's holding your visibility back.",
  },
  {
    icon: Compass,
    title: "Strategy & Keyword Mapping",
    description: "Buyer-intent keyword research mapped to a content and campaign plan built around your business goals.",
  },
  {
    icon: Layers,
    title: "On-Page & Technical Optimization",
    description: "Site speed, structure, schema, and content fixes implemented to make every page rank-ready.",
  },
  {
    icon: Share2,
    title: "Content, Ads & Link Building",
    description: "Authority content, paid campaigns, and outreach executed in parallel to compound your growth.",
  },
  {
    icon: Gauge,
    title: "Tracking, Reporting & Scaling",
    description: "Transparent monthly reporting on rankings, traffic, and leads — then double down on what's working.",
  },
];

function ProcessStep({ step, index, isDark, isLast }) {
  const Icon = step.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="relative flex flex-1 flex-col items-center text-center"
    >
      {!isLast && (
        <div
          className={
            "absolute left-1/2 top-7 hidden h-px w-full -translate-y-1/2 lg:block " +
            (isDark ? "bg-neutral-800" : "bg-neutral-200")
          }
        />
      )}
      <motion.div
        whileHover={{ scale: 1.1, rotate: 6 }}
        className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-rose-500 text-white shadow-lg shadow-amber-500/25"
      >
        <Icon className="h-6 w-6" />
        <span className={"absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 text-[11px] font-extrabold " + (isDark ? "border-neutral-950 bg-neutral-900 text-amber-400" : "border-white bg-white text-amber-700")}>
          {index + 1}
        </span>
      </motion.div>
      <h3 className={"mt-5 text-base font-bold " + (isDark ? "text-white" : "text-neutral-900")}>
        {step.title}
      </h3>
      <p className={"mt-2 max-w-[220px] text-sm leading-relaxed " + (isDark ? "text-neutral-400" : "text-neutral-600")}>
        {step.description}
      </p>
    </motion.div>
  );
}

function Process({ isDark }) {
  return (
    <section id="process" className={"py-24 lg:py-28 xl:py-32 " + (isDark ? "bg-neutral-950" : "bg-white")}>
      <div className="mx-auto max-w-[1320px] px-6 lg:px-12 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <span
            className={
              "inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] " +
              (isDark ? "border-amber-800/60 bg-amber-500/10 text-amber-400" : "border-amber-200 bg-amber-100 text-amber-700")
            }
          >
            How I Work
          </span>
          <h2
            className={
              "mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.75rem] " +
              (isDark ? "text-white" : "text-neutral-900")
            }
          >
            A Proven{" "}
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
              Growth Process
            </span>
          </h2>
          <p className={"mt-4 text-base leading-relaxed sm:text-lg " + (isDark ? "text-neutral-400" : "text-neutral-600")}>
            Every project follows the same disciplined process — so results
            are predictable, not accidental.
          </p>
        </motion.div>

        <div className="mt-16 flex flex-col gap-12 lg:flex-row lg:gap-6">
          {PROCESS_STEPS.map((step, index) => (
            <ProcessStep
              key={step.title}
              step={step}
              index={index}
              isDark={isDark}
              isLast={index === PROCESS_STEPS.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------
// Portfolio.tsx
// ---------------------------------------------------------------------
const PORTFOLIO_FILTERS = [
  { id: "all", label: "All" },
  { id: "seo", label: "SEO" },
  { id: "smm", label: "Social Media" },
  { id: "ads", label: "Google Ads" },
  { id: "branding", label: "Personal Branding" },
];

const PORTFOLIO_CATEGORY_ICONS = {
  seo: Search,
  smm: Share2,
  ads: Target,
  branding: Sparkles,
};

const PROJECTS = [
  {
    category: "seo",
    tag: "SEO Strategy",
    client: "NovaWear Fashion",
    challenge: "Stuck on page 4 of Google with almost no organic sales.",
    solution: "Technical SEO overhaul plus a content-cluster strategy targeting buyer-intent keywords.",
    metric: "+214%",
    metricLabel: "Organic traffic",
  },
  {
    category: "ads",
    tag: "Google Ads",
    client: "BrightPath Academy",
    challenge: "High ad spend with weak lead quality from search campaigns.",
    solution: "Rebuilt campaign structure with intent-based ad groups and optimized landing pages.",
    metric: "-38%",
    metricLabel: "Cost per lead",
  },
  {
    category: "smm",
    tag: "Social Media",
    client: "Urban Bites Café",
    challenge: "Low local brand awareness and inconsistent posting.",
    solution: "Content engine built around Reels and community engagement, run for 5 months straight.",
    metric: "+64K",
    metricLabel: "Instagram followers",
  },
  {
    category: "branding",
    tag: "Personal Branding",
    client: "Dr. Farah Rahman, Nutrition Coach",
    challenge: "Strong expertise, but no cohesive online presence to attract clients.",
    solution: "Full personal brand system — content pillars, visual identity, and a consistent posting rhythm.",
    metric: "42K",
    metricLabel: "Engaged followers",
  },
  {
    category: "ads",
    tag: "Google Ads",
    client: "TechNest Software",
    challenge: "Low volume of qualified B2B leads from paid search.",
    solution: "Rebuilt keyword strategy around high-intent B2B search terms with tightened conversion tracking.",
    metric: "+180%",
    metricLabel: "Qualified leads",
  },
  {
    category: "seo",
    tag: "SEO Strategy",
    client: "GreenLeaf Organics",
    challenge: "Zero inbound traffic from search despite a strong product line.",
    solution: "Local SEO plus authority content strategy targeting organic-food search intent.",
    metric: "+156%",
    metricLabel: "Organic sales",
  },
];

function PortfolioCard({ project, isDark, onDiscuss }) {
  const CategoryIcon = PORTFOLIO_CATEGORY_ICONS[project.category] || Sparkles;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -8 }}
      className={
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border p-8 shadow-sm transition-all duration-300 hover:shadow-2xl " +
        (isDark
          ? "border-neutral-800 bg-neutral-900 hover:border-amber-500/50 hover:shadow-amber-500/10"
          : "border-neutral-200 bg-white hover:border-amber-300 hover:shadow-amber-500/15")
      }
    >
      {/* Decorative corner glow, revealed on hover */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-amber-400/0 to-rose-500/0 blur-2xl transition-all duration-500 group-hover:from-amber-400/20 group-hover:to-rose-500/20" />

      <div className="flex items-center justify-between">
        <span
          className={
            "flex h-11 w-11 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 " +
            (isDark ? "bg-amber-500/10 text-amber-400" : "bg-amber-100 text-amber-700")
          }
        >
          <CategoryIcon className="h-5 w-5" />
        </span>
        <span
          className={
            "text-xs font-semibold uppercase tracking-[0.1em] " +
            (isDark ? "text-amber-400" : "text-amber-700")
          }
        >
          {project.tag}
        </span>
      </div>

      <h3
        className={
          "mt-5 text-lg font-bold leading-snug xl:text-xl " +
          (isDark ? "text-white" : "text-neutral-900")
        }
      >
        {project.client}
      </h3>

      <div className="mt-4 flex-1 space-y-3 text-sm leading-relaxed">
        <p className={isDark ? "text-neutral-400" : "text-neutral-600"}>
          <span className={"font-semibold " + (isDark ? "text-neutral-200" : "text-neutral-800")}>
            Challenge:{" "}
          </span>
          {project.challenge}
        </p>
        <p className={isDark ? "text-neutral-400" : "text-neutral-600"}>
          <span className={"font-semibold " + (isDark ? "text-neutral-200" : "text-neutral-800")}>
            Solution:{" "}
          </span>
          {project.solution}
        </p>
      </div>

      <div
        className={"mt-6 flex items-center justify-between border-t pt-5 " + (isDark ? "border-neutral-800" : "border-neutral-100")}
      >
        <div
          className={
            "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-transform duration-300 group-hover:scale-105 " +
            (isDark ? "bg-amber-500/10 text-amber-400" : "bg-amber-100 text-amber-700")
          }
        >
          <TrendingUp className="h-4 w-4" />
          {project.metric} {project.metricLabel}
        </div>
        <button
          type="button"
          onClick={onDiscuss}
          aria-label={"Discuss a project like " + project.client}
          className={
            "flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-amber-500 group-hover:text-amber-500 " +
            (isDark ? "border-neutral-800 text-neutral-500" : "border-neutral-200 text-neutral-400")
          }
        >
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}

function Portfolio({ isDark }) {
  const [activeFilter, setActiveFilter] = useState("all");

  const scrollToContact = (e) => scrollToSection(e, "contact");

  const filtered =
    activeFilter === "all"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeFilter);

  return (
    <section
      id="portfolio"
      className={"relative overflow-hidden py-24 lg:py-28 xl:py-32 " + (isDark ? "bg-neutral-950" : "bg-[#FBF6EF]")}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 top-10 h-[26rem] w-[26rem] rounded-full bg-rose-500/10 blur-3xl" />
        <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-[1320px] px-6 lg:px-12 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <span
            className={
              "inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] " +
              (isDark
                ? "border-amber-800/60 bg-amber-500/10 text-amber-400"
                : "border-amber-200 bg-amber-100 text-amber-700")
            }
          >
            Featured Case Studies
          </span>
          <h2
            className={
              "mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.75rem] " +
              (isDark ? "text-white" : "text-neutral-900")
            }
          >
            Real Results for{" "}
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
              Real Businesses
            </span>
          </h2>
          <p
            className={
              "mt-4 text-base leading-relaxed sm:text-lg " +
              (isDark ? "text-neutral-400" : "text-neutral-600")
            }
          >
            A snapshot of SEO, paid ads, social media, and personal branding
            work — and the measurable impact behind each one.
          </p>
        </motion.div>

        {/* Filters */}
        <div
          className={
            "mt-10 flex flex-wrap items-center justify-center gap-2 rounded-full border p-1.5 sm:mx-auto sm:w-fit " +
            (isDark ? "border-neutral-800 bg-neutral-900/60" : "border-neutral-200 bg-white/70")
          }
        >
          {PORTFOLIO_FILTERS.map((filter) => {
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                className={
                  "rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 " +
                  (isActive
                    ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md shadow-amber-500/25"
                    : isDark
                    ? "text-neutral-400 hover:text-white"
                    : "text-neutral-600 hover:text-neutral-900")
                }
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        {/* Project grid */}
        <motion.div layout className="mt-14 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <PortfolioCard key={project.client} project={project} isDark={isDark} onDiscuss={scrollToContact} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------
// Certificates.tsx (Certifications & Recognition)
// ---------------------------------------------------------------------
const CERTIFICATES = [
  { icon: BadgeCheck, title: "Google Ads Search Certification", issuer: "Google Skillshop" },
  { icon: BadgeCheck, title: "Google Analytics (GA4) Certification", issuer: "Google Skillshop" },
  { icon: ShieldCheck, title: "Meta Blueprint Certification", issuer: "Meta" },
  { icon: Trophy, title: "HubSpot SEO Certification", issuer: "HubSpot Academy" },
];

function CertificateCard({ cert, index, isDark }) {
  const Icon = cert.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className={
        "flex items-center gap-4 rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:shadow-lg " +
        (isDark
          ? "border-neutral-800 bg-neutral-900/70 backdrop-blur-sm hover:border-amber-500/40"
          : "border-neutral-200 bg-white/80 backdrop-blur-sm hover:border-amber-300")
      }
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-rose-500 text-white">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className={"text-sm font-bold leading-snug " + (isDark ? "text-white" : "text-neutral-900")}>{cert.title}</p>
        <p className={"text-xs " + (isDark ? "text-neutral-500" : "text-neutral-500")}>{cert.issuer}</p>
      </div>
    </motion.div>
  );
}

function Certificates({ isDark }) {
  return (
    <section id="certificates" className={"relative overflow-hidden py-24 lg:py-28 xl:py-32 " + (isDark ? "bg-neutral-950" : "bg-[#FBF6EF]")}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-[1320px] px-6 lg:px-12 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <span
            className={
              "inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] " +
              (isDark ? "border-amber-800/60 bg-amber-500/10 text-amber-400" : "border-amber-200 bg-amber-100 text-amber-700")
            }
          >
            Certifications
          </span>
          <h2
            className={
              "mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.75rem] " +
              (isDark ? "text-white" : "text-neutral-900")
            }
          >
            Credentials That{" "}
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
              Back the Results
            </span>
          </h2>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CERTIFICATES.map((cert, index) => (
            <CertificateCard key={cert.title} cert={cert} index={index} isDark={isDark} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------
// About.tsx
// ---------------------------------------------------------------------
const SKILLS = [
  { label: "SEO", value: 95 },
  { label: "Google Ads", value: 90 },
  { label: "Social Media Marketing", value: 92 },
  { label: "Personal Branding", value: 88 },
  { label: "Content Strategy", value: 85 },
];

const TIMELINE = [
  { year: "2019", title: "Started freelancing in digital marketing", description: "Took on my first small-business clients while learning SEO and paid ads hands-on." },
  { year: "2021", title: "Founded Rayhan Digital Hub", description: "Turned freelance work into a dedicated digital marketing practice." },
  { year: "2022", title: "Crossed 50 client projects", description: "Expanded into social media marketing and personal branding services." },
  { year: "2023", title: "Google Ads & Meta Blueprint certified", description: "Formalized paid-media expertise across Search, Display, and Meta platforms." },
  { year: "2025", title: "10,000+ leads generated for clients", description: "Reached a career milestone across combined SEO and paid-ads campaigns." },
];

function SkillBar({ skill, isDark }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref}>
      <div className="flex items-center justify-between text-sm">
        <span className={"font-semibold " + (isDark ? "text-neutral-200" : "text-neutral-800")}>
          {skill.label}
        </span>
        <span className={isDark ? "text-neutral-400" : "text-neutral-500"}>{skill.value}%</span>
      </div>
      <div className={"mt-2 h-2 w-full overflow-hidden rounded-full " + (isDark ? "bg-neutral-800" : "bg-neutral-200")}>
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-rose-500"
          initial={{ width: 0 }}
          animate={{ width: inView ? skill.value + "%" : 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function About({ isDark }) {
  return (
    <section id="about" className={"py-24 lg:py-28 xl:py-32 " + (isDark ? "bg-neutral-950" : "bg-white")}>
      <div className="mx-auto max-w-[1320px] px-6 lg:px-12 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <span
            className={
              "inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] " +
              (isDark ? "border-amber-800/60 bg-amber-500/10 text-amber-400" : "border-amber-200 bg-amber-100 text-amber-700")
            }
          >
            About Me
          </span>
          <h2
            className={
              "mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.75rem] " +
              (isDark ? "text-white" : "text-neutral-900")
            }
          >
            Helping Brands Grow with{" "}
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
              Strategy and Data
            </span>
          </h2>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-20 xl:gap-24">
          {/* Left: bio, mission/vision, skills */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex items-center gap-4"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-rose-500 text-xl font-extrabold text-white">
                {siteConfig.brand.initials}
              </div>
              <div>
                <p className={"font-bold " + (isDark ? "text-white" : "text-neutral-900")}>{siteConfig.brand.name}</p>
                <p className={"text-sm " + (isDark ? "text-neutral-400" : "text-neutral-500")}>Founder, {siteConfig.brand.business}</p>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className={"mt-6 text-base leading-relaxed sm:text-lg " + (isDark ? "text-neutral-400" : "text-neutral-600")}
            >
              {siteConfig.brand.longBio}
            </motion.p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
                whileHover={{ y: -4 }}
                className={"rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:shadow-lg " + (isDark ? "border-neutral-800 bg-neutral-900 hover:border-amber-500/40" : "border-neutral-200 bg-[#FBF6EF] hover:border-amber-300")}
              >
                <Compass className="h-5 w-5 text-amber-500" />
                <p className={"mt-3 text-sm font-bold " + (isDark ? "text-white" : "text-neutral-900")}>Mission</p>
                <p className={"mt-1 text-sm leading-relaxed " + (isDark ? "text-neutral-400" : "text-neutral-600")}>
                  Help businesses and personal brands build a genuine,
                  high-performing online presence that turns visibility into
                  revenue.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                whileHover={{ y: -4 }}
                className={"rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:shadow-lg " + (isDark ? "border-neutral-800 bg-neutral-900 hover:border-amber-500/40" : "border-neutral-200 bg-[#FBF6EF] hover:border-amber-300")}
              >
                <Award className="h-5 w-5 text-amber-500" />
                <p className={"mt-3 text-sm font-bold " + (isDark ? "text-white" : "text-neutral-900")}>Vision</p>
                <p className={"mt-1 text-sm leading-relaxed " + (isDark ? "text-neutral-400" : "text-neutral-600")}>
                  Become Bangladesh's most trusted name in results-driven
                  digital marketing and personal branding.
                </p>
              </motion.div>
            </div>

            <div className="mt-10 space-y-5">
              {SKILLS.map((skill) => (
                <SkillBar key={skill.label} skill={skill} isDark={isDark} />
              ))}
            </div>
          </div>

          {/* Right: timeline */}
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={"flex items-center gap-2 text-lg font-bold " + (isDark ? "text-white" : "text-neutral-900")}
            >
              <Briefcase className="h-5 w-5 text-amber-500" />
              Experience Timeline
            </motion.h3>

            <div className="relative mt-8">
              <div className={"absolute left-[7px] top-2 bottom-2 w-px " + (isDark ? "bg-neutral-800" : "bg-neutral-200")} />
              <div className="space-y-8">
                {TIMELINE.map((item, index) => (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                    className="relative pl-8"
                  >
                    <span className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-amber-500 bg-gradient-to-br from-amber-400 to-rose-500" />
                    <span className={"text-xs font-bold uppercase tracking-wider " + (isDark ? "text-amber-400" : "text-amber-700")}>
                      {item.year}
                    </span>
                    <p className={"mt-1 font-bold " + (isDark ? "text-white" : "text-neutral-900")}>{item.title}</p>
                    <p className={"mt-1 text-sm leading-relaxed " + (isDark ? "text-neutral-400" : "text-neutral-600")}>
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------
// Testimonials.tsx
// ---------------------------------------------------------------------
const TESTIMONIALS = [
  { name: "Nusrat Jahan", role: "Founder, NovaWear Fashion", initials: "NJ", rating: 5, quote: "Rayhan doubled our organic traffic in four months. Our inbound leads have never been stronger, and he explains every decision in plain language." },
  { name: "David Chowdhury", role: "CEO, BrightPath Academy", initials: "DC", rating: 5, quote: "Our cost per lead dropped 38% while volume went up. He genuinely understands paid ads and never wastes budget on guesswork." },
  { name: "Farah Rahman", role: "Nutrition Coach", initials: "FR", rating: 5, quote: "My personal brand finally looks and feels professional. Rayhan gave me a content system I could actually stick to, and it shows." },
  { name: "Imran Kabir", role: "Owner, Urban Bites Café", initials: "IK", rating: 5, quote: "Our Instagram following grew by 64K in five months. Reservations are up and people recognize the brand around the neighborhood now." },
  { name: "Meherun Nesa", role: "Founder, GreenLeaf Organics", initials: "MN", rating: 5, quote: "From almost no search traffic to a 156% increase in organic sales. Rayhan is reliable, clear, and completely results-focused." },
  { name: "Tanvir Islam", role: "Founder, TechNest Software", initials: "TI", rating: 5, quote: "Qualified leads increased by 180% after Rayhan rebuilt our Google Ads account. Best marketing investment we've made this year." },
];

function StarRow({ rating = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={
            "h-4 w-4 " +
            (i < rating ? "fill-amber-500 text-amber-500" : "fill-transparent text-neutral-300")
          }
        />
      ))}
    </div>
  );
}

function Testimonials({ isDark }) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(id);
  }, [isPaused, index]);

  const goTo = (i) => setIndex(i);
  const goNext = () => setIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  const goPrev = () => setIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  const active = TESTIMONIALS[index];

  return (
    <section id="testimonials" className={"py-24 lg:py-28 xl:py-32 " + (isDark ? "bg-neutral-950" : "bg-[#FBF6EF]")}>
      <div className="mx-auto max-w-[1320px] px-6 lg:px-12 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <span
            className={
              "inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] " +
              (isDark ? "border-amber-800/60 bg-amber-500/10 text-amber-400" : "border-amber-200 bg-amber-100 text-amber-700")
            }
          >
            Testimonials
          </span>
          <h2
            className={
              "mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.75rem] " +
              (isDark ? "text-white" : "text-neutral-900")
            }
          >
            What Clients{" "}
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
              Say
            </span>
          </h2>

          <motion.a
            href={
              "https://www.google.com/search?q=" +
              encodeURIComponent(siteConfig.brand.business + " reviews")
            }
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            whileHover={{ y: -2 }}
            className={
              "mt-6 inline-flex items-center gap-3 rounded-2xl border px-5 py-3 shadow-sm transition-all duration-300 hover:shadow-lg " +
              (isDark ? "border-neutral-800 bg-neutral-900 hover:border-amber-500/40" : "border-neutral-200 bg-white hover:border-amber-300")
            }
          >
            <Globe className="h-5 w-5 text-amber-500" />
            <span className={"text-sm font-semibold " + (isDark ? "text-neutral-300" : "text-neutral-700")}>
              Read Verified Reviews on Google
            </span>
            <ExternalLink className={"h-3.5 w-3.5 " + (isDark ? "text-neutral-600" : "text-neutral-400")} />
          </motion.a>
        </motion.div>

        {/* Animated featured carousel */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          role="region"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
          className={
            "relative mx-auto mt-14 max-w-3xl rounded-[2rem] border px-6 py-12 shadow-sm sm:px-14 " +
            (isDark ? "border-neutral-800 bg-neutral-900/60" : "border-neutral-200 bg-white/70")
          }
        >
          <Quote className={"mx-auto h-10 w-10 " + (isDark ? "text-amber-500/30" : "text-amber-300")} aria-hidden="true" />
          <AnimatePresence mode="wait">
            <motion.div
              key={active.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-center"
              aria-live="polite"
            >
              <p className={"mx-auto max-w-2xl text-lg font-medium leading-relaxed sm:text-xl " + (isDark ? "text-neutral-200" : "text-neutral-800")}>
                “{active.quote}”
              </p>
              <div className="mt-6 flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-rose-500 text-sm font-bold text-white">
                  {active.initials}
                </div>
                <p className={"font-bold " + (isDark ? "text-white" : "text-neutral-900")}>{active.name}</p>
                <p className={"text-sm " + (isDark ? "text-neutral-400" : "text-neutral-500")}>{active.role}</p>
                <StarRow rating={active.rating} />
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={goPrev}
              className={"flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:border-amber-500 hover:text-amber-700 " + (isDark ? "border-neutral-700 text-neutral-300" : "border-neutral-300 text-neutral-600")}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  aria-label={"Go to testimonial " + (i + 1)}
                  aria-current={i === index ? "true" : undefined}
                  onClick={() => goTo(i)}
                  className={"h-2 rounded-full transition-all duration-300 " + (i === index ? "w-6 bg-gradient-to-r from-amber-500 to-rose-500" : isDark ? "w-2 bg-neutral-700" : "w-2 bg-neutral-300")}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="Next testimonial"
              onClick={goNext}
              className={"flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:border-amber-500 hover:text-amber-700 " + (isDark ? "border-neutral-700 text-neutral-300" : "border-neutral-300 text-neutral-600")}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Full ratings grid */}
        <div className="mt-20 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: "easeOut" }}
              whileHover={{ y: -4 }}
              className={
                "rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:shadow-lg " +
                (isDark ? "border-neutral-800 bg-neutral-900 hover:border-amber-500/40" : "border-neutral-200 bg-white hover:border-amber-300")
              }
            >
              <StarRow rating={t.rating} />
              <p className={"mt-3 text-sm leading-relaxed " + (isDark ? "text-neutral-400" : "text-neutral-600")}>
                “{t.quote}”
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-rose-500 text-xs font-bold text-white">
                  {t.initials}
                </div>
                <div>
                  <p className={"text-sm font-bold " + (isDark ? "text-white" : "text-neutral-900")}>{t.name}</p>
                  <p className={"text-xs " + (isDark ? "text-neutral-500" : "text-neutral-500")}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------
// FAQ.tsx
// ---------------------------------------------------------------------
const FAQS = siteConfig.faqs;

function FAQItem({ faq, index, isDark, isOpen, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      className={
        "overflow-hidden rounded-2xl border transition-colors duration-300 " +
        (isDark
          ? "border-neutral-800 bg-neutral-900" + (isOpen ? " border-amber-500/40" : "")
          : "border-neutral-200 bg-white" + (isOpen ? " border-amber-300" : ""))
      }
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={"faq-panel-" + index}
        id={"faq-trigger-" + index}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className={"text-sm font-bold sm:text-base " + (isDark ? "text-white" : "text-neutral-900")}>
          {faq.question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          aria-hidden="true"
          className={
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full " +
            (isOpen
              ? "bg-gradient-to-br from-amber-500 to-rose-500 text-white"
              : isDark
              ? "bg-neutral-800 text-neutral-400"
              : "bg-neutral-100 text-neutral-500")
          }
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={"faq-panel-" + index}
            role="region"
            aria-labelledby={"faq-trigger-" + index}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <p className={"px-6 pb-5 text-sm leading-relaxed " + (isDark ? "text-neutral-400" : "text-neutral-600")}>
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FAQ({ isDark }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className={"py-24 lg:py-28 xl:py-32 " + (isDark ? "bg-neutral-950" : "bg-white")}>
      <div className="mx-auto max-w-[860px] px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <span
            className={
              "inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] " +
              (isDark ? "border-amber-800/60 bg-amber-500/10 text-amber-400" : "border-amber-200 bg-amber-100 text-amber-700")
            }
          >
            <HelpCircle className="h-3.5 w-3.5" />
            FAQ
          </span>
          <h2
            className={
              "mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.75rem] " +
              (isDark ? "text-white" : "text-neutral-900")
            }
          >
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
        </motion.div>

        <div className="mt-12 space-y-4">
          {FAQS.map((faq, index) => (
            <FAQItem
              key={faq.question}
              faq={faq}
              index={index}
              isDark={isDark}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------
// Blog.tsx
// ---------------------------------------------------------------------
const ARTICLES = [
  {
    slug: "seo-mistakes-killing-your-rankings-2026",
    category: "SEO Tips",
    title: "5 SEO Mistakes That Are Killing Your Rankings in 2026",
    excerpt: "From ignoring Core Web Vitals to stuffing keywords into thin content — here are the technical and content mistakes I see most often, and how to fix each one.",
    date: "Jun 12, 2026",
    readTime: "6 min read",
  },
  {
    slug: "google-ads-vs-facebook-ads-which-first",
    category: "Digital Marketing Insights",
    title: "Google Ads vs Facebook Ads: Which Should You Choose First?",
    excerpt: "Search and social ads solve different problems. Here's how I decide which platform to launch first for a new client, based on intent and budget.",
    date: "May 28, 2026",
    readTime: "8 min read",
  },
  {
    slug: "build-a-personal-brand-that-attracts-clients",
    category: "Personal Branding",
    title: "How to Build a Personal Brand That Actually Attracts Clients",
    excerpt: "A personal brand isn't a logo — it's a consistent point of view. Here's the exact framework I use to help experts turn visibility into booked clients.",
    date: "May 9, 2026",
    readTime: "7 min read",
  },
];

function BlogCard({ article, index, isDark }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className={
        "group flex flex-col overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-2xl " +
        (isDark ? "border-neutral-800 bg-neutral-900 hover:border-amber-500/40" : "border-neutral-200 bg-white hover:border-amber-300 hover:shadow-amber-500/15")
      }
    >
      {/* href points to the future WordPress route for this post
          (e.g. /blog/{slug}). Once the Headless WordPress blog is live,
          this resolves automatically — no component change needed. */}
      <a href={"/blog/" + article.slug} className="flex flex-1 flex-col" aria-label={"Read: " + article.title}>
        <div className="relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 xl:h-48">
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:16px_16px]" />
          <BookOpen className="relative h-10 w-10 text-white/90 transition-transform duration-500 group-hover:scale-110" aria-hidden="true" />
        </div>
        <div className="flex flex-1 flex-col p-7">
          <span className={"inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide " + (isDark ? "bg-amber-500/10 text-amber-400" : "bg-amber-100 text-amber-700")}>
            {article.category}
          </span>
          <h3 className={"mt-3 text-lg font-bold leading-snug " + (isDark ? "text-white" : "text-neutral-900")}>
            {article.title}
          </h3>
          <p className={"mt-2 flex-1 text-sm leading-relaxed " + (isDark ? "text-neutral-400" : "text-neutral-600")}>
            {article.excerpt}
          </p>
          <div className={"mt-4 flex items-center gap-4 text-xs " + (isDark ? "text-neutral-500" : "text-neutral-500")}>
            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{article.date}</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{article.readTime}</span>
          </div>
          <div className={"mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-semibold transition-transform duration-200 group-hover:translate-x-1 " + (isDark ? "text-amber-400" : "text-amber-700")}>
            Read Article
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </a>
    </motion.article>
  );
}

function Blog({ isDark }) {
  return (
    <section id="blog" className={"py-24 lg:py-28 xl:py-32 " + (isDark ? "bg-neutral-950" : "bg-white")}>
      <div className="mx-auto max-w-[1320px] px-6 lg:px-12 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <span
            className={
              "inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] " +
              (isDark ? "border-amber-800/60 bg-amber-500/10 text-amber-400" : "border-amber-200 bg-amber-100 text-amber-700")
            }
          >
            Blog
          </span>
          <h2
            className={
              "mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.75rem] " +
              (isDark ? "text-white" : "text-neutral-900")
            }
          >
            Insights to Help You{" "}
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
              Grow Smarter
            </span>
          </h2>
          <p className={"mt-4 text-base leading-relaxed sm:text-lg " + (isDark ? "text-neutral-400" : "text-neutral-600")}>
            Practical SEO tips, marketing strategy, and personal branding
            advice — drawn straight from client work.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {ARTICLES.map((article, index) => (
            <BlogCard key={article.title} article={article} index={index} isDark={isDark} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------
// Newsletter.tsx
// ---------------------------------------------------------------------
function Newsletter({ isDark }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    setTimeout(() => {
      setStatus("sent");
      setTimeout(() => {
        setStatus("idle");
        setEmail("");
      }, 2600);
    }, 900);
  };

  return (
    <section id="newsletter" className={"py-20 " + (isDark ? "bg-neutral-950" : "bg-[#FBF6EF]")}>
      <div className="mx-auto max-w-[1320px] px-6 lg:px-12 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={
            "relative flex flex-col items-center gap-6 overflow-hidden rounded-2xl border px-8 py-12 text-center shadow-sm sm:flex-row sm:justify-between sm:text-left " +
            (isDark ? "border-neutral-800 bg-neutral-900" : "border-amber-200 bg-white")
          }
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-amber-400/10 to-rose-500/10 blur-3xl" />

          <div className="relative">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-rose-500 text-white sm:mx-0">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className={"mt-4 text-xl font-extrabold tracking-tight sm:text-2xl " + (isDark ? "text-white" : "text-neutral-900")}>
              Get Weekly SEO & Growth Tips
            </h3>
            <p className={"mt-2 max-w-md text-sm leading-relaxed " + (isDark ? "text-neutral-400" : "text-neutral-600")}>
              Practical marketing insights, straight from real client work — no spam, unsubscribe anytime.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative flex w-full max-w-sm shrink-0 flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              aria-label="Email address for newsletter"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={
                "w-full rounded-full border px-5 py-3 text-sm outline-none transition-all duration-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/30 " +
                (isDark
                  ? "border-neutral-800 bg-neutral-950 text-white placeholder:text-neutral-600"
                  : "border-neutral-200 bg-[#FBF6EF] text-neutral-900 placeholder:text-neutral-400")
              }
            />
            <button
              type="submit"
              disabled={status !== "idle"}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-amber-500/25 transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-90"
            >
              <AnimatePresence mode="wait" initial={false}>
                {status === "idle" && (
                  <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    Subscribe
                  </motion.span>
                )}
                {status === "sending" && (
                  <motion.span key="sending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </motion.span>
                )}
                {status === "sent" && (
                  <motion.span key="sent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <CheckCircle2 className="h-4 w-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------
// Contact.tsx
// ---------------------------------------------------------------------
const CONTACT_CHANNELS = [
  {
    icon: Mail,
    label: "Email",
    value: siteConfig.contact.email,
    href: "mailto:" + siteConfig.contact.email,
    accent: "from-amber-400 to-orange-500",
  },
  {
    icon: Phone,
    label: "Phone",
    value: siteConfig.contact.phoneDisplay,
    href: "tel:" + siteConfig.contact.phoneHref,
    accent: "from-violet-400 to-purple-600",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: siteConfig.contact.whatsappDisplay,
    href: "https://wa.me/" + siteConfig.contact.whatsappNumber,
    accent: "from-emerald-400 to-green-500",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: siteConfig.socials.find((s) => s.key === "linkedin").handle,
    href: siteConfig.socials.find((s) => s.key === "linkedin").href,
    accent: "from-sky-400 to-sky-600",
  },
];

function ContactChannelCard({ channel, index, isDark }) {
  const Icon = channel.icon;
  return (
    <motion.a
      href={channel.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className={
        "group flex items-center gap-4 rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:shadow-lg " +
        (isDark
          ? "border-neutral-800 bg-neutral-900 hover:border-amber-500/40"
          : "border-neutral-200 bg-white hover:border-amber-300")
      }
    >
      <div
        className={
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white transition-transform duration-300 group-hover:scale-110 " +
          channel.accent
        }
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className={"text-xs font-semibold uppercase tracking-wide " + (isDark ? "text-neutral-500" : "text-neutral-500")}>
          {channel.label}
        </p>
        <p className={"truncate text-sm font-bold " + (isDark ? "text-white" : "text-neutral-900")}>
          {channel.value}
        </p>
      </div>
      <ArrowUpRight
        className={
          "ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 " +
          (isDark ? "text-neutral-600" : "text-neutral-400")
        }
      />
    </motion.a>
  );
}

function Contact({ isDark }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    setTimeout(() => {
      setStatus("sent");
      setTimeout(() => {
        setStatus("idle");
        setForm({ name: "", email: "", message: "" });
      }, 2600);
    }, 1100);
  };

  const inputClasses =
    "w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/30 " +
    (isDark
      ? "border-neutral-800 bg-neutral-900 text-white placeholder:text-neutral-600"
      : "border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400");

  return (
    <section id="contact" className={"py-24 lg:py-28 xl:py-32 " + (isDark ? "bg-neutral-950" : "bg-white")}>
      <div className="mx-auto max-w-[1320px] px-6 lg:px-12 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <span
            className={
              "inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] " +
              (isDark ? "border-amber-800/60 bg-amber-500/10 text-amber-400" : "border-amber-200 bg-amber-100 text-amber-700")
            }
          >
            Contact
          </span>
          <h2
            className={
              "mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.75rem] " +
              (isDark ? "text-white" : "text-neutral-900")
            }
          >
            Let's Grow Your{" "}
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
              Brand Together
            </span>
          </h2>
          <p className={"mt-4 text-base leading-relaxed sm:text-lg " + (isDark ? "text-neutral-400" : "text-neutral-600")}>
            Have a project in mind or just want to say hello? Send a message
            or reach out directly — I usually reply within a few hours.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-12 xl:gap-16">
          {/* Left: form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={
              "rounded-2xl border p-7 shadow-sm lg:col-span-3 xl:p-9 " +
              (isDark ? "border-neutral-800 bg-neutral-900" : "border-neutral-200 bg-[#FBF6EF]")
            }
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label htmlFor="contact-name" className={"mb-1.5 block text-xs font-semibold uppercase tracking-wide " + (isDark ? "text-neutral-400" : "text-neutral-600")}>
                  Your Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange("name")}
                  placeholder="John Doe"
                  className={inputClasses}
                />
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="contact-email" className={"mb-1.5 block text-xs font-semibold uppercase tracking-wide " + (isDark ? "text-neutral-400" : "text-neutral-600")}>
                  Your Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange("email")}
                  placeholder="john@example.com"
                  className={inputClasses}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="contact-message" className={"mb-1.5 block text-xs font-semibold uppercase tracking-wide " + (isDark ? "text-neutral-400" : "text-neutral-600")}>
                  Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange("message")}
                  placeholder="Tell me about your project or goal..."
                  className={inputClasses + " resize-none"}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status !== "idle"}
              className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-500/30 disabled:cursor-not-allowed disabled:opacity-90 sm:w-auto"
            >
              <AnimatePresence mode="wait" initial={false}>
                {status === "idle" && (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    Send Message
                    <Send className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </motion.span>
                )}
                {status === "sending" && (
                  <motion.span
                    key="sending"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    Sending
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </motion.span>
                )}
                {status === "sent" && (
                  <motion.span
                    key="sent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    Message Sent
                    <CheckCircle2 className="h-4 w-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </motion.form>

          {/* Right: channels + location + CTA */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            {CONTACT_CHANNELS.map((channel, index) => (
              <ContactChannelCard key={channel.label} channel={channel} index={index} isDark={isDark} />
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.32, ease: "easeOut" }}
              className={
                "flex items-center gap-4 rounded-2xl border p-5 shadow-sm " +
                (isDark ? "border-neutral-800 bg-neutral-900" : "border-neutral-200 bg-white")
              }
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-neutral-700 to-neutral-900 text-white">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className={"text-xs font-semibold uppercase tracking-wide " + (isDark ? "text-neutral-500" : "text-neutral-500")}>
                  Location
                </p>
                <p className={"text-sm font-bold " + (isDark ? "text-white" : "text-neutral-900")}>
                  {siteConfig.contact.address.line1}, {siteConfig.contact.address.line2}
                </p>
                <p className={"mt-0.5 text-xs " + (isDark ? "text-neutral-500" : "text-neutral-500")}>
                  {siteConfig.contact.address.remoteNote}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.34, ease: "easeOut" }}
              className={
                "flex items-center gap-4 rounded-2xl border p-5 shadow-sm " +
                (isDark ? "border-neutral-800 bg-neutral-900" : "border-neutral-200 bg-white")
              }
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className={"text-xs font-semibold uppercase tracking-wide " + (isDark ? "text-neutral-500" : "text-neutral-500")}>
                  Business Hours
                </p>
                <p className={"text-sm font-bold " + (isDark ? "text-white" : "text-neutral-900")}>
                  {siteConfig.contact.availability}
                </p>
                <p className={"mt-0.5 text-xs " + (isDark ? "text-neutral-500" : "text-neutral-500")}>
                  {siteConfig.contact.closedNote} · {siteConfig.contact.responseTime}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.36, ease: "easeOut" }}
              className={
                "relative overflow-hidden rounded-2xl border shadow-sm " +
                (isDark ? "border-neutral-800" : "border-neutral-200")
              }
            >
              {/* siteConfig.contact.address.mapConnected === false means this
                  is a query-based embed (approximate pin), not yet a verified
                  Google Business Profile embed. Swap mapEmbedSrc for the
                  verified "share > embed a map" URL and flip mapConnected to
                  true once the business location is claimed on Google Maps. */}
              {!siteConfig.contact.address.mapConnected && (
                <span
                  className={
                    "absolute right-3 top-3 z-10 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide backdrop-blur-md " +
                    (isDark ? "border-neutral-700 bg-neutral-900/80 text-neutral-300" : "border-neutral-200 bg-white/85 text-neutral-600")
                  }
                >
                  Map pin pending verification
                </span>
              )}
              <iframe
                title={siteConfig.brand.business + " location on Google Maps"}
                src={siteConfig.contact.address.mapEmbedSrc}
                className="h-48 w-full grayscale-[40%] transition-all duration-300 hover:grayscale-0"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div
                className={
                  "flex items-center justify-between gap-2 border-t px-4 py-2.5 text-xs font-semibold " +
                  (isDark ? "border-neutral-800 bg-neutral-900" : "border-neutral-200 bg-white")
                }
              >
                <a
                  href={siteConfig.contact.address.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    "inline-flex items-center gap-1.5 transition-colors hover:text-amber-700 " +
                    (isDark ? "text-neutral-300" : "text-neutral-700")
                  }
                >
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  Get Directions
                </a>
                <a
                  href={siteConfig.contact.address.openInMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    "inline-flex items-center gap-1.5 transition-colors hover:text-amber-700 " +
                    (isDark ? "text-neutral-300" : "text-neutral-700")
                  }
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open in Google Maps
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
              className="rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 p-6 text-center shadow-lg shadow-amber-500/20"
            >
              <p className="text-base font-bold text-white">
                Ready to grow your traffic, leads, and brand?
              </p>
              <p className="mt-1.5 text-sm text-white/85">
                Book a free 20-minute consultation — no pressure, just strategy.
              </p>
              <a
                href={"https://wa.me/" + siteConfig.contact.whatsappNumber}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-amber-700 shadow-md transition-transform duration-200 hover:-translate-y-0.5"
              >
                Book Free Consultation
                <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------
// CTABanner.tsx
// ---------------------------------------------------------------------
function CTABanner({ isDark }) {
  const scrollTo = scrollToSection;

  return (
    <section className={"relative overflow-hidden py-20 " + (isDark ? "bg-neutral-950" : "bg-white")}>
      <div className="mx-auto max-w-[1320px] px-6 lg:px-12 xl:px-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 px-8 py-16 text-center shadow-2xl shadow-amber-500/25 sm:px-16"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -left-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -bottom-20 -right-10 h-80 w-80 rounded-full bg-white/10 blur-3xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <div className="relative">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-sm">
              <Rocket className="h-7 w-7" />
            </div>
            <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Ready to Turn Visibility Into Revenue?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/90">
              Let's build an SEO, ads, and personal branding strategy that
              actually moves the numbers that matter — traffic, leads, and
              sales.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#contact"
                onClick={(e) => scrollTo(e, "contact")}
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-amber-700 shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
              >
                Book Free Consultation
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={"https://wa.me/" + siteConfig.contact.whatsappNumber}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-sm font-bold text-white transition-colors duration-200 hover:bg-white/10"
              >
                Chat on WhatsApp
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------
// Footer.tsx
// ---------------------------------------------------------------------
const SOCIAL_ICON_MAP = {
  facebook: Facebook,
  linkedin: Linkedin,
  instagram: Instagram,
  whatsapp: MessageCircle,
};

const FOOTER_SOCIALS = siteConfig.socials.map((social) => ({
  ...social,
  icon: SOCIAL_ICON_MAP[social.key] || Globe,
}));

function Footer({ isDark }) {
  const scrollTo = scrollToSection;

  return (
    <footer className={"border-t pt-20 lg:pt-24 " + (isDark ? "border-neutral-800 bg-neutral-950" : "border-neutral-200 bg-[#FBF6EF]")}>
      <div className="mx-auto max-w-[1320px] px-6 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 gap-12 pb-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <a
              href="#home"
              onClick={(e) => scrollTo(e, "home")}
              className="flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-rose-500 text-sm font-extrabold text-white">
                {siteConfig.brand.initials}
              </div>
              <div className="flex flex-col leading-tight">
                <span className={"text-base font-extrabold " + (isDark ? "text-white" : "text-neutral-900")}>
                  {siteConfig.brand.name}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-700">
                  {siteConfig.brand.business}
                </span>
              </div>
            </a>
            <p className={"mt-5 max-w-sm text-sm leading-relaxed " + (isDark ? "text-neutral-400" : "text-neutral-600")}>
              Helping businesses and personal brands grow through
              results-driven SEO, paid ads, social media marketing, and
              personal branding strategy.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {FOOTER_SOCIALS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={
                      "flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-500 hover:bg-amber-500/10 hover:text-amber-700 " +
                      (isDark ? "border-neutral-800 text-neutral-400" : "border-neutral-200 text-neutral-500")
                    }
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className={"text-sm font-bold uppercase tracking-wide " + (isDark ? "text-white" : "text-neutral-900")}>
              Quick Links
            </p>
            <ul className="mt-5 space-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={"#" + item.id}
                    onClick={(e) => scrollTo(e, item.id)}
                    className={
                      "text-sm transition-colors hover:text-amber-700 " +
                      (isDark ? "text-neutral-400" : "text-neutral-600")
                    }
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact snapshot */}
          <div>
            <p className={"text-sm font-bold uppercase tracking-wide " + (isDark ? "text-white" : "text-neutral-900")}>
              Get in Touch
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a
                  href={"mailto:" + siteConfig.contact.email}
                  className={"flex items-center gap-2 transition-colors hover:text-amber-700 " + (isDark ? "text-neutral-400" : "text-neutral-600")}
                >
                  <Mail className="h-4 w-4 shrink-0 text-amber-500" />
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={"tel:" + siteConfig.contact.phoneHref}
                  className={"flex items-center gap-2 transition-colors hover:text-amber-700 " + (isDark ? "text-neutral-400" : "text-neutral-600")}
                >
                  <Phone className="h-4 w-4 shrink-0 text-amber-500" />
                  {siteConfig.contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={"https://wa.me/" + siteConfig.contact.whatsappNumber}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={"flex items-center gap-2 transition-colors hover:text-amber-700 " + (isDark ? "text-neutral-400" : "text-neutral-600")}
                >
                  <MessageCircle className="h-4 w-4 shrink-0 text-amber-500" />
                  WhatsApp: {siteConfig.contact.whatsappDisplay}
                </a>
              </li>
              <li className={"flex items-center gap-2 " + (isDark ? "text-neutral-400" : "text-neutral-600")}>
                <MapPin className="h-4 w-4 shrink-0 text-amber-500" />
                {siteConfig.contact.address.cityLabel}
              </li>
              <li className={"flex items-center gap-2 " + (isDark ? "text-neutral-400" : "text-neutral-600")}>
                <Globe className="h-4 w-4 shrink-0 text-amber-500" />
                {siteConfig.contact.address.remoteNote}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className={
            "flex flex-col items-center justify-between gap-4 border-t py-7 text-center sm:flex-row sm:text-left " +
            (isDark ? "border-neutral-800" : "border-neutral-200")
          }
        >
          <p className={"text-xs " + (isDark ? "text-neutral-500" : "text-neutral-500")}>
            © {new Date().getFullYear()} {siteConfig.brand.business}. All rights reserved.
          </p>
          <p className={"flex items-center gap-1.5 text-xs " + (isDark ? "text-neutral-500" : "text-neutral-500")}>
            Built with <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" /> by {siteConfig.brand.name}
          </p>
        </div>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------
// StickyWhatsApp.tsx
// ---------------------------------------------------------------------
function StickyWhatsApp({ isDark }) {
  return (
    <motion.a
      href={"https://wa.me/" + siteConfig.contact.whatsappNumber}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      className={
        "group fixed bottom-8 right-8 z-50 flex h-12 items-center gap-2.5 overflow-hidden rounded-full border pl-3.5 pr-3.5 text-sm font-semibold shadow-lg backdrop-blur-md transition-[padding,box-shadow] duration-300 hover:pr-5 hover:shadow-xl " +
        (isDark
          ? "border-neutral-800 bg-neutral-900/95 text-white shadow-black/30"
          : "border-neutral-200 bg-white/95 text-neutral-800 shadow-neutral-900/10")
      }
    >
      <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-600 text-white">
        <motion.span
          className="absolute inset-0 rounded-full bg-green-400/60"
          animate={{ scale: [1, 1.7, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <MessageCircle className="relative h-3.5 w-3.5" />
      </span>
      <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 group-hover:max-w-[9rem] group-hover:opacity-100">
        Chat on WhatsApp
      </span>
    </motion.a>
  );
}

// ---------------------------------------------------------------------
// ScrollToTop.tsx
// ---------------------------------------------------------------------
function ScrollToTop({ isDark }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          aria-label="Scroll to top"
          onClick={handleClick}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          whileHover={{ y: -3 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={
            "fixed bottom-6 left-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border shadow-lg backdrop-blur-md transition-colors duration-200 hover:border-amber-500 hover:text-amber-700 " +
            (isDark ? "border-neutral-700 bg-neutral-900/80 text-neutral-200" : "border-neutral-200 bg-white/80 text-neutral-700")
          }
        >
          <ArrowUp className="h-4 w-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------
// App.tsx
// ---------------------------------------------------------------------
export default function App() {
  const [isDark, setIsDark] = useState(false);

  const toggleDark = () => setIsDark((prev) => !prev);

  return (
    <MotionConfig reducedMotion="user">
      <div className={isDark ? "dark min-h-screen bg-neutral-950" : "min-h-screen bg-white"}>
        <Seo />

        <Navbar isDark={isDark} onToggleDark={toggleDark} />

        <main>
          <Hero isDark={isDark} />

          <ClientLogos isDark={isDark} />

          <Stats isDark={isDark} />

          <Services isDark={isDark} />

          <Process isDark={isDark} />

          <Portfolio isDark={isDark} />

          <Certificates isDark={isDark} />

          <About isDark={isDark} />

          <Testimonials isDark={isDark} />

          <FAQ isDark={isDark} />

          <Blog isDark={isDark} />

          <Newsletter isDark={isDark} />

          <Contact isDark={isDark} />

          <CTABanner isDark={isDark} />
        </main>

        <Footer isDark={isDark} />

        <StickyWhatsApp isDark={isDark} />

        <ScrollToTop isDark={isDark} />
      </div>
    </MotionConfig>
  );
}
