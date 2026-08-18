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
  const trackRef = useRef<HTMLDivElement>(null);

  const dragState = useRef({
    isDown: false,
    dragged: false,
    startX: 0,
    startScrollLeft: 0,
  });
  const pausedRef = useRef(false);
  const resumeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-scroll loop with seamless wrap (list is rendered twice).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = now - last;
      last = now;

      if (!pausedRef.current && !dragState.current.isDown) {
        const half = track.scrollWidth / 2;
        let next = track.scrollLeft + (SPEED_PX_PER_SEC * dt) / 1000;
        if (half > 0 && next >= half) {
          next -= half;
        }
        track.scrollLeft = next;
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
    const track = trackRef.current;
    if (!track) return;
    dragState.current.isDown = true;
    dragState.current.dragged = false;
    dragState.current.startX = e.clientX;
    dragState.current.startScrollLeft = track.scrollLeft;
    pausedRef.current = true;
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    track.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const track = trackRef.current;
    if (!track || !dragState.current.isDown) return;
    const delta = e.clientX - dragState.current.startX;
    if (Math.abs(delta) > DRAG_CLICK_THRESHOLD) {
      dragState.current.dragged = true;
    }
    let next = dragState.current.startScrollLeft - delta;
    const half = track.scrollWidth / 2;
    if (half > 0) {
      if (next < 0) next += half;
      if (next >= half) next -= half;
    }
    track.scrollLeft = next;
  };

  const endDrag = () => {
    if (!dragState.current.isDown) return;
    dragState.current.isDown = false;
    scheduleResume();
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (dragState.current.dragged) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div
      ref={trackRef}
      className="flex touch-pan-y cursor-grab select-none gap-5 overflow-x-hidden px-4 active:cursor-grabbing md:px-8"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={onClickCapture}
      role="region"
      aria-label="Витрина дома"
    >
      {[...items, ...items].map((cat, i) => (
        <Link
          key={`${cat.id}-${i}`}
          href={cat.href}
          draggable={false}
          className="group relative aspect-[4/5] w-[46%] shrink-0 overflow-hidden rounded-2xl border-[3px] border-white bg-[var(--muted)] shadow-[0_8px_24px_rgba(0,0,0,0.25)] sm:w-[32%] md:w-[24%] lg:w-[20%]"
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
  );
}
