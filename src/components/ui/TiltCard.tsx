"use client";

import { useRef, useCallback } from "react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
};

export default function TiltCard({ children, className = "", intensity = 6 } : TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) scale(1.01)`;
  }, [intensity]);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (card) card.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)";
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-300 will-change-transform ${className}`} style={{ transformStyle : "preserve-3d" }}
    >
      {children}
    </div>
  );
}
