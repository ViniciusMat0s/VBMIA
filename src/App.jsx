import React, { useEffect, useState } from "react";
import { flushSync } from "react-dom";

const topNavItems = ["Pack", "Nichos", "CÃ³mo funciona", "Casos", "FAQ"];

const footerColumns = [
  {
    title: "Pack",
    links: [
      "QuÃ© incluye",
      "CÃ³mo funciona",
      "Ejemplos",
      "Actualizaciones",
    ],
  },
  {
    title: "Nichos",
    links: ["Profesional", "Lifestyle", "Lujo", "Comercial"],
  },
  {
    title: "FAQ",
    links: [
      "Â¿Necesito experiencia?",
      "Â¿Sirve para varios nichos?",
      "Â¿Puedo adaptarlo?",
      "Â¿Funciona con herramientas de IA?",
    ],
  },
];

const courses = [
  {
    badge: "NUEVO",
    title: "Profesional y corporativo",
    text: "Prompts para retratos limpios, perfiles serios y piezas visuales que refuerzan tu presencia digital.",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
    meta: "Perfil Â· marca",
    price: "24 prompts",
  },
  {
    badge: "DESTACADO",
    title: "Marca personal y redes sociales",
    text: "ImÃ¡genes naturales para Instagram, stories y contenido diario con un look mÃ¡s actual y coherente.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    meta: "Social Â· creadores",
    price: "22 prompts",
  },
  {
    badge: "PREMIUM",
    title: "Lifestyle, lujo y viajes",
    text: "Escenas con aire editorial para coches, moda, belleza y un acabado mÃ¡s aspiracional.",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
    meta: "Premium Â· editorial",
    price: "20 prompts",
  },
  {
    badge: "PRO",
    title: "Negocios y publicidad",
    text: "Sistemas listos para posts, anuncios y creatividades comerciales con una direcciÃ³n visual clara.",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80",
    meta: "Anuncios Â· negocio",
    price: "18 prompts",
  },
];

const testimonials = [
  {
    name: "Laura GÃ³mez",
    role: "Marca personal",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
    quote:
      "Me ayudÃ³ a pasar de ideas sueltas a imÃ¡genes mÃ¡s coherentes para LinkedIn, Instagram y mi web.",
  },
  {
    name: "Ãlvaro MartÃ­n",
    role: "Lifestyle y redes",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
    quote: "Ahora adapto el estilo en minutos y no tengo que empezar desde cero cada vez.",
  },
  {
    name: "Marta Ruiz",
    role: "Lujo y editorial",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&q=80",
    quote:
      "Me sirve para moda, viajes y escenas premium con un resultado mucho mÃ¡s cuidado.",
  },
  {
    name: "Javier LÃ³pez",
    role: "Negocio y publicidad",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80",
    quote:
      "Para campaÃ±as y contenido comercial me ahorra tiempo y me da una direcciÃ³n visual mucho mÃ¡s clara.",
  },
];

function useScrollReveal() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll("[data-reveal]"));

    if (elements.length === 0) {
      return undefined;
    }

    const markVisible = (element) => {
      const delay = element.dataset.revealDelay;

      if (delay) {
        element.style.transitionDelay = `${delay}ms`;
      }

      element.classList.add("is-visible");
    };

    if (!("IntersectionObserver" in window)) {
      elements.forEach(markVisible);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            markVisible(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    elements.forEach((element) => {
      const delay = element.dataset.revealDelay;

      if (delay) {
        element.style.transitionDelay = `${delay}ms`;
      }

      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);
}

function useDirectionalScrollReveal() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll("[data-direction-reveal]"));

    if (elements.length === 0) {
      return undefined;
    }

    let frameId = 0;

    const clamp = (value) => Math.min(1, Math.max(0, value));

    const setBaseStyles = (element) => {
      const baseSide = element.dataset.directionRevealBase || "left";
      const offsetX = baseSide === "right" ? "28px" : "-28px";

      element.style.setProperty("--direction-reveal-offset-x", offsetX);
      element.style.setProperty("--direction-reveal-progress", "0");
    };

    const scheduleUpdate = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
        const revealStart = viewportHeight * 0.82;
        const revealEnd = viewportHeight * 0.42;
        const revealSpan = revealStart - revealEnd || 1;

        elements.forEach((element) => {
          const rect = element.getBoundingClientRect();
          const progress = clamp((revealStart - rect.top) / revealSpan);
          element.style.setProperty("--direction-reveal-progress", progress.toFixed(3));
        });

        frameId = 0;
      });
    };

    elements.forEach(setBaseStyles);

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    scheduleUpdate();

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);
}

function useThemeMode() {
  const getInitialTheme = () => {
    if (typeof window === "undefined") {
      return "light";
    }

    let storedTheme = null;

    try {
      storedTheme = window.localStorage.getItem("vbm-theme");
    } catch (error) {
      storedTheme = null;
    }

    if (storedTheme === "dark" || storedTheme === "light") {
      return storedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;

    try {
      window.localStorage.setItem("vbm-theme", theme);
    } catch (error) {
      // Ignore storage errors and keep the in-memory theme active.
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    if (typeof document !== "undefined" && "startViewTransition" in document) {
      document.startViewTransition(() => {
        flushSync(() => {
          setTheme(nextTheme);
        });
      });
      return;
    }

    setTheme(nextTheme);
  };

  return {
    isDark: theme === "dark",
    toggleTheme,
  };
}

function App() {
  useScrollReveal();
  useDirectionalScrollReveal();
  const { isDark, toggleTheme } = useThemeMode();

  return (
    <div className="theme-transition min-h-screen overflow-x-hidden bg-[var(--page-bg)] text-[var(--page-text)]">
      <HeroSection />
      <DiscoverySection />
      <CoursesSection />
      <TestimonialsSection />
      <Footer />
      <ThemeToggleButton isDark={isDark} onToggle={toggleTheme} />
    </div>
  );
}

function HeroSection() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navTargets = ["#courses", "#nichos", "#discovery", "#testimonials", "#faq"];

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.matchMedia("(min-width: 768px)").matches) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <section id="top" className="theme-hero relative flex min-h-screen flex-col overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 12%, var(--hero-glow-1), transparent 28%), radial-gradient(circle at 48% 28%, var(--hero-glow-2), transparent 34%), radial-gradient(circle at 50% 92%, var(--hero-glow-3), transparent 18%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: [
            "linear-gradient(var(--hero-grid-line) 1px, transparent 1px)",
            "linear-gradient(90deg, var(--hero-grid-line) 1px, transparent 1px)",
            "radial-gradient(circle, var(--hero-dot) 1.4px, transparent 1.9px)",
          ].join(", "),
          backgroundSize: "76px 76px, 76px 76px, 24px 24px",
          opacity: 0.42,
          WebkitMaskImage: "radial-gradient(circle at center, black 68%, transparent 100%)",
          maskImage: "radial-gradient(circle at center, black 68%, transparent 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, var(--hero-grid-diagonal) 0 2px, transparent 2px 34px)",
          opacity: 0.28,
          mixBlendMode: "multiply",
          WebkitMaskImage: "radial-gradient(circle at center, black 62%, transparent 100%)",
          maskImage: "radial-gradient(circle at center, black 62%, transparent 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute -left-24 top-[12%] h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: "var(--hero-orb-1)" }}
      />
      <div
        className="pointer-events-none absolute right-[-6rem] top-[18%] h-80 w-80 rounded-full blur-3xl"
        style={{ backgroundColor: "var(--hero-orb-2)" }}
      />
      <div
        className="pointer-events-none absolute bottom-[18%] left-[18%] h-48 w-48 rounded-full blur-3xl"
        style={{ backgroundColor: "var(--hero-orb-3)" }}
      />
      <div className="fixed inset-x-0 top-4 z-50 px-4 md:top-6 md:px-6 lg:px-8">
        <header className="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-3 rounded-full border border-white/70 bg-white/75 px-4 py-3 shadow-[0_10px_30px_rgba(31,41,55,0.08)] backdrop-blur-md md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center md:px-5">
          <a href="#top" className="flex items-center gap-2.5 md:justify-self-start">
            <img
              src="/images/logo-vm.png"
              alt="VBM Devs"
              className="theme-logo block h-10 w-auto md:h-11"
            />
          </a>

          <nav className="hidden items-center gap-2 rounded-full border border-slate-200 bg-[#eff2f7] px-2 py-2 md:flex md:justify-self-center">
            {topNavItems.map((item, index) => (
              <a
                key={item}
                href={navTargets[index]}
                className={`rounded-full px-4 py-2 text-[12px] font-medium tracking-[-0.01em] transition ${
                  index === 0
                    ? "bg-white text-[#101828] shadow-[0_4px_14px_rgba(15,23,42,0.08)]"
                    : "text-[#5f687b] hover:text-[#101828]"
                }`}
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex md:justify-self-end">
            <a
              href="#courses"
              className="inline-flex h-9 items-center rounded-full bg-[#1f57ff] px-4 text-[12px] font-semibold text-white shadow-[0_8px_18px_rgba(31,87,255,0.22)] transition hover:-translate-y-0.5"
            >
              Ver pack
            </a>
            <a
              href="#courses"
              className="inline-flex h-9 items-center rounded-full bg-[#12203a] px-4 text-[12px] font-semibold text-white shadow-[0_8px_18px_rgba(18,32,58,0.18)] transition hover:-translate-y-0.5"
            >
              Comprar
            </a>
          </div>

          <button
            type="button"
            aria-label={isMobileMenuOpen ? "Cerrar menÃº" : "Abrir menÃº"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            className={`relative grid h-11 w-11 place-items-center rounded-full border shadow-[0_10px_20px_rgba(31,87,255,0.12)] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
              isMobileMenuOpen
                ? "border-[#1f57ff] bg-[linear-gradient(135deg,#87e4ff_0%,#5d9bff_50%,#2f60ff_100%)] text-white shadow-[0_14px_28px_rgba(31,87,255,0.28)]"
                : "border-slate-200 bg-white text-[#101828]"
            }`}
          >
            <span
              className={`absolute h-0.5 w-4 rounded-full bg-current transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isMobileMenuOpen ? "translate-y-0 rotate-45" : "-translate-y-1.5"
              }`}
            />
            <span
              className={`absolute h-0.5 w-4 rounded-full bg-current transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isMobileMenuOpen ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100"
              }`}
            />
            <span
              className={`absolute h-0.5 w-4 rounded-full bg-current transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isMobileMenuOpen ? "translate-y-0 -rotate-45" : "translate-y-1.5"
              }`}
            />
          </button>
        </header>

        <div
          className={`fixed inset-0 z-[60] md:hidden transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isMobileMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <button
            type="button"
            aria-label="Cerrar menÃº"
            onClick={closeMobileMenu}
            className="absolute inset-0 bg-[#071120]/45 backdrop-blur-md"
          />

          <div
            id="mobile-menu"
            className={`absolute left-4 right-4 top-[5.25rem] z-[70] origin-top rounded-[28px] border border-[var(--border-soft)] bg-[var(--surface-elevated)] p-4 text-[var(--page-text)] shadow-[0_28px_90px_rgba(15,23,42,0.18)] backdrop-blur-2xl transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-5 ${
              isMobileMenuOpen
                ? "translate-y-0 scale-100 opacity-100"
                : "-translate-y-3 scale-[0.98] opacity-0"
            }`}
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
              <div className="flex items-center gap-3">
                <img src="/images/logo-vm.png" alt="VBM Devs" className="theme-logo h-9 w-auto" />
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#1a2842]">
                    NavegaciÃ³n
                  </div>
                  <div className="mt-1 text-[12px] text-[#6d7483]">
                    MenÃº rÃ¡pido e interactivo
                  </div>
                </div>
              </div>
              <button
                type="button"
                aria-label="Cerrar menÃº"
                onClick={closeMobileMenu}
                className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-[#101828] shadow-[0_8px_18px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5"
              >
                <span className="relative block h-4 w-4">
                  <span className="absolute left-1/2 top-1/2 h-0.5 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-current" />
                  <span className="absolute left-1/2 top-1/2 h-0.5 w-4 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-current" />
                </span>
              </button>
            </div>

            <nav className="mt-4 grid gap-2">
              {topNavItems.map((item, index) => (
                <a
                  key={item}
                  href={navTargets[index]}
                  onClick={closeMobileMenu}
                  className={`group flex items-center justify-between rounded-[20px] border px-4 py-3 text-[14px] font-medium transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isMobileMenuOpen
                      ? "translate-y-0 opacity-100"
                      : "translate-y-2 opacity-0"
                  } ${
                    index === 0
                      ? "border-[#1f57ff]/20 bg-[#edf3ff] text-[#101828]"
                      : "border-slate-200 bg-white/80 text-[#5f687b] hover:border-[#1f57ff]/20 hover:bg-[#edf3ff] hover:text-[#101828]"
                  }`}
                  style={{ transitionDelay: isMobileMenuOpen ? `${120 + index * 60}ms` : "0ms" }}
                >
                  <span>{item}</span>
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-[#1f57ff] shadow-[0_8px_18px_rgba(31,87,255,0.08)] transition group-hover:translate-x-0.5">
                    <ArrowIcon />
                  </span>
                </a>
              ))}
            </nav>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <a
                href="#courses"
                onClick={closeMobileMenu}
                className="inline-flex h-11 items-center justify-center rounded-full bg-[#1f57ff] px-5 text-[12px] font-semibold text-white shadow-[0_10px_20px_rgba(31,87,255,0.18)] transition hover:-translate-y-0.5"
              >
                Ver pack
              </a>
              <a
                href="#courses"
                onClick={closeMobileMenu}
                className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white/80 px-5 text-[12px] font-semibold text-[#101828] shadow-[0_10px_20px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5"
              >
                Comprar
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1360px] flex-1 flex-col px-4 pt-28 md:px-6 md:pt-32 lg:px-8 lg:pt-32">
        <div className="relative mx-auto flex w-full max-w-[1280px] flex-1 flex-col items-center justify-center pb-24 pt-8 md:pb-24 md:pt-12 lg:pb-28">
          <div className="relative z-10 mx-auto max-w-[1120px] text-center" data-reveal data-reveal-side="up">
            <h1 className="font-display text-[clamp(3.35rem,7.25vw,8.2rem)] leading-[0.88] tracking-[-0.055em] text-[#111a33] uppercase md:leading-[0.86]">
              <span className="block">La biblioteca de prompts</span>
              <span className="block">de IA mÃ¡s completa</span>
            </h1>
          </div>

          <div
            className="relative z-10 mt-8 flex w-full items-center justify-center gap-3 px-4 md:mt-10"
            data-reveal
            data-reveal-delay="120"
          >
            <FloatingPill label="Quiero el pack" />
            <FloatingPill label="Ver nichos" small />
          </div>
        </div>
      </div>

    </section>
  );
}

function DiscoverySection() {
  return (
    <section id="discovery" className="bg-[#ffffff] px-4 py-18 text-[#101828] md:px-6 md:py-22 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1260px]">
        <div className="mx-auto max-w-[820px] text-center">
          <h2
            className="text-[clamp(2.25rem,4vw,4.25rem)] font-medium leading-[0.92] tracking-[-0.06em] text-[#101828]"
            data-direction-reveal
            data-direction-reveal-base="left"
          >
            Una biblioteca de prompts,
            <br className="hidden sm:block" />
            mÃºltiples posibilidades
          </h2>
          <p
            className="mx-auto mt-5 max-w-[560px] text-[14px] leading-7 text-[#6d7483] md:text-[15px]"
            data-reveal
            data-reveal-delay="80"
          >
            Prompts editables para crear imÃ¡genes realistas, estÃ©ticas y comerciales en varios
            estilos, nichos y objetivos.
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.26fr_0.94fr]">
          <div
            className="theme-discovery-card relative overflow-hidden rounded-[24px] p-3 shadow-[0_18px_50px_rgba(14,23,48,0.16)] lg:h-full"
            data-reveal
            data-reveal-side="left"
          >
            <div className="relative h-[340px] overflow-hidden rounded-[18px] border border-slate-200/70 sm:h-[410px] lg:h-full">
              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
                alt="Personas trabajando juntas"
                className="h-full w-full object-cover object-[center_30%]"
              />
              <div className="theme-discovery-overlay absolute inset-0" />
            </div>
          </div>

          <div className="grid gap-4">
            <div className="theme-discovery-card-emphasis rounded-[24px] p-6 text-[#101828] shadow-[0_18px_50px_rgba(14,23,48,0.12)]" data-reveal data-reveal-delay="120">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1f57ff] text-white shadow-[0_10px_20px_rgba(31,87,255,0.18)]">
                01
              </div>
              <h3 className="mt-9 text-[24px] font-medium tracking-[-0.05em]">
                Prompts listos
              </h3>
              <p className="mt-4 max-w-[28ch] text-[14px] leading-7 text-[#6c7485]">
                Elige el nicho, ajusta los detalles y genera imÃ¡genes con una direcciÃ³n mucho mÃ¡s
                clara desde el primer intento.
              </p>
            </div>

            <div className="rounded-[24px] bg-white p-6 shadow-[0_18px_50px_rgba(14,23,48,0.12)]" data-reveal data-reveal-delay="220">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1f57ff] text-white shadow-[0_10px_20px_rgba(31,87,255,0.18)]">
                02
              </div>
              <h3 className="mt-9 text-[24px] font-medium tracking-[-0.05em] text-[#101828]">
                FÃ¡ciles de adaptar
              </h3>
              <p className="mt-4 max-w-[30ch] text-[14px] leading-7 text-[#6c7485]">
                Sirven para profesional, lifestyle, lujo, redes, moda y contenido comercial sin
                complicarte con instrucciones largas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CoursesSection() {
  return (
    <section id="courses" className="bg-[#ffffff] px-4 pb-28 pt-8 md:px-6 md:pb-32 lg:px-8 lg:pb-36 lg:pt-10">
      <div className="mx-auto max-w-[1260px]">
        <div id="nichos" className="mx-auto max-w-[760px] text-center">
          <h2
            className="text-[clamp(2.1rem,3.8vw,3.45rem)] font-medium leading-[0.92] tracking-[-0.06em] text-[#101828]"
            data-direction-reveal
            data-direction-reveal-base="right"
          >
            Encuentra el pack ideal
            <br className="hidden sm:block" />
            para cada tipo de imagen
          </h2>
        </div>

        <div className="mt-12 flex flex-col gap-4 md:mt-14 lg:mt-16">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {courses.map((course, index) => (
              <CourseCard key={course.title} course={course} revealDelay={index * 110} />
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 text-[12px] font-medium text-[#5f687b]">
            <button type="button" className="transition hover:text-[#101828]">
              Anterior
            </button>

            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#101828]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#c6cddc]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#c6cddc]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#c6cddc]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#c6cddc]" />
            </div>

            <button type="button" className="transition hover:text-[#101828]">
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section id="testimonials" className="theme-testimonials theme-testimonials-panel relative overflow-hidden px-4 py-24 md:px-6 md:py-28 lg:px-8 lg:py-32">
      <h2
        className="pointer-events-none absolute inset-x-0 top-12 flex justify-center font-display text-center text-[clamp(4rem,10vw,8.4rem)] leading-[0.95] tracking-[0.04em] text-[#101828] md:top-20 lg:top-24"
        data-direction-reveal
        data-direction-reveal-base="left"
      >
        LO QUE OPINAN
        <br />
        NUESTROS CLIENTES
      </h2>

      <div className="relative z-10 mx-auto mt-32 grid max-w-[1260px] gap-4 sm:grid-cols-2 md:mt-40 lg:mt-72 lg:grid-cols-4">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={testimonial.name}
            testimonial={testimonial}
            revealDelay={index * 110}
            className={
              index === 0
                ? "lg:mt-12"
                : index === 1
                  ? "lg:-mt-2"
                  : index === 2
                    ? "lg:mt-8"
                    : "lg:mt-14"
            }
          />
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="faq" className="bg-white pb-10 pt-8">
      <div
        className="w-full border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:p-8 lg:p-10"
        data-reveal
      >
        <div className="grid gap-10 xl:grid-cols-[1.05fr_1.2fr] xl:gap-12">
          <div className="space-y-6">
            <a href="#top" className="flex items-center gap-2.5">
              <img
                src="/images/logo-vm.png"
                alt="VBM Devs"
                className="theme-logo block h-10 w-auto"
              />
            </a>

            <p className="max-w-[360px] text-[13px] leading-7 text-[#677082]">
              Una biblioteca de prompts de IA para crear imÃ¡genes en distintos nichos, estilos y
              objetivos sin empezar desde cero.
            </p>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex h-9 items-center rounded-full bg-[#edf3ff] px-4 text-[11px] font-semibold text-[#101828]">
                MÃ¡s de 100 prompts
              </span>
              <span className="inline-flex h-9 items-center rounded-full bg-[#f1f4f9] px-4 text-[11px] font-semibold text-[#5f687b]">
                Varios nichos
              </span>
              <span className="inline-flex h-9 items-center rounded-full bg-[#f1f4f9] px-4 text-[11px] font-semibold text-[#5f687b]">
                Acceso instantÃ¡neo
              </span>
            </div>

          </div>

          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {footerColumns.map((group) => (
              <div key={group.title}>
                <div className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[#1a2842]">
                  {group.title}
                </div>
                <div className="mt-4 flex flex-col gap-3 text-[13px] text-[#5f687b]">
                  {group.links.map((link) => (
                    <a key={link} href="#top" className="transition hover:text-[#101828]">
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}

            <div className="sm:col-span-2 xl:col-span-3">
              <div className="flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-[#edf3ff] p-5 shadow-[0_12px_28px_rgba(31,87,255,0.08)] md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[#1a2842]">
                    Â¿QuÃ© lo hace distinto?
                  </div>
                  <p className="mt-2 max-w-[42ch] text-[13px] leading-6 text-[#677082]">
                    No es un pack centrado en un solo uso: reÃºne prompts para distintos
                    objetivos y estilos en una sola biblioteca fÃ¡cil de adaptar.
                  </p>
                </div>
                <a
                  href="#courses"
                  className="inline-flex h-11 items-center rounded-full bg-[#1f57ff] px-5 text-[12px] font-semibold text-white shadow-[0_10px_20px_rgba(31,87,255,0.18)] transition hover:-translate-y-0.5"
                >
                  Quiero el pack
                </a>
              </div>
            </div>

          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-[12px] leading-6 text-[#677082]">
            © 2026 VBM Devs. Todos los derechos reservados. Creado para quienes quieren generar
            imÃ¡genes con IA de forma prÃ¡ctica y profesional.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-[12px] text-[#5f687b]">
            <a href="#courses" className="transition hover:text-[#101828]">
              Pack
            </a>
            <a href="#top" className="transition hover:text-[#101828]">
              Inicio
            </a>
            <a href="mailto:contacto@vbmdevs.com" className="transition hover:text-[#101828]">
              contacto@vbmdevs.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ThemeToggleButton({ isDark, onToggle }) {
  return (
    <button
      type="button"
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
      aria-pressed={isDark}
      onClick={onToggle}
      className="theme-toggle fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f57ff]/35 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent md:bottom-6 md:right-6"
    >
      <span
        className={`pointer-events-none absolute grid h-14 w-14 place-items-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isDark ? "scale-50 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
        }`}
      >
        <MoonIcon />
      </span>
      <span
        className={`pointer-events-none absolute grid h-14 w-14 place-items-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isDark ? "scale-100 rotate-0 opacity-100" : "scale-50 -rotate-90 opacity-0"
        }`}
      >
        <SunIcon />
      </span>
    </button>
  );
}

function FloatingPill({ label, small = false }) {
  return (
    <button
      type="button"
      className={`hero-pill inline-flex cursor-pointer items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-[#16233d] shadow-[0_10px_28px_rgba(18,32,58,0.12)] transition-all duration-300 ease-out hover:border-[#1f57ff] hover:bg-[#1f57ff] hover:text-white hover:shadow-[0_10px_28px_rgba(31,87,255,0.18)] ${
        small ? "text-[11px] font-medium" : "text-[12px] font-medium"
      }`}
    >
      {label}
    </button>
  );
}

function CourseCard({ course, revealDelay = 0 }) {
  return (
    <article
      className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_12px_26px_rgba(15,23,42,0.07)]"
      data-reveal
      data-reveal-delay={revealDelay}
    >
      <div className="relative">
        <img
          src={course.image}
          alt={course.title}
          className="h-[210px] w-full object-cover object-[center_24%]"
        />
        <div className="absolute left-3 top-3 rounded-full bg-[#1f57ff] px-3 py-1 text-[10px] font-semibold tracking-[0.16em] text-white shadow-[0_10px_20px_rgba(31,87,255,0.18)]">
          {course.badge}
        </div>
      </div>

      <div className="p-4">
        <div className="text-[11px] font-medium tracking-[0.02em] text-[#6d7483]">
          {course.meta}
        </div>
        <h3 className="mt-3 text-[17px] font-semibold leading-[1.25] tracking-[-0.04em] text-[#101828]">
          {course.title}
        </h3>
        <p className="mt-2 text-[13px] leading-6 text-[#6d7483]">{course.text}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[15px] font-semibold text-[#1d7c45]">{course.price}</span>
          <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#101828]">
            View
            <ArrowIcon />
          </span>
        </div>
      </div>
    </article>
  );
}

function TestimonialCard({ testimonial, className = "", revealDelay = 0 }) {
  return (
    <article
      className={`rounded-[16px] border border-white/80 bg-white p-4 shadow-[0_14px_34px_rgba(33,55,102,0.08)] ${className}`}
      data-reveal
      data-reveal-delay={revealDelay}
    >
      <div className="flex items-center gap-3">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="h-11 w-11 rounded-full object-cover"
        />
        <div>
          <div className="text-[13px] font-semibold text-[#101828]">{testimonial.name}</div>
          <div className="text-[11px] text-[#6d7483]">{testimonial.role}</div>
        </div>
      </div>
      <p className="mt-4 text-[13px] leading-6 text-[#4f596a]">{testimonial.quote}</p>
    </article>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-current" aria-hidden="true">
      <path
        d="M5 12h12m0 0-4.5-4.5M17 12l-4.5 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
      <path
        d="M20 15.2A8.2 8.2 0 0 1 8.8 4a7.8 7.8 0 1 0 11.2 11.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" fill="currentColor" />
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      >
        <path d="M12 2.5v2.1" />
        <path d="M12 19.4v2.1" />
        <path d="M4.6 4.6 6 6" />
        <path d="M18 18l1.4 1.4" />
        <path d="M2.5 12h2.1" />
        <path d="M19.4 12h2.1" />
        <path d="m4.6 19.4 1.4-1.4" />
        <path d="m18 6 1.4-1.4" />
      </g>
    </svg>
  );
}

export default App;



