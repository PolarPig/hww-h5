import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import filters from "./filters";
Vue.mixin(filters);
Vue.config.productionTip = false;

//import Vant from "vant";
import {
  NavBar,
  Icon,
  Cell,
  CellGroup,
  List,
  Button,
  Popup,
  Picker,
  Field,
  Row,
  Col,
  Loading,
  Toast,
  Uploader,
  PullRefresh,
  Collapse,
  CollapseItem
} from "vant";
import "vant/lib/index.css";
import axios from "axios";

Vue.config.productionTip = false;

//Vue.use(Vant);
Vue.use(NavBar)
  .use(Icon)
  .use(Cell)
  .use(CellGroup)
  .use(List)
  .use(Button)
  .use(Popup)
  .use(Picker)
  .use(Field)
  .use(Row)
  .use(Col)
  .use(Uploader)
  .use(Loading)
  .use(Toast)
  .use(PullRefresh)
  .use(Collapse)
  .use(CollapseItem);
Vue.prototype.$http = axios;

import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import('echarts/lib/component/tooltip')
Vue.prototype.$echarts = echarts

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
