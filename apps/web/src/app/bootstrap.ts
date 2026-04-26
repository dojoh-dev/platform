import { createRouter, createWebHistory } from '@repo/router';

import middleware from './middleware';
import routes from './routes';

const router = createRouter({
	middleware: [middleware],
	history: createWebHistory(),
	routes,
});

export default function boot() {
	router.start();
}
