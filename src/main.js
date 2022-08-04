import Vue from 'vue'
import { Button, Message } from 'element-ui';
import App from './App.vue'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import 'amfe-flexible/index.js'
import './common/js/rem.js'

import 'element-ui/lib/theme-chalk/index.css';
import 'assets/font-icon/iconfont.css'
import 'common/style/index.scss'

fastclick.attach(document.body)
Vue.config.productionTip = false

Vue.use(VueLazyload, {
  loading: require('./assets/images/default.png')
})

// 在调用 Vue.use 前，给 Message 添加 install 方法
Message.install = function (Vue, options) {
  Vue.prototype.$message = Message
}

Vue.use(Button);
Vue.use(Message);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
