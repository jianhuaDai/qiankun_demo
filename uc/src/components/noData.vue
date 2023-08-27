<template>
	<div class="noData">
		<div class="task-empty"><img class="noDataImg" src="@/assets/img/empty.png" ondragstart="return false;" width="120" min-height="254" /></div>
	</div>
</template>
<script>
export default {
	data() {
		return {};
	},
	props: []
};
</script>
<style lang="scss" scoped>
.noData {
	text-align: center;
	margin-top:60px;
	.noDataImg {
		width: 120px;
	}
}
</style>
