import axios from 'axios'
import { Dialog, Toast } from 'vant';
import Vue from "vue"
import { getLocalStorage } from '@/utils/local-storage';

// create an axios instance
const $baseUrl = process.env.BASE_URL;
const $timeout = Vue.prototype.$appConfig.timeout;
const service = axios.create({
  baseURL: $baseUrl,//process.env.VUE_APP_BASE_API, // api 的 window.BASE_CONFIG.baseURL
  timeout: $timeout  // request timeout
})

// request interceptor
service.interceptors.request.use(
    config => {
      // 不传递默认不开启loading
    if (config.hideloading) {
      // loading
      Toast.loading({
        forbidClick: true
      })
    }
    if (!config.headers['X-pershowEA-Token']) {
      config.headers['X-pershowEA-Token'] = `${window.localStorage.getItem(
        'Authorization'
      ) || ''}`;
    }
    return config;
  },
  err => Promise.reject(err)
)

// response interceptor
service.interceptors.response.use(
  response => {
    Toast.clear()
    const res = response.data
    if (res.errno === 501) {
        Toast.fail('请登录');
        setTimeout(() => {
          window.location = '#/login/'
        }, 1500)
      return Promise.reject('error')
    } else if (res.errno === 502) {
        Toast.fail('网站内部错误，请联系网站维护人员')
      return Promise.reject('error')
    } if (res.errno === 401) {
      Toast.fail('参数不对');
      return Promise.reject('error')
    } if (res.errno === 402) {
      Toast.fail('参数值不对');
      return Promise.reject('error')
    } else if (res.errno !== 0) {
      // 非5xx的错误属于业务错误，留给具体页面处理
      return Promise.reject(response)
    } else {

      return response
    }
  }, error => {
    Toast.clear()
    console.log('err' + error)// for debug
    Dialog.alert({
        title: '警告',
        message: '登录连接超时'
      });
    return Promise.reject(error)
  })

export default service
