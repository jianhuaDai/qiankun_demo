<template>
	<div id="body">
		<!-- <div class="header">
			<Header />
		</div>
		<Navigation class="navigation" /> -->
		<div class="MainBody">
			<router-view class="page"></router-view>
		</div>
	</div>
</template>
<script>
import { mapActions } from "vuex";
import Navigation from "@/components/nav/Navigation";
import Header from "@/components/header/Header";

export default {
	methods: {
		// ...mapActions("user", ["initUser"]),
	},
	created() {
		// this.initUser(this.$storage.getUserInfo("uc__user"));
	},
	beforeDestroy() {
		// this.$storage.destory();
	},
	components: {
		Header,
		Navigation,
	},
};
</script>

<style lang="scss" scoped>
.header {
	position: fixed;
	top: 0;
	padding-left: 180px;
	height: 45px;
	width: 100%;
	border-bottom: 1px solid #f0f0f0;
	z-index: 10;
	box-sizing: border-box;
}

.navigation {
	position: fixed;
	top: 0;
	left: 0;
	width: 180px;
	height: 100vh;
	background: #2284e7;
	overflow-x: hidden;
	z-index: 20;
}

.MainBody {
	// padding-left: 180px;
	// padding-top: 45px;
	background: #f3f4f5;
	height: calc(100vh - 70px);
	width: 100%;
}
</style>
