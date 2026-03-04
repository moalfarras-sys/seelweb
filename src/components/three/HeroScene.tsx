"use client";

import { useRef, useEffect, useCallback } from "react";

export default function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const animId = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const t = Date.now() * 0.001;
    const mx = mouse.current.x;
    const my = mouse.current.y;

    ctx.clearRect(0, 0, W, H);

    // Glass panels
    const panels = [
      { x: W * 0.15, y: H * 0.3, w: 220, h: 160, speed: 0.3, phase: 0 },
      { x: W * 0.7, y: H * 0.25, w: 180, h: 130, speed: 0.25, phase: 2 },
      { x: W * 0.4, y: H * 0.65, w: 200, h: 140, speed: 0.35, phase: 4 },
      { x: W * 0.85, y: H * 0.6, w: 160, h: 120, speed: 0.2, phase: 1 },
      { x: W * 0.3, y: H * 0.1, w: 240, h: 100, speed: 0.15, phase: 3 },
    ];

    for (const p of panels) {
      const offsetX = Math.sin(t * p.speed + p.phase) * 15 + (mx - 0.5) * 30;
      const offsetY = Math.cos(t * p.speed * 0.7 + p.phase) * 10 + (my - 0.5) * 20;
      const px = p.x + offsetX;
      const py = p.y + offsetY;
      const angle = Math.sin(t * p.speed * 0.5 + p.phase) * 0.05;

      ctx.save();
      ctx.translate(px + p.w / 2, py + p.h / 2);
      ctx.rotate(angle);
      ctx.fillStyle = "rgba(13, 158, 160, 0.06)";
      ctx.strokeStyle = "rgba(13, 158, 160, 0.12)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(-p.w / 2, -p.h / 2, p.w, p.h, 12);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // Route lines
    const routes = [
      { points: [0.05, 0.6, 0.25, 0.35, 0.5, 0.55, 0.75, 0.3, 0.95, 0.5], color: "rgba(38, 191, 194, 0.3)" },
      { points: [0.1, 0.3, 0.3, 0.7, 0.55, 0.25, 0.8, 0.65, 0.95, 0.35], color: "rgba(77, 202, 205, 0.25)" },
    ];

    for (const route of routes) {
      const pts = route.points;
      const dashOffset = t * 30;

      ctx.save();
      ctx.strokeStyle = route.color;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([12, 6]);
      ctx.lineDashOffset = -dashOffset;
      ctx.beginPath();
      ctx.moveTo(pts[0] * W, pts[1] * H);
      for (let i = 2; i < pts.length; i += 2) {
        const cpx = ((pts[i - 2] + pts[i]) / 2) * W;
        const cpy = ((pts[i - 1] + pts[i + 1]) / 2) * H + Math.sin(t + i) * 15;
        ctx.quadraticCurveTo(cpx, cpy, pts[i] * W, pts[i + 1] * H);
      }
      ctx.stroke();
      ctx.restore();
    }

    // Particles
    for (let i = 0; i < 40; i++) {
      const seed = i * 137.508;
      const px = ((Math.sin(seed) * 0.5 + 0.5 + Math.sin(t * 0.1 + seed) * 0.05) * W) % W;
      const py = ((Math.cos(seed * 0.7) * 0.5 + 0.5 + Math.cos(t * 0.08 + seed) * 0.04) * H) % H;
      const size = 1.5 + Math.sin(t * 0.5 + seed) * 0.8;
      const alpha = 0.2 + Math.sin(t * 0.3 + seed) * 0.15;

      ctx.fillStyle = `rgba(77, 202, 205, ${alpha})`;
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Light streaks
    for (let i = 0; i < 3; i++) {
      const progress = ((t * 0.15 + i * 0.33) % 1);
      const sx = progress * W * 1.5 - W * 0.25;
      const sy = H * (0.2 + i * 0.25) + Math.sin(t * 0.5 + i) * 30;

      const grad = ctx.createLinearGradient(sx - 100, sy, sx + 100, sy);
      grad.addColorStop(0, "rgba(13, 158, 160, 0)");
      grad.addColorStop(0.5, `rgba(13, 158, 160, ${0.08 - i * 0.02})`);
      grad.addColorStop(1, "rgba(13, 158, 160, 0)");

      ctx.fillStyle = grad;
      ctx.fillRect(sx - 100, sy - 2, 200, 4);
    }

    animId.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
      canvas.style.width = canvas.offsetWidth + "px";
      canvas.style.height = canvas.offsetHeight + "px";
    };

    const handleResize = () => {
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      resize();
    };

    const handleMouse = (e: MouseEvent) => {
      mouse.current.x = e.clientX / window.innerWidth;
      mouse.current.y = e.clientY / window.innerHeight;
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouse, { passive: true });

    animId.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none" style={{ width : "100%", height: "100%" }}
    />
  );
}
