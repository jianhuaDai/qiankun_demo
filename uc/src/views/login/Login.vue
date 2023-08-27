<template>
	<div class="login">
		<div class="login-box">
			<div class="login-carousel">
				<el-carousel height="544px" arrow="never">
					<el-carousel-item v-for="item in 1" :key="item"
						><img src="@/assets/images/loginBanner.png" width="455" alt
					/></el-carousel-item>
				</el-carousel>
			</div>
			<div class="login-form">
				<div class="login-body">
					<p class="login-title">登录</p>
					<el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="0">
						<el-form-item prop="username">
							<el-input
								@keyup.enter.native="submitLogin"
								size="small"
								type="text"
								v-model.trim="loginForm.username"
								placeholder="请输入您的用户账号"
							>
								<i slot="prefix" class="login-icon icon-account"></i>
							</el-input>
						</el-form-item>

						<el-form-item prop="password">
							<el-input
								@keyup.enter.native="submitLogin"
								size="small"
								type="password"
								v-model.trim="loginForm.password"
								placeholder="请输入您的密码"
							>
								<i slot="prefix" class="login-icon icon-password"></i>
							</el-input>
						</el-form-item>

						<el-form-item prop="verify" v-if="voiceConfig">
							<div class="block">
								<el-input
									class="verifyInput"
									@keyup.enter.native="submitLogin"
									placeholder="请输入验证码"
									v-model="loginForm.verify"
									clearable
								>
									<i slot="prefix" class="login-icon icon-checkCode"></i>
								</el-input>

								<div class="imgBox" @click="pictureVerifyFn" v-if="voiceConfig === 1">
									<img :src="pictureSrc" alt="" class="verifyImg" />
								</div>

								<div class="verifyCodeBox" v-else>
									<div class="timeBox">
										<span v-show="countDown">{{ countDown }} s</span>
									</div>

									<el-tooltip
										class="item"
										effect="light"
										content="发送验证码"
										placement="right"
									>
										<el-button
											circle
											type="primary"
											icon="el-icon-message"
											:disabled="countDown"
											@click="sendMsgFn"
										></el-button>
									</el-tooltip>
								</div>
							</div>
						</el-form-item>

						<el-form-item
							><el-button class="login-btn" type="primary" @click.stop="submitLogin"
								>登 录</el-button
							></el-form-item
						>
					</el-form>
					<p class="login-tip"><span>忘记密码请联系管理员</span></p>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { verifyLogin, pictureVerify, getSmsCode, login } from "@/api/user.js";
import { ROUTER_TABLE } from "@/constants";
import { mapActions } from "vuex";
import { Base64 } from "js-base64";
import { v1 as uuidv1 } from "uuid";

export default {
	data() {
		return {
			uuid: "",
			loginForm: {
				username: "",
				password: "",
				verify: "",
			},
			rules: {
				username: [
					{
						required: true,
						message: "请输入您的用户账号",
						trigger: "blur",
					},
				],
				password: [
					{
						required: true,
						message: "请输入您的密码",
						trigger: "blur",
					},
				],
				verify: [
					{
						required: true,
						message: "请输入验证码",
						trigger: "blur",
					},
				],
			},
			//0: 不需要验证 1: 图片验证  2: 手机号验证
			voiceConfig: this.$config.getConfig("login").verifyFlag,
			sessionId: "",
			pictureSrc: "",
			countDown: 0,
			notifyInstance: false,
		};
	},
	computed: {
		menus() {
			const permission = sessionStorage.getItem("__permission");
			let menu = "";
			if (permission) {
				menu = JSON.parse(permission).menu || "";
			}
			return menu;
		},
	},
	methods: {
		...mapActions("user", ["setPermission"]),

		//发送验证码
		sendMsgFn() {
			//正则校验手机号
			const username = this.loginForm.username;
			const regex = /^(?:(?:\+|00)86)?1\d{10}$/;
			if (!username || !regex.test(username)) {
				this.$message.warning("请输入正确的手机号");
				return;
			}

			this.sessionId = uuidv1();
			getSmsCode(
				{
					username: username,
				},
				{
					sessionId: this.sessionId,
				}
			).then((res) => {
				if (res.code === 0) {
					this.$message.success("短信验证码已发送，请查收");

					this.countDown = 60;
					const timer = setInterval(() => {
						this.countDown--;
						if (this.countDown === 0) {
							clearInterval(timer);
						}
					}, 1000);
				} else {
					this.$message.warning(res.message || "短信验证码发送失败");
				}
			});
		},
		seatsLogin() {
			window.open("/ccc/#/login");
		},
		pictureVerifyFn() {
			this.sessionId = uuidv1();

			pictureVerify({
				sessionId: this.sessionId,
			}).then((res) => {
				if (res) {
					this.pictureSrc = window.URL.createObjectURL(res);
				}
			});
		},

		submitLogin() {
			this.$refs.loginForm.validate((valid) => {
				if (!valid) {
					return;
				}

				const param = {
					username: this.loginForm.username,
					password: Base64.encode(this.loginForm.password),
					isEncode: 1,
					//verify: this.loginForm.verify,
					//type: this.voiceConfig,
				};

				let loginAjax = login;
				if (this.voiceConfig) {
					param.verify = this.loginForm.verify;
					param.type = this.voiceConfig;
					loginAjax = verifyLogin;
				}

				loginAjax(param, { sessionId: this.sessionId }).then((resp) => {
					if (resp.code != 0) {
						if (this.notifyInstance) {
							this.notifyInstance.close();
						}
						this.notifyInstance = this.$notify({
							title: "提示",
							message: resp.message || "登录失败",
							type: "error",
							duration: 1000,
						});
						this.pictureVerifyFn();
						return;
					}
					let token = this.$config.getValue(resp, "data.token") || "";
					let user = this.$config.getValue(resp, "data.user");
					this.$storage.setUserInfo({
						user: user,
						corpid: user ? user.organizationId : "",
						token: token,
					});
					this.$router.push(ROUTER_TABLE.index);
				});
			});
		},
	},
	created() {
		this.uuid = this.$route.query.uuid;
		this.voiceConfig === 1 && this.pictureVerifyFn();
	},
};
</script>

<style scoped>
.login {
	position: fixed;
	background: url(./images/bg.png) 0 0 no-repeat;
	background-size: 100% 100%;
	width: 100%;
	top: 0;
	bottom: 0;
	min-width: 1200px;
}

.login-box {
	position: fixed;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	height: 544px;
	box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
	border-radius: 8px;
	overflow: hidden;
	display: flex;
}

.login-carousel {
	width: 455px;
	height: 100%;
}

.login-form {
	width: 497px;
	height: 100%;
	background: #fff;
	display: flex;
	justify-content: center;
	align-items: center;
	box-sizing: border-box;
}

.login-title {
	color: #2878ff;
	margin-bottom: 50px;
	font-size: 28px;
	padding: 0 4px 0px 4px;
	font-family: "Source Han Sans CN";
	font-weight: bold;
	text-align: center;
}
.login-body {
	width: 70%;
}

.login-icon {
	display: inline-block;
	background-position: center center;
	background-repeat: no-repeat;
	background-size: contain;
	width: 16px;
	height: 14px;
	position: relative;
	top: 3px;
}

.login-icon.icon-account {
	background-image: url(./images/username.png);
}

.login-icon.icon-password {
	background-image: url(./images/password.png);
}

.login-icon.icon-checkCode {
	background-image: url(./images/checkCode.png);
	height: 16px;
}

.login-btn {
	width: 100%;
	background: #2878ff !important;
	margin-top: 30px;
	border-color: #2878ff !important;
	color: #fff !important;
	font-size: 16px;
}

.login-tip {
	margin-top: 10px;
	font-size: 14px;
	text-align: left;
	color: #909199;
}
.seatsLogin {
	color: #2878ff;
}
.block {
	display: flex;
}
.verifyInput {
	flex: 1;
}
.imgBox {
	padding: 4px 0px 4px 40px;
	cursor: pointer;
}
.verifyImg {
	display: block;
	outline: none;
	height: 32px;
}
.verifyCodeBox {
	padding-left: 10px;
}
.timeBox {
	display: inline-block;
	height: 40px;
	width: 60px;
	text-align: center;
	line-height: 40px;
	color: #999;
	vertical-align: top;
}
</style>
