// 评论管理页面相关类型定义

import type { CommentItem } from '@/api/comment';

// 视图模式类型
export type ViewMode = 'articles' | 'comments' ;

// 筛选类型
export type FilterType = '' | 'pending' | 'approved' | 'rejected';

// 排序类型
export type SortType = 'date' | 'likes' | 'article';

// 统计数据类型
export interface CommentStats {
  totalComments: number;
  pendingComments: number;
  approvedComments: number;
  rejectedComments: number;
  totalLikes: number;
}

// 管理页面评论类型
export interface ManageComment extends CommentItem {
  articleTitle: string;
  articleId: number;
  user_name: string;
  user_email: string;
}

// 批量操作类型
export type BatchAction = 'approve' | 'reject' | 'delete';
