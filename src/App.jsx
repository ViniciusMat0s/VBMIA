import React, { useEffect, useState } from "react";
import { flushSync } from "react-dom";

const topNavItems = ["Pack", "Nichos", "Cómo funciona", "Casos", "FAQ"];

const footerColumns = [
  {
    title: "Pack",
    links: [
      "Qué incluye",
      "Cómo funciona",
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
      "¿Necesito experiencia?",
      "¿Sirve para varios nichos?",
      "¿Puedo adaptarlo?",
      "¿Funciona con herramientas de IA?",
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
    meta: "Perfil · marca",
    price: "24 prompts",
  },
  {
    badge: "DESTACADO",
    title: "Marca personal y redes sociales",
    text: "Imágenes naturales para Instagram, stories y contenido diario con un look más actual y coherente.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    meta: "Social · creadores",
    price: "22 prompts",
  },
  {
    badge: "PREMIUM",
    title: "Lifestyle, lujo y viajes",
    text: "Escenas con aire editorial para coches, moda, belleza y un acabado más aspiracional.",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
    meta: "Premium · editorial",
    price: "20 prompts",
  },
  {
    badge: "PRO",
    title: "Negocios y publicidad",
    text: "Sistemas listos para posts, anuncios y creatividades comerciales con una dirección visual clara.",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80",
    meta: "Anuncios · negocio",
    price: "18 prompts",
  },
];

const testimonials = [
  {
    name: "Laura Gómez",
    role: "Marca personal",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
    quote:
      "Me ayudó a pasar de ideas sueltas a imágenes más coherentes para LinkedIn, Instagram y mi web.",
  },
  {
    name: "Álvaro Martín",
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
      "Me sirve para moda, viajes y escenas premium con un resultado mucho más cuidado.",
  },
  {
    name: "Javier López",
    role: "Negocio y publicidad",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80",
    quote:
      "Para campañas y contenido comercial me ahorra tiempo y me da una dirección visual mucho más clara.",
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
  return (
    <section className="theme-hero relative flex min-h-screen flex-col overflow-hidden">
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
        <header className="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-4 rounded-full border border-white/70 bg-white/75 px-4 py-3 shadow-[0_10px_30px_rgba(31,41,55,0.08)] backdrop-blur-md md:px-5">
          <a href="#top" className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-[linear-gradient(135deg,#87e4ff_0%,#5d9bff_50%,#2f60ff_100%)] shadow-[0_10px_20px_rgba(73,120,255,0.26)]">
              <span className="block h-3 w-3 rotate-45 rounded-[2px] border-r border-t border-white/90" />
            </div>
            <span className="text-[12px] font-semibold tracking-[0.34em] text-[#1a2842] md:text-[13px]">
              CLASTRO
            </span>
          </a>

          <nav className="hidden items-center gap-2 rounded-full border border-slate-200 bg-[#eff2f7] px-2 py-2 md:flex">
            {topNavItems.map((item, index) => (
              <a
                key={item}
                href="#top"
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

          <div className="flex items-center gap-2">
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
        </header>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1360px] flex-1 flex-col px-4 pt-28 md:px-6 md:pt-32 lg:px-8 lg:pt-32">
        <div className="relative mx-auto flex w-full max-w-[1280px] flex-1 flex-col items-center justify-center pb-24 pt-8 md:pb-24 md:pt-12 lg:pb-28">
          <div className="relative z-10 mx-auto max-w-[1120px] text-center" data-reveal data-reveal-side="up">
            <h1 className="font-display text-[clamp(3.35rem,7.25vw,8.2rem)] leading-[0.88] tracking-[-0.055em] text-[#111a33] uppercase md:leading-[0.86]">
              <span className="block">La biblioteca de prompts</span>
              <span className="block">de IA más completa</span>
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
    <section className="bg-[#ffffff] px-4 py-18 text-[#101828] md:px-6 md:py-22 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1260px]">
        <div className="mx-auto max-w-[820px] text-center">
          <h2
            className="text-[clamp(2.25rem,4vw,4.25rem)] font-medium leading-[0.92] tracking-[-0.06em] text-[#101828]"
            data-direction-reveal
            data-direction-reveal-base="left"
          >
            Una biblioteca de prompts,
            <br className="hidden sm:block" />
            múltiples posibilidades
          </h2>
          <p
            className="mx-auto mt-5 max-w-[560px] text-[14px] leading-7 text-[#6d7483] md:text-[15px]"
            data-reveal
            data-reveal-delay="80"
          >
            Prompts editables para crear imágenes realistas, estéticas y comerciales en varios
            estilos, nichos y objetivos.
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.26fr_0.94fr]">
          <div
            className="theme-discovery-card relative overflow-hidden rounded-[24px] p-3 shadow-[0_18px_50px_rgba(14,23,48,0.16)]"
            data-reveal
            data-reveal-side="left"
          >
            <div className="relative overflow-hidden rounded-[18px] border border-slate-200/70">
              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
                alt="Personas trabajando juntas"
                className="h-[410px] w-full object-cover object-[center_30%]"
              />
              <div className="theme-discovery-overlay absolute inset-0" />
            </div>

            <div className="absolute bottom-4 left-4 w-[225px] rounded-[18px] bg-white p-4 shadow-[0_16px_38px_rgba(0,0,0,0.18)]" data-reveal data-reveal-delay="180">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[34px] font-semibold leading-none tracking-[-0.08em] text-[#0f172a]">
                    85%
                  </div>
                  <p className="mt-2 text-[11px] leading-5 text-[#6b7280]">
                    de usuarios dice que una base clara les ayuda a ahorrar tiempo y mejorar el
                    resultado final.
                  </p>
                </div>
                <div className="grid h-9 w-9 place-items-center rounded-full bg-[#edf2ff] text-[#3b5cff]">
                  <SparkIcon />
                </div>
              </div>

              <div className="mt-3 flex items-end gap-1.5">
                {Array.from({ length: 18 }).map((_, index) => (
                  <span
                    key={index}
                    className="w-full rounded-sm bg-[linear-gradient(180deg,#9a8cff_0%,#8bc0ff_48%,#d9e3ff_100%)]"
                    style={{ height: `${10 + ((index * 7) % 22)}px` }}
                  />
                ))}
              </div>
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
                Elige el nicho, ajusta los detalles y genera imágenes con una dirección mucho más
                clara desde el primer intento.
              </p>
            </div>

            <div className="rounded-[24px] bg-white p-6 shadow-[0_18px_50px_rgba(14,23,48,0.12)]" data-reveal data-reveal-delay="220">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1f57ff] text-white shadow-[0_10px_20px_rgba(31,87,255,0.18)]">
                02
              </div>
              <h3 className="mt-9 text-[24px] font-medium tracking-[-0.05em] text-[#101828]">
                Fáciles de adaptar
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
        <div className="mx-auto max-w-[760px] text-center">
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
    <section className="theme-testimonials theme-testimonials-panel relative overflow-hidden px-4 py-24 md:px-6 md:py-28 lg:px-8 lg:py-32">
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
    <footer className="bg-[var(--page-bg)] pb-10 pt-8">
      <div
        className="w-full border border-slate-200 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-md md:p-8 lg:p-10"
        data-reveal
      >
        <div className="grid gap-10 xl:grid-cols-[1.05fr_1.2fr] xl:gap-12">
          <div className="space-y-6">
            <a href="#top" className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-[linear-gradient(135deg,#87e4ff_0%,#5d9bff_50%,#2f60ff_100%)] shadow-[0_10px_20px_rgba(73,120,255,0.24)]">
                <span className="block h-3 w-3 rotate-45 rounded-[2px] border-r border-t border-white/90" />
              </div>
              <span className="text-[12px] font-semibold tracking-[0.34em] text-[#1a2842]">
                CLASTRO
              </span>
            </a>

            <p className="max-w-[360px] text-[13px] leading-7 text-[#677082]">
              Una biblioteca de prompts de IA para crear imágenes en distintos nichos, estilos y
              objetivos sin empezar desde cero.
            </p>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex h-9 items-center rounded-full bg-[#edf3ff] px-4 text-[11px] font-semibold text-[#101828]">
                Más de 100 prompts
              </span>
              <span className="inline-flex h-9 items-center rounded-full bg-[#f1f4f9] px-4 text-[11px] font-semibold text-[#5f687b]">
                Varios nichos
              </span>
              <span className="inline-flex h-9 items-center rounded-full bg-[#f1f4f9] px-4 text-[11px] font-semibold text-[#5f687b]">
                Acceso instantáneo
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
                    ¿Qué lo hace distinto?
                  </div>
                  <p className="mt-2 max-w-[42ch] text-[13px] leading-6 text-[#677082]">
                    No es un pack centrado en un solo uso: reúne prompts para distintos
                    objetivos y estilos en una sola biblioteca fácil de adaptar.
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
            © 2026 CLASTRO. Todos los derechos reservados. Creado para quienes quieren generar
            imágenes con IA de forma práctica y profesional.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-[12px] text-[#5f687b]">
            <a href="#courses" className="transition hover:text-[#101828]">
              Pack
            </a>
            <a href="#top" className="transition hover:text-[#101828]">
              Inicio
            </a>
            <a href="mailto:hola@clastro.ai" className="transition hover:text-[#101828]">
              hola@clastro.ai
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

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" aria-hidden="true">
      <path
        d="M12 3.2 13.9 9l6.1 1.9-6.1 1.9L12 18.8l-1.9-6-6.1-1.9L10.1 9 12 3.2Z"
        fill="currentColor"
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
