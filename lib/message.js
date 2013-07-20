exports.error = {
	//common
	input_empty : '信息不完整',
	input_not_numeric : '输入信息不是数字',
	input_not_array: '输入的不是数组',

	//user
	username_length : '用户名至少需要5个字符',
	username_incorrect : '用户名只能使用0-9，a-z，A-Z',
	email_incorrect : '不正确的电子邮箱',
	username_email_used : '用户名或邮箱已被使用',
	user_not_exit :'用户不存在',
	password_incorrect : '密码错误',

	//userinfo
	userinfo_not_exit : '你还没有任何社区',

	//token
	not_login : '你还没有登录',
	token_miss : '没有认证,请重新登录',
	token_expired : '认证过期',


	//community
	community_not_exit : '社区不存在',

	//group
	group_not_exit : '圈子不存在',
	group_exit : '圈子名字已经被使用',
	group_creater_canot_leave : '你是创建者不能取消加入圈子',
	group_creater_canot_invite : '您是创建者不能邀请自己',

	//timeline
	timline_not_exit: '广播不存在',

	//image photo
	image_type : '图片文件类型不对！',
	upload_file_error : '上传图片失败'

};

exports.success = {
	signup_success : '注册成功',
	signin_success : '登录成功',
	thxed : '感谢成功',
	join_group_success : '加入圈子成功',
	delete_success : '删除成功',
	upload_file_success: '上传图片成功',
	group_kick_success: '踢人成功',
	group_kick_success: '邀请成功'
};
