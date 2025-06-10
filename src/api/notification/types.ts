// 通知发送者信息
export interface NotificationSender {
  id: number;
  username: string;
  nickname: string;
  avatar: string;
}

// 通知关联文章信息
export interface NotificationArticle {
  id: number;
  title: string;
  slug: string;
}

// 通知项
export interface NotificationItem {
  id: number;
  type: string;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  sender: NotificationSender;
  article: NotificationArticle;
}

// 获取通知列表请求参数
export interface GetNotificationsReq {
  page?: number;
  page_size?: number;
  type?: string;
  is_read?: boolean;
}

// 获取通知列表响应数据
export interface GetNotificationsRes {
  total: number;
  unread_count: number;
  list: NotificationItem[];
}

// 获取未读通知数量响应数据
export interface GetUnreadCountRes {
  count: number;
}

// 批量删除通知请求参数
export interface BatchDeleteNotificationsReq {
  notification_ids: number[];
}
