import type { XRoute } from '@repo/router';

export default [
  {
    path: '/',
    component: () => import('@domains/home/layout.page'),
    children: [
      {
        path: '/challenges/:id',
        component: () => import('@domains/challenge/index.page'),
      },
    ],
  },
] as XRoute[];
