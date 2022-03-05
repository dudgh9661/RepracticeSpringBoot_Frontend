import Vue from 'vue'
import VueRouter from 'vue-router'
import BoardList from '../components/Board/BoardList.vue'
import BoardUpdate from '../components/Board/BoardUpdate.vue' // 게시물 수정 클릭 시 보여지는 화면
import BoardEnroll from '../components/Board/BoardEnroll.vue' // 게시물 등록 클릭 시 보여지는 화면
import Board from '../components/Board/Board.vue' // 게시물 row 클릭 시 보여지는 화면

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'BoardList',
    component: BoardList // another component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue')
  },
  {
    path: '/update',
    name: 'BoardUpdate',
    component: BoardUpdate
  },
  {
    path: '/enroll',
    name: 'BoardEnroll',
    component: BoardEnroll
  },
  {
    path: '/board/:id',
    name: 'Board',
    component: Board
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
