import React, { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { collections, legalPages, productCatalog, productTypes, categories } from "../data/platformData";
import { usePlatform } from "../context/PlatformContext";
import { ThemeToggleButton } from "../components/ThemeToggleButton";

function joinClasses(...parts) {
  return parts.filter(Boolean).join(" ");
}

function normalizeSearchText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function getProductProgress(progressMap, userId, productId) {
  return progressMap?.[userId]?.[productId] || { progress: 0, completedLessonIds: [] };
}

function canAccessProduct({ currentUser, entitlements, product }) {
  if (!currentUser) {
    return false;
  }

  if (currentUser.role === "admin") {
    return true;
  }

  const granted = entitlements[currentUser.id] || [];
  return granted.includes(product.id) || product.access !== "locked";
}

function ProgressBar({ value = 0, className = "" }) {
  return (
    <div className={joinClasses("h-2 overflow-hidden rounded-full bg-[#e9edf6]", className)}>
      <div
        className="h-full rounded-full bg-[linear-gradient(90deg,#87e4ff_0%,#5d9bff_50%,#2f60ff_100%)] transition-all duration-500"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-[#edf3ff] text-[#101828]",
    blue: "bg-[#1f57ff] text-white",
    soft: "bg-white text-[#5f687b] border border-slate-200",
    dark: "bg-[#12203a] text-white",
    success: "bg-[#e7f7ee] text-[#0e7a42]",
    warning: "bg-[#fff3d9] text-[#9a6516]",
    danger: "bg-[#ffe5e5] text-[#b42318]",
  };

  return (
    <span
      className={joinClasses(
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold",
        tones[tone] || tones.neutral,
      )}
    >
      {children}
    </span>
  );
}

function SectionHeading({ eyebrow, title, subtitle, action }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? (
          <div className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#5f687b]">
            {eyebrow}
          </div>
        ) : null}
        <h2 className="mt-2 text-[clamp(1.5rem,2.6vw,2.4rem)] font-medium leading-[0.95] tracking-[-0.05em] text-[#101828]">
          {title}
        </h2>
        {subtitle ? <p className="mt-3 max-w-3xl text-[14px] leading-7 text-[#6d7483]">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

function ContentCard({ product, progress = 0, onClick, actionLabel, locked = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-[22px] border border-slate-200 bg-white text-left shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(15,23,42,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f57ff]/35"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={product.cover}
          alt={product.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,10,25,0.05)_0%,rgba(4,10,25,0.72)_100%)]" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge tone={locked ? "danger" : product.featured ? "blue" : "soft"}>{product.badge}</Badge>
          <Badge tone="soft">{productTypes.find((type) => type.id === product.type)?.label || product.type}</Badge>
        </div>
        {locked ? (
          <div className="absolute right-3 top-3">
            <Badge tone="dark">Bloqueado</Badge>
          </div>
        ) : null}
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#5f687b]">
              {product.author}
            </div>
            <h3 className="mt-1 text-[16px] font-semibold leading-[1.2] tracking-[-0.04em] text-[#101828]">
              {product.title}
            </h3>
          </div>
          <div className="shrink-0 rounded-full bg-[#edf3ff] px-3 py-1 text-[11px] font-semibold text-[#1f57ff]">
            {product.duration}
          </div>
        </div>
        <p className="text-[13px] leading-6 text-[#6d7483]">{product.description}</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-[#6d7483]">
            <span>{progress}% concluido</span>
            <span>{product.lessonsCount} aulas</span>
          </div>
          <ProgressBar value={progress} />
        </div>
        <div className="flex items-center justify-between pt-1 text-[12px] font-semibold text-[#101828]">
          <span>{actionLabel || "Abrir"}</span>
          <span className="rounded-full bg-[#12203a] px-3 py-1 text-white">Ver detalhes</span>
        </div>
      </div>
    </button>
  );
}

function HorizontalRow({ title, subtitle, items, renderItem, emptyLabel }) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-[#101828]">{title}</h3>
          {subtitle ? <p className="mt-1 text-[13px] text-[#6d7483]">{subtitle}</p> : null}
        </div>
      </div>

      {items.length ? (
        <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:thin]">
          {items.map((item) => (
            <div key={item.id} className="min-w-[260px] max-w-[260px] shrink-0">
              {renderItem(item)}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[20px] border border-dashed border-slate-200 bg-white p-6 text-sm text-[#6d7483]">
          {emptyLabel || "Nenhum item para mostrar."}
        </div>
      )}
    </section>
  );
}

function PageFrame({ title, subtitle, children, action }) {
  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--page-text)]">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-4 md:px-6 md:py-6 lg:px-8">
        <div className="rounded-[28px] border border-white/60 bg-[var(--surface-elevated)] p-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6">
          <div className="flex flex-col gap-4 border-b border-slate-200/70 pb-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#5f687b]">
                VBM Devs
              </div>
              <h1 className="mt-2 text-[clamp(1.8rem,3vw,2.8rem)] font-medium leading-[0.95] tracking-[-0.05em] text-[#101828]">
                {title}
              </h1>
              {subtitle ? <p className="mt-3 max-w-3xl text-[14px] leading-7 text-[#6d7483]">{subtitle}</p> : null}
            </div>
            {action ? <div>{action}</div> : null}
          </div>
          <div className="pt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

function ShellNav() {
  const {
    currentUser,
    isAdmin,
    logout,
    toggleTheme,
    theme,
    entitlements,
    products,
  } = usePlatform();
  const [drawerAbrir, setDrawerAbrir] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: "Inicio", to: "/library" },
    { label: "Catálogo", to: "/library" },
    { label: "Perfil", to: "/profile" },
  ];

  if (isAdmin) {
    navItems.push({ label: "Admin", to: "/admin" });
  }

  const ownedCount = currentUser ? (entitlements[currentUser.id] || []).length : 0;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/50 bg-[var(--surface-elevated)] backdrop-blur-2xl">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-3 px-4 py-4 md:px-6 lg:px-8">
          <Link to="/library" className="flex items-center gap-3">
            <img src="/images/logo-vm.png" alt="VBM Devs" className="theme-logo h-10 w-auto" />
            <div className="hidden sm:block">
              <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#5f687b]">
                Biblioteca digital
              </div>
              <div className="text-[12px] text-[#101828]">{ownedCount} contenidos desbloqueados</div>
            </div>
          </Link>

          <div className="hidden flex-1 items-center justify-center gap-2 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-full px-4 py-2 text-[13px] font-medium text-[#5f687b] transition hover:bg-[#edf3ff] hover:text-[#101828]"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggleButton isDark={theme === "dark"} onToggle={toggleTheme} size="sm" />
            {currentUser ? (
              <>
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-left shadow-[0_10px_20px_rgba(15,23,42,0.08)]"
                >
                  <img src={currentUser.avatar} alt={currentUser.name} className="h-7 w-7 rounded-full object-cover" />
                  <span className="text-[12px] font-semibold text-[#101828]">{currentUser.name}</span>
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-full bg-[#12203a] px-4 py-2 text-[12px] font-semibold text-white shadow-[0_10px_20px_rgba(18,32,58,0.16)] transition hover:-translate-y-0.5"
                >
                  Cerrar sesión
                </button>
              </>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => setDrawerAbrir((current) => !current)}
            className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-[#101828] shadow-[0_10px_20px_rgba(15,23,42,0.08)] md:hidden"
            aria-label="Abrir menu"
          >
            <span className="block h-0.5 w-5 rounded-full bg-current" />
          </button>
        </div>
      </header>

      <div
        className={joinClasses(
          "fixed inset-0 z-50 bg-[#071120]/45 backdrop-blur-md transition md:hidden",
          drawerAbrir ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <button type="button" aria-label="Cerrar menú" className="absolute inset-0" onClick={() => setDrawerAbrir(false)} />
        <div className="absolute right-4 top-4 w-[calc(100%-2rem)] max-w-sm rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-elevated)] p-4 shadow-[0_28px_90px_rgba(15,23,42,0.22)] backdrop-blur-2xl">
          <div className="flex items-center justify-between border-b border-slate-200/70 pb-4">
            <img src="/images/logo-vm.png" alt="VBM Devs" className="theme-logo h-9 w-auto" />
            <button
              type="button"
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold"
              onClick={() => setDrawerAbrir(false)}
            >
              Cerrar
            </button>
          </div>
          <div className="mt-4 grid gap-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setDrawerAbrir(false)}
                className="rounded-[18px] border border-slate-200 bg-white/80 px-4 py-3 text-[14px] font-medium text-[#101828]"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ThemeToggleButton
              isDark={theme === "dark"}
              onToggle={() => {
                toggleTheme();
                setDrawerAbrir(false);
              }}
              size="sm"
              className="justify-self-start"
            />
            {currentUser ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  setDrawerAbrir(false);
                }}
                className="rounded-full bg-[#12203a] px-4 py-3 text-[12px] font-semibold text-white"
              >
                Cerrar sesión
              </button>
            ) : (
              <Link to="/login" className="rounded-full bg-[#12203a] px-4 py-3 text-center text-[12px] font-semibold text-white">
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function RequireAuth({ children }) {
  const { currentUser } = usePlatform();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function RequireRole({ role, children }) {
  const { currentUser } = usePlatform();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  if (role && currentUser.role !== role) {
    return <Navigate to="/library" replace />;
  }
  return children;
}

function AuthLayout({ title, subtitle, children, footerLink }) {
  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--page-text)]">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-between bg-[linear-gradient(180deg,#fbfdff_0%,#eef4ff_45%,#dfe9ff_100%)] px-6 py-6 md:px-10 md:py-8">
          <Link to="/" className="flex items-center gap-3">
            <img src="/images/logo-vm.png" alt="VBM Devs" className="theme-logo h-10 w-auto" />
          </Link>
          <div className="mx-auto w-full max-w-2xl">
            <Badge tone="blue">VBM Devs Platform</Badge>
            <h1 className="mt-5 text-[clamp(2.6rem,5vw,4.8rem)] font-display leading-[0.9] tracking-[-0.06em] text-[#111a33] uppercase">
              {title}
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-7 text-[#5f687b]">{subtitle}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                "Streaming-like catalog",
                "Progreso persisted",
                "Dark and light theme",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[20px] border border-white/80 bg-white/85 p-4 text-[13px] font-medium text-[#101828] shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="text-[12px] text-[#677082]">{footerLink}</div>
        </div>

        <div className="flex items-center justify-center px-4 py-8 md:px-8 lg:px-10">
          <div className="w-full max-w-lg rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.12)] md:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginPage() {
  const { login, demoCredentials } = usePlatform();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: demoCredentials.student.email, password: demoCredentials.student.password });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      login(form);
      navigate("/library");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Entra en tu biblioteca"
      subtitle="Accede a tu contenido comprado, continúa las lecciones y mantén tu progreso sincronizado en toda la plataforma."
      footerLink={<Link to="/signup">¿No tienes cuenta? Crea una aquí.</Link>}
    >
      <div className="space-y-6">
        <div>
          <div className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[#1a2842]">Iniciar sesión</div>
          <h2 className="mt-2 text-[28px] font-medium tracking-[-0.05em] text-[#101828]">Bienvenido de nuevo</h2>
        </div>

        {error ? <div className="rounded-[18px] bg-[#ffe5e5] px-4 py-3 text-[13px] text-[#b42318]">{error}</div> : null}

        <form className="space-y-4" onSubmit={submit}>
          <input
            className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-[14px] outline-none ring-0 focus:border-[#1f57ff]"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            type="email"
            placeholder="Correo electrónico"
            required
          />
          <input
            className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-[14px] outline-none focus:border-[#1f57ff]"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            type="password"
            placeholder="Contraseña"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#1f57ff] px-5 py-3 text-[13px] font-semibold text-white shadow-[0_12px_26px_rgba(31,87,255,0.2)] transition hover:-translate-y-0.5 disabled:opacity-60"
          >
            {loading ? "Iniciando sesión..." : "Entrar en la biblioteca"}
          </button>
        </form>

        <div className="rounded-[20px] bg-[#edf3ff] p-4 text-[13px] text-[#677082]">
          Cuentas de demo: admin@vbmdevs.com / admin123, student@vbmdevs.com / student123
        </div>

        <div className="flex flex-wrap gap-3 text-[13px]">
          <Link to="/forgot-password" className="text-[#1f57ff]">
            ¿Olvidaste tu contraseña?
          </Link>
          <Link to="/signup" className="text-[#1f57ff]">
            Crear cuenta
          </Link>
          <Link to="/" className="text-[#5f687b]">
            Volver a la landing
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

function SignupPage() {
  const { register } = usePlatform();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();
    setError("");
    try {
      register(form);
      navigate("/library");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Únete a la biblioteca y controla cada producto, lección y elemento guardado desde un solo lugar."
      footerLink={<Link to="/login">¿Ya tienes cuenta? Inicia sesión.</Link>}
    >
      <div className="space-y-6">
        <div>
          <div className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[#1a2842]">Sign up</div>
          <h2 className="mt-2 text-[28px] font-medium tracking-[-0.05em] text-[#101828]">Empieza con VBM Devs</h2>
        </div>

        {error ? <div className="rounded-[18px] bg-[#ffe5e5] px-4 py-3 text-[13px] text-[#b42318]">{error}</div> : null}

        <form className="space-y-4" onSubmit={submit}>
          <input
            className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-[14px] outline-none focus:border-[#1f57ff]"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="Nombre"
            required
          />
          <input
            className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-[14px] outline-none focus:border-[#1f57ff]"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            type="email"
            placeholder="Correo electrónico"
            required
          />
          <input
            className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-[14px] outline-none focus:border-[#1f57ff]"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            type="password"
            placeholder="Contraseña"
            required
          />
          <button className="w-full rounded-full bg-[#1f57ff] px-5 py-3 text-[13px] font-semibold text-white">
            Crear cuenta
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}

function ForgotPasswordPage() {
  const { requestPasswordReset } = usePlatform();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();
    setError("");
    try {
      const createdToken = requestPasswordReset(email);
      setToken(`${window.location.origin}/reset-password?token=${encodeURIComponent(createdToken)}`);
    } catch (err) {
      setToken("");
      setError(err.message);
    }
  };

  return (
    <AuthLayout
      title="Recuperar acceso"
      subtitle="Genera un token de restablecimiento y continúa con el proceso de cambio de contraseña."
      footerLink={<Link to="/login">Volver al inicio de sesión</Link>}
    >
      <div className="space-y-6">
        <div>
          <div className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[#1a2842]">Recovery</div>
          <h2 className="mt-2 text-[28px] font-medium tracking-[-0.05em] text-[#101828]">Restablecer contraseña</h2>
        </div>

        {error ? <div className="rounded-[18px] bg-[#ffe5e5] px-4 py-3 text-[13px] text-[#b42318]">{error}</div> : null}
        {token ? (
          <div className="rounded-[18px] bg-[#e7f7ee] px-4 py-3 text-[13px] text-[#0e7a42]">
            Enlace de restablecimiento generado: <a className="underline" href={token}>{token}</a>
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={submit}>
          <input
            className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-[14px] outline-none focus:border-[#1f57ff]"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="Correo electrónico"
            required
          />
          <button className="w-full rounded-full bg-[#1f57ff] px-5 py-3 text-[13px] font-semibold text-white">
            Generar enlace de restablecimiento
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}

function ResetPasswordPage() {
  const { resetPassword } = usePlatform();
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();
    setError("");
    try {
      resetPassword({ token, password });
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthLayout
      title="Establece una nueva contraseña"
      subtitle="Usa el token generado en el paso de recuperación y completa el restablecimiento."
      footerLink={<Link to="/forgot-password">¿Necesitas un nuevo token?</Link>}
    >
      <div className="space-y-6">
        <div>
          <div className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[#1a2842]">Reset</div>
          <h2 className="mt-2 text-[28px] font-medium tracking-[-0.05em] text-[#101828]">Elige una nueva contraseña</h2>
        </div>

        {error ? <div className="rounded-[18px] bg-[#ffe5e5] px-4 py-3 text-[13px] text-[#b42318]">{error}</div> : null}

        <form className="space-y-4" onSubmit={submit}>
          <input
            className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-[14px] outline-none focus:border-[#1f57ff]"
            value={token}
            readOnly
            placeholder="Token de restablecimiento"
          />
          <input
            className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-[14px] outline-none focus:border-[#1f57ff]"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="Nueva contraseña"
            required
          />
          <button className="w-full rounded-full bg-[#1f57ff] px-5 py-3 text-[13px] font-semibold text-white">
            Guardar contraseña
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}

function DashboardIcon({ name, className = "" }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" };

  switch (name) {
    case "home":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M4 10.5 12 4l8 6.5" {...common} />
          <path d="M6.5 9.5V20h11V9.5" {...common} />
        </svg>
      );
    case "library":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h11A2.5 2.5 0 0 1 21 6.5v11A2.5 2.5 0 0 1 18.5 20h-11A2.5 2.5 0 0 1 5 17.5v-11Z" {...common} />
          <path d="M9 8h8M9 12h6M9 16h5" {...common} />
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.8-5.4 2.8 1-6.1L3.2 9.4l6.1-.9L12 3Z" fill="currentColor" />
        </svg>
      );
    case "clock":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="8.5" {...common} />
          <path d="M12 7.5V12l3 2" {...common} />
        </svg>
      );
    case "check":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M20 7 10.5 16.5 4 10" {...common} />
        </svg>
      );
    case "download":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M12 4v9" {...common} />
          <path d="m8.5 10.5 3.5 3.5 3.5-3.5" {...common} />
          <path d="M5 18.5h14" {...common} />
        </svg>
      );
    case "user":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <circle cx="12" cy="8" r="3.5" {...common} />
          <path d="M5.5 20a6.5 6.5 0 0 1 13 0" {...common} />
        </svg>
      );
    case "bell":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M7.5 17.5h9a1 1 0 0 0 1-1V12a5.5 5.5 0 1 0-11 0v4.5a1 1 0 0 0 1 1Z" {...common} />
          <path d="M10 19.5a2 2 0 0 0 4 0" {...common} />
        </svg>
      );
    case "menu":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" {...common} />
        </svg>
      );
    case "search":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <circle cx="11" cy="11" r="5.5" {...common} />
          <path d="m15 15 4 4" {...common} />
        </svg>
      );
    case "chevron":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="m9 6 6 6-6 6" {...common} />
        </svg>
      );
    case "logout":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M10 17H6.5A2.5 2.5 0 0 1 4 14.5v-5A2.5 2.5 0 0 1 6.5 7H10" {...common} />
          <path d="M14 8.5 18 12l-4 3.5" {...common} />
          <path d="M18 12H10" {...common} />
        </svg>
      );
    default:
      return null;
  }
}

function DashboardCard({ product, progressValue, locked = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full overflow-hidden rounded-[20px] border border-slate-200 bg-[var(--surface)] text-left shadow-[0_10px_26px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(15,23,42,0.12)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.cover}
          alt={product.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,10,25,0.05)_0%,rgba(4,10,25,0.72)_100%)]" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge tone={locked ? "danger" : "blue"}>{locked ? "Bloqueado" : product.badge}</Badge>
          <Badge tone="soft">{product.type}</Badge>
        </div>
      </div>
      <div className="space-y-2.5 p-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5f687b]">
              {product.category}
            </div>
            <h3 className="mt-1 line-clamp-2 text-[14px] font-semibold leading-[1.18] tracking-[-0.04em] text-[#101828]">
              {product.title}
            </h3>
          </div>
          <span className="shrink-0 rounded-full bg-[#edf3ff] px-2.5 py-1 text-[10px] font-semibold text-[#1f57ff]">
            {product.duration}
          </span>
        </div>
        <p className="line-clamp-2 text-[12px] leading-5 text-[#6d7483]">{product.description}</p>
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.16em] text-[#6d7483]">
            <span>{progressValue}%</span>
            <span>{product.lessonsCount} aulas</span>
          </div>
          <ProgressBar value={progressValue} className="!h-[7px]" />
        </div>
      </div>
    </button>
  );
}

function DashboardListItem({ product, progressValue, onClick, actionLabel = "Abrir" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[18px] border border-slate-200 bg-[var(--surface)] p-3 text-left shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5"
    >
      <img
        src={product.cover}
        alt={product.title}
        className="h-[52px] w-[52px] rounded-[14px] object-cover"
        loading="lazy"
      />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[12px] font-semibold text-[#101828]">{product.title}</div>
        <div className="mt-0.5 text-[10px] text-[#6d7483]">
          {product.type} · {product.duration}
        </div>
        <ProgressBar value={progressValue} className="mt-2 !h-[6px]" />
      </div>
      <span className="rounded-full bg-[#edf3ff] px-2.5 py-1 text-[10px] font-semibold text-[#1f57ff]">
        {actionLabel}
      </span>
    </button>
  );
}

function DashboardSectionHeader({ title, action, subtitle }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h3 className="text-[18px] font-semibold tracking-[-0.04em] text-[#101828]">{title}</h3>
        {subtitle ? <p className="mt-1 text-[12px] text-[#6d7483]">{subtitle}</p> : null}
      </div>
      {action ? (
        <button type="button" className="text-[12px] font-semibold text-[#5f687b] hover:text-[#101828]">
          {action}
        </button>
      ) : null}
    </div>
  );
}

function DashboardHeader({
  search,
  onSearch,
  onClearSearch,
  onMenu,
  onThemeToggle,
  theme,
  currentUser,
  onProfile,
  onNotifications,
}) {
  return (
    <div className="sticky top-0 z-30 rounded-[26px] border border-white/70 bg-[var(--surface-elevated)] px-4 py-3 shadow-[0_14px_30px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenu}
          className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-[#101828] shadow-[0_8px_18px_rgba(15,23,42,0.06)] lg:hidden"
          aria-label="Abrir menú"
        >
          <DashboardIcon name="menu" className="h-5 w-5" />
        </button>

        <label className="relative flex min-w-0 flex-1 items-center">
          <DashboardIcon name="search" className="pointer-events-none absolute left-4 h-4 w-4 text-[#8a93a4]" />
          <input
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Buscar cursos, packs y prompts..."
            className="h-11 w-full rounded-full border border-slate-200 bg-white pl-10 pr-12 text-[13px] outline-none transition placeholder:text-[#8a93a4] focus:border-[#1f57ff] focus:ring-2 focus:ring-[#1f57ff]/10"
          />
          {search ? (
            <button
              type="button"
              onClick={onClearSearch}
              className="absolute right-3 grid h-7 w-7 place-items-center rounded-full text-[#8a93a4] transition hover:bg-[#edf3ff] hover:text-[#101828]"
              aria-label="Limpiar búsqueda"
              title="Limpiar búsqueda"
            >
              <span className="text-[18px] leading-none">×</span>
            </button>
          ) : null}
        </label>

        <button
          type="button"
          onClick={onNotifications}
          className="hidden h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-[#101828] shadow-[0_8px_18px_rgba(15,23,42,0.06)] sm:grid"
          aria-label="Notificaciones"
        >
          <DashboardIcon name="bell" className="h-5 w-5" />
        </button>

        <div className="hidden sm:block">
          <ThemeToggleButton isDark={theme === "dark"} onToggle={onThemeToggle} size="sm" />
        </div>

        <button
          type="button"
          onClick={onProfile}
          className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-2 py-1.5 shadow-[0_8px_18px_rgba(15,23,42,0.06)]"
        >
          <img src={currentUser.avatar} alt={currentUser.name} className="h-8 w-8 rounded-full object-cover" />
          <div className="hidden pr-2 text-left sm:block">
            <div className="text-[12px] font-semibold text-[#101828]">{currentUser.name}</div>
            <div className="text-[10px] text-[#6d7483]">{currentUser.role}</div>
          </div>
        </button>
      </div>
    </div>
  );
}

function DashboardBanner({ currentUser, featuredProduct, completedCount, progressAverage, onContinuar, onExplore }) {
  return (
    <div className="overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#12203a_0%,#1f57ff_46%,#87e4ff_100%)] p-4 text-white shadow-[0_24px_60px_rgba(31,87,255,0.26)] md:p-5">
      <div className="grid items-center gap-4 lg:grid-cols-[0.82fr_1.12fr_0.86fr]">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-x-6 top-1/2 h-14 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
          <img
            src="/images/ai-prompt-packs-hero.png"
            alt="Prompt pack hero"
            className="relative h-28 w-full max-w-[190px] object-contain drop-shadow-[0_18px_40px_rgba(0,0,0,0.18)] md:h-40"
          />
        </div>

        <div className="text-center lg:text-left">
          <Badge tone="dark">Bienvenido de nuevo, {currentUser.name.split(" ")[0]}</Badge>
          <h2 className="mt-3 text-[clamp(1.45rem,2.6vw,2.4rem)] font-display leading-[0.92] tracking-[-0.06em] uppercase">
            Continúa desde tu último punto
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-[12px] leading-6 text-white/82 lg:mx-0">
            Una biblioteca curada de cursos, packs, ebooks y plantillas organizada como un catálogo en streaming.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3 lg:justify-start">
            <button
              type="button"
              onClick={onContinuar}
              className="rounded-full bg-white px-4 py-2.5 text-[12px] font-semibold text-[#101828] shadow-[0_10px_20px_rgba(0,0,0,0.1)]"
            >
              Seguir aprendiendo
            </button>
            <button
              type="button"
              onClick={onExplore}
              className="rounded-full border border-white/30 px-4 py-2.5 text-[12px] font-semibold text-white"
            >
              Explorar biblioteca
            </button>
          </div>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-[20px] bg-white/14 p-3 backdrop-blur-sm">
            <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/74">Progreso total</div>
            <div className="mt-2 text-[26px] font-semibold tracking-[-0.05em]">{progressAverage}%</div>
            <ProgressBar value={progressAverage} className="mt-3 bg-white/14" />
          </div>
          <div className="rounded-[20px] bg-white p-3 text-[#101828] shadow-[0_14px_30px_rgba(0,0,0,0.08)]">
            <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#5f687b]">Desbloqueados</div>
            <div className="mt-2 text-[26px] font-semibold tracking-[-0.05em]">{completedCount}</div>
            <div className="mt-1 text-[11px] text-[#6d7483]">productos disponibles en tu cuenta</div>
          </div>
          <div className="rounded-[20px] bg-[#12203a]/50 p-3 backdrop-blur-sm">
            <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/74">Destacado ahora</div>
            <div className="mt-2 line-clamp-2 text-[13px] font-semibold">{featuredProduct.title}</div>
            <div className="mt-1 text-[12px] text-white/78">{featuredProduct.duration} · {featuredProduct.lessonsCount} lecciones</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LibraryPage() {
  const { currentUser, products, progress, entitlements, favorites, history, toggleFavorite, theme, toggleTheme, logout } = usePlatform();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("comprados");

  useEffect(() => {
    if (!sidebarOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [sidebarOpen]);

  const items = useMemo(() => {
    return products
      .filter((product) => !product.archived)
      .map((product) => {
        const progressInfo = getProductProgress(progress, currentUser.id, product.id);
        const accessible = canAccessProduct({ currentUser, entitlements, product });

        return {
          ...product,
          accessible,
          progressValue: progressInfo.progress || 0,
          isFavorite: (favorites[currentUser.id] || []).includes(product.id),
          progressInfo,
        };
      });
  }, [currentUser, entitlements, favorites, products, progress]);

  const normalizedQuery = normalizeSearchText(search);

  const visibleProducts = useMemo(() => {
    return items.filter((product) => {
      const searchable = [
        product.title,
        product.description,
        product.author,
        product.type,
        product.category,
        product.badge,
        ...(product.tags || []),
      ]
        .join(" ")
        .toLowerCase();
      return !normalizedQuery || normalizeSearchText(searchable).includes(normalizedQuery);
    });
  }, [items, normalizedQuery]);

  const purchasedProducts = useMemo(
    () => visibleProducts.filter((product) => product.accessible).slice(0, 4),
    [visibleProducts],
  );

  const featuredProducts = useMemo(
    () => [...visibleProducts].filter((product) => product.featured).sort((a, b) => b.rating - a.rating).slice(0, 4),
    [visibleProducts],
  );

  const ongoingProducts = useMemo(
    () =>
      [...visibleProducts]
        .filter((product) => product.progressValue > 0 && product.progressValue < 100)
        .sort((a, b) => b.progressValue - a.progressValue)
        .slice(0, 4),
    [visibleProducts],
  );

  const favoriteProducts = useMemo(
    () => [...visibleProducts].filter((product) => product.isFavorite).slice(0, 4),
    [visibleProducts],
  );

  const completedProducts = useMemo(
    () => [...visibleProducts].filter((product) => product.progressValue === 100).slice(0, 4),
    [visibleProducts],
  );

  const downloadProducts = useMemo(
    () => [...visibleProducts].filter((product) => ["ebook", "template", "asset"].includes(product.type)).slice(0, 4),
    [visibleProducts],
  );

  const mostUsedProducts = useMemo(
    () => {
      const base = (history[currentUser.id] || [])
        .map((productId) => products.find((product) => product.id === productId))
        .filter(Boolean);

      if (!normalizedQuery) {
        return base.slice(0, 4);
      }

      return base
        .filter((product) => {
          const searchable = [
            product.title,
            product.description,
            product.author,
            product.type,
            product.category,
            product.badge,
            ...(product.tags || []),
          ].join(" ");
          return normalizeSearchText(searchable).includes(normalizedQuery);
        })
        .slice(0, 4);
    },
    [currentUser.id, history, normalizedQuery, products],
  );

  const topRatedProducts = useMemo(
    () => [...visibleProducts].sort((a, b) => b.rating - a.rating).slice(0, 5),
    [visibleProducts],
  );

  const unlockedCount = items.filter((product) => product.accessible).length;
  const completedCount = items.filter((product) => product.progressValue === 100).length;
  const progressAverage = items.length
    ? Math.round(items.reduce((sum, product) => sum + product.progressValue, 0) / items.length)
    : 0;

  const featuredHero = purchasedProducts[0] || visibleProducts[0] || items[0] || products[0];
  const continueTarget = ongoingProducts[0] || featuredHero;

  const continueAction = () => {
    if (!continueTarget) {
      return;
    }

    const firstLesson = continueTarget.modules?.[0]?.lessons?.[0]?.id;
    if (continueTarget.progressValue > 0 && firstLesson) {
      navigate(`/watch/${continueTarget.slug}/${continueTarget.progressInfo.lastLessonId || firstLesson}`);
      return;
    }

    navigate(`/product/${continueTarget.slug}`);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setSidebarOpen(false);
  };

  const sidebarItems = [
    { key: "comprados", label: "Comprados", icon: "check", onClick: () => { setActiveMenu("comprados"); scrollToSection("comprados"); } },
    { key: "catalogo", label: "Catálogo", icon: "library", onClick: () => { setActiveMenu("catalogo"); scrollToSection("catalogo"); } },
    { key: "descargas", label: "Descargas", icon: "download", onClick: () => { setActiveMenu("descargas"); scrollToSection("descargas"); } },
    { key: "mas-usados", label: "Más usados", icon: "star", onClick: () => { setActiveMenu("mas-usados"); scrollToSection("mas-usados"); } },
    { key: "profile", label: "Perfil", icon: "user", onClick: () => navigate("/profile") },
  ];

  if (currentUser.role === "admin") {
    sidebarItems.push({ key: "admin", label: "Admin", icon: "user", onClick: () => navigate("/admin") });
  }

  const renderSidebar = (mobile = false) => (
    <aside
      className={joinClasses(
        "flex h-full flex-col border-r border-[var(--border-soft)] bg-[var(--surface-elevated)] backdrop-blur-xl",
        mobile
          ? "fixed inset-y-0 left-0 z-40 w-[304px] rounded-r-[28px] p-4 shadow-[0_24px_60px_rgba(15,23,42,0.18)] transition duration-300 lg:hidden"
          : "hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:w-[304px] lg:px-4 lg:py-4",
      )}
      style={
        mobile
          ? {
              transform: sidebarOpen ? "translateX(0)" : "translateX(-102%)",
            }
          : undefined
      }
    >
      <div className="flex h-full flex-col rounded-[26px] border border-white/70 bg-[var(--surface-elevated)] p-3 shadow-[0_14px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <div className="relative flex items-center justify-center py-2 pb-6">
          <Link to="/library" className="flex items-center justify-center" onClick={() => setSidebarOpen(false)}>
            <img src="/images/logo-vm.png" alt="VBM Devs" className="theme-logo h-12 w-auto" />
          </Link>
          {mobile ? (
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="absolute right-0 grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-[#101828]"
            >
              <DashboardIcon name="chevron" className="h-3.5 w-3.5 -rotate-180" />
            </button>
          ) : null}
        </div>

        <nav className="mt-8 flex-1 space-y-1 overflow-visible pr-0">
          {sidebarItems.map((item) => {
            const active = activeMenu === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setActiveMenu(item.key);
                  item.onClick();
                }}
                className={joinClasses(
                  "group flex w-full items-center gap-2.5 rounded-[16px] px-3 py-2 text-left text-[11px] font-medium transition",
                  active
                    ? "bg-[#edf3ff] text-[#101828] shadow-[0_10px_20px_rgba(31,87,255,0.08)]"
                    : "text-[#5f687b] hover:bg-white hover:text-[#101828]",
                )}
              >
                <span
                  className={joinClasses(
                    "grid h-8 w-8 place-items-center rounded-full border transition",
                    active ? "border-[#1f57ff]/20 bg-white text-[#1f57ff]" : "border-slate-200 bg-white/80 text-[#5f687b]",
                  )}
                >
                  <DashboardIcon name={item.icon} className="h-4.5 w-4.5" />
                </span>
                <span className="flex-1">{item.label}</span>
                {active ? <span className="h-1.5 w-1.5 rounded-full bg-[#1f57ff]" /> : null}
              </button>
            );
          })}
        </nav>

        <div className="mt-4 flex items-center gap-3 rounded-[20px] border border-slate-200 bg-white p-3 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
          <img src={currentUser.avatar} alt={currentUser.name} className="h-9 w-9 rounded-full object-cover" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[11px] font-semibold text-[#101828]">{currentUser.name}</div>
            <div className="text-[9px] text-[#6d7483]">{currentUser.email}</div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#12203a] text-white shadow-[0_10px_20px_rgba(18,32,58,0.16)] transition hover:-translate-y-0.5"
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            <DashboardIcon name="logout" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--page-bg)] text-[var(--page-text)]">
      {renderSidebar(false)}

      {sidebarOpen ? (
        <div className="fixed inset-0 z-30 bg-[#071120]/45 backdrop-blur-md lg:hidden" onClick={() => setSidebarOpen(false)} />
      ) : null}

      <div className="lg:pl-[304px]">
        <main className="mx-auto w-full max-w-[1600px] px-4 py-4 md:px-6 lg:px-8">
          <DashboardHeader
            search={search}
            onSearch={setSearch}
            onClearSearch={() => setSearch("")}
            onMenu={() => setSidebarOpen(true)}
            onThemeToggle={toggleTheme}
            theme={theme}
            currentUser={currentUser}
            onProfile={() => navigate("/profile")}
            onNotifications={() => {
              setActiveMenu("mas-usados");
              scrollToSection("mas-usados");
            }}
          />

          <div className="mt-5">
            <div className="space-y-5">
              <DashboardBanner
                currentUser={currentUser}
                featuredProduct={featuredHero}
                completedCount={unlockedCount}
                progressAverage={progressAverage}
                onContinuar={continueAction}
                onExplore={() => {
                  setActiveMenu("catalogo");
                  scrollToSection("catalogo");
                }}
              />

              <section id="comprados" className="space-y-4">
                <DashboardSectionHeader title="Comprados" action="Ver todos" subtitle="Tus contenidos adquiridos y desbloqueados." />
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {purchasedProducts.length ? (
                    purchasedProducts.map((product) => (
                      <DashboardCard
                        key={product.id}
                        product={product}
                        progressValue={product.progressValue}
                        locked={!product.accessible}
                        onClick={() => navigate(`/product/${product.slug}`)}
                      />
                    ))
                  ) : (
                    <div className="rounded-[22px] border border-dashed border-slate-200 bg-[var(--surface)] p-6 text-sm text-[#6d7483] sm:col-span-2 xl:col-span-4">
                      Aún no tienes contenidos comprados.
                    </div>
                  )}
                </div>
              </section>

              <section id="catalogo" className="space-y-4">
                <DashboardSectionHeader title="Catálogo" action="Ver todos" subtitle="Busca en toda la biblioteca de contenidos." />
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {visibleProducts.length ? (
                    visibleProducts.slice(0, 4).map((product) => (
                      <DashboardCard
                        key={product.id}
                        product={product}
                        progressValue={product.progressValue}
                        locked={!product.accessible}
                        onClick={() => navigate(`/product/${product.slug}`)}
                      />
                    ))
                  ) : (
                    <div className="rounded-[22px] border border-dashed border-slate-200 bg-[var(--surface)] p-6 text-sm text-[#6d7483] sm:col-span-2 xl:col-span-4">
                      No hay resultados para esta búsqueda.
                    </div>
                  )}
                </div>
              </section>

              <section id="descargas" className="space-y-4">
                <DashboardSectionHeader title="Descargas" action="Ver todos" subtitle="Ebooks, plantillas y otros materiales descargables." />
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {downloadProducts.length ? (
                    downloadProducts.map((product) => (
                      <DashboardCard
                        key={product.id}
                        product={product}
                        progressValue={product.progressValue}
                        locked={!product.accessible}
                        onClick={() => navigate(`/product/${product.slug}`)}
                      />
                    ))
                  ) : (
                    <div className="rounded-[22px] border border-dashed border-slate-200 bg-[var(--surface)] p-6 text-sm text-[#6d7483] sm:col-span-2 xl:col-span-4">
                      No hay descargas disponibles.
                    </div>
                  )}
                </div>
              </section>

              <section id="mas-usados" className="space-y-4">
                <DashboardSectionHeader title="Más usados" action="Ver todos" subtitle="Tus productos más consultados recientemente." />
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {mostUsedProducts.length ? (
                    mostUsedProducts.map((product) => (
                      <DashboardCard
                        key={product.id}
                        product={product}
                        progressValue={product.progressValue}
                        locked={!product.accessible}
                        onClick={() => navigate(`/product/${product.slug}`)}
                      />
                    ))
                  ) : (
                    <div className="rounded-[22px] border border-dashed border-slate-200 bg-[var(--surface)] p-6 text-sm text-[#6d7483] sm:col-span-2 xl:col-span-4">
                      Aún no hay actividad suficiente para mostrar aquí.
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>

      {renderSidebar(true)}
    </div>
  );
}

function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { currentUser, products, entitlements, progress, toggleFavorite, favorites, trackProductVisit } = usePlatform();
  const product = products.find((entry) => entry.slug === slug);

  useEffect(() => {
    if (product) {
      trackProductVisit(product.id);
    }
  }, [product, trackProductVisit]);

  if (!product) {
    return <Navigate to="/library" replace />;
  }

  const productProgress = currentUser ? getProductProgress(progress, currentUser.id, product.id) : { progress: 0 };
  const favoriteList = favorites[currentUser?.id] || [];
  const favorite = favoriteList.includes(product.id);
  const accessible = canAccessProduct({ currentUser, entitlements, product });
  const firstLessonId = product.modules?.[0]?.lessons?.[0]?.id || "";

  return (
    <PageFrame
      title={product.title}
      subtitle={product.description}
      action={
        <div className="flex flex-wrap gap-2">
          <Badge tone={product.locked ? "danger" : "success"}>{accessible ? "Disponible" : "Bloqueado"}</Badge>
          <Badge tone="soft">{product.type}</Badge>
        </div>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <img src={product.cover} alt={product.title} className="h-[320px] w-full object-cover" />
          <div className="space-y-5 p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="blue">{product.badge}</Badge>
              <Badge tone="soft">{product.author}</Badge>
              <Badge tone="soft">{product.duration}</Badge>
              <Badge tone="soft">{product.lessonsCount} lecciones</Badge>
            </div>
            <p className="text-[14px] leading-7 text-[#6d7483]">{product.description}</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[18px] bg-[#edf3ff] p-4">
                <div className="text-[11px] uppercase tracking-[0.24em] text-[#5f687b]">Progreso</div>
                <div className="mt-2 text-[28px] font-semibold text-[#101828]">{productProgress.progress || 0}%</div>
              </div>
              <div className="rounded-[18px] bg-[#edf3ff] p-4">
                <div className="text-[11px] uppercase tracking-[0.24em] text-[#5f687b]">Elementos</div>
                <div className="mt-2 text-[28px] font-semibold text-[#101828]">{product.itemCount}</div>
              </div>
              <div className="rounded-[18px] bg-[#edf3ff] p-4">
                <div className="text-[11px] uppercase tracking-[0.24em] text-[#5f687b]">Valoración</div>
                <div className="mt-2 text-[28px] font-semibold text-[#101828]">{product.rating}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {accessible ? (
                <button
                  type="button"
                  onClick={() => navigate(`/watch/${product.slug}/${firstLessonId}`)}
                  className="rounded-full bg-[#1f57ff] px-5 py-3 text-[13px] font-semibold text-white"
                >
                  {productProgress.progress > 0 ? "Continuar" : "Empezar"}
                </button>
              ) : (
                <Link to="/login" className="rounded-full bg-[#1f57ff] px-5 py-3 text-[13px] font-semibold text-white">
                  Inicia sesión para acceder
                </Link>
              )}
              <button
                type="button"
                onClick={() => currentUser && toggleFavorite(product.id)}
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-[13px] font-semibold text-[#101828]"
              >
                {favorite ? "Quitar favorito" : "Guardar favorito"}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
            <div className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[#5f687b]">Módulos</div>
            <div className="mt-4 space-y-3">
              {product.modules.map((mod) => (
                <div key={mod.id} className="rounded-[18px] bg-[#f7f9ff] p-4">
                  <div className="font-semibold text-[#101828]">{mod.title}</div>
                  <div className="mt-3 space-y-2">
                    {mod.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() => navigate(`/watch/${product.slug}/${lesson.id}`)}
                        className="flex w-full items-center justify-between rounded-[14px] bg-white px-3 py-2 text-left text-[13px] text-[#5f687b]"
                      >
                        <span>{lesson.title}</span>
                        <span>{lesson.duration}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
            <div className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[#5f687b]">Relacionados</div>
            <div className="mt-4 grid gap-3">
              {products.filter((entry) => entry.id !== product.id).slice(0, 3).map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => navigate(`/product/${entry.slug}`)}
                  className="flex items-center gap-3 rounded-[16px] bg-[#f7f9ff] p-3 text-left"
                >
                  <img src={entry.cover} alt={entry.title} className="h-14 w-14 rounded-[14px] object-cover" />
                  <div>
                    <div className="font-semibold text-[#101828]">{entry.title}</div>
                    <div className="text-[12px] text-[#6d7483]">{entry.type}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageFrame>
  );
}

function PlayerPage() {
  const { slug, lessonId } = useParams();
  const navigate = useNavigate();
  const { currentUser, products, progress, setLessonProgress, trackProductVisit, entitlements } = usePlatform();
  const product = products.find((entry) => entry.slug === slug);

  useEffect(() => {
    if (product) {
      trackProductVisit(product.id);
    }
  }, [product, trackProductVisit]);

  if (!product) {
    return <Navigate to="/library" replace />;
  }

  const accessible = canAccessProduct({ currentUser, entitlements, product });
  if (!accessible) {
    return <Navigate to={`/product/${product.slug}`} replace />;
  }

  const allLessons = product.modules.flatMap((mod) => mod.lessons.map((lesson) => ({ ...lesson, moduleTitle: mod.title })));
  const activeLesson = allLessons.find((lesson) => lesson.id === lessonId) || allLessons[0];
  const productProgress = getProductProgress(progress, currentUser.id, product.id);
  const activeIndex = allLessons.findIndex((lesson) => lesson.id === activeLesson.id);

  const setComplete = (completed) => {
    const nextProgress = completed
      ? Math.min(100, productProgress.progress + Math.ceil(100 / Math.max(1, allLessons.length)))
      : productProgress.progress;
    setLessonProgress({
      productId: product.id,
      lessonId: activeLesson.id,
      progressValue: nextProgress,
      completed,
    });
  };

  const goToLesson = (offset) => {
    const nextIndex = Math.max(0, Math.min(allLessons.length - 1, activeIndex + offset));
    navigate(`/watch/${product.slug}/${allLessons[nextIndex].id}`);
  };

  return (
    <PageFrame title={`Viendo: ${product.title}`} subtitle="Haz seguimiento del progreso y retoma desde la lección exacta que abriste por última vez.">
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <div className="rounded-[26px] overflow-hidden border border-slate-200 bg-[#101828] shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
            <div className="relative aspect-video">
              <img src={product.cover} alt={product.title} className="h-full w-full object-cover opacity-85" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,10,25,0.15)_0%,rgba(4,10,25,0.85)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/75">{activeLesson.moduleTitle}</div>
                <h2 className="mt-2 text-[clamp(1.6rem,3vw,2.8rem)] font-medium tracking-[-0.05em]">{activeLesson.title}</h2>
                <p className="mt-2 max-w-2xl text-[14px] leading-7 text-white/80">{product.description}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => goToLesson(-1)}
              className="rounded-full bg-white px-5 py-3 text-[13px] font-semibold text-[#101828]"
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={() => goToLesson(1)}
              className="rounded-full bg-[#1f57ff] px-5 py-3 text-[13px] font-semibold text-white"
            >
              Siguiente
            </button>
            <button
              type="button"
              onClick={() => setComplete(true)}
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-[13px] font-semibold text-[#101828]"
            >
              Marcar como completado
            </button>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[#5f687b]">Progreso</div>
                <div className="mt-1 text-[28px] font-semibold text-[#101828]">{productProgress.progress || 0}%</div>
              </div>
              <div className="min-w-[220px] flex-1">
                <ProgressBar value={productProgress.progress || 0} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
            <div className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[#5f687b]">Lecciones</div>
            <div className="mt-4 space-y-2">
              {allLessons.map((lesson, index) => (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => navigate(`/watch/${product.slug}/${lesson.id}`)}
                  className={joinClasses(
                    "flex w-full items-center justify-between rounded-[16px] px-4 py-3 text-left text-[13px] transition",
                    lesson.id === activeLesson.id ? "bg-[#edf3ff] text-[#101828]" : "bg-[#f7f9ff] text-[#5f687b]",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-[#1f57ff]">{index + 1}</span>
                    <span>{lesson.title}</span>
                  </span>
                  <span>{lesson.duration}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
            <div className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[#5f687b]">Materiales</div>
            <p className="mt-3 text-[13px] leading-7 text-[#6d7483]">
              Aquí puedes añadir descargas, referencias y recursos extra según el tipo de producto.
            </p>
          </div>
        </div>
      </div>
    </PageFrame>
  );
}

function ProfilePage() {
  const { currentUser, progress, favorites, history, products, updateProfile, logout } = usePlatform();
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const navigate = useNavigate();

  useEffect(() => {
    setName(currentUser.name);
    setEmail(currentUser.email);
  }, [currentUser]);

  const ownedProductos = products.filter((product) => product.access !== "locked");
  const favoriteProducts = products.filter((product) => (favorites[currentUser.id] || []).includes(product.id));
  const recentProductos = (history[currentUser.id] || []).map((productId) => products.find((product) => product.id === productId)).filter(Boolean);

  const submit = (event) => {
    event.preventDefault();
    updateProfile({ name, email });
  };

  return (
    <PageFrame
      title="Tu perfil"
      subtitle="Gestiona los datos de tu cuenta, revisa tu progreso y sigue tu actividad reciente."
      action={<Badge tone={currentUser.role === "admin" ? "blue" : "soft"}>{currentUser.role}</Badge>}
    >
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-4">
              <img src={currentUser.avatar} alt={currentUser.name} className="h-16 w-16 rounded-full object-cover" />
              <div>
                <div className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[#5f687b]">Cuenta</div>
                <div className="mt-1 text-[22px] font-semibold text-[#101828]">{currentUser.name}</div>
                <div className="text-[13px] text-[#6d7483]">{currentUser.email}</div>
              </div>
            </div>
          </div>

          <form onSubmit={submit} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)] space-y-4">
            <div className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[#5f687b]">Preferencias</div>
            <input className="w-full rounded-full border border-slate-200 bg-[#f7f9ff] px-4 py-3" value={name} onChange={(event) => setName(event.target.value)} />
            <input className="w-full rounded-full border border-slate-200 bg-[#f7f9ff] px-4 py-3" value={email} onChange={(event) => setEmail(event.target.value)} />
            <button className="rounded-full bg-[#1f57ff] px-5 py-3 text-[13px] font-semibold text-white">Guardar cambios</button>
          </form>

          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-[13px] font-semibold text-[#101828]"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[22px] bg-[#edf3ff] p-4">
              <div className="text-[11px] uppercase tracking-[0.24em] text-[#5f687b]">Adquiridos</div>
              <div className="mt-2 text-[30px] font-semibold text-[#101828]">{ownedProductos.length}</div>
            </div>
            <div className="rounded-[22px] bg-[#edf3ff] p-4">
              <div className="text-[11px] uppercase tracking-[0.24em] text-[#5f687b]">Favoritos</div>
              <div className="mt-2 text-[30px] font-semibold text-[#101828]">{favoriteProducts.length}</div>
            </div>
            <div className="rounded-[22px] bg-[#edf3ff] p-4">
              <div className="text-[11px] uppercase tracking-[0.24em] text-[#5f687b]">Recientes</div>
              <div className="mt-2 text-[30px] font-semibold text-[#101828]">{recentProductos.length}</div>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
            <SectionHeading
              eyebrow="Progreso"
              title="Actividad reciente y favoritos"
              subtitle="Estas listas se guardan por cuenta y se restauran en tu próxima visita."
            />
            <div className="mt-5 grid gap-4">
              {recentProductos.slice(0, 4).map((product) => {
                const current = getProductProgress(progress, currentUser.id, product.id);
                return (
                  <button key={product.id} type="button" onClick={() => navigate(`/product/${product.slug}`)} className="flex items-center gap-3 rounded-[18px] bg-[#f7f9ff] p-3 text-left">
                    <img src={product.cover} alt={product.title} className="h-14 w-14 rounded-[14px] object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-[#101828]">{product.title}</div>
                      <div className="text-[12px] text-[#6d7483]">{current.progress || 0}% complete</div>
                      <ProgressBar value={current.progress || 0} className="mt-2" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </PageFrame>
  );
}

function AdminPage() {
  const { isAdmin, products, users, entitlements, upsertProduct, archiveProduct, grantAccess, revokeAccess, currentUser } = usePlatform();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(products[0]?.id || "");
  const selected = products.find((product) => product.id === selectedId) || products[0];
  const [form, setForm] = useState(selected || {});

  useEffect(() => {
    setForm(selected || {});
  }, [selected]);

  if (!isAdmin) {
    return <Navigate to="/library" replace />;
  }

  const save = (event) => {
    event.preventDefault();
    upsertProduct({
      ...selected,
      ...form,
      id: form.id || selected.id,
      slug: (form.slug || selected.slug || "").toString().trim().toLowerCase().replace(/\s+/g, "-"),
      tags: typeof form.tags === "string" ? form.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : form.tags,
    });
  };

  const metrics = [
    { label: "Productos", value: products.length },
    { label: "Usuarios", value: users.length },
    { label: "Desbloqueados", value: users.reduce((sum, user) => sum + (entitlements[user.id] || []).length, 0) },
  ];

  return (
    <PageFrame
      title="Panel de administración"
      subtitle="Gestiona productos, permisos y metadatos del catálogo desde un solo lugar."
      action={<button onClick={() => navigate("/library")} className="rounded-full bg-[#1f57ff] px-5 py-3 text-[13px] font-semibold text-white">Volver a la biblioteca</button>}
    >
      <div className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-3">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-[22px] bg-[#edf3ff] p-4">
              <div className="text-[11px] uppercase tracking-[0.24em] text-[#5f687b]">{metric.label}</div>
              <div className="mt-2 text-[30px] font-semibold text-[#101828]">{metric.value}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
            <div className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[#5f687b]">Productos</div>
            <div className="mt-4 space-y-2">
              {products.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(product.id);
                    setForm(product);
                  }}
                  className={joinClasses(
                    "w-full rounded-[16px] px-4 py-3 text-left text-[13px] transition",
                    product.id === selected?.id ? "bg-[#edf3ff] text-[#101828]" : "bg-[#f7f9ff] text-[#5f687b]",
                  )}
                >
                  <div className="font-semibold">{product.title}</div>
                  <div className="text-[12px]">{product.type} - {product.access}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[#5f687b]">Editar producto</div>
                <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.05em] text-[#101828]">{form.title || "Select a product"}</h2>
              </div>
              <button type="button" onClick={() => archiveProduct(selected.id)} className="rounded-full bg-[#ffe5e5] px-4 py-2 text-[12px] font-semibold text-[#b42318]">
                Archivar
              </button>
            </div>

            <form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={save}>
              {[
                ["title", "Título"],
                ["slug", "Slug"],
                ["type", "Tipo"],
                ["category", "Categoría"],
                ["badge", "Badge"],
                ["duration", "Duración"],
                ["author", "Autor"],
                ["access", "Acceso"],
                ["cover", "URL de portada"],
                ["itemCount", "Elementos"],
                ["lessonsCount", "Lecciones"],
                ["rating", "Valoración"],
              ].map(([key, label]) => (
                <label key={key} className="space-y-2 text-[13px] text-[#5f687b]">
                  <div className="font-semibold text-[#101828]">{label}</div>
                  <input
                    className="w-full rounded-full border border-slate-200 bg-[#f7f9ff] px-4 py-3 text-[14px]"
                    value={form?.[key] ?? ""}
                    onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                  />
                </label>
              ))}

              <label className="md:col-span-2 space-y-2 text-[13px] text-[#5f687b]">
                <div className="font-semibold text-[#101828]">Descripción</div>
                <textarea
                  className="min-h-[120px] w-full rounded-[20px] border border-slate-200 bg-[#f7f9ff] px-4 py-3 text-[14px]"
                  value={form?.description ?? ""}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                />
              </label>

              <label className="md:col-span-2 space-y-2 text-[13px] text-[#5f687b]">
                <div className="font-semibold text-[#101828]">Etiquetas separadas por comas</div>
                <input
                  className="w-full rounded-full border border-slate-200 bg-[#f7f9ff] px-4 py-3 text-[14px]"
                  value={Array.isArray(form?.tags) ? form.tags.join(", ") : form?.tags || ""}
                  onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
                />
              </label>

              <div className="md:col-span-2 flex flex-wrap gap-3">
                <button className="rounded-full bg-[#1f57ff] px-5 py-3 text-[13px] font-semibold text-white">Guardar producto</button>
                <button type="button" onClick={() => grantAccess(currentUser.id, selected.id)} className="rounded-full bg-[#edf3ff] px-5 py-3 text-[13px] font-semibold text-[#101828]">Concederme acceso</button>
                <button type="button" onClick={() => revokeAccess(currentUser.id, selected.id)} className="rounded-full border border-slate-200 bg-white px-5 py-3 text-[13px] font-semibold text-[#101828]">Revocar acceso</button>
              </div>
            </form>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
          <div className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[#5f687b]">Accesos concedidos</div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {users.map((user) => (
              <div key={user.id} className="rounded-[18px] bg-[#f7f9ff] p-4">
                <div className="font-semibold text-[#101828]">{user.name}</div>
                <div className="text-[12px] text-[#6d7483]">{user.email}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(entitlements[user.id] || []).slice(0, 4).map((productId) => {
                    const item = products.find((entry) => entry.id === productId);
                    return item ? <Badge key={productId} tone="soft">{item.title}</Badge> : null;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageFrame>
  );
}

function LegalPage() {
  const { pathname } = useLocation();
  const page = legalPages.find((entry) => pathname.includes(entry.slug)) || legalPages[0];

  return (
    <PageFrame title={page.title} subtitle={page.summary}>
      <div className="prose max-w-none prose-p:text-[#6d7483] prose-headings:text-[#101828]">
        <p>
          Esta es una base de implementación del front-end preparada para alojar más adelante un backend de producción.
          Mantiene intacta la landing pública mientras añade una experiencia de biblioteca tipo streaming, flujos de autenticación y herramientas de administración.
        </p>
      </div>
    </PageFrame>
  );
}

function NotFoundPage() {
  return (
    <PageFrame title="Página no encontrada" subtitle="La página que buscas no existe.">
      <div className="flex flex-wrap gap-3">
        <Link to="/library" className="rounded-full bg-[#1f57ff] px-5 py-3 text-[13px] font-semibold text-white">
          Ir a la biblioteca
        </Link>
        <Link to="/" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-[13px] font-semibold text-[#101828]">
          Volver a la landing
        </Link>
      </div>
    </PageFrame>
  );
}

export {
  AdminPage,
  AuthLayout,
  ContentCard,
  ForgotPasswordPage,
  HorizontalRow,
  LegalPage,
  LibraryPage,
  LoginPage,
  NotFoundPage,
  PageFrame,
  PlayerPage,
  ProductPage,
  ProfilePage,
  RequireAuth,
  RequireRole,
  ResetPasswordPage,
  SectionHeading,
  ShellNav,
  SignupPage,
  canAccessProduct,
  getProductProgress,
};






