/**
 * Các function mặc định và các biến chung
 *
 * userOnline
 * copy_user_name
 * my_getcookie
 * my_setcookie
 */

var user_setting = {
	/*
	buzz: 60, // Giới hạn thời gian giữa 2 lần buzz, nếu đặt 0 sẽ không sử dụng buzz
	autoLogin: true, // Tự động đăng nhập
	autoRefresh: true, // Tự động cập nhật
	hideTabs: false, // Ẩn cột trái
	noClear: true, // Không xóa tin nhắn khi clear chatbox, tự động lưu trữ
	reverse: false // Đảo ngược thứ tự tin nhắn (mới nhất lên trên)
	*/
};

var zzChat = {

	uId: "", // User id (của mình)
	uName: "", // User name (của mình)

	/**
	 * Dữ liệu các kênh chat, thông số từng kênh
	 *
	 * time: Thời điểm tạo phòng
	 * uid: User id của người tạo
	 * name: Tên phòng
	 * users: Danh sách người trong phòng (bao gồm mình)
	 * other: Danh sách thành viên khác trong phòng (không bao gồm mình)
	 * mLength: Số tin nhắn cũ
	 * mLastContent: Nội dung tin nhắn cuối cùng
	 * mLastTime: Thời điểm tin nhắn cuối cùng
	 * close: Đánh dấu phòng đã đóng hay chưa
	 */
	data: {},

	active: "publish", // Id của tab đang hiển thị

	// Các đối tượng thường dùng
	o: {
		chat: $("#chatbox-forumvi"), // Khối bao quanh toàn chatbox
		cTit: $("#chatbox-title > h2"), // Tiêu đề chatbox
		wTit: $("title"), // Tiêu đề của trang
		wrap: $("#chatbox-wrap"), // Khối bao quanh tin nhắn
		mList: $("#chatbox-members"), // Danh sách thành viên trên chatbox
		tabs: $("#chatbox-list"), // Danh sách tab chatbox
		messenge : $("#chatbox-messenger-input"), // input nhập liệu
		form : $("#chatbox-form"), // form gửi tin
	},

	firstTime: true, // Lần truy cập đầu tiên
	refreshFunction: function(){}, // Hàm cập nhật tin nhắn
	oldMessage: "" // Nội dung tin nhắn vừa nhập vào để phục hồi khi lỗi
};

var settings = $.extend({
	buzz: 60, // Giới hạn thời gian giữa 2 lần buzz, nếu đặt 0 sẽ không sử dụng buzz
	autoLogin: true, // Tự động đăng nhập
	autoRefresh: true, // Tự động cập nhật
	hideTabs: false, // Ẩn cột trái
	noClear: true, // Không xóa tin nhắn khi clear chatbox, tự động lưu trữ
	reverse: false // Đảo ngược thứ tự tin nhắn (mới nhất lên trên)
}, user_setting);

/**
 * Lấy Link của người dùng trong danh sách bằng nickname
 *
 * @param {String} nickname của người cần lấy
 * return {Object}
 */
var userOnline = function (user_name) {
	return $("#chatbox-members").find('a[onclick="return copy_user_name(\'' + user_name + '\');"]');
};

/**
 * Copy nickname vào khung soạn thảo
 *
 * @param {String} nickname người dùng
 */
function copy_user_name(user_name) {
	$messenger[0].value += user_name;
	$messenger.focus();
	return false;
}

/**
 * Lấy cookie
 *
 * @param {String} Tên cookie
 */
function my_getcookie(name) {
	cname = name + '=';
	cpos = document.cookie.indexOf(cname);
	if (cpos != -1) {
		cstart = cpos + cname.length;
		cend = document.cookie.indexOf(";", cstart);
		if (cend == -1) {
			cend = document.cookie.length;
		}
		return unescape(document.cookie.substring(cstart, cend));
	}
	return null;
}

/**
 * Đặt cookie
 *
 * @param1 {String} tên cookie
 * @param2 {String} Giá tri cookie
 * @param3 {Boolean} Thời gian lưu trữ theo session hoặc vĩnh viễn
 * @param4 {URL} Đường dẫn trang lưu trữ
 */
function my_setcookie(name, value, sticky, path) {
	expires = "";
	domain = "";
	if (sticky) {
		expires = "; expires=Wed, 1 Jan 2020 00:00:00 GMT";
	}
	if (!path) {
		path = "/";
	}
	document.cookie = name + "=" + value + "; path=" + path + expires + domain + ';';
}