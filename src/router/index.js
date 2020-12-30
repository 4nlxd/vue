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


export const asyncRouterMap = [{
		path: '/lotteryprediction',
		component: Layout,
		redirect: '/lotteryprediction/singlefield',
		name: '彩票预测',
		meta: {
			title: '彩票预测',
			icon: 'el-icon-s-help',
			role: [3]
		},
		children: [{
				path: 'singlefield',
				name: '单场预测',
				component: () => import('@/views/lotteryprediction/singlefield/index'),
				meta: {
					title: '单场预测',
				}
			},
			{
				path: 'programme',
				name: '方案预测',
				component: () => import('@/views/lotteryprediction/programme/index'),
				meta: {
					title: '方案预测',
				},
				children:[
					{
					path: 'programmedetaile/:id',
					name: '方案预测详情',
					component: () => import('@/views/lotteryprediction/programmedetaile/index'),
					meta: {
						title: '方案预测详情',
					},
					hidden:true,
				}]
			},
			{
				path: 'documentary',
				name: '跟单预购方案',
				component: () => import('@/views/lotteryprediction/documentary/index'),
				meta: {
					title: '跟单预购方案',
				},
				children:[
					{
					path: 'documentarydemo/:id',
					name: '跟单预购方案详情',
					component: () => import('@/views/lotteryprediction/documentarydemo/index'),
					meta: {
						title: '跟单预购方案详情',
					},
					hidden:true,
				}]
			},
		]
	},

	{
		path: '/platform',
		name: 'platform',
		component: Layout,
		meta: {
			title: '平台管理',
			icon: 'el-icon-s-help',
			role: [3]
		},
		children: [{
				path: 'advertisement',
				name: '广告',
				meta: {
					title: '广告',
				},
				component: () => import('@/views/platform/advertisement/home/home'),
				children: [{
						path: '/home',
						name: 'home',
						component: () => import('@/views/platform/advertisement/home/home'),
						meta: {
							title: '首页'
						},
						children: [{
								path: 'homepage',
								name: 'homepage',
								component: () => import('@/views/platform/advertisement/home/homepage/homepage'),
								meta: {
									title: '主页Banner'
								}
							},
							{
								path: 'lottery',
								name: 'lottery',
								component: () => import('@/views/platform/advertisement/home/lottery/lottery'),
								meta: {
									title: '彩票方案'
								}
							},
							{
								path: 'e-sports',
								name: 'e-sports',
								component: () => import('@/views/platform/advertisement/home/e-sports/e-sports'),
								meta: {
									title: '电竞竞猜'
								}
							},
							{
								path: 'game',
								name: 'game',
								component: () => import('@/views/platform/advertisement/home/game/game'),
								meta: {
									title: '游戏'
								}
							},
							{
								path: 'activity',
								name: 'activity',
								component: () => import('@/views/platform/advertisement/home/activity/activity'),
								meta: {
									title: '精彩活动'
								}
							}
						]
					},
					{
						path: 'choiceness',
						component: () => import('@/views/platform/advertisement/choiceness/choiceness'),
						name: 'choiceness',
						meta: {
							title: '精选'
						},
						children: [{
								path: 'choicenessBanner',
								name: 'choicenessBanner',
								component: () => import('@/views/platform/advertisement/choiceness/choicenessBanner/choicenessBanner'),
								meta: {
									title: '精选Banner'
								}
							},
							{
								path: 'choicenessShop',
								name: 'choicenessShop',
								component: () => import('@/views/platform/advertisement/choiceness/choicenessShop/choicenessShop'),
								meta: {
									title: '精选商品'
								}
							},
						]
					},
					{
						path: 'discount',
						component: () => import('@/views/platform/advertisement/discount/discount'),
						name: 'discount',
						meta: {
							title: '领券'
						}
					},
					{
						path: 'mine',
						component: () => import('@/views/platform/advertisement/mine/mine'),
						name: 'mine',
						meta: {
							title: '我的'
						}
					},
				]
			},
			{
				path: 'newsList',
				name: '咨询管理',
				component: () => import('@/views/platform/newsList/newsList'),
				meta: {
					title: '咨询管理',
				}
			},
			{
				path: 'newsCont',
				name: 'newsCont',
				hidden: true,
				component: () => import('@/views/platform/newsCont/newsCont'),
				meta: {
					title: '咨询',
				}
			}
		]
	},
  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/recharge',
    name: '财务管理',
    meta: {
      title: '财务管理',
      icon: 'el-icon-s-help',
	  role: ['1']
    },
    children: [
      {
        path: 'recharge',
        component: () => import('@/views/nested/recharge/index'), // Parent router-view
        name: '充值统计',
        meta: { title: '充值统计' },
      },
      {
        path: 'rechargequery/:dataTime',
        component: () => import('@/views/nested/rechargequery/index'),
        name: '充值查询',
        meta: { title: '充值查询' }
      },
	  {
	    path: 'balance',
	    component: () => import('@/views/nested/balance/index'), // Parent router-view
	    name: '余额统计',
	    meta: { title: '余额统计' },
	  },
	  {
	    path: 'balancequery/:dataTime',
	    component: () => import('@/views/nested/balancequery/index'), // Parent router-view
	    name: '余额查询',
	    meta: { title: '余额查询' },
	  },
	  {
		path: 'withdrawal',
		component: () => import('@/views/nested/withdrawal/index'), // Parent router-view
		name: '提现管理',
		meta: { title: '提现管理' },
			  
	 }
    ]
  },
  {
    path: '/documentary',
    component: Layout,
    redirect: '/documentary/reconciliation/:dataTime',
    name: '跟单管理',
    meta: {
      title: '跟单管理',
      icon: 'el-icon-s-help',
  	  role: [1]
    },
    children: [
		    {
		      path: 'reconciliation/:dataTime',
		      component: () => import('@/views/documentary/reconciliation/index'), // Parent router-view
		      name: '对账统计',
		      meta: { title: '对账统计' },
		    },
		    {
		      path: 'query',
		      component: () => import('@/views/documentary/query/index'), // Parent router-view
		      name: '对账查询',
		      meta: { title: '对账查询' },
		    },
  			{
  			  path: 'tickets',
  			  component: () => import('@/views/documentary/tickets/index'), // Parent router-view
  			  name: '出票统计',
  			  meta: { title: '出票统计' },
  			},
  			{
  			  path: 'ticketsDetaile/:dataTime',
  			  component: () => import('@/views/documentary/ticketsDetaile/index'), // Parent router-view
  			  name: '出票详情',
  			  meta: { title: '出票详情' },
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
