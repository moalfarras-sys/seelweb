"use client";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
};

export default function ScrollReveal({ children, delay = 0, className = "" } : ScrollRevealProps) {
  return (
    <div
      className={className}
      style={{
        animation: `hero-rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s both`,
      }}
    >
      {children}
    </div>
  );
}
