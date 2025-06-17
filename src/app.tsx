import { request as RequestConfig } from './api';
import { history } from '@umijs/max';
import { useUserStore } from './stores/userStore';
import {
    isPublicRoute,
    isGuestOnlyRoute,
    isAuthRequiredRoute,
    isAdminRoute
} from './constants/routes';

export const request = RequestConfig;

/**
 * 路由变化时的处理函数
 * @param location 路由信息
 */
export function onRouteChange({ location }: { location: { pathname: string } }) {
    const { pathname } = location;

    // 获取用户状态
    const { isLoggedIn, currentUser, isInitialized } = useUserStore.getState();

    // 等待用户状态初始化完成
    if (!isInitialized) {
        return;
    }

    // 处理公开页面 - 可直接访问
    if (isPublicRoute(pathname)) {
        return;
    }

    // 仅游客可访问的页面 - 已登录用户重定向到首页
    if (isGuestOnlyRoute(pathname) && isLoggedIn) {
        history.push('/');
        return;
    }

    // 需要登录的页面 - 未登录用户重定向到登录页
    if ((isAuthRequiredRoute(pathname) || isAdminRoute(pathname)) && !isLoggedIn) {
        history.push('/login?redirect=' + encodeURIComponent(pathname));
        return;
    }

    // 管理员页面 - 非管理员用户重定向到403页面
    if (isAdminRoute(pathname) && (currentUser?.role !== 'admin')) {
        history.push('/403');
        return;
    }
};


// 在 src/app.tsx 文件中
export function render(oldRender: () => void) {
    // 创建 CSP meta 标签
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    // 修改 CSP 策略，添加 ws: 和 wss: 协议
    meta.content = "default-src 'self' http: https: ws: wss: data: blob: 'unsafe-inline'";
    // 添加到文档头部
    document.head.appendChild(meta);

    // 继续原始渲染
    oldRender();
}
