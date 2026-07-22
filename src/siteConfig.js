// ---------------------------------------------------------------------
// siteConfig.js
//
// Single source of truth for brand, contact, social, navigation, and
// SEO data used across the site. Keeping this as plain data (no JSX,
// no component imports) means it can later be replaced by a fetch to
// a Headless WordPress REST/GraphQL endpoint (e.g. an ACF Options page
// or a `site-settings` custom post type) without touching any UI
// component — components only ever read from `siteConfig`.
// ---------------------------------------------------------------------

export const siteConfig = {
  brand: {
    name: "Rayhan Ahmed",
    business: "Rayhan Digital Hub",
    initials: "/profesinal-DP.png",
    roles: [
      "SEO Expert",
      "Digital Marketing Specialist",
      "Social Media Marketing Specialist",
    ],
    foundedYear: 2021,
    shortPitch:
      "I plan and run SEO, paid media, and social strategy for brands that are done guessing. Every campaign is built around one question: does this move pipeline, not just impressions.",
    longBio:
      "I'm Rayhan Ahmed, founder of Rayhan Digital Hub and a digital marketing specialist with 5+ years of hands-on experience helping businesses and personal brands grow online. I specialize in SEO, paid advertising, and social media marketing — combining data-driven strategy with genuine care for every client's goals, so results translate into real revenue, not just vanity metrics.",
  },

  // -------------------------------------------------------------------
  // Contact — every channel referenced by the Contact section, footer,
  // sticky WhatsApp button, and CTA banners is derived from this object
  // so there is exactly one place to update a phone number or address.
  // -------------------------------------------------------------------
  contact: {
    email: "info@digitalhub.com",
    phoneDisplay: "+880 18654-16597",
    phoneHref: "+880 18654-16597",
    whatsappNumber: "+880 18654-16597",
    whatsappDisplay: "+880 18654-16597",
    address: {
      line1: "Road 15, Dhanmondi",
      line2: "Dhaka 1209, Bangladesh",
      locality: "Dhaka",
      region: "Dhaka Division",
      postalCode: "1209",
      countryCode: "BD",
      cityLabel: "Dhanmondi, Dhaka, Bangladesh",
      remoteNote: "Available worldwide, remote",
      mapQuery: "Dhanmondi 15, Dhaka 1209, Bangladesh",
      mapEmbedSrc:
        "https://www.google.com/maps?q=Dhanmondi+15,+Dhaka+1209,+Bangladesh&output=embed",
      directionsUrl:
        "https://www.google.com/maps/dir/?api=1&destination=Dhanmondi+15,+Dhaka+1209,+Bangladesh",
      openInMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Dhanmondi+15,+Dhaka+1209,+Bangladesh",
      lat: 23.7461,
      lng: 90.3742,
      mapConnected: false,
    },
    availability: "Saturday – Thursday, 10:00 AM – 7:00 PM (GMT+6)",
    closedNote: "Closed Fridays",
    responseTime: "Usually replies within a few hours",
  },

  socials: [
    {
      key: "facebook",
      label: "Facebook",
      handle: "Rayhan Ahmed",
      href: "https://facebook.com/RayhanDigitalHub",
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      handle: "Rayhan Ahmed",
      href: "https://bd.linkedin.com/in/rayhandigitalhub",
    },
    {
      key: "instagram",
      label: "Instagram",
      handle: "@rayhandigitalhub",
      href: "https://www.instagram.com/rayhandigitalhub/",
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      handle: "+880 1712-345678",
      href: "https://wa.me/8801712345678",
    },
  ],

  nav: [
    { id: "home", label: "Home" },
    { id: "services", label: "Services" },
    { id: "portfolio", label: "Portfolio" },
    { id: "about", label: "About" },
    { id: "testimonials", label: "Testimonials" },
    { id: "blog", label: "Blog" },
    { id: "contact", label: "Contact" },
  ],

  // -------------------------------------------------------------------
  // SEO — consumed by the <Seo /> component to populate <title>, meta
  // description/keywords, canonical URL, Open Graph, Twitter Card, and
  // the Person + ProfessionalService JSON-LD schema.
  // -------------------------------------------------------------------
  seo: {
    siteUrl: "https://www.rayhandigitalhub.com",
    title:
      "Rayhan Ahmed | SEO Expert & Digital Marketing Specialist in Dhaka",
    description:
      "Rayhan Ahmed, founder of Rayhan Digital Hub, is an SEO expert and digital marketing specialist helping brands and personal labels grow through data-driven SEO, paid ads, and social media strategy.",
    keywords: [
      "SEO expert Dhaka",
      "digital marketing specialist Bangladesh",
      "social media marketing specialist",
      "Rayhan Digital Hub",
      "personal branding agency Dhaka",
    ],
    ogImage: "https://www.rayhandigitalhub.com/og-image.jpg",
    twitterHandle: "@rayhandigitalhub",
    locale: "en_US",
    themeColor: "#f59e0b",
  },
  faqs: [
    {
      question: "How long does SEO take to show results?",
      answer:
        "Most clients start seeing measurable ranking and traffic improvements within 8-12 weeks, with compounding growth over 6+ months. SEO is a long-term investment, not an overnight switch — but I share progress in monthly reports so you always know where things stand.",
    },
    {
      question: "Do you offer month-to-month contracts?",
      answer:
        "Yes. I work on flexible month-to-month retainers for ongoing SEO and ads management, plus fixed-scope packages for one-off audits, website SEO fixes, or personal branding setups.",
    },
    {
      question: "Which industries do you work with?",
      answer:
        "I've worked across e-commerce, education, food & hospitality, B2B software, health & wellness, and personal brands. My process adapts to your industry's search intent and buying behavior.",
    },
    {
      question: "Do you handle both SEO and paid ads together?",
      answer:
        "Yes — I often run SEO and Google/Meta Ads in parallel, since paid traffic can fund short-term leads while organic growth compounds in the background. You can also start with just one and add the other later.",
    },
    {
      question: "How do you report results?",
      answer:
        "You'll get a clear monthly report covering rankings, organic traffic, ad performance, and leads — plus a short call or written summary explaining what changed and what's next.",
    },
    {
      question: "What's your pricing structure?",
      answer:
        "Pricing depends on scope — whether it's a one-time audit, a monthly SEO retainer, or a full ads + branding package. Reach out with your goals and I'll send a tailored quote within 24 hours.",
    },
  ],
};

export default siteConfig;
