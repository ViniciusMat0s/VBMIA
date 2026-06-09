import { useEffect, useState } from "react";

const stats = [
  { value: "30+", label: "prompts por pack" },
  { value: "100+", label: "variações prontas" },
  { value: "50+", label: "estilos visuais" },
  { value: "500k", label: "potencial de alcance" },
];

const featureCards = [
  {
    title: "Posicionamento nas buscas e no feed",
    text:
      "Prompts pensados para gerar imagens com cara de campanha, produto e creator, prontos para postar e vender.",
    icon: "A",
  },
  {
    title: "Meta Ads, Instagram e Pinterest",
    text:
      "Estruturas visuais que funcionam em conteúdo orgânico, anúncio, landing page e oferta direta.",
    icon: "∞",
  },
  {
    title: "Design, branding e direção de arte",
    text:
      "Visual premium, consistência estética e variações para nichos diferentes sem perder identidade.",
    icon: "◎",
  },
];

const steps = [
  {
    title: "Escolha o cenário",
    text:
      "Use o pack certo para o tipo de imagem que quer criar: editorial, lifestyle, produto, creator ou campanha.",
  },
  {
    title: "Personalize o prompt",
    text:
      "Troque nicho, pose, fundo, luz e styling sem perder a estrutura que mantém a qualidade do resultado.",
  },
  {
    title: "Gere e publique",
    text:
      "O resultado já sai com linguagem visual consistente para usar no feed, anúncio ou página de venda.",
  },
  {
    title: "Teste novas variações",
    text:
      "Crie diferentes ângulos e aplicações com o mesmo padrão visual, sem começar do zero toda vez.",
  },
  {
    title: "Escale por nicho",
    text:
      "Vá de creator para beauty, de e-commerce para business, com uma oferta fácil de entender.",
  },
  {
    title: "Monetize em camadas",
    text:
      "Venda o pack principal, depois adicione bônus, upsell e novos bundles para aumentar o ticket.",
  },
];

const testimonials = [
  {
    name: "Joana Vilela",
    role: "Creator",
    text:
      "Com os prompts, eu parei de perder tempo tentando acertar estilo. A página já me ajudou a vender como algo premium.",
  },
  {
    name: "Lucas Moreira",
    role: "Social Media",
    text:
      "O pack ficou com cara de produto de alto valor. A estrutura da landing convence rápido e deixa a oferta mais forte.",
  },
  {
    name: "Ana Souza",
    role: "E-commerce",
    text:
      "Consistência visual foi o diferencial. Passei a gerar imagens muito mais confiáveis para campanhas e produtos.",
  },
];

const logos = ["BrandFlow", "NovaSkin", "Studio IA", "Lume Lab", "Vibe Digital", "Orbit Ads"];
const trustedLogos = ["ACME", "Neo Studio", "Blue Pulse", "Aurora", "Flux", "Zenith"];

const faqs = [
  {
    q: "Preciso ser avançado em IA para comprar?",
    a: "Não. Os prompts são estruturados para facilitar o uso mesmo por quem está começando.",
  },
  {
    q: "Serve para vender no Instagram?",
    a: "Sim. A proposta foi pensada para conversão em social, checkout, DM ou lançamento.",
  },
  {
    q: "Posso usar em vários nichos?",
    a: "Pode. A ideia é justamente adaptar um mesmo sistema para creator, beauty, business e e-commerce.",
  },
  {
    q: "Tem suporte e atualizações?",
    a: "Se quiser, depois a gente pode transformar essa landing em um produto com área de membros e bônus.",
  },
];

const heroNavItems = ["HOME", "ABOUT US", "COURSE", "BLOG", "LOG IN"];

const heroAvatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&q=80",
];

const heroLeftCard = {
  title: "92% Career Outcome",
  subtitle: "Success",
  image:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
  alt: "Portrait of a smiling tutor",
};

const heroCenterCard = {
  title: "Mark Jhongson",
  subtitle: "CEO at Tutorlv",
  image:
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=80",
  alt: "Tutor working on a laptop",
};

const heroRightCard = {
  title: "100+",
  subtitle: "Experienced tutor",
  image:
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
  alt: "Portrait of an experienced tutor",
};

const companyLogos = ["Raonadle", "Mondole", "Hanhlod", "Wondrot", "Raonadle", "Bonraow"];

const featuredCourses = [
  {
    title: "UI/UX design crash course",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
    duration: "20 hours 30 min",
    lessons: "23 Lessons",
    price: "$ 250.50 USD",
    oldPrice: "$ 280.50 USD",
    featured: false,
    crop: "object-[center_28%]",
  },
  {
    title: "Full-stack web development",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    duration: "26 hours 30 min",
    lessons: "20 Lessons",
    price: "$ 350.50 USD",
    oldPrice: "$ 380.50 USD",
    featured: true,
    crop: "object-[center_28%]",
  },
  {
    title: "Data analytics professional",
    image:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80",
    duration: "20 hours 30 min",
    lessons: "24 Lessons",
    price: "$ 450.50 USD",
    oldPrice: "$ 680.50 USD",
    featured: false,
    crop: "object-[center_22%]",
  },
];

const exploreCourseFilters = [
  "ALL COURSE",
  "UI/UX DESIGN",
  "MARKETING",
  "EMAIL MARKETING",
  "CONTENT & SEO",
];

const exploreCourses = [
  {
    title: "Digital marketing mastery",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    duration: "20 hours 30 min",
    lessons: "27 Lessons",
    price: "$ 150.50 USD",
    oldPrice: "$ 240.50 USD",
    featured: false,
    crop: "object-[center_22%]",
  },
  {
    title: "UI/UX design essentials",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80",
    duration: "20 hours 30 min",
    lessons: "25 Lessons",
    price: "$ 450.50 USD",
    oldPrice: "$ 580.50 USD",
    featured: true,
    crop: "object-[center_24%]",
  },
  {
    title: "Python for beginners",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80",
    duration: "20 hours 30 min",
    lessons: "28 Lessons",
    price: "$ 550.50 USD",
    oldPrice: "$ 680.50 USD",
    featured: false,
    crop: "object-[center_20%]",
  },
  {
    title: "Front-end development",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
    duration: "20 hours 30 min",
    lessons: "29 Lessons",
    price: "$ 550.50 USD",
    oldPrice: "$ 680.50 USD",
    featured: false,
    crop: "object-[center_28%]",
  },
  {
    title: "Excel & business reporting",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
    duration: "20 hours 30 min",
    lessons: "27 Lessons",
    price: "$ 250.50 USD",
    oldPrice: "$ 280.50 USD",
    featured: false,
    crop: "object-[center_24%]",
  },
  {
    title: "Project management course",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80",
    duration: "20 hours 30 min",
    lessons: "26 Lessons",
    price: "$ 350.50 USD",
    oldPrice: "$ 460.50 USD",
    featured: false,
    crop: "object-[center_26%]",
  },
];

function Card({ children, className = "" }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.045] shadow-[0_24px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06] hover:shadow-[0_32px_100px_rgba(0,0,0,0.48)] ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.12),transparent_38%),linear-gradient(135deg,rgba(255,255,255,0.05),transparent_55%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function Reveal({ children, className = "", delay = 0 }) {
  return (
    <div className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }} data-reveal>
      {children}
    </div>
  );
}

function SectionTitle({ kicker, title, text, center = false }) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="text-xs font-semibold uppercase tracking-[0.38em] text-teal-300/90">{kicker}</p>
      <h2 className="mt-4 font-saira text-[clamp(2rem,4vw,3.6rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-white">
        {title}
      </h2>
      {text ? <p className="mt-4 text-sm leading-7 text-white/70 md:text-base">{text}</p> : null}
    </div>
  );
}

function HeroStat({ title, subtitle, image, alt, icon, align = "left", className = "" }) {
  return (
    <div className={`absolute hidden lg:block ${className}`}>
      <div className={`flex ${align === "right" ? "justify-end" : "justify-start"}`}>
        <div className="w-[158px] rounded-[18px] border border-black/10 bg-white px-3 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-black/10 text-black/70">
              {icon}
            </div>
            <div className="min-w-0">
              <div className="text-[12px] font-semibold leading-tight text-black">{title}</div>
              <div className="text-[12px] leading-tight text-black/60">{subtitle}</div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`mt-4 h-[66px] w-[66px] overflow-hidden rounded-[14px] shadow-[0_16px_30px_rgba(0,0,0,0.12)] ${
          align === "right" ? "ml-auto" : "ml-[86px]"
        }`}
      >
        <img src={image} alt={alt} className="h-full w-full object-cover object-center" />
      </div>
    </div>
  );
}

function HeroShowcaseCard({ image, alt, title, subtitle, className = "", coverClassName = "", play = false }) {
  return (
    <div
      className={`relative min-h-[260px] overflow-hidden rounded-[28px] bg-black shadow-[0_30px_70px_rgba(0,0,0,0.16)] md:min-h-[340px] lg:min-h-[388px] ${className}`}
    >
      <img
        src={image}
        alt={alt}
        className={`absolute inset-0 h-full w-full object-cover ${coverClassName}`}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.14)_48%,rgba(0,0,0,0.8)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.72)_100%)]" />

      <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
        <div className="max-w-[12ch] text-left text-white">
          <div className="text-[15px] font-medium leading-[1.15] tracking-[-0.03em] md:text-[17px]">
            {title}
          </div>
          <div className="mt-1 text-[12px] font-medium tracking-[-0.01em] text-white/80 md:text-[14px]">
            {subtitle}
          </div>
        </div>

        {play ? (
          <button
            type="button"
            aria-label="Play video"
            className="grid h-12 w-12 place-items-center rounded-full bg-white text-[16px] text-black shadow-[0_12px_25px_rgba(0,0,0,0.22)]"
          >
            ►
          </button>
        ) : null}
      </div>
    </div>
  );
}

function MetaIcon({ type }) {
  if (type === "clock") {
    return (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-black/58" aria-hidden="true">
        <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 8v4l2.5 1.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === "lessons") {
    return (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-black/58" aria-hidden="true">
        <path
          d="M5 7.5A2.5 2.5 0 0 1 7.5 5H19v11.5A2.5 2.5 0 0 1 16.5 19H7.5A2.5 2.5 0 0 1 5 16.5V7.5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M8 8.5h8M8 12h6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-amber-500" aria-hidden="true">
      <path d="m12 4 1.7 4.9h5.2l-4.2 3 1.6 5L12 14.9 7.7 16.9l1.6-5-4.2-3h5.2L12 4Z" fill="currentColor" />
    </svg>
  );
}

function CourseCard({ course }) {
  return (
    <div
      className={`overflow-hidden rounded-[18px] border border-black/10 bg-white shadow-[0_14px_34px_rgba(0,0,0,0.08)] ${
        course.featured ? "ring-1 ring-black/95" : ""
      }`}
    >
      <div className="p-2.5 pb-0">
        <div className="relative overflow-hidden rounded-[14px] bg-[#d8ddd8]">
          <img
            src={course.image}
            alt={course.title}
            className={`h-[204px] w-full object-cover ${course.crop}`}
          />
        </div>
      </div>

      <div className="px-4 pb-4 pt-2.5">
        <div className="flex items-center justify-between gap-3 text-[11px] text-black/58">
          <div className="flex items-center gap-2">
            <MetaIcon type="clock" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <MetaIcon type="lessons" />
            <span>{course.lessons}</span>
          </div>
          <div className="flex items-center gap-1 text-amber-500">
            <MetaIcon type="star" />
            <span className="text-black/68">5.0</span>
          </div>
        </div>

        <h3 className="mt-3 text-[18px] font-semibold leading-tight tracking-[-0.03em] text-black">
          {course.title}
        </h3>

        <div className="mt-2 flex flex-wrap items-end gap-2">
          <span className="text-[18px] font-semibold tracking-[-0.03em] text-black">
            {course.price}
          </span>
          <span className="pb-0.5 text-[12px] text-black/42 line-through">{course.oldPrice}</span>
        </div>

        <a
          href="#cta"
          className={`mt-4 flex h-10 w-full items-center justify-center rounded-full border text-[11px] font-semibold tracking-[0.06em] transition ${
            course.featured
              ? "border-black bg-black text-white"
              : "border-black/10 bg-white text-black hover:border-black/20"
          }`}
        >
          VIEW COURSE
        </a>
      </div>
    </div>
  );
}

function ExploreCourseCard({ course }) {
  return (
    <div className="overflow-hidden rounded-[14px] border border-black/10 bg-white shadow-[0_10px_26px_rgba(0,0,0,0.06)]">
      <div className="p-2.5 pb-0">
        <div className="relative overflow-hidden rounded-[12px] bg-[#d8ddd8]">
          <img
            src={course.image}
            alt={course.title}
            className={`h-[194px] w-full object-cover ${course.crop}`}
          />
        </div>
      </div>

      <div className="px-4 pb-4 pt-2.5">
        <div className="flex items-center justify-between gap-3 text-[11px] text-black/58">
          <div className="flex items-center gap-2">
            <MetaIcon type="clock" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <MetaIcon type="lessons" />
            <span>{course.lessons}</span>
          </div>
          <div className="flex items-center gap-1 text-amber-500">
            <MetaIcon type="star" />
            <span className="text-black/68">5.0</span>
          </div>
        </div>

        <h3 className="mt-3 text-[17px] font-semibold leading-tight tracking-[-0.03em] text-black">
          {course.title}
        </h3>

        <div className="mt-3 flex flex-wrap items-end gap-2">
          <span className="text-[18px] font-semibold tracking-[-0.03em] text-black">
            {course.price}
          </span>
          <span className="pb-0.5 text-[12px] text-black/42 line-through">{course.oldPrice}</span>
        </div>

        <a
          href="#cta"
          className={`mt-4 flex h-10 w-full items-center justify-center rounded-full border text-[11px] font-semibold tracking-[0.06em] transition ${
            course.featured
              ? "border-black bg-black text-white"
              : "border-black/10 bg-white text-black hover:border-black/20"
          }`}
        >
          VIEW COURSE
        </a>
      </div>
    </div>
  );
}

function ExploreCoursesSection() {
  return (
    <section id="courses" className="bg-[#f5f5f5] px-4 py-16 text-black md:px-6 lg:px-8 lg:py-18">
      <div className="mx-auto max-w-[1120px]">
        <h2 className="text-center text-[clamp(2rem,3vw,2.95rem)] font-semibold tracking-[-0.05em] text-black">
          Explore our courses
        </h2>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          {exploreCourseFilters.map((filter, index) => {
            const active = index === 0;
            return (
              <button
                key={filter}
                type="button"
                className={`h-10 rounded-full px-5 text-[11px] font-semibold tracking-[0.08em] transition ${
                  active
                    ? "bg-black text-white shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
                    : "border border-black/10 bg-white text-black/68 hover:border-black/20"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {exploreCourses.map((course) => (
            <ExploreCourseCard key={course.title} course={course} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="#cta"
            className="inline-flex items-center gap-3 rounded-full bg-black px-5 py-2 text-[11px] font-semibold tracking-[0.08em] text-white shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
          >
            <span>VIEW ALL COURSE</span>
            <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-black">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function FooterSection() {
  const footerLinks = {
    Platform: ["Explore courses", "Why choose us", "Student reviews", "Pricing"],
    Company: ["About", "Careers", "Blog", "Contact"],
    Resources: ["Help center", "Guides", "Community", "Privacy policy"],
  };

  return (
    <footer id="cta" className="bg-[#f5f5f5] px-4 pb-6 pt-10 text-black md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1120px]">
        <div className="rounded-[28px] border border-black/8 bg-white px-5 py-6 shadow-[0_14px_34px_rgba(0,0,0,0.06)] md:px-7 md:py-7">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_1.25fr] lg:items-start">
            <div>
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-black text-white shadow-[0_10px_22px_rgba(0,0,0,0.18)]">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" aria-hidden="true">
                    <path d="M13.1 1.6 4.8 12.1h5.2L8.9 22.4 19.2 9.9h-5.3L13.1 1.6Z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[18px] font-semibold tracking-[-0.04em]">Tutorlv</div>
                  <div className="text-[12px] text-black/55">Learning that feels clean and premium.</div>
                </div>
              </div>

              <p className="mt-5 max-w-md text-[14px] leading-7 text-black/62">
                A simple, modern learning experience built to help students move faster,
                learn better and choose the right course without friction.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {["ALL COURSE", "UI/UX DESIGN", "MARKETING"].map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full border border-black/10 bg-[#f8f8f8] px-4 py-2 text-[11px] font-semibold tracking-[0.08em] text-black/68"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {Object.entries(footerLinks).map(([group, items]) => (
                <div key={group}>
                  <h3 className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/42">
                    {group}
                  </h3>
                  <ul className="mt-4 space-y-3 text-[14px] text-black/74">
                    {items.map((item) => (
                      <li key={item}>
                        <a href="#top" className="transition hover:text-black">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-black/8 pt-5 md:flex-row md:items-center md:justify-between">
            <div className="text-[12px] text-black/52">
              © 2026 Tutorlv. All rights reserved.
            </div>

            <div className="flex items-center gap-3">
              <a
                href="#top"
                className="grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white text-black transition hover:border-black/20"
                aria-label="Instagram"
              >
                IG
              </a>
              <a
                href="#top"
                className="grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white text-black transition hover:border-black/20"
                aria-label="X"
              >
                X
              </a>
              <a
                href="#top"
                className="grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white text-black transition hover:border-black/20"
                aria-label="YouTube"
              >
                YT
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function WhyIcon({ type }) {
  if (type === "user") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          d="M20 19.5c0-3-3.4-5.5-8-5.5s-8 2.5-8 5.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="12" cy="8" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }

  if (type === "money") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          d="M7 9.5c0-2 2.2-3.5 5-3.5s5 1.5 5 3.5-2.2 3.5-5 3.5-5 1.5-5 3.5 2.2 3.5 5 3.5 5-1.5 5-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path d="M12 4.5v15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "award") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          d="M8.5 14.5 7.2 20l4.8-2.7L17 20l-1.3-5.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="9.5" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        d="M12 4.5l2.1 4.3 4.8.7-3.5 3.4.8 4.8-4.2-2.2-4.2 2.2.8-4.8-3.5-3.4 4.8-.7L12 4.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WhyFeatureCard({ title, text, icon, dark = false }) {
  return (
    <div
      className={`rounded-[18px] p-6 shadow-[0_10px_24px_rgba(0,0,0,0.06)] ${
        dark ? "bg-black text-white" : "border border-black/6 bg-white text-black"
      }`}
    >
      <div
        className={`grid h-9 w-9 place-items-center rounded-full ${
          dark ? "bg-white/10 text-white/85" : "bg-black/5 text-black/65"
        }`}
      >
        <WhyIcon type={icon} />
      </div>
      <h3 className="mt-8 text-[17px] font-semibold tracking-[-0.03em]">{title}</h3>
      <p className={`mt-3 max-w-[22ch] text-[13px] leading-6 ${dark ? "text-white/62" : "text-black/60"}`}>
        {text}
      </p>
    </div>
  );
}

function WhyChooseSection() {
  return (
    <section className="bg-[#f5f5f5] px-4 py-16 text-black md:px-6 lg:px-8 lg:py-18">
      <div className="mx-auto max-w-[1120px]">
        <div className="mx-auto max-w-[620px] text-center">
          <h2 className="text-[clamp(2rem,3.3vw,3rem)] font-semibold tracking-[-0.05em] text-black">
            Why choose Tutorlv
          </h2>
          <p className="mx-auto mt-4 max-w-[420px] text-[13px] leading-6 text-black/62">
            Designed for better learning. Built for real success.Designed
            for better learning. Built for real success.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-[0.86fr_1.22fr_0.86fr] lg:items-stretch">
          <div className="grid gap-4">
            <WhyFeatureCard
              dark
              icon="user"
              title="Expert instructors"
              text="Our instructors are creative minds and strategic thinkers."
            />
            <WhyFeatureCard
              icon="money"
              title="Affordable pricing"
              text="We're a team of creative minds and strategic thinkers."
            />
          </div>

          <div className="overflow-hidden rounded-[18px] bg-[#d6d9d3] shadow-[0_12px_28px_rgba(0,0,0,0.08)]">
            <img
              src={heroCenterCard.image}
              alt="Student working on a laptop"
              className="h-full min-h-[340px] w-full object-cover object-[center_26%]"
            />
          </div>

          <div className="grid gap-4">
            <WhyFeatureCard
              icon="award"
              title="Awards"
              text="But along the way, our work has been honored."
            />
            <WhyFeatureCard
              icon="star"
              title="Reviews"
              text="Strategic placements for testimonials, student success."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function TutorHero() {
  return (
    <section className="relative isolate overflow-hidden bg-white text-black">
      <div className="absolute inset-0 bg-white" />
      <div className="absolute inset-0 opacity-[0.8] [background-image:linear-gradient(rgba(16,16,16,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,16,16,0.05)_1px,transparent_1px)] [background-size:74px_74px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_42%,rgba(255,255,255,0.96)_100%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-[1240px] flex-col px-4 pb-10 pt-4 md:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[586px] rounded-full border border-black/10 bg-white shadow-[0_8px_22px_rgba(0,0,0,0.08)]">
          <div className="flex h-[54px] items-center justify-between gap-3 px-3 sm:px-4">
            <a
              href="#top"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-black text-white shadow-[0_8px_18px_rgba(0,0,0,0.18)]"
              aria-label="Home"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" aria-hidden="true">
                <path d="M13.1 1.6 4.8 12.1h5.2L8.9 22.4 19.2 9.9h-5.3L13.1 1.6Z" />
              </svg>
            </a>

            <nav className="hidden flex-1 items-center justify-center gap-6 text-[12px] font-medium tracking-[0.01em] text-black/82 md:flex md:gap-7 md:text-[13px]">
              {heroNavItems.map((item) => (
                <a key={item} href="#top" className="transition hover:text-black">
                  {item}
                </a>
              ))}
            </nav>

            <a
              href="#cta"
              className="inline-flex h-10 shrink-0 items-center gap-3 rounded-full bg-black pl-5 pr-1.5 text-[12px] font-medium tracking-[0.01em] text-white shadow-[0_8px_18px_rgba(0,0,0,0.18)] md:text-[13px]"
            >
              <span>SIGN UP</span>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-[18px] text-black">
                →
              </span>
            </a>
          </div>
        </div>

        <div className="relative flex flex-1 flex-col">
          <div className="relative z-10 mx-auto mt-16 w-full max-w-[780px] text-center md:mt-20 lg:mt-24">
            <div className="inline-flex items-center rounded-full border border-black/10 bg-white px-4 py-2 shadow-[0_8px_22px_rgba(0,0,0,0.06)]">
              <div className="flex -space-x-2">
                {heroAvatars.map((avatar, index) => (
                  <img
                    key={avatar}
                    src={avatar}
                    alt={`Student ${index + 1}`}
                    className="h-7 w-7 rounded-full border border-white object-cover"
                  />
                ))}
              </div>
              <span className="ml-3 text-[13px] font-medium text-black/75 md:text-[15px]">
                125k+ student reviews
              </span>
            </div>

            <h1 className="mt-6 font-sans text-[clamp(3.15rem,7vw,5.6rem)] font-black leading-[0.9] tracking-[-0.08em] text-black md:mt-8">
              Build skills
              <br />
              New opportunities.
            </h1>

            <p className="mx-auto mt-6 max-w-[780px] text-[15px] leading-7 text-black/70 md:text-[17px] md:leading-8">
              Tutorlv gives you a complete learning experience that helps you gain real,
              job-ready skills and take the next step in your career.
            </p>

            <a
              href="#courses"
              className="mt-8 inline-flex items-center gap-4 rounded-full bg-black px-5 py-2.5 text-[11px] font-medium tracking-[0.04em] text-white shadow-[0_14px_32px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 md:px-6 md:py-3 md:text-[13px]"
            >
              <span className="pl-1">EXPLORE OUR COURSES</span>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-[18px] text-black">
                →
              </span>
            </a>
          </div>

          <HeroStat
            className="left-0 top-[43%]"
            align="left"
            icon={<span className="text-lg leading-none">◌</span>}
            title="100+"
            subtitle="Expert tutor"
            image={heroLeftCard.image}
            alt={heroLeftCard.alt}
          />

          <HeroStat
            className="right-0 top-[33%]"
            align="right"
            icon={<span className="text-lg leading-none">▢</span>}
            title="120+"
            subtitle="Video courses"
            image={heroRightCard.image}
            alt={heroRightCard.alt}
          />

          <div className="relative z-10 mt-auto pt-12 lg:pt-16">
            <div className="grid gap-4 lg:grid-cols-[0.9fr_1.4fr_0.9fr] lg:gap-5">
              <HeroShowcaseCard
                image={heroLeftCard.image}
                alt={heroLeftCard.alt}
                title={heroLeftCard.title}
                subtitle={heroLeftCard.subtitle}
                coverClassName="object-[center_18%]"
              />
              <HeroShowcaseCard
                image={heroCenterCard.image}
                alt={heroCenterCard.alt}
                title={heroCenterCard.title}
                subtitle={heroCenterCard.subtitle}
                play
                coverClassName="object-[center_22%]"
              />
              <HeroShowcaseCard
                image={heroRightCard.image}
                alt={heroRightCard.alt}
                title={heroRightCard.title}
                subtitle={heroRightCard.subtitle}
                coverClassName="object-[center_18%]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PromptHeroArt() {
  return (
    <div className="relative mx-auto h-[580px] w-full max-w-[680px]">
      <div className="absolute left-[4%] top-[18%] h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute right-[6%] top-[8%] h-72 w-72 rounded-full bg-teal-400/10 blur-3xl" />
      <div className="absolute inset-y-[12%] right-[14%] w-[1px] bg-gradient-to-b from-transparent via-cyan-300/60 to-transparent opacity-50" />

      <div className="absolute left-[8%] top-[15%] rotate-[-6deg]">
        <Card className="w-56 p-4">
          <div className="flex items-center justify-between text-[11px] text-white/55">
            <span>Prompt premium</span>
            <span className="rounded-full bg-teal-300/15 px-2 py-1 text-teal-200">AI</span>
          </div>
          <div className="mt-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 p-4">
            <div className="mb-3 h-2 w-20 rounded-full bg-teal-300/90" />
            <div className="space-y-2">
              <div className="h-2 w-full rounded-full bg-white/20" />
              <div className="h-2 w-4/5 rounded-full bg-white/15" />
              <div className="h-2 w-2/3 rounded-full bg-white/10" />
            </div>
          </div>
        </Card>
      </div>

      <div className="absolute left-[34%] top-[3%] rotate-[8deg]">
        <Card className="w-48 p-4">
          <div className="text-[11px] uppercase tracking-[0.28em] text-teal-300">score</div>
          <div className="mt-4 text-4xl font-semibold text-white">98</div>
          <p className="mt-2 text-xs leading-5 text-white/60">padrão visual premium.</p>
        </Card>
      </div>

      <div className="absolute bottom-[10%] left-[8%] rotate-[4deg]">
        <Card className="w-60 p-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-white/55">Estrutura completa</div>
            <div className="h-3 w-3 rounded-full bg-teal-300 shadow-[0_0_20px_rgba(45,212,191,0.8)]" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="h-16 rounded-2xl bg-white/5 p-2">
              <div className="h-full rounded-xl bg-gradient-to-t from-cyan-400/25 to-transparent" />
            </div>
            <div className="h-16 rounded-2xl bg-white/5 p-2">
              <div className="h-full rounded-xl bg-gradient-to-t from-teal-400/25 to-transparent" />
            </div>
            <div className="h-16 rounded-2xl bg-white/5 p-2">
              <div className="h-full rounded-xl bg-gradient-to-t from-white/20 to-transparent" />
            </div>
          </div>
        </Card>
      </div>

      <div className="absolute bottom-[22%] right-[7%] rotate-[-8deg]">
        <Card className="w-44 p-3">
          <div className="text-[10px] uppercase tracking-[0.28em] text-teal-300">release</div>
          <div className="mt-2 text-3xl font-semibold text-white">+30</div>
          <div className="mt-2 h-1.5 rounded-full bg-white/10">
            <div className="h-1.5 w-[84%] rounded-full bg-gradient-to-r from-teal-300 to-cyan-400" />
          </div>
        </Card>
      </div>

      <div className="absolute inset-0">
        <svg viewBox="0 0 640 540" className="h-full w-full">
          <defs>
            <linearGradient id="heroGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a7f3d0" stopOpacity="1" />
              <stop offset="45%" stopColor="#22d3ee" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="1" />
            </linearGradient>
            <radialGradient id="heroSpot" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="35%" stopColor="#67e8f9" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </radialGradient>
            <filter id="heroBlur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="16" />
            </filter>
          </defs>

          <ellipse cx="450" cy="416" rx="188" ry="54" fill="#02131b" opacity="0.72" />
          <ellipse cx="432" cy="394" rx="144" ry="38" fill="#0ea5e9" opacity="0.2" filter="url(#heroBlur)" />

          <g transform="translate(312 60)">
            <path
              d="M114 334c-7-19-15-36-22-56-10-29-9-61 5-87 8-14 16-26 17-41 1-18-7-32-11-48-5-20-1-37 7-54 18 5 31 16 39 30 9 16 13 35 10 54-1 13-6 25-10 37-5 17-2 33 3 49 9 31 25 55 24 90-1 22-6 42-16 59-22 4-41 3-52-3z"
              fill="url(#heroGlow)"
              opacity="0.95"
            />
            <path
              d="M122 334c-5-17-13-31-19-50-8-24-8-49 4-69 8-14 14-25 14-37 0-14-6-26-9-40-4-16-1-30 5-44 13 5 23 13 29 25 7 13 10 28 8 44-1 11-5 20-8 31-4 14-2 28 2 40 7 26 20 47 19 76-1 18-4 35-11 49-14 3-28 2-34-1z"
              fill="#e0f7ff"
              opacity="0.45"
            />
            <path
              d="M120 332c-5-17-11-32-18-48-10-23-10-49 2-71 8-13 11-24 11-35 0-14-7-27-10-40-4-17-1-31 6-46 19 9 28 22 30 38 2 12-1 24-5 36-5 16-2 31 2 46 7 25 18 46 20 72 1 17-1 31-7 44-12 2-22 2-31 4z"
              fill="url(#heroSpot)"
              opacity="0.8"
            />
            <circle cx="133" cy="88" r="22" fill="#d9fbff" opacity="0.65" />
            <circle cx="109" cy="74" r="12" fill="#ffffff" opacity="0.45" />
          </g>

          <g opacity="0.95">
            <path d="M128 102c18 8 30 20 36 38" stroke="#9ef3ff" strokeWidth="2" strokeLinecap="round" />
            <path d="M124 118l18-7-5 19" fill="none" stroke="#9ef3ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M146 182c26 1 49 8 66 24" stroke="#9ef3ff" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
            <path d="M192 216l24-5-11 22" fill="none" stroke="#9ef3ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
          </g>

          <g transform="translate(72 126)">
            <rect x="0" y="0" width="90" height="108" rx="18" fill="#0b1220" opacity="0.95" />
            <rect x="12" y="10" width="66" height="16" rx="8" fill="#0f172a" />
            <rect x="20" y="36" width="50" height="40" rx="10" fill="url(#heroGlow)" opacity="0.88" />
            <text x="45" y="62" textAnchor="middle" fontSize="15" fontWeight="700" fill="#ffffff">
              39€
            </text>
            <path d="M14 88h62" stroke="#67e8f9" strokeWidth="2" strokeLinecap="round" />
            <path d="M18 97h48" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />
          </g>

          <g transform="translate(108 356)">
            <rect x="0" y="0" width="168" height="82" rx="18" fill="#f8fafc" opacity="0.95" />
            <circle cx="28" cy="30" r="10" fill="#0f172a" />
            <circle cx="56" cy="30" r="10" fill="#0f172a" opacity="0.85" />
            <circle cx="84" cy="30" r="10" fill="#0f172a" opacity="0.72" />
            <circle cx="112" cy="30" r="10" fill="#0f172a" opacity="0.58" />
            <circle cx="140" cy="30" r="10" fill="#0f172a" opacity="0.4" />
            <path d="M20 58h128" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
            <path d="M20 58c18-12 38-6 52-14s23-15 34-15 18 8 31 4 24-13 40-9" fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          <g transform="translate(342 26)" opacity="0.9">
            <rect x="0" y="0" width="176" height="22" rx="11" fill="url(#heroGlow)" opacity="0.65" />
            <rect x="18" y="5" width="42" height="12" rx="6" fill="#0f172a" opacity="0.7" />
          </g>

          <g transform="translate(490 108)" opacity="0.9">
            <rect x="0" y="0" width="16" height="16" rx="4" fill="#67e8f9" />
            <rect x="24" y="24" width="10" height="10" rx="3" fill="#67e8f9" opacity="0.8" />
            <rect x="42" y="42" width="8" height="8" rx="3" fill="#67e8f9" opacity="0.65" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function LaptopMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[540px]">
      <div className="absolute left-[-10px] top-[20px] h-[300px] w-[300px] rounded-full bg-teal-300/10 blur-3xl" />
      <div className="relative rotate-[-8deg]">
        <svg viewBox="0 0 540 400" className="h-auto w-full drop-shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
          <defs>
            <linearGradient id="laptopBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="52%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
            <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d8f8ff" />
              <stop offset="100%" stopColor="#eff6ff" />
            </linearGradient>
            <linearGradient id="chartLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2dd4bf" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <g transform="translate(68 28)">
            <path d="M20 0h312c12 0 22 10 22 22v178c0 12-10 22-22 22H20c-12 0-22-10-22-22V22C-2 10 8 0 20 0z" fill="url(#laptopBody)" />
            <rect x="18" y="18" width="316" height="184" rx="16" fill="#f8fafc" />
            <rect x="28" y="28" width="296" height="164" rx="12" fill="url(#screenGrad)" />
            <rect x="28" y="28" width="96" height="164" rx="12" fill="#eff6ff" opacity="0.85" />
            <circle cx="54" cy="46" r="8" fill="#0f172a" opacity="0.9" />
            <circle cx="74" cy="46" r="8" fill="#0f172a" opacity="0.78" />
            <circle cx="94" cy="46" r="8" fill="#0f172a" opacity="0.66" />
            <g transform="translate(52 72)">
              <rect x="0" y="0" width="226" height="98" rx="10" fill="#ffffff" opacity="0.8" />
              <path d="M16 66c18-10 30-7 46-16s22-18 40-19 23 10 37 8 27-15 46-12 32 17 48 12" fill="none" stroke="url(#chartLine)" strokeWidth="3" strokeLinecap="round" />
              <path d="M16 66v18h194" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
              <path d="M22 18h44" stroke="#0f172a" strokeOpacity="0.12" strokeWidth="6" strokeLinecap="round" />
              <path d="M22 32h80" stroke="#0f172a" strokeOpacity="0.1" strokeWidth="5" strokeLinecap="round" />
              <path d="M22 46h62" stroke="#0f172a" strokeOpacity="0.08" strokeWidth="5" strokeLinecap="round" />
            </g>
            <rect x="148" y="30" width="126" height="164" rx="12" fill="#ffffff" opacity="0.92" />
            <rect x="164" y="46" width="92" height="24" rx="10" fill="#0f172a" opacity="0.95" />
            <rect x="164" y="82" width="92" height="74" rx="12" fill="url(#screenGrad)" />
            <path d="M176 146h68" stroke="url(#chartLine)" strokeWidth="4" strokeLinecap="round" />
            <path d="M176 132h52" stroke="#0f172a" strokeOpacity="0.14" strokeWidth="4" strokeLinecap="round" />
            <path d="M176 118h38" stroke="#0f172a" strokeOpacity="0.12" strokeWidth="4" strokeLinecap="round" />
            <rect x="148" y="202" width="126" height="16" rx="8" fill="#cbd5e1" />
          </g>
          <g transform="translate(82 230)">
            <path d="M0 52l330 0c18 0 30 11 30 23s-12 21-30 21H0c-18 0-30-9-30-21S-18 52 0 52z" fill="#94a3b8" opacity="0.18" />
            <path d="M18 0h302c12 0 22 10 22 22v38c0 12-10 22-22 22H18C6 82-4 72-4 60V22C-4 10 6 0 18 0z" fill="url(#laptopBody)" />
            <path d="M0 74h330c16 0 28 8 28 18 0 8-10 16-26 16H18c-20 0-34-8-34-18 0-10 12-16 16-16z" fill="#cbd5e1" />
            <path d="M26 22h278" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
            <path d="M80 22v26" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function PawnIllustration() {
  return (
    <div className="relative mx-auto h-[360px] w-full max-w-[460px]">
      <div className="absolute left-[14%] top-[10%] h-[300px] w-[300px] rounded-full bg-cyan-400/10 blur-3xl" />
      <svg viewBox="0 0 460 360" className="relative h-full w-full">
        <defs>
          <linearGradient id="pawnGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d9fbff" />
            <stop offset="35%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>
        <ellipse cx="222" cy="302" rx="135" ry="34" fill="#0a1220" opacity="0.9" />
        <ellipse cx="222" cy="302" rx="92" ry="22" fill="#67e8f9" opacity="0.2" />
        <g transform="translate(170 48)">
          <path
            d="M76 0c18 0 30 15 30 34 0 10-4 20-12 26 17 12 31 30 38 53 8 29 2 66-9 95-11 28-30 52-55 67-24 14-52 21-79 21-30 0-57-9-77-25-18-15-31-38-31-65 0-31 16-58 41-76-10-9-16-22-16-36 0-19 12-34 29-34h40c0-18 16-40 32-40h19z"
            fill="url(#pawnGlow)"
            opacity="0.95"
          />
          <path
            d="M73 16c10 0 17 8 17 18 0 8-4 15-11 19 14 10 25 25 31 44 6 22 1 49-7 71-9 22-24 41-43 52-18 11-40 17-61 17-24 0-45-7-61-20-15-12-24-29-24-49 0-23 12-43 31-56-8-8-12-18-12-29 0-10 6-17 15-17h39c0-15 12-28 25-28h20z"
            transform="translate(15 10)"
            fill="#ffffff"
            opacity="0.28"
          />
          <ellipse cx="59" cy="206" rx="120" ry="27" fill="#020617" opacity="0.85" />
          <ellipse cx="62" cy="204" rx="82" ry="16" fill="#22d3ee" opacity="0.16" />
        </g>
        <path d="M326 84c16 14 24 29 28 48" stroke="#9ef3ff" strokeWidth="2" strokeLinecap="round" />
        <path d="M320 96l18-7-4 19" fill="none" stroke="#9ef3ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M336 166c20 1 36 8 50 22" stroke="#9ef3ff" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        <path d="M366 196l20-4-9 18" fill="none" stroke="#9ef3ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
        <rect x="66" y="78" width="18" height="18" rx="5" fill="#9ef3ff" opacity="0.8" />
        <rect x="390" y="94" width="14" height="14" rx="4" fill="#9ef3ff" opacity="0.65" />
        <rect x="376" y="232" width="12" height="12" rx="3" fill="#9ef3ff" opacity="0.5" />
        <circle cx="396" cy="70" r="22" fill="#d9fbff" opacity="0.65" />
        <circle cx="401" cy="68" r="12" fill="#ffffff" opacity="0.42" />
      </svg>
    </div>
  );
}

function App() {
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#060808] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-8%] top-[-10%] h-[34rem] w-[34rem] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute right-[-10%] top-[16%] h-[38rem] w-[38rem] rounded-full bg-teal-400/10 blur-3xl" />
        <div className="absolute left-0 top-[45%] h-[26rem] w-[26rem] rounded-full bg-[#0d3f45]/25 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:120px_120px] opacity-[0.08]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(6,8,8,0.28)_58%,rgba(6,8,8,0.76)_100%)]" />
      </div>

      <header className="hidden sticky top-0 z-40 border-b border-white/5 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <a href="#top" className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full border border-teal-300/30 bg-teal-300/10 text-xs font-bold text-teal-200">
              V
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-[13px] text-white/70 md:flex">
            <a className="transition hover:text-white" href="#top">
              Home
            </a>
            <a className="transition hover:text-white" href="#sobre">
              Sobre nos
            </a>
            <a className="transition hover:text-white" href="#servicos">
              Servicos
            </a>
            <a className="transition hover:text-white" href="#clientes">
              Clientes
            </a>
            <a className="transition hover:text-white" href="#faq">
              FAQ
            </a>
          </nav>

          <a
            href="#cta"
            className="rounded-full bg-gradient-to-r from-teal-400 to-blue-500 px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_18px_40px_rgba(34,211,238,0.22)] transition hover:-translate-y-0.5"
          >
            Comece Agora!
          </a>
        </div>
      </header>

      <main id="top" className="relative z-10">
        <TutorHero />

        <Reveal className="hidden">
          <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-18 pt-14 md:px-8 lg:grid-cols-[0.98fr_1.02fr] lg:items-center lg:pt-20">
            <div className="max-w-[540px]">
              <div className="mb-8 inline-flex h-10 w-10 items-center justify-center rounded-full border border-teal-300/30 bg-teal-300/10 text-teal-200">
                ◌
              </div>
              <h1 className="max-w-[10ch] font-saira text-[clamp(3rem,6vw,5.2rem)] font-semibold leading-[0.9] tracking-[-0.07em] text-white">
                O nosso pack e feito para acelerar os seus{" "}
                <span className="text-teal-300">resultados</span>.
              </h1>
              <p className="mt-5 max-w-[34ch] text-sm leading-7 text-white/72 md:text-[15px]">
                Packs de prompts premium para fotos com IA, com direção visual,
                consistência de marca e uma leitura que parece produto de alto valor.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                {stats.map((item) => (
                  <Card key={item.label} className="min-w-[92px] px-4 py-3">
                    <div className="text-xl font-semibold text-white">{item.value}</div>
                    <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/45">
                      {item.label}
                    </div>
                  </Card>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#cta"
                  className="rounded-full bg-gradient-to-r from-teal-400 to-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                >
                  Comprar agora
                </a>
                <a
                  href="#sobre"
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 transition hover:border-white/20 hover:bg-white/10"
                >
                  Conhecer os packs
                </a>
              </div>

              <div className="mt-10">
                <div className="text-xs uppercase tracking-[0.3em] text-white/45">Estrutura completa</div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {["Prompt base", "Estilos", "Variações", "Upsell"].map((item) => (
                    <Card key={item} className="px-5 py-3 text-sm text-white/85">
                      {item}
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative">
              <PromptHeroArt />
            </div>
          </section>
        </Reveal>

        <Reveal delay={120}>
          <WhyChooseSection />
        </Reveal>

        <Reveal delay={90}>
          <ExploreCoursesSection />
        </Reveal>

        <Reveal delay={90}>
          <section className="hidden bg-[#f5f5f5] px-4 py-14 text-black md:px-6 lg:px-8 lg:py-16">
            <div className="mx-auto max-w-[1120px]">
              <p className="text-center text-[12px] font-medium tracking-[-0.01em] text-black/72">
                Tutorlv fetured in more than 50+ companies
              </p>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-[#8d8d8d]">
                {companyLogos.map((logo, index) => (
                  <div key={`${logo}-${index}`} className="flex items-center gap-2 text-[22px] font-semibold">
                    <span className="opacity-75">◌</span>
                    <span className="text-[18px] font-bold tracking-[-0.04em]">{logo}</span>
                  </div>
                ))}
              </div>

              <h2 className="mt-20 text-center text-[clamp(2rem,3vw,2.9rem)] font-semibold tracking-[-0.05em] text-black">
                Our featured courses
              </h2>

              <div className="mt-12 grid gap-5 md:grid-cols-3">
                {featuredCourses.map((course) => (
                  <CourseCard key={course.title} course={course} />
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delay={120}>
          <section id="sobre" className="mx-auto max-w-7xl px-5 py-16 md:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
              <div className="order-2 lg:order-1">
                <LaptopMockup />
              </div>
              <div className="order-1 max-w-xl lg:order-2">
                <SectionTitle
                  kicker="CRESCA RAPIDO COM O PODER DA IA"
                  title={
                    <>
                      Gere prompts com{" "}
                      <span className="text-teal-300">cara de campanha</span>{" "}
                      sem perder tempo.
                    </>
                  }
                  text="Se você quer vender imagens geradas por IA, precisa de packs prontos que entregam qualidade, direção e repetição consistente. É isso que essa oferta resolve."
                />
                <div className="mt-8">
                  <a
                    href="#servicos"
                    className="inline-flex rounded-full bg-gradient-to-r from-teal-400 to-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                  >
                    Falar com especialista
                  </a>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delay={140}>
          <section id="servicos" className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <div className="grid gap-4 md:grid-cols-3">
              {featureCards.map((card) => (
                <Card key={card.title} className="px-6 py-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-teal-300/10 text-teal-200">
                    {card.icon}
                  </div>
                  <h3 className="text-lg font-semibold tracking-[-0.03em] text-white">{card.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/66">{card.text}</p>
                </Card>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal delay={160}>
          <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.38em] text-teal-300/90">
                O QUE A VBM IA FAZ?
              </p>
              <h2 className="mt-4 font-saira text-[clamp(1.8rem,3.8vw,3rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-white">
                Tudo o que você precisa para transformar prompts em produto desejável.
              </h2>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {steps.map((step, index) => (
                <div key={step.title} className="relative">
                  <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-teal-300/50 via-white/15 to-transparent md:block" />
                  <Card className="relative px-5 py-5">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-full border border-teal-300/20 bg-teal-300/10 text-sm font-semibold text-teal-200">
                        0{index + 1}
                      </div>
                      <div className="text-sm font-semibold uppercase tracking-[0.2em] text-white/25">
                        Etapa
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/65">{step.text}</p>
                  </Card>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal delay={180}>
          <section id="clientes" className="mx-auto max-w-7xl px-5 py-16 md:px-8">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.12),transparent_35%),radial-gradient(circle_at_bottom,rgba(34,211,238,0.1),transparent_35%),rgba(255,255,255,0.03)] px-6 py-10 md:px-8 md:py-12">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-[-4%] top-[12%] h-40 w-40 rounded-full bg-white/5 blur-3xl" />
                <div className="absolute right-[-2%] top-[18%] h-44 w-44 rounded-full bg-teal-300/10 blur-3xl" />
                <div className="absolute bottom-[-10%] left-[40%] h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl" />
                <div className="absolute left-[10%] top-[18%] h-24 w-24 rounded-[1.5rem] border border-white/10 bg-white/[0.03] blur-[1px]" />
                <div className="absolute right-[12%] bottom-[18%] h-20 w-20 rounded-[1.25rem] border border-white/10 bg-white/[0.03] blur-[1px]" />
              </div>

              <div className="mx-auto max-w-4xl text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.38em] text-teal-300/90">
                  O QUE NOSSOS CLIENTES ESTAO FALANDO SOBRE NOS
                </p>
                <h2 className="mt-4 font-saira text-[clamp(1.8rem,3.6vw,2.8rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-white">
                  Gente que comprou, aplicou e viu o produto ficar mais forte.
                </h2>
              </div>

              <div className="relative mt-10 grid gap-4 lg:grid-cols-[0.88fr_1.24fr_0.88fr] lg:items-stretch">
                <Card className="pointer-events-none absolute left-[-40px] top-[18px] hidden h-24 w-24 rotate-[-8deg] opacity-60 blur-[1px] lg:block" />
                <Card className="pointer-events-none absolute right-[-30px] top-[10px] hidden h-20 w-20 rotate-[10deg] opacity-60 blur-[1px] lg:block" />

                {testimonials.map((item, index) => {
                  const isCenter = index === 1;

                  return (
                    <Card
                      key={item.name}
                      className={`relative p-5 ${
                        isCenter
                          ? "scale-[1.03] border-white/15 bg-white/[0.07] lg:py-6"
                          : "opacity-80 lg:mt-6"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`grid h-12 w-12 place-items-center rounded-full border border-white/10 ${
                              isCenter ? "bg-gradient-to-br from-teal-300/25 to-blue-500/20" : "bg-white/5"
                            }`}
                          >
                            <span className="text-sm font-semibold text-white">
                              {item.name
                                .split(" ")
                                .map((part) => part[0])
                                .join("")
                                .slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-white">{item.name}</div>
                            <div className="text-xs uppercase tracking-[0.18em] text-white/40">
                              {item.role}
                            </div>
                          </div>
                        </div>
                        <div className="text-teal-300">Google</div>
                      </div>

                      <div className="mt-4 flex gap-1 text-teal-300">
                        <span>★</span>
                        <span>★</span>
                        <span>★</span>
                        <span>★</span>
                        <span>★</span>
                      </div>

                      <div className="mt-4 text-sm leading-7 text-white/68">{item.text}</div>
                      {isCenter ? (
                        <div className="mt-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-white/35">
                          <span className="h-1.5 w-1.5 rounded-full bg-teal-300" />
                          prova social real
                        </div>
                      ) : null}
                    </Card>
                  );
                })}
              </div>

              <div className="mt-10 text-center">
                <a
                  href="#cta"
                  className="inline-flex rounded-full bg-gradient-to-r from-teal-400 to-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                >
                  Quero crescer mais
                </a>
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delay={200}>
          <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.38em] text-teal-300/90">
                  A VBM IA E RESPONSAVEL PELO CRESCIMENTO DE GRANDES NEGOCIOS
                </p>
                <p className="mt-4 max-w-xl text-sm leading-7 text-white/68">
                  Pack pronto, visual forte e promessa clara. E isso que ajuda sua oferta
                  a se diferenciar em um mercado cheio de material generico.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {logos.map((logo) => (
                  <Card
                    key={logo}
                    className="grid place-items-center px-4 py-6 text-center text-sm font-semibold text-white/80"
                  >
                    {logo}
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delay={220}>
          <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <Card className="mx-auto max-w-2xl px-6 py-6 text-center">
              <div className="mx-auto flex w-fit items-center gap-3 rounded-2xl bg-teal-300/10 px-4 py-2">
                <div className="h-8 w-8 rounded-full border border-white/15 bg-white/10" />
                <span className="font-semibold text-teal-300">ATENCAO!</span>
              </div>
              <p className="mt-4 text-sm leading-7 text-white/72">
                Acelere seu crescimento agora com a VBM IA. Se a sua oferta precisa
                parecer mais premium, mais clara e mais vendavel, esse e o ponto de virada.
              </p>
              <div className="mt-6">
                <a
                  href="#cta"
                  className="inline-flex rounded-full bg-gradient-to-r from-teal-400 to-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                >
                  Eleve seu negocio agora!
                </a>
              </div>
            </Card>
          </section>
        </Reveal>

        <Reveal delay={240}>
          <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
              <div className="relative">
                <Card className="max-w-xl p-6 md:p-7">
                  <div className="text-xs font-semibold uppercase tracking-[0.32em] text-teal-300/90">
                    Garantia
                  </div>
                  <h3 className="mt-4 font-saira text-3xl font-semibold leading-[0.98] tracking-[-0.04em] text-white">
                    Cancele, quando quiser.
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-white/68">
                    Aqui a proposta é simples: entregar um produto digital com valor
                    percebido alto, sem fricção e sem compromisso complicado.
                  </p>
                </Card>
              </div>

              <div className="relative flex min-h-[360px] items-center justify-center">
                <PawnIllustration />
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delay={260}>
          <section id="faq" className="mx-auto max-w-7xl px-5 py-16 md:px-8">
            <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
              <div>
                <div className="mb-5 h-14 w-14 rounded-full border border-teal-300/20 bg-teal-300/10" />
                <div className="space-y-3">
                  {faqs.map((faq, index) => {
                    const open = openFaq === index;
                    return (
                      <Card key={faq.q} className="overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setOpenFaq(open ? -1 : index)}
                          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                        >
                          <span className="text-sm font-medium text-white/85">{faq.q}</span>
                          <span className="text-teal-300">{open ? "−" : "+"}</span>
                        </button>
                        {open ? (
                          <div className="px-5 pb-5 text-sm leading-7 text-white/66">{faq.a}</div>
                        ) : null}
                      </Card>
                    );
                  })}
                </div>
              </div>

              <div className="lg:pt-14">
                <p className="text-xs font-semibold uppercase tracking-[0.38em] text-teal-300/90">
                  Perguntas Frequentes
                </p>
                <h2 className="mt-4 font-saira text-[clamp(2rem,4vw,3.3rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-white">
                  Ainda ficou com alguma dúvida?
                </h2>
                <p className="mt-4 max-w-md text-sm leading-7 text-white/68">
                  Fala com a gente no WhatsApp e a gente te ajuda a escolher o melhor
                  pack para o seu momento.
                </p>
                <div className="mt-6">
                  <a
                    href="#cta"
                    className="inline-flex rounded-full bg-gradient-to-r from-teal-400 to-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                  >
                    Chamar no WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delay={280}>
          <FooterSection />
        </Reveal>

        <Reveal delay={280}>
          <section id="cta" className="hidden mt-10">
            <div className="mx-auto max-w-7xl px-5 pb-0 md:px-8">
              <div className="rounded-t-[2rem] bg-gradient-to-r from-[#08313b] via-[#138b84] to-[#2a8dc0] px-5 py-5 text-center text-sm text-white/80 md:px-8">
                <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
                  <div className="font-medium">© 2026 VBM IA - Todos os direitos reservados</div>
                  <div className="flex items-center gap-4">
                    <span className="text-white/65">Desenvolvido por VBM</span>
                    <span className="h-5 w-5 rounded-full border border-white/20 bg-white/10" />
                    <span className="h-5 w-5 rounded-full border border-white/20 bg-white/10" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Reveal>
      </main>
    </div>
  );
}

export default App;
