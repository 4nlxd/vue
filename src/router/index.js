import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Layout */
export const constantRouterMap = [{
	path: '/login',
	component: () => import('@/views/login/index'),
	hidden: true
}, ]


export const asyncRouterMap = [
  {
    path: '/stock',
    component: Layout,
    redirect: '/stock/goodsstock',
    name: '库存后台',
    meta: {
      title: '库存后台',
      icon: 'el-icon-s-help',
	  role: [1]
    },
    children: [
      {
        path: 'goodsstock',
        component: () => import('@/views/stock/goodsstock/index'), // Parent router-view
        name: '货品库存',
        meta: { title: '货品库存' },
      },
      {
        path: 'flowofgoods',
        component: () => import('@/views/stock/flowofgoods/index'),
        name: '货品流水',
        meta: { title: '货品流水' }
      },
	  {
	    path: 'ordermanagement',
	    component: () => import('@/views/stock/ordermanagement/index'), // Parent router-view
	    name: '订单管理',
	    meta: { title: '订单管理' },
	  },
    ]
  },
  {
    path: '/shopowner',
    component: Layout,
    redirect: '/shopowner/ordermanagement',
    name: '店长后台',
    meta: {
      title: '店长后台',
      icon: 'el-icon-s-help',
  	  role: [1]
    },
    children: [
		    {
		      path: 'ordermanagement',
		      component: () => import('@/views/shopowner/ordermanagement/index'), // Parent router-view
		      name: '订单管理',
		      meta: { title: '订单管理' },
		    },
		    {
		      path: 'ordergoods',
		      component: () => import('@/views/shopowner/ordergoods/index'), // Parent router-view
		      name: '订货清单',
		      meta: { title: '订货清单' },
		    },
    ]
  },

	// 404 page must be placed at the end !!!
	{
		path: '*',
		redirect: '/404',
		hidden: true
	}
]

const createRouter = () => new Router({
	scrollBehavior: () => ({
		y: 0
	}),
	routes: constantRouterMap
})

const router = createRouter()
export function resetRouter() {
	const newRouter = createRouter()
	router.matcher = newRouter.matcher // reset router
}

export default router
