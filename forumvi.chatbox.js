/*!
 * Chatbox forumvi version 0.1
 * 
 * Author: Zzbaivong (lelinhtinh@gmail.com}
 * Homepage: http://devs.forumvi.com
 */

/**
 * Các biến chính, sử dụng nhiều
 */
var firstTime = true; // Lần truy cập đầu tiên

var $wrap = $("#chatbox-wrap"); // Khối bao quanh tin nhắn
var $messenger = $("#chatbox-messenger-input"); // input nhập liệu
var $form = $("#chatbox-form"); // form gửi tin
var uId, uName; // user id, user name của thành viên đang truy cập chatbox(mình)
var autoRefresh; // Cập nhật tin nhắn mỗi 5 giây
var $title = $("title"); // Tiêu đề của trang

var regexpPM = /^(<span style="color: (#[0-9A-Fa-f]{6}|rgb\(\d{2,3}, \d{2,3}, \d{2,3}\));?">(<(strike|i|u|strong)>)*)(\d{13,}_\d+)({.*})(\["[^"]+"(\,"[^"]+")+\])(.*)$/; // Mã kiểm tra định dạng tin nhắn riêng
var lastMess; // Lấy html của tin cuối cùng

/**
 * Lấy Link của người dùng trong danh sách bằng nickname
 * 
 * @param {String} nickname của người cần lấy
 * return {Object}
 */
var userOnline = function (user_name) {
	return $("#chatbox-members").find('a[onclick="return copy_user_name(\'' + user_name + '\');"]');
};

var chatbox_old_update = 0;

var oldMessage; // Nội dung các tin nhắn vừa được gửi trước đó

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

/**
 * Xử lý dữ liệu tin nhắn để chuyển đến dạng tab riêng mình cần
 *
 * @param {htmlString} Dữ liệu tin nhắn mới
 */
var newMessage = function (Messages) {
	if (Messages) {

		var arr = $.parseHTML(Messages); // Chuyển htmlString tin nhắn thành HTML

		$.each(arr, function (i, val) { // Duyệt qua từng tin

			var $this = $(this); // Đặt biến cho tin nhắn đang xét

			var $msg = $(".msg", $this);

			var messText = $msg.html(); // Lấy HTML phần nội dung tin nhắn			

			if (regexpPM.test(messText)) { // Nếu đúng định dạng tin riêng

				/**
				 * Tạo array chứa các thành phần của tin nhắn riêng
				 *
				 * 0  htmlString
				 * 1  Tag định dạng văn bản
				 * 2  Mã màu
				 * 3  Tag (không quan trọng)
				 * 4  Tag (không quan trọng)
				 * 5  data-id
				 * 6  conversation name
				 * 7  arrayString nickname các thành viên
				 * 8  Nickname thành viên cuối (không quan trọng)
				 * 9  nội dung và tag đóng
				 */
				var arrMess = messText.match(regexpPM);

				var arrUsers = JSON.parse(arrMess[7]); // Array nickname các thành viên

				var indexUser = $.inArray(encodeURIComponent(uName), arrUsers); // Lấy vị trí index nickname của thành viên đang truy cập trong arrayString

				if (indexUser !== -1) { // Nếu có nickname của thành viên đang truy cập trong danh sách

					var dataId = arrMess[5]; // data-id lấy từ tin nhắn

					var $private = $('.chatbox-content[data-id="' + dataId + '"]'); // Đặt biến cho mục chat riêng ứng với data-id lấy được
					var $tabPrivate = $('.chatbox-change[data-id="' + dataId + '"]'); // Đặt biến cho tab của mục tương ứng

					if (!$tabPrivate.length) { // Nếu chưa có mục chat riêng thì tạo mới
						$private = $("<div>", {
							"class": "chatbox-content",
							"data-id": dataId,
							style: "display: none;"
						}).appendTo("#chatbox-wrap"); // Thêm vào khu vực chatbox

						var chat_name = arrMess[6].slice(1, -1); // Đặt biến cho tên tab là phần ký tự trong dấu {}

						if (chat_name === '') {
							chat_name = $.grep(arrUsers, function (n, i) {
								return (n !== encodeURIComponent(uName));
							});

							if (chat_name.length === 1) {
								chat_name = decodeURIComponent(chat_name[0]);
								var $tabname = userOnline(chat_name);
								$tabname.parent().hide();
							} else {
								chat_name = decodeURIComponent(chat_name.join(", ")); // Đặt tên tab là các nickname đang chat với mình
							}
						}

						$tabPrivate = $("<div>", {
							"class": "chatbox-change",
							"data-id": dataId,
							"data-name": arrMess[6],
							"data-users": arrMess[7],
							html: '<h3 style="color:' + $tabname.css('color') + '">' + chat_name + '</h3><span class="chatbox-change-mess"></span>'
						}).appendTo("#chatbox-list"); // Thêm vào khu vực tab

					} else if ($tabPrivate.is(":hidden") && $msg.text().indexOf("]/out") === -1) {
						$tabPrivate.show();
						userOnline($tabPrivate.find("h3").text()).parent().hide();
					}

					$msg.html(arrMess[1] + arrMess[9]); // Xóa phần đánh dấu tin nhắn
					$this.appendTo($private); // Thêm tin nhắn vào mục chat riêng theo data-id

				}

			} else { // Nếu không đúng định dạng mã tin riêng
				$this.appendTo('.chatbox-content[data-id="publish"]'); // Thêm tin nhắn thường vào mục chat chung
			}

			var msgId = $this.closest(".chatbox-content").attr("data-id");
			var $msgTab = $(".chatbox-change[data-id='" + msgId + "']");
			messText = $msg.text();
			if (messText === "/buzz") { // Nếu có ký hiệu buzz
				$msg.html('<img src="http://i.imgur.com/9GvQ6Gd.gif" width="62" height="16" />'); // Thay bằng ảnh buzz
				if (!firstTime && $("#chatbox-main").css("left") !== "0px") { // Không chạy hiệu ứng buzz trong lần truy cập đầu tiên
					$msgTab.click();
					$("#chatbox-forumvi").addClass("chatbox-buzz");
					$("#chatbox-buzz-audio")[0].play();
					setTimeout(function () {
						$("#chatbox-forumvi").removeClass("chatbox-buzz");
						$messenger.focus();
					}, 1000);
				}
			} else if (messText.indexOf("/out") === 0 && msgId !== "publish") {
				if ($this.find(".user > a").text() === uName) {
					$msgTab.add(".chatbox-content[data-id='" + msgId + "']").hide();
					var otherUser = decodeURIComponent($.grep($msgTab.data("users"), function (n, i) {
						return (n !== encodeURIComponent(uName));
					})[0]);
					userOnline(otherUser).parent().show();
					if (my_getcookie('chatbox_active') === msgId) {
						$(".chatbox-change[data-id='publish']").click();
						my_setcookie('chatbox_active', msgId);
					}
					$this.replaceWith('<p class="chatbox-userout me clearfix">Bạn đã rời khỏi phòng.</p>');
				} else {
					$this.replaceWith('<p class="chatbox-userout clearfix"><strong>' + $this.find('.user > a').text() + '</strong> đã rời khỏi phòng.</p>');
				}
			}

			var messTime = $(".date-and-time", $this), // Lấy định dạng thời gian
				messTimeText = messTime.text();
			var arrTime = messTimeText.match(/\[(\S+)\s(\S+)\]/);

			messTime.text("[" + arrTime[1] + "]"); // Dùng thông số giờ:phút:giây cho tin nhắn

			if (!$this.closest(".chatbox-content").find(".chatbox-date:contains('" + arrTime[2] + "')").length) { // Nếu trong mục chưa có thông số ngày/tháng/năm
				$this.before('<p class="chatbox-date clearfix">' + arrTime[2] + '</p>'); // Thêm vào thông số ngày/tháng/năm
			}

		});

		setTimeout(function () {
			var $tabCookie = $('.chatbox-change[data-id="' + my_getcookie('chatbox_active') + '"]');
			if ($tabCookie.length && $tabCookie.is(":visible")) {
				$('.chatbox-change[data-id="' + my_getcookie('chatbox_active') + '"]').click(); // Active tab khi có cookie
			}
		}, 200);
		
		var messCounterObj = JSON.parse(sessionStorage.getItem("messCounter"));
		var allNewMess = 0; // Đếm số tin nhắn mới

		$(".chatbox-content").each(function () {
			var $this = $(this),
				dataID = $this.attr("data-id");
			var messLength = $(".chatbox_row_1, .chatbox_row_2", $this).length; // Số tin nhắn
			var $count = $(".chatbox-change[data-id='" + dataID + "']").find(".chatbox-change-mess"); // tab tương ứng
			var mLength = messLength; // đặt biến trung gian

			var oldMessLength = 0;
			if (messCounterObj && messCounterObj[dataID]) {
				oldMessLength = parseInt(messCounterObj[dataID], 10);
			}

			mLength = messLength - oldMessLength; // trừ lấy số tin mới

			if (mLength <= 0) { // Nếu không có tin mới
				mLength = ""; // Xóa bộ đếm
			} else {
				allNewMess += mLength; // Lấy tổng số tin mới
				mLength = "<strong>" + mLength + "</strong>";
			}

			$count.html(mLength);

		});

		if (allNewMess > 0) { // Nếu có tin nhắn mới
			var tit = $title.text();
			var regexpTit = /^\(\d+(\)\s.*$)/;
			if (regexpTit.test(tit)) { // Đã có số đếm
				tit = "(" + allNewMess + tit.match(regexpTit)[1];
			} else { // Chưa có số đếm
				tit = "(" + allNewMess + ") " + tit;
			}
			$title.text(tit);
		}

		setTimeout(function () {
			$wrap.scrollTop(99999); // Cuộn xuống dòng cuối cùng
		}, 300);
	}
}

/**
 * Xử lý các tin nhắn sau khi tải về
 * 
 * @param {htmlString} Dữ liệu tin nhắn
 */
var filterMess = function (chatsource) {

	/**
	 * Tải dữ liệu chatbox
	 *
	 * chatbox_messages     Tin nhắn chatbox
	 * chatbox_memberlist   Thành viên đang truy cập
	 * chatbox_last_update  Thời điểm cập nhật cuối
	 */
	eval(chatsource); // Chuyển đổi để các biến chạy được

	// if (chatbox_old_update !== chatbox_last_update) { // Nếu như chatbox được cập nhật
	// chatbox_old_update = chatbox_last_update;
	var newChatboxMessages, thisLastMess;
	if (chatbox_messages) { // Nếu có tin nhắn
		thisLastMess = chatbox_messages.match(/<p class="chatbox_row_(1|2) clearfix">(?:.(?!<p class="chatbox_row_(1|2) clearfix">))*<\/p>$/)[0]; // Lấy tin nhắn cuối trong lần này
		if (lastMess === undefined) { // Nếu trước đó ko có tin cuối => lần truy cập chatbox đầu tiên hoặc chatbox mới clear
			newChatboxMessages = chatbox_messages;
			lastMess = thisLastMess; // Cập nhật tin nhắn cuối
			newMessage(newChatboxMessages); // Xử lý tin nhắn và đưa vào chatbox
		} else if (lastMess !== thisLastMess) { // Không có tin mới
			newChatboxMessages = chatbox_messages.split(lastMess)[1]; // Cắt bỏ tin nhắn cũ, lấy tin mới
			lastMess = thisLastMess; // Cập nhật tin nhắn cuối
			newMessage(newChatboxMessages); // Xử lý tin nhắn và đưa vào chatbox
		}
	} else { // Nếu không có tin nhắn (có thể là do clear chatbox)
		lastMess = undefined; // Xóa giá trị tin nhắn cuối
	}
	//}
	$("#chatbox-forumvi:hidden").fadeIn(300); // Hiển thị chatbox
	firstTime = false;
};

/**
 * Xử lý khi tải xong dữ liệu
 * Cập nhật dữ liệu
 */

/**
 * Tạo nhanh thẻ li trong menu action
 * 
 * @param1 {Object} Thẻ ul mà nó gắn vào
 * @param2 {String} Mã lệnh cmd
 * @param3 {String} nickname dùng trong mã lệnh
 * @param4 {String} Nội dung thẻ li
 */
var quickAction = function (ele, cmd, user_name, txt) {
	if (user_name) {
		user_name = " " + user_name;
	} else {
		user_name = "";
	}
	$("<li>", {
		"class": "chatbox-action",
		"data-action": "/" + cmd + user_name,
		text: txt
	}).appendTo(ele);
};

var menuActionOne = true; // Chỉ chạy 1 lần

/**
 * Xử lý khi tải xong dữ liệu tin nhắn
 * 
 * $param {htmlString} Dữ liệu tin nhắn
 */
var getDone = function (chatsource) {

	if (chatsource.indexOf("<!DOCTYPE html PUBLIC") === 0) { // Lỗi do logout hoặc bị ban
		if (chatsource.indexOf("You have been banned from the ChatBox") !== -1) {
			alert("Bạn đã bị cấm truy cập chatbox!");
		} else {
			alert("Mất kết nối đến máy chủ. Vui lòng đăng nhập lại!");
		}
		clearInterval(autoRefresh);
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
			 * 8  event (không quan trọng)
			 * 9  sid (không quan trọng)
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
				var $h3 = $(this);
				if ($h3.text() == user_name && $h3.parent().is(":visible")) {
					$this.parent().hide(); // Ẩn nick trong danh sách
					return false;
				}
			});

			if (user_id === my_user_id) { // Nếu user_id trùng với my_user_id
				uId = my_user_id; // Lấy ra id của mình
				uName = user_name; // Lấy ra nickname của mình
				$("#chatbox-me > h2").html('<a href="/u' + user_id + '" target="_blank" style="color:' + $this.find('span').css('color') + '">' + uName + '</a>');
				$this.parent().remove();

				if (menuActionOne) {
					quickAction("#chatbox-title ul", "out", false, "Rời khỏi phòng");
					menuActionOne = false;
				}
			} else {

				var $setting = $("<div>").addClass("chatbox-setting");
				$setting.insertAfter($this);
				var $list = $("<ul>").addClass("chatbox-dropdown");
				$list.appendTo($setting);

				quickAction($list, "chat", user_name, "Trò chuyện riêng");
				// quickAction($list, "gift", user_name, "Tặng video, nhạc");

				if (my_chat_level == 2) { // Mình có quyền quản lý				
					if (user_chat_level != 2) { // Nick này cấp bậc thấp hơn mình

						// quickAction($list, "kick", user_name, "Mời ra khỏi chatbox");
						quickAction($list, "ban", user_name, "Cấm truy cập chat");
					}
					if (my_user_level == 1 && user_chat_level == 2 && user_level != 1) { // Nick này có quyền quản lý nhưng cấp thấp hơn mình
						quickAction($list, "unmod", user_name, "Xóa quyền quản lý");
					} else if (my_user_level == 1 && user_chat_level != 2) { // Nick này chưa có quền quản lý và cấp thấp hơn mình
						quickAction($list, "mod", user_name, "Thăng cấp quản lý");
					}
				}

			}

		});

		// Đặt icon online và away dựa vào class ở tiêu đề
		$(".chatbox-change > h3").each(function () { // Duyệt qua từng tab riêng			
			var $this = $(this),
				$status = $("#chatbox-members").find('a[onclick="return copy_user_name(\'' + $this.text() + '\');"]').closest("ul").prev("h4"),
				clas;
			if ($status.hasClass("online")) {
				clas = "online";
			} else if ($status.hasClass("away")) {
				clas = "away";
			}
			$this.parent().removeClass("online away").addClass(clas);
		});

		filterMess(chatsource); // Lọc và xử lý các tin nhắn trong chatbox_messages
	}
};

/**
 * Tải dữ liệu và cập nhật nội dung chatbox
 * 
 * @param {URL} Đường dẫn tải dữ liệu
 */
var update = function (url) {

	$.get(url).done(function (data) {
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
			// Xử lý cho các lỗi khác không phải do disconnect như mất kết nối internet (có thể xảy ra do refresh trang trong lúc đang tải)
			clearInterval(autoRefresh); // Dừng tự cập nhật
		}
	});

};

var autoUpdate = function () { // Tự cập nhật mỗi 5s
	autoRefresh = setInterval(function () {
		update("/chatbox/chatbox_actions.forum?archives=1&mode=refresh");
	}, 5000);
};

update("/chatbox/chatbox_actions.forum?archives=1");
autoUpdate();

/**
 * Chuyển/xóa/thêm tab chat
 */

// Đánh dấu đã xem hết tin nhắn
$messenger.on("focus click keydown", function () {
	var dataID = $messenger.attr("data-id");
	var $countMess = $(".chatbox-change[data-id='" + dataID + "']").find(".chatbox-change-mess");
	var newMess = parseInt($countMess.text(), 10);

	if (newMess) {
		var $content = $(".chatbox-content[data-id='" + dataID + "']");
		var obj = JSON.parse(sessionStorage.getItem("messCounter")) || {};
		obj[dataID] = $(".chatbox_row_1, .chatbox_row_2", $(".chatbox-content[data-id='" + dataID + "']")).length;
		sessionStorage.setItem("messCounter", JSON.stringify(obj)); // Lưu vào sessionStorage

		var noSeen = $("p", $content).length - newMess - 1;
		var $noSeen = $("p:gt(" + noSeen + ")", $content);

		// Hiệu ứng cho tin nhắn mới
		$noSeen.addClass("chatbox-newmess");
		setTimeout(function () {
			$noSeen.removeClass("chatbox-newmess");
		}, 3000);

		$title.text($title.text().replace(/\(\d+\)\s/, "")); // Xóa chỉ số tin trên tiêu đề
		$countMess.empty(); // Xóa số đếm tin mới
	}
});

// Chuyển tab
$("#chatbox-list").on("click", ".chatbox-change", function () {
	var $this = $(this);
	$(".chatbox-change.active").removeClass("active");
	$this.addClass("active");
	var dataID = $this.attr("data-id");
	$(".chatbox-content").hide();
	$('.chatbox-content[data-id="' + dataID + '"]').show();
	var key = "";
	var $titSetting = $("#chatbox-title >.chatbox-setting");
	if (dataID !== "publish") {
		key = dataID + $this.attr("data-name") + $this.attr("data-users");
		$titSetting.show();
	} else {
		$titSetting.hide();
	}
	$form.attr("data-key", key);
	$messenger.attr("data-id", dataID);
	$("#chatbox-title > h2").text($("h3", $this).text());

	$messenger.focus();
	my_setcookie("chatbox_active", dataID, false); // Lưu cookie cho tab vừa click
	$wrap.scrollTop(99999); // Cuộn xuống dòng cuối cùng

});

// Chạy các chức năng từ menu
$("#chatbox-members, #chatbox-title").on("click", ".chatbox-action", function () {
	$messenger.val($(this).attr("data-action"));
	$form.submit();
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

// Buzz
$("#chatbox-option-buzz").click(function () {
	if ($(this).html() === "BUZZ") {
		$messenger.val("/buzz");
		$form.submit();
	}
});

/**
 * Gửi tin nhắn
 * 
 * @param {String} Nội dung tin nhắn
 */
var sendMessage = function (val) {
	oldMessage = $messenger.val();
	$.post("/chatbox/chatbox_actions.forum?archives=1", {
		mode: "send",
		sent: val,
		sbold: $("#chatbox-input-bold").val(),
		sitalic: $("#chatbox-input-italic").val(),
		sunderline: $("#chatbox-input-underline").val(),
		sstrike: $("#chatbox-input-strike").val(),
		scolor: $("#chatbox-input-color").val()
	}).done(function () {

		// Cập nhật tin nhắn
		$.get("/chatbox/chatbox_actions.forum?archives=1&mode=refresh").done(function (data) {
			getDone(data);
			$messenger.focus();
		});
	}).fail(function () {
		alert("Lỗi! Tin nhắn chưa được gửi.");
		$messenger.val(oldMessage);
		// Xử lý cho lỗi mất kết nối internet (có thể xảy ra do refresh trang trong lúc đang tải)
	});
};

$form.submit(function (event) { // Gửi tin nhắn
	event.preventDefault(); // Chặn sự kiện submit

	var messVal = $messenger.val();
	if ($.trim(messVal) !== "") {

		var regexpCmd = /^\/(chat|gift|toggle|kick|ban|unban|mod|unmod|cls|clear|me)(\s(.+))?$/;

		if (regexpCmd.test(messVal)) { // Nếu là các lệnh cmd
			var cmd = messVal.match(regexpCmd);

			var action = cmd[1],
				nickname = cmd[3],
				nicknameencode = encodeURIComponent(nickname),
				uNameencode = encodeURIComponent(uName);

			if (/^(chat|gift|toggle)$/.test(action)) { // Những lệnh không gửi đi
				if (action === "chat") {
					var nickdecode = decodeURIComponent(nickname);

					// Đặt biến cho tab chat riêng
					var $newTab = $('.chatbox-change[data-users="[\\"' + uNameencode + '\\",\\"' + nicknameencode + '\\"]"]');
					if (!$newTab.length) {
						$newTab = $('.chatbox-change[data-users="[\\"' + nicknameencode + '\\",\\"' + uNameencode + '\\"]"]');
					}

					var $user = userOnline(nickname);

					if ($newTab.length) { // Nếu đã có tab chat riêng
						$newTab.show().click();
					} else {
						if ($user.length) { // Nếu có nickname trong danh sách
							$user.parent().hide(); // Ẩn nickname trong danh sách

							if (!$newTab.length) { // Nếu chưa có tab chat
								var dataId = new Date().getTime() + "_" + uId; // Tạo data-id

								// Đặt icon online và away dựa vào class ở tiêu đề
								var clas,
									$status = $user.parent().parent().prev("h4");
								if ($status.hasClass("online")) {
									clas = " online";
								} else if ($status.hasClass("online")) {
									clas = " away";
								} else {
									clas = "";
								}
								$newTab = $("<div>", {
									"class": "chatbox-change" + clas,
									"data-id": dataId,
									"data-name": "{}",
									"data-users": '["' + uNameencode + '","' + nicknameencode + '"]',
									html: '<h3 style="color:' + $user.css('color') + '">' + nickname + '</h3><span class="chatbox-change-mess"></span>'
								}).appendTo("#chatbox-list"); // Tạo tab chat riêng mới 
								$newTab.click();
								$("<div>", {
									"class": "chatbox-content",
									"data-id": dataId,
									"style": "display: none;"
								}).appendTo($wrap); // Tạo mục chat riêng mới
							}

						} else { // Nếu không có nickname trong danh sách
							if ($newTab.length) { // Nếu có tab chat riêng
								$newTab.removeClass("online away").click(); // Xóa trang thái online, away về trạng thái offline
							} else {
								if (nickname === uName) {
									alert("Phát hiện nghi vấn Tự kỷ ^^~");
								} else {
									alert("Thành viên " + nickname + " hiện không truy cập!");
								}
							}
						}
					}
				} else if (action === "toggle") {
					$("#chatbox-hidetab").click();
				}
			} else { // Những lệnh sẽ được gửi đi
				sendMessage(messVal);
			}
		} else { // Nếu là tin nhắn thường
			var messWithKey = $form.attr("data-key") + messVal; // tin nhắn có key (tin riêng)
			var messId = $messenger.attr("data-id");
			if (messVal == "/buzz") { // BUZZ

				var $buzz = $("#chatbox-option-buzz");
				if ($buzz.html() === "BUZZ") { // BUZZ chưa disable
					var timeBuzz = 59, // 30s
						timeBuzzCount;

					sendMessage(messWithKey);

					$buzz.addClass("disable"); // Thêm class để hiện số đếm lùi
					$buzz.html(60);
					timeBuzzCount = setInterval(function () {
						var zero = timeBuzz--;
						$buzz.html(zero);
						if (zero <= 0) { // Cho phép BUZZ
							clearInterval(timeBuzzCount);
							$buzz.removeClass("disable");
							timeBuzz = 59;
							timeBuzzCount = undefined;
							$buzz.html("BUZZ");
						}
					}, 1000);
				}
			} else if (messVal == "/out" && messId !== "publish") {
				sendMessage(messWithKey);
			} else {
				sendMessage(messWithKey);
			}
		}

		$messenger.val("");
	}
});