import type { ArticleListItem } from '@/api/article';
import {
  itemVariants,
  slideInLeft,
  slideInRight,
} from '@/constants/animations';
import { Card } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import type {
  BatchAction,
  FilterType,
  ManageComment,
  SortType,
  ViewMode,
} from '../types';
import DataTable from './DataTable';
import PageHeader from './PageHeader';
import SearchAndFilters from './SearchAndFilters';
import StatsOverview from './StatsOverview';

interface CommentsManageViewProps {
  // 基础状态
  viewMode: ViewMode;
  selectedArticle: ArticleListItem | null;

  // 搜索和过滤
  searchTerm: string;
  filterType: FilterType;
  sortType: SortType;
  selectedCommentIds: number[];

  // 分页
  currentPage: number;
  pageSize: number;

  // 数据
  articles: ArticleListItem[];
  comments: ManageComment[];
  articleStats: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    likes: number;
  };
  commentStats: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    likes: number;
  };

  // 加载状态
  loading: boolean;

  // 操作方法
  setSearchTerm: (term: string) => void;
  setFilterType: (type: FilterType) => void;
  setSortType: (type: SortType) => void;
  setCurrentPage: (page: number) => void;

  handleSelectArticle: (article: ArticleListItem) => void;
  handleBackToArticles: () => void;
  handleSelectComment: (id: number, selected: boolean) => void;
  handleSelectAll: (selected: boolean) => void;
  handleApprove: (id: number) => Promise<void>;
  handleReject: (id: number) => Promise<void>;
  handleDelete: (id: number) => Promise<void>;
  handleBatchAction: (action: BatchAction) => Promise<void>;

  // 数据总数
  total: number;
}

/**
 * 评论管理主视图组件
 * 整合了页面头部、统计信息、搜索过滤和数据表格
 */
const CommentsManageView: React.FC<CommentsManageViewProps> = ({
  viewMode,
  selectedArticle,
  searchTerm,
  filterType,
  sortType,
  selectedCommentIds,
  currentPage,
  pageSize,
  articles,
  comments,
  articleStats,
  commentStats,
  loading,
  total,
  setSearchTerm,
  setFilterType,
  setSortType,
  setCurrentPage,
  handleSelectArticle,
  handleBackToArticles,
  handleSelectComment,
  handleSelectAll,
  handleApprove,
  handleReject,
  handleDelete,
  handleBatchAction,
}) => {
  return (
    <>
      {/* 页面标题和导航 */}
      <PageHeader
        viewMode={viewMode}
        selectedArticle={selectedArticle}
        onBackToArticles={handleBackToArticles}
      />

      {/* 统计信息 */}
      <AnimatePresence>
        <StatsOverview
          viewMode={viewMode}
          selectedArticle={selectedArticle}
          articleStats={articleStats}
          commentStats={commentStats}
          articleCount={articles.length}
          loading={loading}
        />
      </AnimatePresence>

      {/* 搜索和过滤栏 */}
      <motion.div variants={itemVariants} className="mb-6">
        <SearchAndFilters
          viewMode={viewMode}
          searchTerm={searchTerm}
          filterType={filterType}
          sortType={sortType}
          selectedCommentIds={selectedCommentIds}
          onSearchChange={setSearchTerm}
          onFilterChange={setFilterType}
          onSortChange={setSortType}
          onBatchAction={handleBatchAction}
        />
      </motion.div>

      {/* 主要数据表格 */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm">
          <AnimatePresence mode="wait">
            {viewMode === 'articles' ? (
              <motion.div key="articles-table" {...slideInLeft}>
                <DataTable
                  type="articles"
                  data={articles}
                  loading={loading}
                  currentPage={currentPage}
                  pageSize={pageSize}
                  total={total}
                  onSelectArticle={handleSelectArticle}
                  onPageChange={setCurrentPage}
                />
              </motion.div>
            ) : (
              <motion.div key="comments-table" {...slideInRight}>
                <DataTable
                  type="comments"
                  data={comments}
                  loading={loading}
                  selectedIds={selectedCommentIds}
                  currentPage={currentPage}
                  pageSize={pageSize}
                  total={total}
                  onSelectComment={handleSelectComment}
                  onSelectAll={handleSelectAll}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onDelete={handleDelete}
                  onPageChange={setCurrentPage}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </>
  );
};

export default CommentsManageView;