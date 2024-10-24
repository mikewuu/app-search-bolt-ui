"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const SparklesCore = ({
  background,
  minSize,
  maxSize,
  particleDensity,
  particleColor,
  className,
}: {
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  particleColor?: string;
  className?: string;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [particles, setParticles] = useState<Array<Particle>>([]);
  const density = particleDensity || 50;
  const particleClass = useRef<Particle>();

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      setContext(ctx);
    }

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.size = Math.random() * (maxSize || 3 - minSize || 1) + (minSize || 1);
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > window.innerWidth) this.x = 0;
        if (this.x < 0) this.x = window.innerWidth;
        if (this.y > window.innerHeight) this.y = 0;
        if (this.y < 0) this.y = window.innerHeight;
      }
      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = particleColor || "#ffffff";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
    }

    particleClass.current = Particle;
  }, [maxSize, minSize, particleColor]);

  useEffect(() => {
    if (particleClass.current) {
      const particlesArray = [];
      for (let i = 0; i < density; i++) {
        particlesArray.push(new particleClass.current());
      }
      setParticles(particlesArray);
    }
  }, [density]);

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      if (context && canvasRef.current) {
        context.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        particles.forEach((particle: any) => {
          particle.update();
          particle.draw(context);
        });
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    if (context) animate();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [context, particles]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        background: background || "transparent",
      }}
      className={cn("absolute inset-0", className)}
    />
  );
};