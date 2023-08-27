<style scoped>
.head {
  height: 100%;
  width: 100%;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-content: center;
}

.logout {
  display: inline-block;
  background: url(./images/icon-logout.png) center center no-repeat;
  background-size: contain;
  cursor: pointer;
  width: 20px;
  height: 20px;
  margin-right: 20px;
}

.downloads {
  margin-top: 4px;
}

.user-name {
  margin: 0 20px 0 20px;
  padding-left: 28px;
  line-height: 24px;
  background: url(./images/head.png) 0 0 no-repeat;
  background-size: contain;
  color: #606266;
}
</style>
<template>
  <div class="head">
    <div>
    </div>
    <div class="flex-center">
      <div class="user-name">{{userName}}</div>
      <i @click.stop="logout" class="logout"></i>
    </div>
  </div>
</template>
<script>
import {
  mapState
} from "vuex"
export default {
  computed: {
    ...mapState('user', [
      "userName"
    ])
  },
  methods: {
    logout() {
      this.$confirm("确定退出页面!", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$router.replace('/login')
      });
    }
  },
}
</script>