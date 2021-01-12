import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
// 环境的切换
let baseWebURL='';
let prefix = 'https:' == document.location.protocol ? 'https' : 'http';
if (window.location.origin.indexOf('local') >= 0 || window.location.origin.indexOf('192.168.0.190') >= 0) {
    // baseWebURL= prefix + '://192.168.0.134:8080/api/';
	baseWebURL='https://api.yzfyzf.com/api/';
}else{
	baseWebURL= prefix + '://api.yzfyzf.com/api/';
}
const service = axios.create({
  baseURL: baseWebURL, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})
let that=this;
// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = getToken();
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code ===10007 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('token已经失效请重新登录', '重新登录', {
          confirmButtonText: '重新等录',
          type: 'warning',
		  showCancelButton:false,
		  showClose:false
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error)
  }
)

export default service
