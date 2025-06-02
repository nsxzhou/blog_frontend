import { hoverScale, itemVariants, pageContainerVariants } from '@/constants';
import { RightOutlined } from '@ant-design/icons';
import { Link } from '@umijs/max';
import { motion } from 'framer-motion';
import React from 'react';

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
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  title,
  description,
  breadcrumbs = [],
  children,
  action,
  className = '',
}) => {
  return (
    <motion.div
      variants={pageContainerVariants}
      initial="hidden"
      animate="visible"
      className={`min-h-screen bg-gray-50 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 面包屑导航 */}
        {breadcrumbs.length > 0 && (
          <motion.nav variants={itemVariants} className="mb-4">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && (
                    <RightOutlined className="mx-2 text-gray-400" />
                  )}
                  {crumb.path ? (
                    <Link
                      to={crumb.path}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-gray-800">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </motion.nav>
        )}

        {/* 页面头部 */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
              {description && (
                <p className="text-lg text-gray-600">{description}</p>
              )}
            </div>
            {action && (
              <motion.div {...hoverScale} className="mt-4 sm:mt-0">
                {action}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* 页面内容 */}
        <motion.div variants={itemVariants} className="space-y-6">
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PageContainer;
