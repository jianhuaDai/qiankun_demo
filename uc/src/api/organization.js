import http from './http.js'
import API from "@/api/index"

const SERVICE = "organization";

function getUrl(apiUrl) {
  return http.formatUrl(SERVICE, apiUrl);
}
// 组织列表
export function queryOrganizationList(param = {}) {
  return http.post(getUrl(API.organization.queryOrganizationList), param);
}
// 新增组织
export function createOrganization(param = {}) {
  return http.post(getUrl(API.organization.createOrganization), param);
}
// 编辑组织
export function updateOrganization(param = {}) {
  return http.post(getUrl(API.organization.updateOrganization), param);
}