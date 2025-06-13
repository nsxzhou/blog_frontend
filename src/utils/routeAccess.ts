// 路由权限映射配置
export const routeAccessMap: Record<string, string> = {
  '/profile': 'canAccess',
  '/notifications': 'canAccess',
  '/favorites': 'canAccess',
  '/reading-history': 'canAccess',
  '/write': 'isAdmin',
  '/my-articles': 'isAdmin',
  '/categories': 'isAdmin',
  '/tags': 'isAdmin',
  '/images': 'isAdmin',
  '/comments': 'isAdmin',
  '/users': 'isAdmin',
  '/articles': 'isAdmin',
  '/login': 'shouldNotAccess',
};

// 检查路由是否需要权限
export const getRouteAccess = (pathname: string): string | undefined => {
  return routeAccessMap[pathname];
};
