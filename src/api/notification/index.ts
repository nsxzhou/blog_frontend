import type { baseResponse } from '@/api';
import { request } from '@umijs/max';
import type {
  BatchDeleteNotificationsReq,
  GetNotificationsReq,
  GetNotificationsRes,
  GetUnreadCountRes,
} from './types';

// 获取用户通知列表
export function GetNotifications(params?: GetNotificationsReq) {
  return request<baseResponse<GetNotificationsRes>>('/api/notifications', {
    method: 'GET',
    params,
  });
}

// 获取未读通知数量
export function GetUnreadCount() {
  return request<baseResponse<GetUnreadCountRes>>(
    '/api/notifications/unread-count',
    {
      method: 'GET',
    },
  );
}

// 标记通知为已读
export function MarkNotificationAsRead(id: number) {
  return request<baseResponse<null>>(`/api/notifications/${id}/read`, {
    method: 'PUT',
  });
}

// 标记所有通知为已读
export function MarkAllNotificationsAsRead() {
  return request<baseResponse<null>>('/api/notifications/read-all', {
    method: 'PUT',
  });
}

// 删除通知
export function DeleteNotification(id: number) {
  return request<baseResponse<null>>(`/api/notifications/${id}`, {
    method: 'DELETE',
  });
}

// 批量删除通知
export function BatchDeleteNotifications(data: BatchDeleteNotificationsReq) {
  return request<baseResponse<null>>('/api/notifications/batch-delete', {
    method: 'POST',
    data,
  });
}

// 统一导出通知相关的API和类型
export * from './types';
