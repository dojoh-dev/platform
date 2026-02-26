import type { XRoute } from '@repo/router';

export default [
  {
    path: '/',
    component: () => import('../domains/home/layout'),
    children: [
      {
        path: '/challenges/:id',
        component: () => import('../domains/challenge/page'),
      },
    ],
  },
] satisfies XRoute[];
