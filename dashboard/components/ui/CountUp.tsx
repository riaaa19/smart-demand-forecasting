'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, motion } from 'framer-motion';
import { formatIndianNumber } from '@/lib/formatting/indian-number';

interface CountUpProps {
  target: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}

export default function CountUp({
  target,
  duration = 2,
  decimals = 0,
  suffix = '',
  className = '',
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!isInView) return;

    const startTime = performance.now();
    const durationMs = duration * 1000;

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;
      setDisplay(formatIndianNumber(current, decimals));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplay(formatIndianNumber(target, decimals));
      }
    }

    requestAnimationFrame(animate);
  }, [isInView, target, duration, decimals]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.3 }}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {display}{suffix}
    </motion.span>
  );
}
