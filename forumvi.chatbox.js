/**
 * Các function mặc định và các biến chung
 * 
 * action_user
 * copy_user_name
 * my_getcookie
 * my_setcookie
 */

var $wrap = $("#chatbox-wrap"); // Khối bao quanh tin nhắn
var $messenger = $("#chatbox-messenger-input"); // input nhập liệu
var $form = $("#chatbox-form"); // form gửi tin
var uId, uName; // user id, user name của thành viên đang truy cập chatbox(mình)

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

/**
 * Xử lý các tin nhắn
 */

var regexpPM = /^(<span style="color: #[0-9A-F]{6}">(<(strike|i|u|strong)>)*)(\d{13,}_\d+)({.*})(\["[^"]+"(\,"[^"]+")+\])(.*)$/; // Mã kiểm tra định dạng tin nhắn riêng
var lastMess; // Lấy html của tin cuối cùng

var filterMess = function (chatsource) {

	/**
	 * Tải dữ liệu chatbox
	 * chatbox_messages     Tin nhắn chatbox
	 * chatbox_memberlist   Thành viên đang truy cập
	 * chatbox_last_update  Thời điểm cập nhật cuối
	 */
	eval(chatsource); // Chuyển đổi để các biến chạy được

	if (chatbox_messages) { // Có tin nhắn

		if (lastMess) { // Có tin nhắn cuối
			chatbox_messages = chatbox_messages.split(lastMess)[1]; // Cắt bỏ tin nhắn cũ, lấy tin mới
		}
		
		if (chatbox_messages) { // Có tin nhắn mới
			var arr = $.parseHTML(chatbox_messages); // Chuyển htmlString tin nhắn thành HTML

			$.each(arr, function (i, val) { // Duyệt qua từng tin

				var $this = $(this); // Đặt biến cho tin nhắn đang xét

				var messText = $(".msg", $this).html(); // Lấy HTML phần nội dung tin nhắn

				if (regexpPM.test(messText)) { // Nếu đúng định dạng tin riêng

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

						var dataId = arrMess[4]; // data-id lấy từ tin nhắn

						var $private = $('.chatbox-content[data-id="' + dataId + '"]'); // Đặt biến cho mục chat riêng ứng với data-id lấy được
						var $tabPrivate = $('.chatbox-change[data-id="' + dataId + '"]'); // Đặt biến cho tab của mục tương ứng

						if (!$tabPrivate.length) { // Nếu chưa có mục chat riêng thì tạo mới
							$private = $("<div>", {
								"class": "chatbox-content",
								"data-id": dataId
							}).appendTo("#chatbox-wrap"); // Thêm vào khu vực chatbox

							var chat_name = arrMess[5].slice(1, -1); // Đặt biến cho tên tab là phần ký tự trong dấu {}

							if (chat_name === '') {
								chat_name = $.grep(arrUsers, function (n, i) {
									return (n !== uName);
								});

								if (chat_name.length === 1) {
									chat_name = chat_name[0];
									$("#chatbox-members").find('a[onclick="return copy_user_name(\'' + chat_name + '\');"]').parent().hide();
								} else {
									chat_name = chat_name.join(", "); // Đặt tên tab là các nickname đang chat với mình
								}
							}

							$tabPrivate = $("<div>", {
								"class": "chatbox-change",
								"data-id": dataId,
								"data-name": arrMess[5],
								"data-users": arrMess[6],
								html: '<h3>' + chat_name + '</h3><span class="chatbox-change-mess" data-mess="0">0</span>'
							}).appendTo("#chatbox-list"); // Thêm vào khu vực tab

							$("#chatbox-title > h2").text(chat_name);
						}

						$(".msg", $this).html(arrMess[1] + arrMess[8]); // Xóa phần đánh dấu tin nhắn
						$this.appendTo($private.hide()); // Thêm tin nhắn vào mục chat riêng theo data-id

						if (my_getcookie("chatbox_active") === dataId) { // Active tab khi có cookie
							$tabPrivate.click();
						}

					}

				} else { // Nếu không đúng định dạng mã tin riêng
					$this.appendTo('.chatbox-content[data-id="publish"]'); // Thêm tin nhắn thường vào mục chat chung
				}

				var messTime = $(".date-and-time", $this), // Lấy định dạng thời gian
					messTimeText = messTime.text();
				var arrTime = messTimeText.match(/\[(\S+)\s(\S+)\]/);

				messTime.text("[" + arrTime[1] + "]"); // Dùng thông số giờ:phút:giây cho tin nhắn

				if (!$this.closest(".chatbox-content").find(".chatbox-date:contains('" + arrTime[2] + "')").length) { // Nếu trong mục chưa có thông số ngày/tháng/năm
					$this.before('<p class="chatbox_row_1 chatbox-date clearfix">' + arrTime[2] + '</p>'); // Thêm vào thông số ngày/tháng/năm
				}

				// Hiệu ứng cho tin nhắn mới
				if (lastMess) { // Không chạy với lần tải đầu tiên
					$this.addClass("chatbox-newmess");
					setTimeout(function () {
						$this.removeClass("chatbox-newmess");
					}, 700);
				}
			});

			lastMess = chatbox_messages.match(/<p class="chatbox_row_(1|2) clearfix">(?:.(?!<p class="chatbox_row_(1|2) clearfix">))*<\/p>$/)[0]; // Cập nhật tin nhắn cuối

			$wrap.scrollTop(99999); // Cuộn xuống dòng cuối cùng
		}
	}
};

var getDone = function (chatsource) { // Xử lý khi tải xong dữ liệu tin nhắn

	if (chatsource.indexOf("<!DOCTYPE html PUBLIC") === 0) { // Lỗi do logout
		alert("Mất kết nối đến máy chủ. Vui lòng đăng nhập lại!");
		return false;
	} else { // Đã login

		/**
		 * Tải dữ liệu chatbox
		 *
		 * chatbox_messages     Tin nhắn chatbox
		 * chatbox_memberlist   Thành viên đang truy cập
		 * chatbox_last_update  Thời điểm cập nhật cuối
		 */

		$("#chatbox-members").html(chatbox_memberlist); // Thêm dach sách thành viên

		$("a", "#chatbox-members").each(function () { // Duyệt từng thành viên trong danh sách

			var $this = $(this);

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
			 * 10 ";" (không quan trọng)
			 */
			var dataMenu = $this.attr("oncontextmenu").split(/\(|,|\)/);
			$this.removeAttr("oncontextmenu"); // Xóa contextmenu để tạo menu mới

			var user_id = dataMenu[1],
				user_name = dataMenu[2].slice(1, -1),
				my_user_id = dataMenu[3],
				my_chat_level = dataMenu[4],
				my_user_level = dataMenu[5],
				user_chat_level = dataMenu[6],
				user_level = dataMenu[7],
				event = dataMenu[8],
				sid = dataMenu[9];

			$(".chatbox-change > h3").each(function () {
				if ($(this).text() == user_name) {
					$this.parent().hide();
					return false;
				}
			});

			if (user_id === my_user_id) { // Nếu user_id trùng với my_user_id
				uId = my_user_id; // Lấy ra id của mình
				uName = user_name; // Lấy ra nickname của mình
				$("#chatbox-me > h2").html('<a href="/u' + user_id + '" target="_blank" style="color:' + $this.find('span').css('color') + '">' + uName + '</a>');
				$this.parent().remove();

			} else {

				var $setting = $("<div>").addClass("chatbox-setting");
				$setting.insertAfter($this);
				var $list = $("<ul>").addClass("chatbox-dropdown");
				$list.appendTo($setting);

				var quickAction = function (cmd, txt) { // Tạo nhanh menu action
					$("<li>", {
						"class": "chatbox-action",
						"data-action": "/" + cmd + " " + user_name,
						text: txt
					}).appendTo($list);
				};

				quickAction("chat", "Trò chuyện riêng");
//				quickAction("gift", "Tặng video, nhạc");

				if (my_chat_level == 2) { // Mình có quyền quản lý				
					if (user_chat_level != 2) { // Nick này cấp bậc thấp hơn mình

						quickAction("kick", "Mời ra khỏi chatbox");
						quickAction("ban", "Cấm người này truy cập");
					}
					if (my_user_level == 1 && user_chat_level == 2 && user_level != 1) { // Nick này có quyền quản lý nhưng cấp thấp hơn mình
						quickAction("unmod", "Xóa quyền quản lý");
					} else if (my_user_level == 1 && user_chat_level != 2) { // Nick này chưa có quền quản lý và cấp thấp hơn mình
						quickAction("mod", "Thăng cấp quản lý");
					}
				}
			}

		});

		filterMess(chatsource); // Lọc và xử lý các tin nhắn trong chatbox_messages		
	}
};

var update = function (url) {
	$.get(url).done(function (data) { // Tải dữ liệu chatbox
		getDone(data);
	}).fail(function (data) {
		if (data.responseText.indexOf("document.getElementById('refresh_auto')") === 0) { // Nếu disconnect
			$.post("/chatbox/chatbox_actions.forum?archives=1", { // Gửi tin nhắn rỗng để connect
				mode: "send",
				sent: ""
			}).done(function () {
				$.get(url).done(function (data) { // Tải dữ liệu chatbox
					getDone(data);
				});
			});
		} else {
			// Xử lý cho các lỗi khác không phải do disconnect
			alert("Lỗi chưa xác định!");
		}
	});
};

update("/chatbox/chatbox_actions.forum?archives=1");

setInterval(function () {
	update("/chatbox/chatbox_actions.forum?archives=1&mode=refresh");
}, 5000);

/**
 * Chuyển/xóa/thêm tab chat
 */

// Chuyển tab

$("#chatbox-list").on("click", ".chatbox-change", function () {
	var $this = $(this);
	$(".chatbox-change.active").removeClass("active");
	$this.addClass("active");
	var dataID = $this.attr("data-id");
	$(".chatbox-content").hide();
	$('.chatbox-content[data-id="' + dataID + '"]').show();
	var key = "";
	if (dataID !== "publish") {
		key = dataID + $this.attr("data-name") + $this.attr("data-users");
	}
	$form.attr("data-key", key);
	$("#chatbox-title > h2").text($("h3", $this).text());

	my_setcookie("chatbox_active", dataID, false); // Lưu cookie cho tab vừa click
	
	$wrap.scrollTop(99999); // Cuộn xuống dòng cuối cùng
	
});

$("#chatbox-members").on("click", ".chatbox-action", function () {
	var $this = $(this);
	var dataAction = $this.attr("data-action"),
		cmd = dataAction.match(/^\/(chat|gift|kick|ban|mod|unmod)\s(.+)$/);
	var action = cmd[1],
		nickname = cmd[2];
	if (action === "chat" || action === "gift") {
		if (action === "chat") {
			
			var dataId = new Date().getTime() + "_" + uId; // Tạo data-id
			
			var $newTab = $("<div>", {
				"class": "chatbox-change",
				"data-id": dataId,
				"data-name": "{}",
				"data-users": '["' + uName + '","' + nickname + '"]',
				html: '<h3>' + nickname + '</h3><span class="chatbox-change-mess" data-mess="0">0</span>'
			}).appendTo("#chatbox-list"); // Tạo tab chat riêng mới
			
			$("<div>", {
				"class": "chatbox-content",
				"data-id": dataId,
				"style": "display: none;"
			}).appendTo($wrap); // Tạo mục chat riêng mới
			
			$newTab.click(); // Kích hoạt tab chat riêng
			$this.parents("li").hide(); // Ẩn nickname trong danh sách
		}
	} else {
		$messenger.val(dataAction);
		$form.submit();
	}
});

// Ẩn/hiện tab

$("#chatbox-hidetab").click(function () {
	var $this = $(this),
		tabs, main, status;
	$this.toggleClass(function () {
		if ($this.hasClass("show")) { // ẩn tab
			tabs = -270;
			main = 0;
			status = "hide";
		} else { // hiện tab
			tabs = 0;
			main = 270;
			status = "show";
		}
		$("#chatbox-tabs").css("left", tabs);
		$("#chatbox-main").css("left", main);
		my_setcookie("chatbox_tabs", status, false); // Lưu cookie cho tab vừa click
	});
});

if (my_getcookie("chatbox_tabs") === "hide") {
	$("#chatbox-hidetab").click();
}

/**
 * Gửi tin nhắn và xử lý các lệnh cmd
 */

$form.submit(function (event) { // Gửi tin nhắn
	event.preventDefault(); // Chặn sự kiện submit
	
	var messVal = $messenger.val();
	var key = $form.attr("data-key");
	if(/^\/(kick|ban|mod|unmod|cls|clear|me)/.test(messVal)) {
		key = "";		
	}

	var $send = $("#chatbox-submit");
	$messenger.add($send).attr("disabled", true);
	$messenger.val("");

	$.post("/chatbox/chatbox_actions.forum?archives=1", {
		mode: "send",
		sent: key + messVal,
		sbold: $("#chatbox-input-bold").val(),
		sitalic: $("#chatbox-input-italic").val(),
		sunderline: $("#chatbox-input-underline").val(),
		sstrike: $("#chatbox-input-strike").val(),
		scolor: $("#chatbox-input-color").val()
	}).done(function () {

		// Cập nhật tin nhắn
		$.get("/chatbox/chatbox_actions.forum?archives=1&mode=refresh").done(function (data) {
			getDone(data);
			$messenger.add($send).attr("disabled", false);
			$messenger.focus();
		});

	}).fail(function () {
		alert("Tin nhắn chưa được gửi!");
	});
});

/**
 * Các công cụ soạn thảo tin nhắn
 * 
 * Chữ in đậm, in nghiêng, gạch dưới, gạch bỏ
 * Chọn màu
 * Chọn biểu tượng cảm xúc
 */