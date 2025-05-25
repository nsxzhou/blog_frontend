import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

interface DropdownMenuProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

const dropdownVariants = {
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
      duration: 0.2,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: {
      duration: 0.15,
      ease: "easeIn"
    }
  }
};

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  children,
  trigger,
  align = 'right',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const menuWidth = 200; // 菜单宽度
      
      let leftPosition = rect.left + window.scrollX;
      
      if (align === 'right') {
        leftPosition = rect.right + window.scrollX - menuWidth;
      }
      
      // 确保菜单不超出屏幕右边界
      const screenWidth = window.innerWidth;
      if (leftPosition + menuWidth > screenWidth - 10) {
        leftPosition = screenWidth - menuWidth - 10;
      }
      
      // 确保菜单不超出屏幕左边界
      if (leftPosition < 10) {
        leftPosition = 10;
      }
      
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: leftPosition
      });
    }
  }, [isOpen, align]);

  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div ref={triggerRef} onClick={handleTriggerClick} className="cursor-pointer">
        {trigger}
      </div>
      
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                position: 'absolute',
                top: position.top,
                left: position.left,
                zIndex: 1000,
              }}
              className={`bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] ${className}`}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  children,
  onClick,
  className = '',
  icon
}) => {
  return (
    <motion.div
      onClick={onClick}
      className={`px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center space-x-3 transition-colors ${className}`}
      whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
      whileTap={{ scale: 0.98 }}
    >
      {icon && <span className="text-gray-500">{icon}</span>}
      <span>{children}</span>
    </motion.div>
  );
};

export const DropdownMenuSeparator: React.FC = () => {
  return <div className="h-px bg-gray-200 my-1" />;
};

export const DropdownMenuLabel: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>
      {children}
    </div>
  );
}; 