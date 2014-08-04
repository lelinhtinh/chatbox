/**
 * Các function mặc định và các biến chung
 * 
 * action_user
 * copy_user_name
 * my_getcookie
 * my_setcookie
 */

var dataID; // id riêng cho từng tab chat
var $messenger = $("#chatbox-messenger-input"); // input nhập liệu
var $form = $("#chatbox-form"); // form gửi tin
var uId, uName; // user id, user name của thành viên đang truy cập chatbox

// Chạy các lệnh cmd
function action_user(cmd, user_name) {
	if (user_name == null) user_name = '';
	$messenger.val("/" + cmd + " " + user_name);
	$form.submit();
	return false;
}
// Copy nickname vào khung soạn thảo
function copy_user_name(user_name) {
	$messenger[0].value += user_name;
	$messenger.focus();
	return false;
}

// Lấy cookie
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

// Đặt cookie
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