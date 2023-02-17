import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { getLocalStorage, setLocalStorage } from '@/utils/local-storage';
import { Toast } from 'vant';
import axios from 'axios'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  // loading
  Toast.loading({
    forbidClick: true
  })
  const { Authorization } = getLocalStorage(
    'Authorization'
  );
  if (!Authorization) {
    if (to.meta.login) {
      next({ name: 'login', query: { redirect: to.name } });
      return;
    }
  }

  
  //页面顶部菜单拦截
  let emptyObj=JSON.stringify(to.meta) == "{}";
  let undefinedObj=typeof(to.meta.showHeader)=="undefined";
  let undefinedRight=typeof(to.meta.rightButton)=="undefined";
  if(typeof(to.meta.reload)=="undefined")
    to.meta.reload = false
  if(to.meta.reload)
    axios.get(process.env.BASE_URL+"wx/auth/info",{
      headers: {
        'X-pershowEA-Token': Authorization,
      }}).then((response) => {
      if(response.data){
          let userInfo = response.data.data;
          userInfo.Authorization = Authorization
          window.localStorage.clear();
          setLocalStorage(userInfo)
      }
    })
  if(!emptyObj&&!undefinedObj){
    store.commit("CHANGE_HEADER",to.meta);
  }else{
    if(undefinedRight){
      store.commit("CHANGE_HEADER",{showHeader:true,rightButton:false,title:"",reload:to.meta.reload});
    }
    else
      store.commit("CHANGE_HEADER",{showHeader:true,rightButton:true,title:"",reload:to.meta.reload});
  }
  next();
});

//当路由进入后：关闭进度条
router.afterEach(() => {  
  // 在即将进入新的页面组件前，关闭掉进度条
  Toast.clear()
})

export default router
