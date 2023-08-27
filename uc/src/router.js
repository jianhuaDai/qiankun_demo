import Vue from "vue";
import Router from "vue-router";

import Login from "@/views/login/Login";
import Home from "@/views/Home";
import Organization from "@/views/organization/index.vue";
import User from "@/views/user/index.vue";
import { ROUTER_TABLE } from "@/constants";
const Index = () => import("@/views/Index/index");
//vue-router3.0 重复路由报错的问题
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
	return originalPush.call(this, location).catch((err) => err);
};

Vue.use(Router);

const routes = [
	{
		path: ROUTER_TABLE.login,
		component: Login,
	},
	{
		path: "/",
		component: Home,
		redirect: ROUTER_TABLE.organization,
		children: [
			{
				path: ROUTER_TABLE.organization,
				component: Organization,
			},
			{
				path: ROUTER_TABLE.user,
				component: User,
			},
		],
	},
];
export default {routes}
