import Vue from 'vue';
import VueRouter from 'vue-router';
import { Message } from 'element-ui';
import { getLoginToken } from 'common/js/util/getToken';

const Homepage = () => import(/* webpackChunkName: "homepage" */ 'pages/homepage/homepage');
const UserLogin = () => import(/* webpackChunkName: "userLogin" */ 'pages/userLogin/userLogin');
const Main = () => import(/* webpackChunkName: "main" */ 'pages/main/main');
const Welcome = () => import(/* webpackChunkName: "welcome" */ '@/welcome/welcome');
const Recommend = () => import(/* webpackChunkName: "recommend" */ '@/recommend/recommend');
const Singer = () => import(/* webpackChunkName: "singer" */ '@/singer/singer');
const Rank = () => import(/* webpackChunkName: "rank" */ '@/rank/rank');
const Search = () => import(/* webpackChunkName: "search" */ '@/search/search');
const toplistDetail = () => import(/* webpackChunkName: "toplistDetail" */ '@/toplist-detail/toplist-detail');
const SingerDetail = () => import(/* webpackChunkName: "singerDetail" */ '@/singer-detail/singer-detail');

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/user-login',
    name: 'UserLogin',
    component: UserLogin
  },
  {
    path: '/home',
    component: Main,
    children: [
      {
        path: '',
        component: Homepage,
        children: [
          {
            path: 'recommend',
            name: 'Recommend',
            component: Recommend,
            meta: {
              requireAuth: true
            }
          },
          {
            path: '/disc/:id',
            component: toplistDetail
          }
        ]
      },
      {
        path: '/rank',
        component: Rank,
        children: [
          {
            path: ':id',
            component: toplistDetail
          }
        ]
      },
      {
        path: '/singer',
        component: Singer,
        children: [
          {
            path: ':id',
            component: SingerDetail
          }
        ]
      },
      {
        path: '/search',
        name: 'search',
        component: Search
      },
      {
        path: '/my-playlist/:id',
        component: toplistDetail
      }
    ]
  },
  {
    path: '/welcome',
    name: 'Welcome',
    component: Welcome
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 登录验证
router.beforeEach((to, from, next) => {
  let isLogin = getLoginToken();
  if (to.matched.some(m => m.meta.requireAuth)) {
    if (isLogin) {
      next()
    } else {
      next({ path: '/user-login' });
      Message({
        type: "error",
        message: "请先登录"
      });
    }
  } else {
    if (to.path === '/user-login') {
      if (isLogin) {
        next({ path: '/home' })
        Message({
          type: "warning",
          message: "当前已有登录账号"
        });
      } else {
        next()
      }
    } else {
      next()
    }
  }
});
export default router
