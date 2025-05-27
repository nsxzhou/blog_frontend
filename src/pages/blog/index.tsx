import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BlogHeader,
  BlogSearch,
  BlogFilters,
  BlogList,
  type BlogPost
} from './components';
import { containerVariants, itemVariants } from '@/constants/animations';

const BlogPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');
  const [sortBy, setSortBy] = useState('date');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 模拟博客数据
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "深入理解React 18的并发特性",
      excerpt: "探索React 18引入的并发渲染、Suspense边界和自动批处理等革命性特性，以及它们如何改变我们构建用户界面的方式。",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop",
      date: "2024-01-15",
      views: 1234,
      likes: 89,
      comments: 23,
      tags: ["React", "JavaScript", "前端"],
      category: "前端开发",
      author: { name: "张三", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
      featured: true
    },
    {
      id: 2,
      title: "现代CSS布局技术详解",
      excerpt: "从Flexbox到Grid，全面了解现代CSS布局技术的最佳实践和使用场景。",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
      date: "2024-01-12",
      views: 2156,
      likes: 143,
      comments: 31,
      tags: ["CSS", "布局", "设计"],
      category: "前端开发",
      author: { name: "李四", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" }
    },
    {
      id: 3,
      title: "TypeScript 5.0新特性解析",
      excerpt: "TypeScript 5.0带来了哪些激动人心的新特性？深入了解最新的开发体验。",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop",
      date: "2024-01-10",
      views: 1876,
      likes: 156,
      comments: 45,
      tags: ["TypeScript", "JavaScript", "开发工具"],
      category: "编程语言",
      author: { name: "王五", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" }
    },
    {
      id: 4,
      title: "微前端架构实战指南",
      excerpt: "如何在大型项目中实施微前端架构，解决团队协作和技术栈统一的难题。",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop",
      date: "2024-01-08",
      views: 987,
      likes: 67,
      comments: 19,
      tags: ["微前端", "架构", "工程化"],
      category: "系统架构",
      author: { name: "赵六", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" }
    },
    {
      id: 5,
      title: "Node.js性能优化最佳实践",
      excerpt: "从内存管理到异步编程，全面提升Node.js应用的性能表现。",
      image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&h=400&fit=crop",
      date: "2024-01-05",
      views: 1543,
      likes: 102,
      comments: 28,
      tags: ["Node.js", "性能优化", "后端"],
      category: "后端开发",
      author: { name: "孙七", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" }
    },
    {
      id: 6,
      title: "Web3开发入门指南",
      excerpt: "从智能合约到DApp开发，带你走进Web3的神奇世界。",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop",
      date: "2024-01-03",
      views: 2234,
      likes: 189,
      comments: 52,
      tags: ["Web3", "区块链", "智能合约"],
      category: "新兴技术",
      author: { name: "周八", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
      featured: true
    }
  ];

  const categories = ['全部', '前端开发', '后端开发', '编程语言', '系统架构', '新兴技术'];
  const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags)));

  // 过滤和排序逻辑
  const filteredPosts = useMemo(() => {
    let filtered = blogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === '全部' || post.category === activeCategory;
      const matchesTags = selectedTags.length === 0 ||
        selectedTags.some(tag => post.tags.includes(tag));

      return matchesSearch && matchesCategory && matchesTags;
    });

    // 排序逻辑
    switch (sortBy) {
      case 'date':
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'views':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'likes':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      default:
        break;
    }

    return filtered;
  }, [searchTerm, activeCategory, selectedTags, sortBy]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filterKey = `${activeCategory}-${searchTerm}-${selectedTags.join(',')}-${sortBy}`;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50"
    >
      {/* 头部区域 */}
      <BlogHeader blogPosts={blogPosts} />

      {/* 搜索和过滤区域 */}
      <motion.section variants={itemVariants} className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* 搜索栏 */}
          <BlogSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {/* 过滤器 */}
          <BlogFilters
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            allTags={allTags}
            selectedTags={selectedTags}
            onTagToggle={toggleTag}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>
      </motion.section>

      {/* 文章列表区域 */}
      <motion.section variants={itemVariants} className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <BlogList
            filteredPosts={filteredPosts}
            key={filterKey}
            onTagClick={toggleTag}
            filterKey={filterKey}
          />
        </div>
      </motion.section>
    </motion.div>
  );
};

export default BlogPage;
