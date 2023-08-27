export default {
  setUserInfo(user) {
    if (!user)
      return;
    let info = this.getUserInfo();
    if (info) {
      Object.assign(info, user);
    } else {
      info = user;
    }
    sessionStorage.setItem("uc__user", typeof user == "object" ? JSON.stringify(info) : info)
  },
  getUserInfo(key) {
    let _user = sessionStorage.getItem("uc__user");
    const userObj = _user && _user != "null" ? JSON.parse(_user) : null;
    if (!key) {
      return userObj;
    }
    return userObj ? userObj[key] : "";
  },
  getCorpId() {
    let _user = sessionStorage.getItem("uc__user");
    return JSON.parse(_user).info.organizationId;
    //return this.getUserInfo("corpId");
  },
  getToken() {
    return this.getUserInfo("token");
  },
  setInteractiveCondition(condition) {
    localStorage.setItem("__interactive_condition", typeof condition == "object" ? JSON.stringify(condition) : condition)
  },
  getInteractiveCondition() {
    let _condition = localStorage.getItem("__interactive_condition");
    const condition = _condition && _condition != "null" ? JSON.parse(_condition) : null;
    return condition;
  },
  setOverviewCondition(condition) {
    localStorage.setItem("__overview_condition", typeof condition == "object" ? JSON.stringify(condition) : condition)
  },
  getOverviewCondition() {
    let _condition = localStorage.getItem("__overview_condition");
    const condition = _condition && _condition != "null" ? JSON.parse(_condition) : null;
    return condition;
  },
  destory() {
    sessionStorage.removeItem("uc__user");
  }
}
