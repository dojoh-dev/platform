/* @refresh reload */
import { lazy } from 'solid-js';
import { render } from 'solid-js/web';
import { RouteDefinition, Router } from '@solidjs/router';

import 'solid-devtools';

import type { MountableElement } from 'solid-js/web';

import '@repo/shared/stylesheets/reset.css';
import '@repo/shared/stylesheets/default.css';
import '@repo/shared/stylesheets/variables.css';
import '@repo/shared/stylesheets/typo.css';
import '@repo/shared/stylesheets/animations.css';
import './styles.css';

const root = document.getElementById('root') as MountableElement;

if (import.meta.env.DEV && !root) {
  throw new Error('Root element not found.');
}

const routes = [
  {
    path: '/',
    component: lazy(() => import('../pages/login')),
  },
  {
    path: '/-',
    component: lazy(() => import('../pages/-/layout')),
    children: [
      {
        path: '/home',
        component: lazy(() => import('../pages/-/home')),
      },
      {
        path: '/game',
        component: lazy(() => import('../pages/-/game')),
      },
    ],
  },
] satisfies RouteDefinition[];

render(() => <Router>{routes}</Router>, root);
