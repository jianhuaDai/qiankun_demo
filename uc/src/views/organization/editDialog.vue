<style lang="scss">
.el-dialog__body {
	padding-bottom: 0;
}
.treeBox {
	width: 100%;
	height: 300px;
	padding: 10px;
	overflow: auto;
	vertical-align: bottom;
	font-size: 14px;
	color: #606266;
	background-color: #fff;
	border: 1px solid #dcdfe6;
	border-radius: 4px;
}
</style>

<template>
	<el-dialog :title="title" width="430px" :visible.sync="showDialog">
		<el-form :model="form" ref="industryForm" :rules="rules">
			<el-form-item label="企业名称" :label-width="formLabelWidth" prop="name">
				<el-input
					v-model.trim="form.name"
					size="small"
					clearable
					maxlength="16"
					placeholder="请输入企业名称"
				></el-input>
				<span class="organizationHint">最多输入16个字符</span>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button size="small" @click="cancel">取 消</el-button>
			<el-button type="primary" size="small" @click="sureAdd">确定</el-button>
		</div>
	</el-dialog>
</template>

<script>
import { createOrganization, updateOrganization } from "@/api/organization.js";
export default {
	props: ["showDialog", "rowData"],
	data() {
		return {
			dialogFormVisible: false,
			form: {
				name: "",
			},
			formLabelWidth: "80px",
			rules: {
				name: [
					{ required: true, message: "请输入企业名称", trigger: ["blur", "change"] },
				],
            },
            title: '新增'
		};
	},
	created() {
        this.form = JSON.parse(JSON.stringify(this.rowData));
        if (this.form.id) {
            this.title = '编辑';
        }
	},
	methods: {
		cancel() {
			this.$emit("close");
		},
		sureAdd() {
			this.$refs["industryForm"].validate((valid) => {
				if (valid) {
					if (this.form.id) {
                        updateOrganization(this.form).then((res) => {
						if (res.code === 0) {
							this.$message({
								message: "编辑成功！",
								type: "success",
							});
							this.$emit("addSuccess");
						} else {
							his.$message({
								message: res.message,
								type: "error",
							});
						}
					});
					} else {
						createOrganization(this.form).then((res) => {
							if (res.code === 0) {
								this.$message({
									message: "新增成功！",
									type: "success",
								});
								this.$emit("addSuccess");
							} else {
								his.$message({
									message: res.message,
									type: "error",
								});
							}
						});
					}
				}
			});
		},
	},
};
</script>
