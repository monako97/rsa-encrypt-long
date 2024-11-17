import { lazy } from 'solid-js';
import type { RouteConfig } from '@app/routes';

const router: RouteConfig[] = [
  {
    path: '/',
    component: lazy(() => import(/* webpackChunkName: "layout" */ '@/layout')),
  },
];

export default router;
