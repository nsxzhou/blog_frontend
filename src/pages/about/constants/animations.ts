// 通用动画变体
export const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export const cardHoverVariants = {
  whileHover: { 
    y: -5, 
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
};

export const iconHoverVariants = {
  whileHover: { 
    scale: 1.1, 
    y: -2,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  whileTap: { scale: 0.95 }
};

export const floatingAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}; 