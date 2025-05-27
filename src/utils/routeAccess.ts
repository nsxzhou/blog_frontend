// 路由权限映射配置
export const routeAccessMap: Record<string, string> = {
  '/write': 'canAccess',
  '/profile': 'canAccess',
  '/my-articles': 'canAccess',
};

// 检查路由是否需要权限
export const getRouteAccess = (pathname: string): string | undefined => {
  return routeAccessMap[pathname];
};
