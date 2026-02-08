import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import GameDetail from '../views/GameDetail.vue';
import SearchResults from '../views/SearchResults.vue';
import Category from '../views/Category.vue';
import Latest from '../views/Latest.vue';
import Popular from '../views/Popular.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/game/:id',
    name: 'GameDetail',
    component: GameDetail,
    props: true
  },
  {
    path: '/search',
    name: 'SearchResults',
    component: SearchResults,
    props: (route) => ({ query: route.query.q })
  },
  {
    path: '/category',
    name: 'Category',
    component: Category
  },
  {
    path: '/latest',
    name: 'Latest',
    component: Home // 暂时使用Home组件，后续可以创建专门的Latest组件
  },
  {
    path: '/popular',
    name: 'Popular',
    component: Home // 暂时使用Home组件，后续可以创建专门的Popular组件
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('../views/admin/Dashboard.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    },
    children: [
      {
        path: 'games',
        name: 'AdminGames',
        component: () => import('../views/admin/Games.vue'),
        meta: {
          requiresAuth: true,
          requiresAdmin: true
        }
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('../views/admin/Users.vue'),
        meta: {
          requiresAuth: true,
          requiresAdmin: true
        }
      },
      {
        path: 'change-password',
        name: 'AdminChangePassword',
        component: () => import('../views/admin/ChangePassword.vue'),
        meta: {
          requiresAuth: true,
          requiresAdmin: true
        }
      }
    ]
  },
  {
    // 404路由
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 全局导航守卫
router.beforeEach((to, from, next) => {
  // 检查路由是否需要认证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const token = localStorage.getItem('token');
    if (!token) {
      // 没有token，重定向到404页面
      console.log('重定向原因：访问需要认证的路由但没有token，重定向到404页面');
      next({ name: 'NotFound' });
    } else {
      // 有token，检查是否是管理员路由
      if (to.matched.some(record => record.meta.requiresAdmin)) {
        // 这里可以添加管理员权限检查逻辑
        // 暂时直接通过，因为Dashboard组件中已经有管理员检查
        next();
      } else {
        next();
      }
    }
  } else {
    next();
  }
});

export default router;