'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CursorGlow() {
  const [isTouch, setIsTouch] = useState(false);
  const [isReduced, setIsReduced] = useState(false);
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);

  const springX = useSpring(cursorX, { stiffness: 300, damping: 28 });
  const springY = useSpring(cursorY, { stiffness: 300, damping: 28 });

  useEffect(() => {
    const touchQuery = window.matchMedia('(pointer: coarse)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsTouch(touchQuery.matches);
    setIsReduced(motionQuery.matches);

    function onMove(e: MouseEvent) {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    }

    if (!touchQuery.matches && !motionQuery.matches) {
      window.addEventListener('mousemove', onMove);
    }

    return () => window.removeEventListener('mousemove', onMove);
  }, [cursorX, cursorY]);

  if (isTouch || isReduced) return null;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-50"
      style={{
        background: `radial-gradient(circle 220px at ${springX.get()}px ${springY.get()}px, rgba(245, 158, 11, 0.06), transparent 70%)`,
      }}
      aria-hidden="true"
    >
      <motion.div
        className="pointer-events-none fixed w-[440px] h-[440px] rounded-full"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.07) 0%, transparent 70%)',
        }}
      />
    </motion.div>
  );
}
