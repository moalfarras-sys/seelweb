"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroVideo() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
      {/* Real hero background image */}
      <Image
        src="/images/moving-truck-hero.png"
        alt="Seel Transport Hero"
        fill
        className="object-cover object-center"
        priority
      />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/70 via-navy-950/50 to-navy-950/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950/70 via-navy-900/30 to-transparent" />

      {/* Animated teal glow orb */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.22, 0.12] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
        className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-[120px] pointer-events-none"
      />

      {/* Blue accent glow */}
      <motion.div
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.08, 0.16, 0.08] }}
        transition={{ repeat: Infinity, duration: 9, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/15 rounded-full blur-[100px] pointer-events-none"
      />

      {/* Light streak 1 */}
      <motion.div
        animate={{ x: ["-120%", "220%"], opacity: [0, 0.4, 0] }}
        transition={{ repeat: Infinity, duration: 9, ease: "linear", delay: 0 }}
        className="absolute top-[30%] -left-1/4 w-[200%] h-[1px] bg-gradient-to-r from-transparent via-teal-400/60 to-transparent blur-[1px] -rotate-6 pointer-events-none"
      />

      {/* Light streak 2 */}
      <motion.div
        animate={{ x: ["-120%", "220%"], opacity: [0, 0.25, 0] }}
        transition={{ repeat: Infinity, duration: 13, ease: "linear", delay: 4 }}
        className="absolute top-[65%] -left-1/4 w-[200%] h-[2px] bg-gradient-to-r from-transparent via-blue-400/40 to-transparent blur-[2px] -rotate-3 pointer-events-none"
      />

      {/* Glass shimmer top */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-navy-950/60 to-transparent" />
    </div>
  );
}
