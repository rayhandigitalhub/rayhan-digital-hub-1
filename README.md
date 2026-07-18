# Rayhan Digital Hub — Website

React + Vite + Tailwind দিয়ে বানানো ওয়ানপেজ পোর্টফোলিও/এজেন্সি সাইট। এই ফোল্ডারটাই সম্পূর্ণ deploy-ready প্রজেক্ট — নিচের ধাপগুলো ফলো করলেই লাইভ হয়ে যাবে।

## ১. প্রথমে নিজের কম্পিউটারে টেস্ট করে দেখো (ঐচ্ছিক কিন্তু recommended)

তোমার কম্পিউটারে [Node.js](https://nodejs.org) (LTS ভার্সন) ইনস্টল থাকতে হবে। তারপর এই ফোল্ডারে গিয়ে টার্মিনালে:

```bash
npm install
npm run dev
```

টার্মিনালে যে `http://localhost:5173` লিংকটা আসবে, সেটা ব্রাউজারে খুললেই সাইটটা দেখতে পাবে। সবকিছু ঠিকঠাক লাগলে পরের ধাপে যাও।

## ২. GitHub-এ কোড আপলোড করো

1. [github.com](https://github.com) এ একটা ফ্রি একাউন্ট বানাও (না থাকলে)।
2. **New repository** বাটনে ক্লিক করো, নাম দাও যেমন `rayhan-digital-hub`, **Public** বা **Private** যেকোনোটা সিলেক্ট করে **Create repository** চাপো।
3. এই পুরো ফোল্ডারের ভেতরে টার্মিনালে গিয়ে:

```bash
git init
git add .
git commit -m "Initial website"
git branch -M main
git remote add origin https://github.com/<তোমার-username>/rayhan-digital-hub.git
git push -u origin main
```

(GitHub-এর ওয়েবসাইটে repo বানানোর পর ওরাও ঠিক এই কমান্ডগুলোই তোমাকে দেখাবে — username আর repo নাম বসিয়ে কপি-পেস্ট করলেই হবে।)

**Git কমান্ড লাইন নিয়ে কমফোর্টেবল না হলে:** GitHub-এর "Upload files" বাটন দিয়ে সরাসরি ব্রাউজার থেকে পুরো ফোল্ডার ড্র্যাগ-ড্রপ করেও আপলোড করা যায় — টার্মিনাল লাগবে না।

## ৩. Vercel দিয়ে Deploy করো

1. [vercel.com](https://vercel.com) এ যাও, **Continue with GitHub** দিয়ে সাইন-আপ করো (একই GitHub একাউন্ট দিয়ে)।
2. Dashboard-এ **Add New → Project** ক্লিক করো।
3. যে repo বানিয়েছ (`rayhan-digital-hub`) সেটা লিস্টে দেখাবে — **Import** চাপো।
4. Vercel নিজে থেকেই বুঝে যাবে এটা একটা Vite প্রজেক্ট (Framework Preset: Vite auto-detect হবে) — কোনো সেটিং বদলানো লাগবে না।
5. **Deploy** বাটনে ক্লিক করো। ১-২ মিনিটের মধ্যে সাইট লাইভ হয়ে যাবে, একটা ফ্রি URL পাবে যেমন `rayhan-digital-hub.vercel.app`।

এরপর থেকে যখনই GitHub-এ নতুন কিছু `git push` করবে, Vercel অটোমেটিক আবার deploy করে দেবে — কোনো manual আপলোড লাগবে না।

## ৪. নিজের ডোমেইন যোগ করা (ঐচ্ছিক)

যদি নিজের ডোমেইন কেনা থাকে (যেমন `rayhandigitalhub.com`):

1. Vercel প্রজেক্টের **Settings → Domains** এ গিয়ে ডোমেইনটা টাইপ করে **Add** করো।
2. Vercel তোমাকে একটা DNS record (A বা CNAME) দেখাবে।
3. যেখান থেকে ডোমেইন কিনেছ (Namecheap, GoDaddy, ইত্যাদি) সেখানে গিয়ে DNS settings-এ ওই record যোগ করো।
4. কিছুক্ষণ পর (কখনো কখনো কয়েক ঘণ্টা) ডোমেইনটা লাইভ হয়ে যাবে, HTTPS/SSL অটোমেটিক সেটআপ হয়ে যাবে — আলাদা করে কিছু করা লাগবে না।

**ডোমেইন এখনো না থাকলে:** Vercel-এর ফ্রি `.vercel.app` সাবডোমেইন দিয়েই সাইট পুরোপুরি কাজ করবে, লাইভ করার জন্য ডোমেইন কেনা বাধ্যতামূলক না।

## ৫. Deploy করার আগে যা যা বদলে নিও (`src/siteConfig.js`)

এই প্রজেক্টে কিছু কনটাক্ট ইনফো ডেমো/প্লেসহোল্ডার হিসেবে বসানো আছে (ফোন নাম্বার, ঠিকানা, ইমেইল, সোশ্যাল লিংক)। লাইভ করার আগে `src/siteConfig.js` ফাইলে গিয়ে নিজের আসল তথ্য দিয়ে বদলে নাও:

- `contact.email`, `contact.phoneDisplay`, `contact.phoneHref`, `contact.whatsappNumber`
- `contact.address` (তোমার আসল ঠিকানা/এলাকা, না দিতে চাইলে "Remote / Worldwide" রেখে দাও)
- `socials` (Facebook/LinkedIn/Instagram/WhatsApp-এর আসল লিংক)
- `seo.siteUrl` — যদি নিজের ডোমেইন কেনো (ধাপ ৪), সেটা এখানে বসাও; না কিনলে Vercel যে `.vercel.app` URL দেবে সেটা বসাও, নাহলে Google/Facebook preview-তে ভুল লিংক দেখাবে।

`index.html`-এর ভেতরেও একই title/description/og:url ডুপ্লিকেট করে রাখা আছে (social media crawler-রা JS চালায় না বলে) — `siteConfig.js` বদলালে `index.html`-এর মিলে থাকা মানগুলোও একইভাবে বদলে নিও।

## InfinityFree কেন recommend করলাম না

InfinityFree মূলত PHP/WordPress-এর জন্য বানানো shared hosting — এটাতে এই React প্রজেক্ট চালাতে হলে প্রতিবার কোড বদলালে ম্যানুয়ালি `npm run build` করে, তৈরি হওয়া `dist` ফোল্ডার FTP দিয়ে আপলোড করতে হতো, আর ফ্রি প্ল্যানের uptime/speed নিয়ে প্রায়ই সমস্যা থাকে। Vercel এই ধরনের প্রজেক্টের জন্যই বানানো — ফ্রি, অটো-ডিপ্লয়, এবং custom domain + SSL দুটোই সাপোর্ট করে বলে এটাই সহজ ও ভালো অপশন।
