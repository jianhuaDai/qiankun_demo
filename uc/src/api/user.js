import http from './http.js'

import API from "@/api/index"

const SERVICE = "user";

function getUrl(apiUrl, urlExtraParam) {
	return http.formatUrl(SERVICE, apiUrl, urlExtraParam);
}

export function login(param = {}) {
  return http.post(getUrl(API.user.login), param);
}

//获取图片
export function pictureVerify(param = {}) {
	return http.ajax(getUrl(API.user.pictureVerify), "get", param, {
		responseType: "blob",
	});
}

//登录新接口
export function verifyLogin(param = {}, urlExtraParam) {
	return http.post(getUrl(API.user.verifyLogin, urlExtraParam), param);
}

//获取短信验证码
export function getSmsCode(param = {}, urlExtraParam) {
	return http.post(getUrl(API.user.getSmsCode, urlExtraParam), param);
}
//用户列表
export function queryUserList(param = {}, urlExtraParam) {
	return http.post(getUrl(API.user.queryUserList, urlExtraParam), param);
}

// 新增用户
export function addUser(param = {}, urlExtraParam) {
	return http.post(getUrl(API.user.addUser, urlExtraParam), param);
}
// 编辑用户
export function updateUser(param = {}, urlExtraParam) {
	return http.post(getUrl(API.user.updateUser, urlExtraParam), param);
}