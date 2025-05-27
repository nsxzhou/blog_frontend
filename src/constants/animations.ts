// =============================================
// 统一动画效果库 - Unified Animation Library
// =============================================

// =============================================
// 基础动画变体 - Basic Animation Variants
// =============================================

// 淡入效果组
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

// 滑入效果组
export const slideInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

export const slideInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

// 缩放效果组
export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2, ease: 'easeOut' },
};

export const scaleInLarge = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

// =============================================
// 容器动画变体 - Container Animation Variants
// =============================================

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const containerVariantsMedium = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

export const containerVariantsSlow = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

// 子元素动画变体
export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

export const itemVariantsLarge = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

// =============================================
// 悬停效果 - Hover Effects
// =============================================

export const hoverScale = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.2 },
};

export const hoverScaleSmall = {
  whileHover: { scale: 1.1 },
  whileTap: { scale: 0.9 },
  transition: { duration: 0.2 },
};

export const cardHover = {
  whileHover: {
    y: -4,
    scale: 1.02,
    boxShadow:
      '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transition: { duration: 0.2, ease: 'easeOut' },
  },
};

export const iconHover = {
  whileHover: {
    scale: 1.1,
    y: -2,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  whileTap: { scale: 0.95 },
};

// =============================================
// 侧边栏/模态框动画 - Sidebar/Modal Animations
// =============================================

export const sidebarVariants = {
  hidden: {
    x: '100%',
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.1,
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
};

export const sidebarLeftVariants = {
  hidden: {
    x: '-100%',
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.1,
    },
  },
  exit: {
    x: '-100%',
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
};

export const sidebarItemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
};

export const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const modalVariants = {
  initial: { opacity: 0, scale: 0.95, y: -10 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: -10 },
  transition: { duration: 0.2 },
};

export const dropdownVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.15,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: {
      duration: 0.1,
      ease: 'easeIn',
    },
  },
};

// =============================================
// 页面过渡动画 - Page Transition Animations
// =============================================

export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

export const pageContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// =============================================
// 专用组件动画 - Specialized Component Animations
// =============================================

// 文章相关动画
export const articleCardVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

export const articleHeaderVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

export const contentVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: 'easeOut', delay: 0.2 },
};

// 导航相关动画
export const headerVariants = {
  initial: { y: -80, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
      staggerChildren: 0.1,
    },
  },
};

export const navItemVariants = {
  initial: { opacity: 0, y: -10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
};

// 英雄区域和卡片动画
export const heroVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      staggerChildren: 0.1,
    },
  },
};

export const cardVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  ...cardHover,
};

// 区域动画
export const sectionVariants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      staggerChildren: 0.1,
    },
  },
};

// 空状态动画
export const emptyStateVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

// =============================================
// 交互动画 - Interactive Animations
// =============================================

// 按钮动画
export const filterButtonVariants = {
  initial: { scale: 1 },
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { duration: 0.2 },
};

export const activeButtonVariants = {
  active: {
    scale: 1.05,
    backgroundColor: '#3B82F6',
    color: '#ffffff',
    transition: { duration: 0.2 },
  },
  inactive: {
    scale: 1,
    backgroundColor: '#ffffff',
    color: '#6B7280',
    transition: { duration: 0.2 },
  },
};

// 图片和媒体动画
export const imageVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
};

export const overlayVariants = {
  rest: { opacity: 0 },
  hover: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
};

// 文字动画
export const titleVariants = {
  rest: { color: '#111827' },
  hover: {
    color: '#2563eb',
    transition: { duration: 0.15 },
  },
};

export const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

// =============================================
// 循环动画 - Loop Animations
// =============================================

export const rotateAnimation = {
  animate: {
    rotate: 360,
  },
  transition: {
    duration: 1,
    repeat: Infinity,
    ease: 'linear',
  },
};

export const floatingAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const floatingVariants = {
  animate: {
    y: [0, -15, 0],
    rotate: [0, 5, 0],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const pulseAnimation = {
  animate: {
    scale: [1, 1.05, 1],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

export const breathingAnimation = {
  animate: {
    opacity: [0.5, 1, 0.5],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

// =============================================
// 特殊效果动画 - Special Effect Animations
// =============================================

export const progressBarAnimation = {
  initial: { width: 0 },
  whileHover: { width: '100%' },
  transition: { duration: 0.3 },
};

export const typewriterConfig = {
  duration: 0.1,
  ease: 'linear',
};

export const cardFlip = {
  whileHover: { rotateY: 180 },
  transition: { duration: 0.6, ease: 'easeInOut' },
};

export const springAnimation = {
  transition: {
    type: 'spring',
    stiffness: 400,
    damping: 17,
  },
};

// =============================================
// 快捷动画组合 - Quick Animation Combinations
// =============================================

export const simpleFadeIn = {
  ...fadeIn,
  transition: { duration: 0.2, ease: 'easeOut' },
};

export const quickEntry = {
  ...scaleIn,
  transition: { duration: 0.15, ease: 'easeOut' },
};

export const delayedEntry = {
  ...fadeInUp,
  transition: { duration: 0.4, ease: 'easeOut', delay: 0.2 },
};

export const complexEntry = {
  initial: { opacity: 0, y: 30, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

// =============================================
// 通用悬停效果 - Universal Hover Effects
// =============================================

export const hoverVariants = {
  initial: { scale: 1 },
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.2 },
};

export const hoverSlideX = {
  whileHover: { x: 4 },
  transition: { duration: 0.2 },
};

// =============================================
// 简化的内联动画替代 - Simplified Inline Animation Replacements
// =============================================

// 小幅上移动画
export const smallSlideUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

// 小幅下移动画
export const smallSlideDown = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

// 简单淡入
export const simpleFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3 },
};

// 左侧滑入
export const slideFromLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.4, ease: 'easeOut' },
};

// 右侧滑入
export const slideFromRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.4, ease: 'easeOut' },
};

// 小幅缩放
export const smallScale = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

// 大幅缩放
export const largeScale = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.4, ease: 'easeOut' },
};

// 高度展开动画
export const expandHeight = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: 0.3, ease: 'easeInOut' },
};

// 延迟淡入
export const delayedFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3, delay: 0.2 },
};

// 快速缩放入场
export const fastScale = {
  initial: { scale: 0.5, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
};
