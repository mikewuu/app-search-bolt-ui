"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useTransform, useScroll, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export const TracingBeam = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const contentRef = useRef<HTMLDivElement>(null);
  const [svgHeight, setSvgHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setSvgHeight(contentRef.current.offsetHeight);
    }
  }, []);

  const y1 = useSpring(
    useTransform(scrollYProgress, [0, 0.8], [50, svgHeight]),
    {
      stiffness: 500,
      damping: 90,
    }
  );

  return (
    <motion.div
      ref={ref}
      className={cn("relative w-full max-w-4xl mx-auto", className)}
    >
      <div className="absolute -left-4 md:-left-20 top-3">
        <motion.div
          transition={{
            duration: 0.2,
            delay: 0.5,
          }}
          animate={{
            height: svgHeight,
          }}
          className="relative h-full w-[4px]"
        >
          <div className="absolute top-0 right-0 -mr-[2px] h-3 w-3 rounded-full border-2 border-blue-500 bg-background" />
          <motion.div
            style={{ y: y1 }}
            className="absolute top-0 right-0 -mr-[2px] h-3 w-3 rounded-full border-2 border-blue-500 bg-blue-500"
          />
        </motion.div>
      </div>
      
      <div ref={contentRef} className="ml-4 md:ml-20">
        {children}
      </div>
    </motion.div>
  );
};