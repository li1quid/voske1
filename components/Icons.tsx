export function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 20" fill="none" aria-hidden>
      <path
        d="M4 10h62M196 10h-62M100 2c8 0 10 8 10 8s-2 8-10 8-10-8-10-8 2-8 10-8Z"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="100" cy="10" r="2.2" fill="currentColor" />
    </svg>
  );
}

export function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.2-3.2" />
    </svg>
  );
}

export function IconHeart({ filled = false }: { filled?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6">
      <path d="M12 20s-7-4.4-9-8.2C1.4 8.6 3.2 5 6.8 5c2 0 3.3 1.1 5.2 3.2C13.9 6.1 15.2 5 17.2 5 20.8 5 22.6 8.6 21 11.8 19 15.6 12 20 12 20z" />
    </svg>
  );
}

export function IconBag() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 8h12l-1 13H7L6 8z" />
      <path d="M9 8V7a3 3 0 0 1 6 0v1" />
    </svg>
  );
}

export function IconClose() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function IconMenu() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function IconSun() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v3M12 18.5v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2.5 12h3M18.5 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    </svg>
  );
}

export function IconMoon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M20 14.2A8.5 8.5 0 1 1 9.8 4a6.7 6.7 0 0 0 10.2 10.2z" />
    </svg>
  );
}

export function IconTelegram() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.5 3.4 18.2 20.2c-.25 1.1-1.1 1.35-2.2.84l-5-3.7-2.4 2.32c-.27.27-.5.5-1.02.5l.36-5.15L17.8 7.3c.4-.35-.1-.54-.62-.2L7.1 13.7 2.1 12.1c-1.08-.34-1.1-1.08.23-1.64L20.1 3c.9-.35 1.68.2 1.4.4z" />
    </svg>
  );
}
