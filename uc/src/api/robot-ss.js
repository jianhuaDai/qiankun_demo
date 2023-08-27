import http from './http.js'
import API from "@/api/index"
import storage from "./storage.js";
const SERVICE = "robot-ss";

function getUrl(apiUrl) {
  return http.formatUrl(SERVICE, apiUrl);
}
/**
 * 查询视频列表
 * @param {*} params 
 */
export function queryVideoList(params) {
  return http.post(getUrl(API.robot_ss.queryVideoList), params);
}