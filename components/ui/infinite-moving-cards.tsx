"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
}) => {
  const containerRef = useState<HTMLDivElement | null>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    setTimeout(() => setStart(true), 100);
  }, []);

  const speeds = {
    fast: 20,
    normal: 35,
    slow: 50,
  };

  const duration = speeds[speed];

  return (
    <div
      className="relative max-w-7xl overflow-hidden"
      style={{
        maskImage: "linear-gradient(to right, transparent, white 20%, white 80%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, white 20%, white 80%, transparent)",
      }}
    >
      <motion.div
        className="flex gap-4 w-fit"
        animate={start ? { x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] } : {}}
        transition={{
          duration,
          ease: "linear",
          repeat: Infinity,
        }}
        style={{ ...(pauseOnHover && { animationPlayState: "paused" }) }}
      >
        {[...items, ...items].map((item, idx) => (
          <div
            key={idx}
            className="relative group w-[350px] overflow-hidden rounded-xl border border-border bg-background/50 backdrop-blur-sm px-8 py-6"
          >
            <div className="font-semibold text-sm leading-snug tracking-wide">
              "{item.quote}"
            </div>
            <div className="mt-4 flex flex-row justify-between items-center">
              <div>
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-muted-foreground text-sm">{item.title}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};