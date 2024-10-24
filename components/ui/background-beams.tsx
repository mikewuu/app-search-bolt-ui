"use client";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  const beamsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!beamsRef.current) return;

    const moveBeams = (e: MouseEvent) => {
      if (!beamsRef.current) return;
      
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth) * 100;
      const y = (clientY / window.innerHeight) * 100;
      
      beamsRef.current.style.setProperty("--x", `${x}%`);
      beamsRef.current.style.setProperty("--y", `${y}%`);
    };

    window.addEventListener("mousemove", moveBeams);
    return () => window.removeEventListener("mousemove", moveBeams);
  }, []);

  return (
    <div
      ref={beamsRef}
      className={cn(
        "absolute inset-0 opacity-30 [--x:50%] [--y:50%]",
        className
      )}
    >
      <div className="absolute h-full w-full bg-gradient-radial from-blue-500/30 via-transparent to-transparent blur-2xl transform scale-150" />
      <div className="absolute h-full w-full bg-gradient-radial from-violet-500/30 via-transparent to-transparent blur-2xl transform scale-150 translate-x-1/4" />
    </div>
  );
};