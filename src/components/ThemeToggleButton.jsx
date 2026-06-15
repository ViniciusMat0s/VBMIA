import React from "react";

function joinClasses(...parts) {
  return parts.filter(Boolean).join(" ");
}

function MoonIcon({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M20 15.2A8.2 8.2 0 0 1 8.8 4a7.8 7.8 0 1 0 11.2 11.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SunIcon({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" fill="currentColor" />
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8">
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

function ThemeToggleButton({ isDark, onToggle, className = "", size = "md" }) {
  const sizing = {
    sm: {
      button: "h-11 w-11",
      layer: "h-11 w-11",
      icon: "h-5 w-5",
    },
    md: {
      button: "h-14 w-14",
      layer: "h-14 w-14",
      icon: "h-6 w-6",
    },
  };

  const preset = sizing[size] || sizing.md;

  return (
    <button
      type="button"
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
      aria-pressed={isDark}
      onClick={onToggle}
      className={joinClasses(
        "theme-toggle relative grid place-items-center rounded-full transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f57ff]/35 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent",
        preset.button,
        className,
      )}
    >
      <span
        className={joinClasses(
          "pointer-events-none absolute grid place-items-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          preset.layer,
          isDark ? "scale-50 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100",
        )}
      >
        <MoonIcon className={preset.icon} />
      </span>
      <span
        className={joinClasses(
          "pointer-events-none absolute grid place-items-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          preset.layer,
          isDark ? "scale-100 rotate-0 opacity-100" : "scale-50 -rotate-90 opacity-0",
        )}
      >
        <SunIcon className={preset.icon} />
      </span>
    </button>
  );
}

export { ThemeToggleButton };
