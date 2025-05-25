import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@umijs/max';
import { RightOutlined } from '@ant-design/icons';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface PageContainerProps {
  title?: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  children: React.ReactNode;
  action?: React.ReactNode;
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

export const PageContainer: React.FC<PageContainerProps> = ({
  title,
  description,
  breadcrumbs,
  children,
  action,
}) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto"
    >
      {/* 面包屑导航 */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <motion.nav variants={itemVariants} className="mb-4">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            {breadcrumbs.map((item, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <RightOutlined className="mx-2 text-xs text-gray-400" />
                )}
                {item.path ? (
                  <Link
                    to={item.path}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-gray-800">{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </motion.nav>
      )}

      {/* 页面头部 */}
      {(title || description || action) && (
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
              )}
              {description && (
                <p className="text-gray-600 text-lg">{description}</p>
              )}
            </div>
            {action && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {action}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* 页面内容 */}
      <motion.div variants={itemVariants} className="space-y-6">
        {children}
      </motion.div>
    </motion.div>
  );
};

export default PageContainer; 