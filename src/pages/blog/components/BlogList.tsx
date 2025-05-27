import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BlogCard from './BlogCard';
import EmptyState from './EmptyState';
import { containerVariants } from '@/constants/animations';
import type { BlogPost } from './types';

interface BlogListProps {
  filteredPosts: BlogPost[];
  onTagClick: (tag: string) => void;
  filterKey: string;
}

const BlogList: React.FC<BlogListProps> = ({
  filteredPosts,
  onTagClick,
  filterKey
}) => {
  return (
    <div className="max-w-6xl mx-auto">
      <AnimatePresence mode="wait">
        {filteredPosts.length > 0 ? (
          <motion.div
            key={filterKey}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {filteredPosts.map((post, index) => (
              <BlogCard
                key={post.id}
                post={post}
                index={index}
                onTagClick={onTagClick}
              />
            ))}
          </motion.div>
        ) : (
          <EmptyState />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogList; 