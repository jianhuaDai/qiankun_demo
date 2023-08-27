<template>
	<!-- dialg -->
	<el-dialog
		width="430px"
		:title="'新增用户'"
		:close-on-click-modal="false"
		:visible.sync="showDialog"
		:before-close="cancel"
		@close="closeDialog"
	>
		<el-form :model="addUserForm" :rules="userRules" ref="addUserForm" label-width="80px">
			<el-form-item label="用户名称" prop="nickname">
				<el-input
					v-model.trim="addUserForm.nickname"
					placeholder="请输入用户名称"
					size="small"
				></el-input>
			</el-form-item>
			<el-form-item label="用户账号" prop="username">
				<el-input
					v-model.trim="addUserForm.username"
					placeholder="请输入用户账号"
					size="small"
				></el-input>
			</el-form-item>

			<el-form-item label="企业" prop="organizationNumber">
				<el-select
					v-model.trim="addUserForm.organizationNumber"
					placeholder="请选择企业"
					filterable
					size="small"
					style="width: 100%"
					@change="selectChanged($event)"
				>
					<el-option
						:label="item.name"
						:key="index"
						:value="item.organizationNumber"
						v-for="(item, index) in organizationList"
					></el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="角色" prop="roleId">
				<el-select
					v-model.trim="addUserForm.roleId"
					placeholder="请选择角色"
					filterable
					size="small"
					style="width: 100%"
				>
					<el-option
						v-for="(item, index) in personList"
						:label="item"
						:key="index"
						:value="index"
					></el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="用户密码" prop="password" v-if="!addUserForm.id">
				<el-input
					show-password
					v-model="addUserForm.password"
					placeholder="请输入用户密码"
					size="small"
					autocomplete="new-password"
				></el-input>
			</el-form-item>
			<el-form-item label="确认密码" prop="checkPass" v-if="!addUserForm.id">
				<el-input
					show-password
					v-model="addUserForm.checkPass"
					placeholder="请确认用户密码"
					size="small"
				></el-input>
			</el-form-item>
			<!-- 编辑才有的表单 -->
			<el-form-item label="SIP账号" v-if="addUserForm.id">
				<el-input
					type="text"
					:disabled="true"
					v-model.trim="addUserForm.extNumber"
					placeholder="请输入SIP账号"
					size="small"
				></el-input>
			</el-form-item>

			<el-form-item label="IM账号" v-if="addUserForm.id">
				<el-input
					type="text"
					:disabled="true"
					v-model.trim="addUserForm.imAccount"
					placeholder="请输入IM账号"
					size="small"
				></el-input>
			</el-form-item>
			<el-form-item label="密码重置" prop="password" v-if="addUserForm.id">
				<el-input
					show-password
					v-model="addUserForm.password"
					placeholder="请输入用户密码"
					size="small"
				></el-input>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button size="small" @click="cancel()">取 消</el-button>
			<el-button
				type="primary"
				:loading="addBtnLoading"
				size="small"
				@click="submit(addUserForm)"
				>确 定</el-button
			>
		</span>
	</el-dialog>
</template>

<script>
import { queryOrganizationList } from "@/api/organization.js";
import { addUser, updateUser } from "@/api/user.js";
import { Base64 } from "js-base64";
import { createOrganization, updateOrganization } from "@/api/organization.js";
export default {
	props: ["showDialog", "rowData"],
	data() {
		const checkUsername = (rule, value, callback) => {
			if (!value) {
				callback(new Error("请输入用户账号"));
			} else if (!/^\w+$/.test(value)) {
				callback(new Error("用户账号由数字、字母和下划线组成"));
			} else if (value.length > 30) {
				callback(new Error("用户账号长度最多30位"));
			} else {
				callback();
			}
		};
		const checkNickname = (rule, value, callback) => {
			if (!value) {
				callback(new Error("请输入用户名称"));
			} else if (value.length > 30) {
				callback(new Error("用户名称长度最多30位"));
			} else {
				callback();
			}
		};
		const checkPassword = (rule, value, callback) => {
			if (!value) {
				callback(new Error("请输入用户密码"));
			} else if (value.length > 30 || value.length < 3) {
				callback(new Error("密码长度设置3至30位"));
			} else {
				callback();
			}
		};
		const validatePass = (rule, value, callback) => {
			if (value === "") {
				callback(new Error("请再次输入密码"));
			} else if (value !== this.addUserForm.password) {
				callback(new Error("两次输入密码不一致!"));
			} else {
				callback();
			}
		};
		return {
			addBtnLoading: false,
			personList: Object.freeze({
				20: "企业管理员",
				21: "坐席",
				22: "操作员",
			}),
			addUserForm: {
				nickname: "",
				password: "",
				checkPass: "",
				username: "",
				organizationNumber: null,
				organizationId: null
			},

			userRules: {
				nickname: [{ required: true, validator: checkNickname }],
				username: [{ required: true, validator: checkUsername }],
				password: [{ required: true, validator: checkPassword }],
				checkPass: [{ required: true, trigger: "blur", validator: validatePass }],
				organizationNumber: [{ required: true, message: "请选择企业" }],
				roleId: [{ required: true, message: "请选择角色" }],
			},

			organizationList: [],
		};
	},
	mounted() {
		this.initOrganization();
	},
	created() {
		if (this.rowData.id) {
			this.addUserForm = JSON.parse(JSON.stringify(this.rowData));
		}
	},
	methods: {
		initOrganization() {
			queryOrganizationList({ page: 1, size: 1000 })
				.then((res) => {
					if (res.code != "0") {
						return;
					}
					this.organizationList = res.data.contents;
				})
				.catch();
		},
		handleClose(done) {
			this.$emit("handleClose");
		},
		closeDialog() {
			this.$emit("handleClose");
			this.$refs["addUserForm"].resetFields();
		},
		selectChanged(organizationNumber) {
			this.organizationList.find((item) => {
				//model就是上面的数据源
				if (item.organizationNumber === organizationNumber) {
					this.addUserForm.organizationId = item.id;
				}
			});
		},
		// 提交数据截取
		submit() {
			const reqData = { ...this.addUserForm };
			this.$refs.addUserForm.validate((valid) => {
				if (valid) {
					this.addBtnLoading = true;
					this.addUserFn(reqData);
				}
			});
		},

		// 新增请求
		addUserFn(reqData) {
			if (!reqData.id) {
				let data = Object.assign({}, reqData, {
					password: Base64.encode(reqData.password),
					isEncode: 1
				});

				addUser(data).then((res) => {
					// 按钮置为可用
					this.addBtnLoading = false;
					if (res.code == 0) {
						this.$message({
							message: "新增成功！",
							type: "success",
						});
						this.$emit("addSuccess");
						this.$refs["addUserForm"].resetFields();
					}
				});
			} else {
				let data = Object.assign({}, reqData, {
					password: Base64.encode(reqData.password),
					isEncode: 1,
					uid: reqData.id,
				});
				updateUser(data).then((res) => {
					// 按钮置为可用
					this.addBtnLoading = false;
					if (res.code == 0) {
						this.$message({
							message: "新增成功！",
							type: "success",
						});
						this.$emit("addSuccess");
						this.$refs["addUserForm"].resetFields();
					}
				});
			}
		},
		cancel() {
			this.$emit("close");
		},
	},
};
</script>
