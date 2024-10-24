"use client";
 
import { useEffect, useRef, useState } from "react";
import { useInView, motion } from "framer-motion";
 
export const CountingNumbers = ({
  value,
  duration = 3.5,
  suffix = "",
  startFrom = 0,
}: {
  value: number;
  duration?: number;
  suffix?: string;
  startFrom?: number;
}) => {
  const [count, setCount] = useState(Math.floor(startFrom));
  const ref = useRef(null);
  const isInView = useInView(ref);
  
  useEffect(() => {
    if (isInView) {
      const start = Math.floor(startFrom);
      const end = value;
      const range = end - start;
      const increment = range / (duration * 60); // 60fps
      const stepTime = (duration * 1000) / (range / increment);
      
      let current = start;
      const counter = setInterval(() => {
        current += increment;
        setCount(Math.min(Math.floor(current), end));
        
        if (current >= end) {
          clearInterval(counter);
        }
      }, stepTime);
 
      return () => clearInterval(counter);
    }
  }, [value, duration, isInView, startFrom]);
 
  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};