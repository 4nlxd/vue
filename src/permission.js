import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist
let routerFag=false;
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next();
      NProgress.done()
    } else {
      if (routerFag) {
          next()
      } else {
        try {
          // get user info
       //          const roles =[];
			    // if(window.sessionStorage.getItem('userCofig')){
			    // 	 roles.push(JSON.parse(window.sessionStorage.getItem('userCofig')).roleId);
			    // }
				 let roles='admins';
			   store.dispatch('GenerateRoutes', { roles }).then(() => { // 生成可访问的路由表
			        // 动态添加可访问路由表
					router.options.routes=router.options.routes.concat(store.getters.addRouters);
					router.addRoutes(store.getters.addRouters);
					routerFag=true;
			        next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
			    })
         
         
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login`) 
      NProgress.done();
	  
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
