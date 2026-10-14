import { useEffect, useRef } from "react";

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

/**
 * Observes an element and adds 'scroll-visible' class when it enters the viewport.
 * The element must have 'scroll-hidden', 'scroll-hidden-left', or 'scroll-hidden-right'
 * CSS class for the animation to work.
 */
export function useScrollAnimation<T extends HTMLElement>(
  options: UseScrollAnimationOptions = {},
) {
  const ref = useRef<T>(null);
  const {
    threshold = 0.15,
    rootMargin = "0px 0px -60px 0px",
    once = true,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      el.classList.add("scroll-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("scroll-visible");
          if (once) observer.unobserve(el);
        } else if (!once) {
          el.classList.remove("scroll-visible");
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return ref;
}

/**
 * Hook to animate multiple children with staggered delays.
 * Children with 'scroll-hidden' class will each be observed independently.
 */
export function useStaggeredScroll<T extends HTMLElement>(
  childSelector = "[data-stagger]",
  options: UseScrollAnimationOptions = {},
) {
  const ref = useRef<T>(null);
  const {
    threshold = 0.1,
    rootMargin = "0px 0px -40px 0px",
    once = true,
  } = options;

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const children = Array.from(
      container.querySelectorAll<HTMLElement>(childSelector),
    );

    if (prefersReducedMotion) {
      for (const child of children) {
        child.classList.add("scroll-visible");
      }
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("scroll-visible");
            if (once) observer.unobserve(entry.target);
          }
        }
      },
      { threshold, rootMargin },
    );

    for (const child of children) {
      observer.observe(child);
    }
    return () => observer.disconnect();
  }, [childSelector, threshold, rootMargin, once]);

  return ref;
}
