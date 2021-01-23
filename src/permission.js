import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, getUser} from '@/utils/auth' // get token from cookie
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
  const hasToken = getToken();
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page 
	  routerFag=false;
      next();
      NProgress.done();
    } else {
      if (routerFag) {
          next()
      } else {
        try {
			   let  roles=[0];
			   // for(let i=0;i<getUser().roles.length;i++){
				  //  roles.push(getUser().roles[i].name);
			   // }
			   store.dispatch('GenerateRoutes', { roles }).then(() => { // 生成可访问的路由表
			        // 动态添加可访问路由表
					router.options.routes=store.getters.addRouters;
					router.addRoutes(store.getters.routers);
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
	    routerFag=false;
    } else {
       routerFag=false;
       next(`/login`) 
       NProgress.done();
	  
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
