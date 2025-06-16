/**
 * 路由权限常量定义
 */

// 公开页面路径
export const PUBLIC_ROUTES = [
  '/',
  '/blog',
  '/about',
  '/article-detail', // 以article-detail开头的都是公开页面
  '/403',
];

// 仅未登录用户可访问的页面
export const GUEST_ONLY_ROUTES = ['/login', '/qq/callback'];

// 需要登录的页面
export const AUTH_REQUIRED_ROUTES = [
  '/profile',
  '/notifications',
  '/reading-history',
  '/favorites',
];

// 需要管理员权限的页面
export const ADMIN_ROUTES = [
  '/categories',
  '/tags',
  '/images',
  '/comments',
  '/users',
  '/write',
  '/articles',
  '/my-articles',
];

/**
 * 检查路由是否匹配指定路径列表
 * @param pathname 当前路由路径
 * @param routes 路由路径列表
 * @returns 是否匹配
 */
export const isRouteMatch = (pathname: string, routes: string[]): boolean => {
  return routes.some((route) => {
    // 精确匹配
    if (route === pathname) return true;
    // 前缀匹配 (如 /article-detail/123 匹配 /article-detail)
    if (pathname.startsWith(`${route}/`)) return true;
    return false;
  });
};

/**
 * 检查是否为公开页面
 */
export const isPublicRoute = (pathname: string): boolean => {
  return isRouteMatch(pathname, PUBLIC_ROUTES);
};

/**
 * 检查是否为仅游客可访问页面
 */
export const isGuestOnlyRoute = (pathname: string): boolean => {
  return isRouteMatch(pathname, GUEST_ONLY_ROUTES);
};

/**
 * 检查是否为需要登录的页面
 */
export const isAuthRequiredRoute = (pathname: string): boolean => {
  return isRouteMatch(pathname, AUTH_REQUIRED_ROUTES);
};

/**
 * 检查是否为需要管理员权限的页面
 */
export const isAdminRoute = (pathname: string): boolean => {
  return isRouteMatch(pathname, ADMIN_ROUTES);
};
