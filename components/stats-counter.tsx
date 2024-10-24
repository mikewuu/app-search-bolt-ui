"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CountingNumbers } from "./ui/counting-numbers";

const stats = [
  {
    label: "Apps Indexed",
    value: 12847,
    suffix: "+"
  },
  {
    label: "Searches Performed",
    value: 54321,
    suffix: ""
  }
];

export function StatsCounter() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative">
      <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="text-center p-8 rounded-xl bg-background/50 backdrop-blur-sm border"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-purple-500"
            >
              {isVisible && (
                <CountingNumbers 
                  value={stat.value} 
                  duration={3.5} 
                  suffix={stat.suffix}
                  startFrom={stat.value * 0.9}
                />
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + idx * 0.2 }}
              className="text-muted-foreground"
            >
              {stat.label}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}