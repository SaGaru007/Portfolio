import { useEffect, useRef, useState } from "react";

interface UseTypewriterOptions {
  /** List of strings to cycle through */
  words: string[];
  /** Typing speed in ms per character */
  typeSpeed?: number;
  /** Deleting speed in ms per character */
  deleteSpeed?: number;
  /** Pause at end of fully typed word (ms) */
  pauseOnComplete?: number;
  /** Pause before starting next word (ms) */
  pauseBeforeNext?: number;
  /** Loop infinitely */
  loop?: boolean;
}

interface UseTypewriterReturn {
  displayText: string;
  isTyping: boolean;
  wordIndex: number;
}

type Phase = "typing" | "pause" | "deleting" | "next-pause";

export function useTypewriter({
  words,
  typeSpeed = 80,
  deleteSpeed = 45,
  pauseOnComplete = 1800,
  pauseBeforeNext = 350,
  loop = true,
}: UseTypewriterOptions): UseTypewriterReturn {
  const [displayText, setDisplayText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  useEffect(() => {
    if (!words.length) return;

    if (prefersReducedMotion) {
      setDisplayText(words[0]);
      return;
    }

    const currentWord = words[wordIndex % words.length];

    const tick = () => {
      if (phase === "typing") {
        setDisplayText((prev) => {
          const next = currentWord.slice(0, prev.length + 1);
          if (next === currentWord) {
            setPhase("pause");
          }
          return next;
        });
        timeoutRef.current = setTimeout(tick, typeSpeed);
      } else if (phase === "pause") {
        timeoutRef.current = setTimeout(
          () => setPhase("deleting"),
          pauseOnComplete,
        );
      } else if (phase === "deleting") {
        setDisplayText((prev) => {
          const next = prev.slice(0, -1);
          if (next === "") {
            setPhase("next-pause");
          }
          return next;
        });
        timeoutRef.current = setTimeout(tick, deleteSpeed);
      } else if (phase === "next-pause") {
        timeoutRef.current = setTimeout(() => {
          if (loop || wordIndex < words.length - 1) {
            setWordIndex((i) => (i + 1) % words.length);
            setPhase("typing");
          }
        }, pauseBeforeNext);
      }
    };

    timeoutRef.current = setTimeout(tick, phase === "typing" ? typeSpeed : 0);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [
    phase,
    wordIndex,
    words,
    typeSpeed,
    deleteSpeed,
    pauseOnComplete,
    pauseBeforeNext,
    loop,
    prefersReducedMotion,
  ]);

  return {
    displayText,
    isTyping: phase === "typing",
    wordIndex: wordIndex % words.length,
  };
}
