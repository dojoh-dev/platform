import type { XRoute } from '@repo/router';

export default [
	{
		path: '/c',
		component: () => import('../domains/home/layout'),
		children: [
			{
				path: '/c/challenges/:id',
				component: () => import('../domains/challenge/page'),
			},
		],
	},
	{
		path: '/login',
		component: () => import('../domains/auth/page'),
	},
] satisfies XRoute[];
