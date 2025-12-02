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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;