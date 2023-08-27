if (window.__POWERED_BY_QIANKUN__) {
	// eslint-disable-next-line no-undef
	__webpack_public_path__ =
		window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ + "uc/";
}

import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";
import Router from "vue-router";
import routes from "./router.js";
import store from "./store";
import storage from "@/api/storage.js";
import _ from "lodash";
import { getConfig } from "@/api/jsondata.js";
import config from "@/api/config.js";
Vue.config.productionTip = false;
Vue.prototype.$config = config;
Vue.prototype.$storage = storage;
Vue.prototype.$event = new Vue();
Vue.use(ElementUI);
let instance = null;
let router = null;
// 子服务render
function render(props = {}) {
	getConfig().then((conf) => {
		config.init(conf);
		const { container, mainPrefix, vuex } = props;
		vuex ? storage.setUserInfo(vuex.state.user) : '';
		router = new Router({
			base: '/uc',
			mode: "hash",
			routes: routes.routes,
		});

		instance = new Vue({
			router,
			store,
			render: (h) => h(App),
		}).$mount(container ? container.querySelector("#app") : "#app");
	});
}
if (!window.__POWERED_BY_QIANKUN__) {
	render();
}
export async function bootstrap() {
	console.log("[vue] vue app bootstraped");
}
export async function mount(props) {
	console.log("[vue] props from main framework", props, 'pppppppppppppppppppppppppppp');
	render(props);
}
export async function unmount() {
	instance.$destroy();
	instance.$el.innerHTML = "";
	instance = null;
	router = null;
}
// 暴露给主应用 用于手动更新本服务
export async function update(props) {
	render(props);
}
