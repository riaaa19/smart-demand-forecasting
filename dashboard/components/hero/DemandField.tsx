'use client';

import { useEffect, useRef } from 'react';

export default function DemandField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    // Data points representing demand signals
    const points: { x: number; y: number; vx: number; vy: number; size: number; value: number }[] = [];
    for (let i = 0; i < 60; i++) {
      points.push({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.0004,
        vy: (Math.random() - 0.5) * 0.0003,
        size: Math.random() * 2 + 1,
        value: Math.floor(Math.random() * 300000 + 5000),
      });
    }

    function resize() {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx!.scale(dpr, dpr);
    }

    function draw() {
      if (!canvas || !ctx) return;
      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;
      time += 0.008;

      ctx.clearRect(0, 0, w, h);

      // Draw subtle grid
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.03)';
      ctx.lineWidth = 0.5;
      const gridSize = 60;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw flowing demand curves
      for (let c = 0; c < 3; c++) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(245, 158, 11, ${0.08 - c * 0.02})`;
        ctx.lineWidth = 1.5;
        for (let x = 0; x <= w; x += 3) {
          const nx = x / w;
          const y = h * 0.3 + Math.sin(nx * 6 + time + c * 1.5) * h * 0.12
            + Math.sin(nx * 2.5 + time * 0.7 + c) * h * 0.08
            + c * h * 0.15;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Draw and update data points
      for (const p of points) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;
        p.x = Math.max(0, Math.min(1, p.x));
        p.y = Math.max(0, Math.min(1, p.y));

        const px = p.x * w;
        const py = p.y * h;

        // Point glow
        const grad = ctx.createRadialGradient(px, py, 0, px, py, p.size * 6);
        grad.addColorStop(0, 'rgba(245, 158, 11, 0.3)');
        grad.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, p.size * 6, 0, Math.PI * 2);
        ctx.fill();

        // Point core
        ctx.fillStyle = 'rgba(245, 158, 11, 0.6)';
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw connections between nearby points
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.04)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = (points[i].x - points[j].x) * w;
          const dy = (points[i].y - points[j].y) * h;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.globalAlpha = 1 - dist / 120;
            ctx.beginPath();
            ctx.moveTo(points[i].x * w, points[i].y * h);
            ctx.lineTo(points[j].x * w, points[j].y * h);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      // Floating numbers
      const nums = [
        { x: 0.15, y: 0.2, val: '2,38,355' },
        { x: 0.75, y: 0.35, val: '1,80,319' },
        { x: 0.45, y: 0.7, val: '1,19,722' },
        { x: 0.85, y: 0.15, val: '63,751' },
        { x: 0.25, y: 0.85, val: '44,098' },
      ];
      for (const n of nums) {
        const floatY = Math.sin(time * 0.5 + n.x * 10) * 8;
        ctx.fillStyle = `rgba(245, 158, 11, ${0.12 + Math.sin(time + n.x * 5) * 0.04})`;
        ctx.font = '11px Inter, system-ui, sans-serif';
        ctx.fillText(n.val, n.x * w, n.y * h + floatY);
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      role="img"
      aria-label="Animated demand forecasting visualization with flowing data points and forecast signals"
    />
  );
}
