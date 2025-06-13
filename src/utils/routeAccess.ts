// 路由权限映射配置
export const routeAccessMap: Record<string, string> = {
  '/write': 'isAdmin',
  '/profile': 'canAccess',
  '/notifications': 'canAccess',
  '/favorites': 'canAccess',
  '/reading-history': 'canAccess',
  '/my-articles': 'isAdmin',
  '/categories': 'isAdmin',
  '/tags': 'isAdmin',
  '/images': 'isAdmin',
  '/comments': 'isAdmin',
  '/login': 'shouldNotAccess',
};

// 检查路由是否需要权限
export const getRouteAccess = (pathname: string): string | undefined => {
  return routeAccessMap[pathname];
};
