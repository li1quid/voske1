"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

type VitrineItem = {
  id: string;
  href: string;
  image: string;
  label: string;
};

const SPEED_PX_PER_SEC = 34;
const DRAG_CLICK_THRESHOLD = 6;
const RESUME_DELAY_MS = 1400;

export function HomeVitrineCarousel({ items }: { items: VitrineItem[] }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Current horizontal offset in px, applied via transform (GPU-composited,
  // no layout/reflow) for a perfectly smooth, jank-free motion.
  const offsetRef = useRef(0);
  const dragState = useRef({
    isDown: false,
    dragged: false,
    startX: 0,
    startOffset: 0,
  });
  const pausedRef = useRef(false);
  const resumeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyTransform = () => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transform = `translate3d(${-offsetRef.current}px,0,0)`;
  };

  const wrap = (value: number, half: number) => {
    if (half <= 0) return value;
    let v = value % half;
    if (v < 0) v += half;
    return v;
  };

  // Auto-scroll loop with seamless wrap (list is rendered twice).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      // Clamp dt so a tab switch / dropped frame can't cause a visible jump.
      const dt = Math.min(now - last, 50);
      last = now;

      if (!pausedRef.current && !dragState.current.isDown) {
        const half = track.scrollWidth / 2;
        offsetRef.current = wrap(offsetRef.current + (SPEED_PX_PER_SEC * dt) / 1000, half);
        applyTransform();
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [items]);

  const scheduleResume = () => {
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    resumeTimeout.current = setTimeout(() => {
      pausedRef.current = false;
    }, RESUME_DELAY_MS);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const outer = outerRef.current;
    if (!outer) return;
    dragState.current.isDown = true;
    dragState.current.dragged = false;
    dragState.current.startX = e.clientX;
    dragState.current.startOffset = offsetRef.current;
    pausedRef.current = true;
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    // Pointer capture is intentionally NOT set here. Capturing on pointerdown
    // retargets the browser's subsequent mousedown to the outer container,
    // which forces the resulting "click" event onto the common ancestor
    // (this div) instead of the link — silently breaking navigation on
    // mouse/desktop while touch taps kept working. We only capture once an
    // actual drag is detected in onPointerMove below.
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const track = trackRef.current;
    const outer = outerRef.current;
    if (!track || !outer || !dragState.current.isDown) return;
    const delta = e.clientX - dragState.current.startX;
    if (!dragState.current.dragged && Math.abs(delta) > DRAG_CLICK_THRESHOLD) {
      dragState.current.dragged = true;
      outer.setPointerCapture?.(e.pointerId);
    }
    if (!dragState.current.dragged) return;
    const half = track.scrollWidth / 2;
    offsetRef.current = wrap(dragState.current.startOffset - delta, half);
    applyTransform();
  };

  const endDrag = (e?: React.PointerEvent) => {
    if (!dragState.current.isDown) return;
    dragState.current.isDown = false;
    scheduleResume();
    const outer = outerRef.current;
    if (outer && e && outer.hasPointerCapture?.(e.pointerId)) {
      outer.releasePointerCapture(e.pointerId);
    }
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (dragState.current.dragged) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div
      ref={outerRef}
      className="touch-pan-y cursor-grab select-none overflow-hidden px-4 active:cursor-grabbing md:px-8"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={onClickCapture}
      role="region"
      aria-label="Витрина дома"
    >
      <div ref={trackRef} className="flex w-max gap-5 will-change-transform">
        {[...items, ...items].map((cat, i) => (
          <Link
            key={`${cat.id}-${i}`}
            href={cat.href}
            draggable={false}
            className="group relative aspect-[4/5] w-[46vw] shrink-0 overflow-hidden rounded-2xl border-[3px] border-white bg-[var(--muted)] shadow-[0_8px_24px_rgba(0,0,0,0.25)] sm:w-[32vw] md:w-[24vw] lg:w-[20vw]"
          >
            <Image
              src={cat.image}
              alt={cat.label}
              fill
              draggable={false}
              className="pointer-events-none object-cover transition duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 46vw, 20vw"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <span className="pointer-events-none absolute bottom-5 left-5 text-sm font-medium tracking-[0.14em] text-white uppercase">
              {cat.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
