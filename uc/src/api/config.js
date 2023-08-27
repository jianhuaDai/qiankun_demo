import {
  getObjValue
} from "@/utils/obj.js"

import storage from "@/api/storage.js"
import axios from 'axios';
export default {
  config: null,
  init(conf) {
    this.config = conf;
    // 请求拦截
    // axios.interceptors.response.use((response) => {
    //   console.log(response, 'response');
    //   // return Promise.resolve(response);
    //   if (response.status === 200 && response.data && response.data.code === '000000') {
    //     return Promise.resolve(response)
    //   } else {
    //     return Promise.reject(response.data.message)
    //   }
    // })
  },
  getConfig(key) {
    return this.config[key];
  },
  getValue(target, path) {
    return getObjValue(target, path);
  },
  formatOssFile(url) {
    return (this.getConfig("ossfile") + '/' + url).replace(/([^:])\/\//g, "$1/");
  },
  formatVideoUrl(url) {
    if (!url || url.startsWith("http")) {
      return url;
    }
    return (this.getConfig("videoURL") + '/' + url).replace(/([^:])\/\//g, "$1/");
    // if (this.getConfig('videoURL') != '/nfs') {
    //   return (this.getConfig('videoURL') + '/' + url).replace(/([^:])\/\//g, '$1/')
    // } else {
    //   return ('https://172.16.103.12/nfs/' + url).replace(/([^:])\/\//g, '$1/')
    // }
  },
  formatVoiceUrl(url) {
    return (this.getConfig("voicefile") + '/' + url).replace(/([^:])\/\//g, "$1/");
  },
  formatSSUrl(url, bizId) {
    let ssFile = this.getConfig("ssfile");
    ssFile = ssFile.replace("{corpId}", storage.getCorpId("corpid")).replace("{bizId}", bizId);
    return (ssFile + url).replace(/([^:])\/\//g, "$1/");
  },
  formatSecond(secs) {
    if (!secs) {
      return "--";
    }
    let min = parseInt(secs / 60),
      sec = secs % 60;
    let ret = "";
    if (min > 0) {
      ret = min + "分"
    }
    ret += sec + "秒"
    return ret;
  }
}