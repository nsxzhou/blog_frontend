/**
 * 通知工具函数
 */

export interface NotificationPermissionResult {
  granted: boolean;
  denied: boolean;
  default: boolean;
  supported: boolean;
}

/**
 * 检查浏览器通知权限状态
 */
export function checkNotificationPermission(): NotificationPermissionResult {
  const supported = 'Notification' in window;

  if (!supported) {
    return {
      granted: false,
      denied: false,
      default: false,
      supported: false,
    };
  }

  const permission = Notification.permission;

  return {
    granted: permission === 'granted',
    denied: permission === 'denied',
    default: permission === 'default',
    supported: true,
  };
}

/**
 * 请求浏览器通知权限
 */
export async function requestNotificationPermission(): Promise<boolean> {
  const { supported, granted } = checkNotificationPermission();

  if (!supported) {
    console.warn('此浏览器不支持桌面通知');
    return false;
  }

  if (granted) {
    return true;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('请求通知权限失败:', error);
    return false;
  }
}

/**
 * 显示浏览器通知
 */
export function showBrowserNotification(
  title: string,
  options: {
    body?: string;
    icon?: string;
    tag?: string;
    requireInteraction?: boolean;
    silent?: boolean;
    data?: any;
    onClick?: () => void;
    onClose?: () => void;
    onError?: (error: Event) => void;
  } = {},
): Notification | null {
  const { granted } = checkNotificationPermission();

  if (!granted) {
    console.warn('没有通知权限');
    return null;
  }

  try {
    const notification = new Notification(title, {
      body: options.body,
      icon: options.icon || '/favicon.ico',
      tag: options.tag || 'blog-notification',
      requireInteraction: options.requireInteraction ?? false,
      silent: options.silent ?? false,
      data: options.data,
    });

    // 设置事件处理器
    if (options.onClick) {
      notification.onclick = () => {
        options.onClick!();
        notification.close();
      };
    }

    if (options.onClose) {
      notification.onclose = options.onClose;
    }

    if (options.onError) {
      notification.onerror = options.onError;
    }

    // 默认点击行为 - 聚焦窗口
    if (!options.onClick) {
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }

    // 自动关闭通知（5秒后）
    if (!options.requireInteraction) {
      setTimeout(() => {
        notification.close();
      }, 5000);
    }

    return notification;
  } catch (error) {
    console.error('显示通知失败:', error);
    return null;
  }
}

/**
 * 格式化通知时间
 */
export function formatNotificationTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < 60000) {
    return '刚刚';
  } else if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`;
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`;
  } else if (diff < 604800000) {
    return `${Math.floor(diff / 86400000)}天前`;
  } else {
    return date.toLocaleDateString();
  }
}

/**
 * 格式化通知内容
 */
export function formatNotificationContent(notification: any): {
  title: string;
  body: string;
  icon?: string;
} {
  const sender =
    notification.sender?.nickname ||
    notification.sender?.username ||
    '未知用户';
  const article = notification.article?.title || '文章';

  switch (notification.type) {
    case 'article_like':
      return {
        title: '收到新点赞',
        body: `${sender} 点赞了您的文章「${article}」`,
        icon: notification.sender?.avatar,
      };

    case 'article_favorite':
      return {
        title: '收到新收藏',
        body: `${sender} 收藏了您的文章「${article}」`,
        icon: notification.sender?.avatar,
      };

    case 'article_comment':
      return {
        title: '收到新评论',
        body: `${sender} 评论了您的文章「${article}」`,
        icon: notification.sender?.avatar,
      };

    case 'comment_reply':
      return {
        title: '收到新回复',
        body: `${sender} 回复了您的评论`,
        icon: notification.sender?.avatar,
      };

    case 'follow':
      return {
        title: '新的关注',
        body: `${sender} 关注了您`,
        icon: notification.sender?.avatar,
      };

    case 'system':
      return {
        title: '系统通知',
        body: notification.content || '您有新的系统消息',
        icon: '/favicon.ico',
      };

    default:
      return {
        title: '新通知',
        body: notification.content || '您有新的消息',
        icon: notification.sender?.avatar || '/favicon.ico',
      };
  }
}

/**
 * 获取通知类型的显示名称
 */
export function getNotificationTypeName(type: string): string {
  const typeMap: Record<string, string> = {
    article_like: '点赞',
    article_favorite: '收藏',
    article_comment: '评论',
    comment_reply: '回复',
    follow: '关注',
    system: '系统通知',
  };

  return typeMap[type] || '通知';
}

/**
 * 获取通知类型的图标
 */
export function getNotificationTypeIcon(type: string): string {
  const iconMap: Record<string, string> = {
    article_like: '👍',
    article_favorite: '⭐',
    article_comment: '💬',
    comment_reply: '↩️',
    follow: '👤',
    system: '🔔',
  };

  return iconMap[type] || '📨';
}

/**
 * 检测页面可见性
 */
export function isPageVisible(): boolean {
  return document.visibilityState === 'visible';
}

/**
 * 监听页面可见性变化
 */
export function onVisibilityChange(
  callback: (visible: boolean) => void,
): () => void {
  const handleVisibilityChange = () => {
    callback(isPageVisible());
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}

/**
 * 更新页面标题中的未读数量
 */
export function updateDocumentTitle(
  unreadCount: number,
  baseTitle = '博客系统',
): void {
  if (unreadCount > 0) {
    document.title = `(${unreadCount}) ${baseTitle}`;
  } else {
    document.title = baseTitle;
  }
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
