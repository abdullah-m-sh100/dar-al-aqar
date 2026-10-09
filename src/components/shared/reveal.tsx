"use client";

import { motion, type HTMLMotionProps } from "motion/react";

type RevealProps = HTMLMotionProps<"div"> & {
  /** Render as a list item when used inside <ul>/<ol>. */
  as?: "div" | "li";
  delay?: number;
  /** Vertical travel in px. */
  offset?: number;
};

/**
 * Subtle fade-and-rise when content scrolls into view. Honors
 * `prefers-reduced-motion` through the global <MotionConfig>.
 */
export function Reveal({ as = "div", delay = 0, offset = 24, children, ...props }: RevealProps) {
  const Component = (as === "li" ? motion.li : motion.div) as typeof motion.div;
  return (
    <Component
      initial={{ opacity: 0, y: offset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      {...props}
    >
      {children}
    </Component>
  );
}
