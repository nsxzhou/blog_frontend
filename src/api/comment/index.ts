import type { baseResponse } from '@/api';
import { request } from '@umijs/max';
import type {
  BatchUpdateCommentStatusReq,
  CommentListQuery,
  CommentListRes,
  CreateCommentReq,
  CreateCommentRes,
  GetCommentRes,
  LikeCommentReq,
  ReplyCommentReq,
  ReplyCommentRes,
  UpdateCommentReq,
  UpdateCommentRes,
  UpdateCommentStatusReq,
  UpdateCommentStatusRes,
} from './type';

// 创建评论
export function CreateComment(data: CreateCommentReq) {
  return request<baseResponse<CreateCommentRes>>('/api/comments', {
    method: 'POST',
    data,
  });
}

// 回复评论
export function ReplyComment(data: ReplyCommentReq) {
  return request<baseResponse<ReplyCommentRes>>('/api/comments/reply', {
    method: 'POST',
    data,
  });
}

// 更新评论
export function UpdateComment(id: number, data: UpdateCommentReq) {
  return request<baseResponse<UpdateCommentRes>>(`/api/comments/${id}`, {
    method: 'PUT',
    data,
  });
}

// 删除评论
export function DeleteComment(id: number) {
  return request<baseResponse<string>>(`/api/comments/${id}`, {
    method: 'DELETE',
  });
}

// 点赞评论
export function LikeComment(data: LikeCommentReq) {
  return request<baseResponse<string>>('/api/comments/like', {
    method: 'POST',
    data,
  });
}

// 更新评论状态
export function UpdateCommentStatus(id: number, data: UpdateCommentStatusReq) {
  return request<baseResponse<UpdateCommentStatusRes>>(
    `/api/comments/${id}/status`,
    {
      method: 'PUT',
      data,
    },
  );
}

// 批量更新评论状态
export function BatchUpdateCommentStatus(data: BatchUpdateCommentStatusReq) {
  return request<baseResponse<string>>('/api/comments/batch-status', {
    method: 'PUT',
    data,
  });
}

// 获取评论列表
export function GetCommentList(params?: CommentListQuery) {
  return request<baseResponse<CommentListRes>>('/api/comments', {
    method: 'GET',
    params,
  });
}

// 获取评论
export function GetComment(id: number) {
  return request<baseResponse<GetCommentRes>>(`/api/comments/${id}`, {
    method: 'GET',
  });
}

// 统一导出评论相关的API和类型
export * from './type';
