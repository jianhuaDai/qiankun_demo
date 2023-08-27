<style scoped>
.nav-icon {
  display: inline-block;
  padding-right: 10px;
  color: #fff;
}

.nav-logo {
  height: 60px;
  width: 100%;
  background: url(./images/logo.png) center center no-repeat;
  background-size: 80%;
}

.nav-badge {
  margin-left: 5px;
  background-color: #f56c6c;
  border-radius: 10px;
  color: #fff;
  display: inline-block;
  font-size: 12px;
  height: 18px;
  line-height: 18px;
  padding: 0 6px;
  text-align: center;
  white-space: nowrap;
}
</style>
<template>
  <div>
    <div class="nav-logo"></div>
    <el-menu
      :router="true"
      :default-openeds="openMenus"
      :unique-opened="true"
      background-color="#2284e7"
      text-color="#fff"
      :default-active="routeActive"
      v-if="menus"
    >
      <template v-for="(menu, index) in menus">
        <template v-if="menu.menu">
          <el-menu-item v-if="!menu.child" :key="index" :index="menu.url">
            <i class="nav-icon" :class="menu.icon"></i>
            <span slot="title">{{menu.title}}</span>
          </el-menu-item>
          <el-submenu v-else :key="index" :index="menu.name">
            <template slot="title">
              <i class="nav-icon" :class="menu.icon"></i>
              <span slot="title">{{menu.title}}</span>
            </template>
            <el-menu-item v-for="item in menu.child" :key="item.id" :index="item.url">{{item.title}}</el-menu-item>
          </el-submenu>
        </template>
      </template>
    </el-menu>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "navigation",
  data: function() {
    return {
      openMenus: []
    };
  },
  computed: {
    ...mapState("user", ["permission"]),
    menus() {
      return this.permission;
    },
    routeActive() {
      return this.$route.path;
    }
  }
};
</script>
