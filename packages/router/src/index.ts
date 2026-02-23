import type {
  CookieOptions,
  HistoryMode,
  RouterOptions,
  XMiddleware,
  XRequest,
  XRoute,
} from './types';

export type {
  CookieOptions,
  HistoryMode,
  RouterOptions,
  XMiddleware,
  XRequest,
  XRoute,
  XNext,
} from './types';

let globalRouter: RouterOptions = {
  history: {
    type: 'web',
  },
  routes: [],
  middleware: [],
};

export const createRouter = (options: RouterOptions) => {
  const { history, middleware = [], routes } = options;
  globalRouter = options;

  document.addEventListener('DOMContentLoaded', () => {
    const route = traverseRoutes(location.pathname, routes);
    handleRoute(route, middleware, history);
  });

  return {
    start() {
      window.addEventListener('popstate', () => {
        const route = routes.find((x) => x.path === location.pathname);
        handleRoute(route, middleware, history);
      });
    },
  };
};

const updateContent = (content: string) => {
  document.getElementById('app')!.innerHTML = content;
};

type Path = string;

let history: Path[] = [];

export const replace = (path: Path) => {
  history = [];
  history.push(path);
  window.history.replaceState({}, '', path);
};

export const navigate = (path: Path) => {
  history.push(path);
  window.history.pushState({}, '', path);
};

export const go = (delta: number) => {
  window.history.go(delta);
  history.splice(history.length - 1, 1);
};

const handleRoute = (
  route: XRoute | undefined,
  middleware: XMiddleware[],
  history: HistoryMode = {
    type: 'web',
  } // TODO: Handle different history modes (web, hash)
) => {
  try {
    if (route) {
      handleMiddleware(middleware).then(async () =>
        updateContent(await collectRouteContent(route))
      );
    } else {
      // Handle 404 Not Found if needed
      import('./defaults/404').then((module) => {
        const content = module.default;
        document.getElementById('app')!.innerHTML = content;
      });
    }
  } catch {
    import('./defaults/500').then((module) => {
      const content = module.default;
      document.getElementById('app')!.innerHTML = content;
    });
  }
};

const createRequest = (url: string): XRequest => {
  const request = new Request(url, {
    method: 'GET',
    headers: new Headers(),
  }) as XRequest;
  request.cookies = {
    set(name: string, value: string, options?: CookieOptions) {
      let cookie = `${name}=${value}`;
      if (options?.expires)
        cookie += `; expires=${options.expires.toUTCString()}`;
      if (options?.path) cookie += `; path=${options.path}`;
      if (options?.sameSite) cookie += `; SameSite=${options.sameSite}`;
      if (options?.maxAge) cookie += `; max-age=${options.maxAge}`;
      if (options?.httpOnly) cookie += '; HttpOnly';
      if (options?.secure) cookie += '; Secure';
      if (options?.partitioned) cookie += '; Partitioned';
      document.cookie = cookie;
    },
    get(name: string) {
      const match = document.cookie.match(
        new RegExp('(^| )' + name + '=([^;]+)')
      );
      return match ? match[2] : undefined;
    },
    has(name: string) {
      return document.cookie
        .split(';')
        .some((cookie) => cookie.trim().startsWith(name + '='));
    },
  };

  return request;
};

const handleMiddleware = async (middleware: XMiddleware[]) => {
  const request = createRequest(location.href);

  let index = -1;
  // next
  const dispatch = async (i: number): Promise<void> => {
    if (i <= index) {
      throw new Error('next() called multiple times');
    }

    index = i;
    const fn = middleware[i];

    if (!fn) return;

    await fn(request, () => dispatch(i + 1));
  };

  await dispatch(0);
};

let routeParams: { [key: string]: string } = {};

const matchRoute = (path: Path, routePath: string): boolean => {
  const pathSegments = path.split('/').filter(Boolean);
  const routeSegments = routePath.split('/').filter(Boolean);

  if (pathSegments.length !== routeSegments.length) {
    return false;
  }

  for (let i = 0; i < pathSegments.length; i++) {
    const pathSegment = pathSegments[i];
    const routeSegment = routeSegments[i];

    if (routeSegment.startsWith(':')) {
      const paramName = routeSegment.slice(1);
      routeParams[paramName] = pathSegment;
    } else if (pathSegment !== routeSegment) {
      return false;
    }
  }

  return true;
};

const traverseRoutes = (path: Path, routes: XRoute[]): XRoute | undefined => {
  for (const route of routes) {
    const match = matchRoute(path, route.path);
    if (match) {
      return route;
    }

    routeParams = {};

    if (route.children) {
      const childMatch = traverseRoutes(path, route.children);
      if (childMatch) {
        return childMatch;
      }
    }
  }

  return undefined;
};

const collectRouteContent = async (route: XRoute): Promise<string> => {
  const imports: Array<() => Promise<{ default: () => string }>> = [];
  const routeSegments = route.path.split('/').filter(Boolean);

  let index = -1;
  while (index < routeSegments.length) {
    const currentPath =
      index === -1 ? '/' : '/' + routeSegments.slice(0, index + 1).join('/');

    const matchedRoute = traverseRoutes(currentPath, globalRouter.routes);
    if (matchedRoute) {
      imports.push(matchedRoute.component);
    }
    index++;
  }

  const loadedComponents = await Promise.all(
    imports.map(async (x) => {
      const module = await x();
      return module.default();
    })
  );

  let result = loadedComponents[loadedComponents.length - 1];
  for (let i = loadedComponents.length - 2; i >= 0; i--) {
    const content = loadedComponents[i];
    if (content.includes('<x-outlet></x-outlet>')) {
      result = content.replace('<x-outlet></x-outlet>', result);
    } else {
      result = content;
    }
  }

  return result;
};

export const createWebHistory = (): HistoryMode => {
  return {
    type: 'web',
  };
};
