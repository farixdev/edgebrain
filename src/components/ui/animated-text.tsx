"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";

interface AnimatedTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  yellowWord?: string;
}

export function AnimatedText({
  text,
  className,
  as: Tag = "h1",
  delay = 0,
  yellowWord,
}: AnimatedTextProps) {
  const shouldReduceMotion = useReducedMotion();

  const words = text.split(" ");

  if (shouldReduceMotion) {
    return (
      <Tag className={className}>
        {words.map((word, i) => (
          <span key={i}>
            {yellowWord && word.toLowerCase() === yellowWord.toLowerCase() ? (
              <span className="text-[var(--color-yellow)]">{word}</span>
            ) : (
              word
            )}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: "100%", opacity: 0 }}
            whileInView={{ y: "0%", opacity: 1 }}
            viewport={viewportOnce}
            transition={{
              duration: DURATION.slow,
              ease: EASE.standard,
              delay: delay + i * 0.05,
            }}
          >
            {yellowWord && word.toLowerCase() === yellowWord.toLowerCase() ? (
              <span className="text-[var(--color-yellow)]">{word}</span>
            ) : (
              word
            )}
          </motion.span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
