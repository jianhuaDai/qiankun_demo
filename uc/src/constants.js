let base = ''
if (window.__POWERED_BY_QIANKUN__) {
  base = '/uc'
}

export const ROUTER_TABLE = {
  login: "/login",
  organization: base + '/organization',
  user: base + '/user',
}
export const MENU = [{
  "id": 1,
  "pid": 0,
  "name": "video",
  "title": "首页",
  "url": "/digital",
  "icon": "el-icon-s-home",
  "menu": true,
  "child": null
}, {
  "id": 3,
  "pid": 0,
  "name": "materielMarket",
  "title": "用户管理",
  "icon": "el-icon-menu",
  "menu": true,
  "child": [
    {
      "id": 31,
      "pid": 3,
      "name": "organization",
      "title": "组织管理",
      "url": ROUTER_TABLE.organization,
      "icon": "el-icon-menu",
      "menu": true,
      "child": null
    },
    {
      "id": 32,
      "pid": 3,
      "name": "user",
      "title": "用户管理",
      "url": ROUTER_TABLE.user,
      "icon": "el-icon-menu",
      "menu": true,
      "child": null
    }
  ]
}
]
