/*!
 * 	Chatbox forumvi v0.1 by Zzbaivong <http://devs.forumvi.com>
 */

// Xóa menu chuột phải
function hideMenu() {
	$("#chatbox_contextmenu").remove();
}
// Xử lý khi click vào menu chuột phải
function action_user(cmd, user_name, sid) {
	if (user_name == null) user_name = '';
	$("#chatbox_message").val("/" + cmd + " " + user_name);
	$("#chatbox_send").submit();
	hideMenu();
	return false;
}
// Copy nickname vào khung soạn thảo
function copy_user_name(user_name) {
	var $mess = $("#chatbox_message");
	$mess[0].value += user_name;
	$mess.focus();
	return false;
}
// Menu chuột phải khi click vào nickname
function showMenu(user_id, user_name, my_user_id, my_chat_level, my_user_level, user_chat_level, user_level, event, sid) {
	if (document.getElementById('chatbox_contextmenu')) {
		hideMenu();
		return false;
	}
	var connected = false;
	if (document.forms[0].elements["message"]) {
		connected = true;
	}
	if (document.all) {
		mouseX = window.event.clientX + document.body.scrollLeft;
		mouseY = window.event.clientY + document.body.scrollTop
	} else {
		mouseX = event.clientX + window.scrollX;
		mouseY = event.clientY + window.scrollY;
	}
	var div = document.createElement('div');
	div.setAttribute('id', 'chatbox_contextmenu');
	div.style.display = 'block';
	div.style.top = mouseY + 'px';
	var window_width = 0;
	if (document.getElementById('content')) {
		window_width = document.getElementById('content').offsetWidth
	} else {
		window_width = (document.body) ? document.body.clientWidth : window.innerWidth
	}
	var div_style_width = 120;
	mouseX = parseInt(mouseX);
	while (div_style_width + mouseX >= window_width) {
		mouseX -= 10;
	}
	div.style.left = mouseX + 'px';
	div.style.position = 'absolute';
	var p = document.createElement('p');
	p.setAttribute('class', 'close');
	p.setAttribute('className', 'close');
	var title_name = ' ' + ((user_name.length > 9) ? user_name.substr(0, 9) + '...' : user_name);
	var close = document.createElement('img');
	close.onclick = new Function('hideMenu();');
	close.setAttribute('src', 'http://illiweb.com/fa/cross.png');
	close.setAttribute('alt', 'Close Window');
	p.appendChild(document.createTextNode(title_name));
	p.appendChild(close);
	div.appendChild(p);
	var p = document.createElement('p');
	p.onmouseover = new Function('this.className="hover";');
	p.onmouseout = new Function('this.className="";');
	var link = document.createElement('a');
	link.appendChild(document.createTextNode("View the profile"));
	link.setAttribute('href', '/u' + user_id);
	link.setAttribute('target', 'profile');
	link.onclick = new Function("hideMenu();");
	p.appendChild(link);
	div.appendChild(p);
	var p = document.createElement('p');
	p.onmouseover = new Function('this.className="hover";');
	p.onmouseout = new Function('this.className="";');
	var link = document.createElement('a');
	link.appendChild(document.createTextNode("Send a PM"));
	link.setAttribute('href', '/privmsg?mode=post&u=' + user_id);
	link.setAttribute('target', 'profile');
	link.onclick = new Function("hideMenu();");
	p.appendChild(link);
	div.appendChild(p);
	if (document.forms[0].elements["message"] && my_chat_level == 2) {
		user_name = user_name.replace(/\\/g, "\\\\");
		user_name = user_name.replace(/\'/g, "\\'");

		// Mình là mod
		if (user_chat_level != 2) {
			var p = document.createElement('p');
			p.onmouseover = new Function('this.className="hover";');
			p.onmouseout = new Function('this.className="";');
			var link = document.createElement('a');
			link.appendChild(document.createTextNode("kick from chat"));
			link.setAttribute('href', 'javascript:void(0)');
			link.onclick = new Function("return action_user('kick', '" + user_name + "', '" + sid + "');");
			p.appendChild(link);
			div.appendChild(p);
			var p = document.createElement('p');
			p.onmouseover = new Function('this.className="hover";');
			p.onmouseout = new Function('this.className="";');
			var link = document.createElement('a');
			link.appendChild(document.createTextNode("Ban from chat"));
			link.setAttribute('href', 'javascript:void(0)');
			link.onclick = new Function("return action_user('ban','" + user_name + "', '" + sid + "');")
		}
		p.appendChild(link);
		div.appendChild(p);

		// Mình admin, người kia mod
		if (my_user_level == 1 && user_chat_level == 2 && user_level != 1) {
			var p = document.createElement('p');
			p.onmouseover = new Function('this.className="hover";');
			p.onmouseout = new Function('this.className="";');
			var link = document.createElement('a');
			link.appendChild(document.createTextNode("Remove moderation"));
			link.setAttribute('href', 'javascript:void(0)');
			link.onclick = new Function("return action_user('unmod','" + user_name + "', '" + sid + "');");
			p.appendChild(link);
			div.appendChild(p);

			// Mình là admin, người kia là thành viên thường
		} else if (my_user_level == 1 && user_chat_level != 2) {
			var p = document.createElement('p');
			p.onmouseover = new Function('this.className="hover";');
			p.onmouseout = new Function('this.className="";');
			var link = document.createElement('a');
			link.appendChild(document.createTextNode("Add to moderators"));
			link.setAttribute('href', 'javascript:void(0)');
			link.onclick = new Function("return action_user('mod','" + user_name + "', '" + sid + "');");
			p.appendChild(link);
			div.appendChild(p);
		}
	}
	if (connected && user_id == my_user_id) {
		var p = document.createElement('p');
		p.onmouseover = new Function('this.className="hover";');
		p.onmouseout = new Function('this.className="";');
		var link = document.createElement('a');
		link.appendChild(document.createTextNode("Away"));
		link.setAttribute('href', 'javascript:void(0)');
		link.onclick = new Function("return action_user('away', prompt('Reason',''), '" + sid + "');");
		p.appendChild(link);
		div.appendChild(p);
		var p = document.createElement('p');
		p.onmouseover = new Function('this.className="hover";');
		p.onmouseout = new Function('this.className="";');
		var link = document.createElement('a');
		link.appendChild(document.createTextNode("Log off"));
		link.setAttribute('href', 'javascript:void(0)');
		link.onclick = new Function("hideMenu();return CB_disconnect();");
		p.appendChild(link);
		div.appendChild(p);
	}
	document.body.appendChild(div);
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

var params = "?archives=0"; // Thiết lập có lấy tin lưu trữ trước đó hay không

$(function () {

	/**
	 * Tải dữ liệu chatbox
	 * chatbox_messages     Tin nhắn chatbox
	 * chatbox_memberlist   Thành viên đang truy cập
	 * chatbox_last_update  Thời điểm cập nhật cuối
	 */


	/**
	 * Tabs
	 * Khi kích hoạt sẽ đổi data-id của khung nhập liệu
	 */
	$("#chatbox_tabs").on("click", "li", function () {
		var $this = $(this);
		$(".chatbox_change.active").removeClass("active");
		$this.addClass("active");
		var id = $this.attr("data-id");
		$(".chatbox_content").hide();
		$('.chatbox_content[data-id="' + id + '"]').show();
		var key = "";
		if (id !== "publish") {
			key = id + $this.attr("data-name") + $this.attr("data-users");
		}
		$("#chatbox_send").attr("data-key", key);

		my_setcookie("chatbox_active", id, false); // Lưu cookie cho tab vừa click
	});

	var uId, uName; // Đặt biến lấy id, nickname của thành viên đang truy cập chatbox
	var regexpPM = /^(<span style="color: #[0-9A-F]{6}">(<(strike|i|u|strong)>)*)(\d{13,}_\d+)({.*})(\["[^"]+"(\,"[^"]+")+\])(.*)$/; // Mã kiểm tra định dạng tin nhắn riêng

	var lastMess; // Lấy html của tin cuối cùng
	var filterMess = function () {
		
		if (chatbox_messages) {
			chatbox_messages = chatbox_messages.replace(/<p class="chatbox_row_(1|2) clearfix">/, '<p class="chatbox_row clearfix">');
			
			if (lastMess !== undefined) {
				// var regexpDate = /<span class="date-and-time" title="\d{2} \w{3} \d{4}">\[\d{2}:\d{2}:\d{2} \d{2}\/\d{2}\/\d{2}\]<\/span>/;
				// if (regexpDate.test(lastMess)) {
				// 	var splitLastMess = lastMess.split(regexpDate);
				// 	lastMess = splitLastMess[0] + lastMess.match(regexpDate)[0].replace(/\s\d{2}\/\d{2}\/\d{2}/, "") + splitLastMess[1];
				// }
				chatbox_messages = chatbox_messages.split(lastMess)[1];
			}

			var arr = $.parseHTML(chatbox_messages);

			$.each(arr, function (i, val) { // Duyệt qua từng tin

				var $this = $(this); // Đặt biến cho tin nhắn đang xét

				var messText = $(".msg", $this).html();

				if (regexpPM.test(messText)) { // Nếu đúng định dạng

					/**
					 * Tạo array chứa các thành phần của tin nhắn riêng
					 *
					 * 0  htmlString
					 * 1  Tag định dạng văn bản
					 * 2  Tag (không quan trọng)
					 * 3  Tag (không quan trọng)
					 * 4  data-id
					 * 5  conversation name
					 * 6  arrayString nickname các thành viên
					 * 7  Nickname thành viên cuối (không quan trọng)
					 * 8  nội dung và tag đóng
					 */
					var arrMess = messText.match(regexpPM);

					var arrUsers = JSON.parse(arrMess[6]); // Array nickname các thành viên

					var indexUser = $.inArray(uName, arrUsers); // Lấy vị trí index nickname của thành viên đang truy cập trong arrayString

					if (indexUser !== -1) { // Nếu có nickname của thành viên đang truy cập trong danh sách

						var dataId = arrMess[4];

						var $private = $('.chatbox_content[data-id="' + dataId + '"]'); // Đặt biến cho mục chat riêng
						var $tabPrivate = $('.chatbox_change[data-id="' + dataId + '"]'); // Đặt biến cho tab của mục

						if (!$private.length) { // Nếu chưa có mục chat riêng thì tạo mới
							$private = $("<div>", {
								"class": "chatbox_content",
								"data-id": dataId
							}).appendTo("#chatbox_forumvi"); // Thêm vào khu vực chatbox

							var chat_name = arrMess[5].slice(1, -1);

							if (chat_name === '') {
								chat_name = $.grep(arrUsers, function (n, i) {
									return (n !== uName);
								}).join(", "); // Đặt tên tab là các nickname đang chat với mình
							}

							$tabPrivate = $("<li>", {
								"class": "chatbox_change",
								"data-id": dataId,
								"data-name": arrMess[5],
								"data-users": arrMess[6],
								text: chat_name
							}).appendTo("#chatbox_tabs"); // Thêm vào tab
						}



						$(".msg", $this).html(arrMess[1] + arrMess[8]); // Xóa phần đánh dấu tin nhắn
						$this.appendTo($private.hide()); // Thêm tin nhắn vào mục chat riêng theo data-id

						// Active tab theo cookie
						if (my_getcookie("chatbox_active") === dataId) {
							$tabPrivate.click();
						}

					}

				} else {
					$this.appendTo('.chatbox_content[data-id="publish"]'); // Thêm tin nhắn thường vào mục chat chung
				}

				var messTime = $(".date-and-time", $this),
					messTimeText = messTime.text();

				if (messTimeText.indexOf(" ") !== -1) {
					var arrTime = messTimeText.match(/\[(\S+)\s(\S+)\]/);
					messTime.text("[" + arrTime[1] + "]");
					if (!$this.closest(".chatbox_content").find(".chatbox_day:contains('" + arrTime[2] + "')").length) {
						$this.before('<p class="chatbox_row chatbox_day clearfix">' + arrTime[2] + '</p>')
					}
				}

				if (lastMess) {
					
					$this.addClass("chatbox_newMess");
					setTimeout(function () {
						$this.removeClass("chatbox_newMess");
					}, 700);
				}
			});
			
			lastMess = chatbox_messages.match(/<p class="chatbox_row clearfix">(?:.(?!<p class="chatbox_row clearfix">))*<\/p>$/)[0];

		}
	};

	var getDone = function (chatsource) {

		if (chatsource.indexOf("<!DOCTYPE html PUBLIC") === 0) {
			alert("Mất kết nối đến máy chủ. Vui lòng đăng nhập lại!");
			return false;
		} else {

			eval(chatsource);
			filterMess();

			$("#chatbox_members").html(chatbox_memberlist); // Thêm dach sách thành viên

			$("a", "#chatbox_members").each(function () { // Duyệt từng thành viên trong danh sách

				/**
				 * Tạo một array các thành phần trong oncontextmenu
				 *
				 * 0  "return showMenu" (không quan trọng)
				 * 1  user_id
				 * 2  user_name
				 * 3  my_user_id
				 * 4  my_chat_level
				 * 5  my_user_level
				 * 6  user_chat_level
				 * 7  user_level
				 * 8  event
				 * 9  sid
				 * 10 conversation_name
				 * 11 ";" (không quan trọng)
				 */
				var dataMenu = $(this).attr("oncontextmenu").split(/\(|,|\)/);

				if (dataMenu[1] === dataMenu[3]) { // Nếu user_id trùng với my_user_id

					uId = dataMenu[1]; // Lấy ra id của thành viên đang truy cập
					uName = dataMenu[2].slice(1, -1); // Lấy ra nickname của thành viên đang truy cập

					return false;
				}
			});

			// Gửi tin nhắn
			$("#chatbox_send").submit(function (event) {
				event.preventDefault();
				var $message = $("#chatbox_message"),
					messVal = $message.val();

				var $send = $("#chatbox_submit");
				$message.add($send).attr("disabled", true);
				$message.val("");

				$.post("/chatbox/chatbox_actions.forum" + params, {
					mode: "send",
					sent: $(this).attr("data-key") + messVal,
					sbold: $("#chatbox_sbold").val(),
					sitalic: $("#chatbox_sitalic").val(),
					sunderline: $("#chatbox_sunderline").val(),
					sstrike: $("#chatbox_sstrike").val(),
					scolor: $("#chatbox_scolor").val()
				}).done(function () {

					// Xử lý khi gửi thành công
					$message.add($send).attr("disabled", false);

					// Cập nhật tin nhắn
					$.get("/chatbox/chatbox_actions.forum" + params + "&mode=refresh").done(function (data) {
						if (chatsource.indexOf("<!DOCTYPE html PUBLIC") === 0) {
							alert("Mất kết nối đến máy chủ. Vui lòng đăng nhập lại!");
							return false;
						} else {
							eval(data);
							filterMess();

							$message.focus();
						}

					});

				}).fail(function () {
					alert("Tin nhắn chưa được gửi!");
				});
			});
		}
	};

	$.get("/chatbox/chatbox_actions.forum" + params).done(function (data) {
		getDone(data);
	}).fail(function (data) {
		if (data.responseText.indexOf("document.getElementById('refresh_auto')") === 0) {
			$.post("/chatbox/chatbox_actions.forum" + params, {
				mode: "send",
				sent: ""
			}).done(function () {
				$.get("/chatbox/chatbox_actions.forum" + params).done(function (data) {
					getDone(data);
				});
			});
		} else {
			alert("Mất kết nối đến máy chủ. Vui lòng đăng nhập lại!");
			return false;
		}
	});
});

//document.getElementById('refresh_auto').checked = false;
//ajax_connect('?archives=0', 'disconnect');
//if (connected) CB_disconnect();
//document.getElementById('chatbox_option_co').style.display = '';
//document.getElementById('chatbox_option_disco').style.display = 'none';
//document.getElementById('chatbox_option_autorefresh').style.display = 'none';
//document.getElementById('chatbox_messenger_form').style.display = 'none';
//connected = 0;
//var chatbox_messages = '<p class=\"chatbox_row_1 clearfix\"><span title=\"03 Aug 2014\">[20:41:52]</span>&nbsp;<span style=\"font-style:italic\">You are disconnected.</span></span></p>';
//var chatbox_memberlist = '';
//var chatbox_last_update = 1407073312.0527;

//function ajax_connect(params, mode) {
//	if (params == '' || params == undefined) {
//		params = '?achives=0';
//	}
//	if (window.XMLHttpRequest) {
//		var http_request = new XMLHttpRequest();
//	} else if (window.ActiveXObject) {
//		var http_request = new ActiveXObject("Microsoft.XMLHTTP");
//	}
//	http_request.onreadystatechange = function () {
//		if (http_request.readyState == 4 && http_request.status == 200) {
//			var parsed_text = http_request.responseText;
//			if (parsed_text) {
//				if (mode == 'connect') {
//					document.getElementById('chatbox_option_co').style.display = 'none';
//					document.getElementById('chatbox_option_disco').style.display = '';
//					document.getElementById('refresh_auto').checked = true;
//					document.getElementById('chatbox_option_autorefresh').style.display = '';
//					document.getElementById('chatbox_messenger_form').style.display = '';
//					document.getElementById('chatbox_footer').style.display = 'block';
//					connected = 1;
//					number_of_refresh = 0;
//				} else if (mode == 'disconnect') {
//					document.getElementById('chatbox_option_co').style.display = '';
//					document.getElementById('chatbox_option_disco').style.display = 'none';
//					document.getElementById('chatbox_option_autorefresh').style.display = 'none';
//					document.getElementById('chatbox_messenger_form').style.display = 'none';
//					document.getElementById('chatbox_footer').style.display = 'none';
//					connected = 0;
//				}
//				refresh_chatbox(params);
//			}
//		}
//	};
//	http_request.open('GET', '/chatbox/chatbox_actions.forum' + params + '&mode=' + mode + '&tid=9e99bf57fdea2d77d0b576819ad92267', true);
//	http_request.send(null);
//}
//
//function CB_disconnect() {
//	if (connected) {
//		ajax_connect('?archives', 'disconnect');
//		clearInterval(refresh_interval);
//	} else {
//		ajax_connect('?archives', 'connect');
//		try {
//			refresh_interval = setInterval("refresh_chatbox('?archives')", 5000);
//		} catch (err) {}
//	}
//}
//if (document.location.href.indexOf('chatbox', 1) == -1) {
//	$('#divcolor').css('display', 'none');
//	$('#divsmilies').css('display', 'none');
//}
//var connected = false;
//var chatbox_updated = 1407100754;
//var chatbox_last_update = 1407100754;
//var template_color = '#333333';
//var refresh_interval;
//window.setTimeout("document.getElementById('chatbox').scrollTop = 999999; Init_pref();", 200);
//window.setTimeout("document.getElementById('chatbox').scrollTop = 999999;", 1000);
//if (connected) {
//	try {
//		refresh_interval = setInterval("refresh_chatbox('?archives')", 5000);
//	} catch (err) {}
//} else {
//	try {
//		refresh_chatbox('?archives');
//	} catch (err) {}
//}