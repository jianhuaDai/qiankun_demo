const API = {
	user: {
		login: "/0/login",
		pictureVerify: "/pictureVerify",
		verifyLogin: "/verifyLogin",
		getSmsCode: "/getSmsCode",
		queryUserList: "/{businessId}/listV2",
		addUser: "/{businessId}/create",
		updateUser: "/{businessId}/update"
	},
	organization: {
		queryOrganizationList: "/v2/{businessId}/list",
		createOrganization: "/{businessId}/create",
		updateOrganization: "/{businessId}/update",
	},
	robot_ss: {
		queryVideoList: "/videoBase/queryVideoListByPage",
	},
	"material-server-api": {},
};

export default API;
