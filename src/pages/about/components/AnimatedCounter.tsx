import React, { useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ 
  value, 
  duration = 2 
}) => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { 
    damping: 30, 
    stiffness: 100,
    duration: duration * 1000
  });
  const displayValue = useTransform(springValue, latest => Math.round(latest));

  const startAnimation = useCallback(() => {
    if (!hasAnimated) {
      motionValue.set(value);
      setHasAnimated(true);
    }
  }, [hasAnimated, motionValue, value]);

  useEffect(() => {
    const timer = setTimeout(startAnimation, 100);
    return () => clearTimeout(timer);
  }, [startAnimation]);

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      aria-live="polite"
    >
      <motion.span>{displayValue}</motion.span>
    </motion.span>
  );
};

export default AnimatedCounter; 