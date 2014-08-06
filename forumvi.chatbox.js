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
var autoRefresh; // Cập nhật tin nhắn mỗi 5 giây
var $title = $("title"); // Tiêu đề của trang

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

var regexpPM = /^(<span style="color: (#[0-9A-Fa-f]{6}|rgb\(\d{2}, \d{2}, \d{2}\));?">(<(strike|i|u|strong)>)*)(\d{13,}_\d+)({.*})(\["[^"]+"(\,"[^"]+")+\])(.*)$/; // Mã kiểm tra định dạng tin nhắn riêng
var lastMess; // Lấy html của tin cuối cùng

var filterMess = function (chatsource) {

	/**
	 * Tải dữ liệu chatbox
	 * chatbox_messages     Tin nhắn chatbox
	 * chatbox_memberlist   Thành viên đang truy cập
	 * chatbox_last_update  Thời điểm cập nhật cuối
	 */
	eval(chatsource); // Chuyển đổi để các biến chạy được

	if (!chatbox_messages) { // Không có tin nhắn
		lastMess = false;
	}

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

				var indexUser = $.inArray(uName, arrUsers); // Lấy vị trí index nickname của thành viên đang truy cập trong arrayString

				if (indexUser !== -1) { // Nếu có nickname của thành viên đang truy cập trong danh sách

					var dataId = arrMess[5]; // data-id lấy từ tin nhắn

					var $private = $('.chatbox-content[data-id="' + dataId + '"]'); // Đặt biến cho mục chat riêng ứng với data-id lấy được
					var $tabPrivate = $('.chatbox-change[data-id="' + dataId + '"]'); // Đặt biến cho tab của mục tương ứng

					if (!$tabPrivate.length) { // Nếu chưa có mục chat riêng thì tạo mới
						$private = $("<div>", {
							"class": "chatbox-content",
							"data-id": dataId
						}).appendTo("#chatbox-wrap"); // Thêm vào khu vực chatbox

						var chat_name = arrMess[6].slice(1, -1); // Đặt biến cho tên tab là phần ký tự trong dấu {}

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
							"data-name": arrMess[6],
							"data-users": arrMess[7],
							html: '<h3>' + chat_name + '</h3><span class="chatbox-change-mess" data-mess="0">0</span>'
						}).appendTo("#chatbox-list"); // Thêm vào khu vực tab

					}

					$(".msg", $this).html(arrMess[1] + arrMess[9]); // Xóa phần đánh dấu tin nhắn
					$this.appendTo($private.hide()); // Thêm tin nhắn vào mục chat riêng theo data-id

				}

			} else { // Nếu không đúng định dạng mã tin riêng
				$this.appendTo('.chatbox-content[data-id="publish"]'); // Thêm tin nhắn thường vào mục chat chung
			}

			if ($this.find(".msg").text() == "/buzz") { // Nếu có ký hiệu buzz
				$this.find(".msg").html('<img src="http://i.imgur.com/9GvQ6Gd.gif" width="62" height="16" />'); // Thay bằng ảnh buzz
				if (lastMess) { // Không chạy hiệu ứng buzz trong lần truy cập đầu tiên
					$(".chatbox-change[data-id='" + $this.closest(".chatbox-content").attr("data-id") + "']").click();
					$("#chatbox-forumvi").addClass("chatbox-buzz");
					$("#chatbox-buzz-audio")[0].play();
					setTimeout(function () {
						$("#chatbox-forumvi").removeClass("chatbox-buzz");
					}, 1000);
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

		lastMess = chatbox_messages.match(/<p class="chatbox_row_(1|2) clearfix">(?:.(?!<p class="chatbox_row_(1|2) clearfix">))*<\/p>$/)[0]; // Cập nhật tin nhắn cuối

		var cookieActive = my_getcookie("chatbox_active"),
			$tabActive = $('.chatbox-change[data-id="' + cookieActive + '"]');;
		if (cookieActive) { // Active tab khi có cookie
			$tabActive.click();
		}

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
			}

			$count.text(mLength);

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

		$("#chatbox-forumvi:hidden").fadeIn();

		$wrap.scrollTop(99999); // Cuộn xuống dòng cuối cùng	
	}
};

/**
 * Xử lý khi tải xong dữ liệu
 * Cập nhật dữ liệu
 */

var getDone = function (chatsource) { // Xử lý khi tải xong dữ liệu tin nhắn

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
				var $h3 = $(this);
				if ($h3.text() == user_name) {
					$this.parent().hide(); // Ẩn nick trong danh sách
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
				// quickAction("gift", "Tặng video, nhạc");

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
			// Xử lý cho các lỗi khác không phải do disconnect như mất kết nối internet (có thể xảy ra do refresh trang trong lúc đang tải)
			clearInterval(autoRefresh); // Dừng tự cập nhật
		}
	});
};

var autoUpdate = function () {
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
		var obj = JSON.parse(sessionStorage.getItem("messCounter")) || {};
		obj[dataID] = $(".chatbox_row_1, .chatbox_row_2", $(".chatbox-content[data-id='" + dataID + "']")).length;
		sessionStorage.setItem("messCounter", JSON.stringify(obj)); // Lưu vào sessionStorage

		var noSeen = $("p", $(".chatbox-content[data-id='" + dataID + "']")).length - newMess - 1;
		var $noSeen = $("p:gt(" + noSeen + ")", $(".chatbox-content[data-id='" + dataID + "']"));

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
	if (dataID !== "publish") {
		key = dataID + $this.attr("data-name") + $this.attr("data-users");
	}
	$form.attr("data-key", key);
	$messenger.attr("data-id", dataID);
	$("#chatbox-title > h2").text($("h3", $this).text());

	$messenger.focus();
	my_setcookie("chatbox_active", dataID, false); // Lưu cookie cho tab vừa click
	$wrap.scrollTop(99999); // Cuộn xuống dòng cuối cùng

});

// Chạy cách chức năng từ menu
$("#chatbox-members").on("click", ".chatbox-action", function () {
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
$("#chatbox-option-buzz").click(function(){
	$messenger.val("/buzz");
	$form.submit();
});

/**
 * Gửi tin nhắn và xử lý các lệnh cmd
 */

var sendMessage = function (val) {
	clearInterval(autoRefresh); // Dừng tự cập nhật

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

		autoUpdate(); // Chạy tự cập nhật

	}).fail(function () {
		alert("Lỗi! Tin nhắn chưa được gửi.");
		// Xử lý cho lỗi mất kết nối internet (có thể xảy ra do refresh trang trong lúc đang tải)
	});
};

$form.submit(function (event) { // Gửi tin nhắn
	event.preventDefault(); // Chặn sự kiện submit

	var messVal = $messenger.val();
	var regexpCmd = /^\/(chat|gift|kick|ban|unban|mod|unmod|cls|clear|me)\s(.+)$/;

	if (regexpCmd.test(messVal)) { // Nếu là các lệnh cmd
		var cmd = messVal.match(regexpCmd);
		var action = cmd[1],
			nickname = cmd[2];
		
		if (action === "chat" || action === "gift") { // Những lệnh không gửi đi
			if (action === "chat") {

				var $newTab = $(".chatbox-change[data-users*='\"" + nickname + "\"']"); // Đặt biến cho tab chat riêng
				var $user = $("#chatbox-members").find('a[onclick="return copy_user_name(\'' + nickname + '\');"]').parent();

				if ($user.length) { // Nếu có nickname trong danh sách
					$user.hide(); // Ẩn nickname trong danh sách

					if (!$newTab.length) { // Nếu chưa có tab chat
						var dataId = new Date().getTime() + "_" + uId; // Tạo data-id
						$newTab = $("<div>", {
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
					}

					// Đặt icon online và away dựa vào class ở tiêu đề
					var clas,
						$user = $("#chatbox-members").find('a[onclick="return copy_user_name(\'' + nickname + '\');"]').parent(),
						$status = $user.parent().prev("h4");
					if ($status.hasClass("online")) {
						clas = "online";
					} else if ($status.hasClass("online")) {
						clas = "away";
					}
					$newTab.addClass(clas).click(); // Thêm trạng thái truy cập

				} else { // Nếu không có nickname trong danh sách
					if ($newTab.length) { // Nếu có tab chat riêng
						$newTab.removeClass("online away").click(); // Xóa trang thái online, away về trạng thái offline
					} else {
						alert("Thành viên " + nickname + " hiện không truy cập!");
					}
				}
			}
		} else { // Những lệnh sẽ được gửi đi
			sendMessage(messVal);
		}
	} else { // Nếu là tin nhắn thường
		sendMessage($form.attr("data-key") + messVal);
	}
	
	$messenger.val("");
});

/**
 * Các công cụ soạn thảo tin nhắn
 *
 * Chữ in đậm, in nghiêng, gạch dưới, gạch bỏ
 * Chọn màu
 * Chọn biểu tượng cảm xúc
 */
var chooseColor = function (colo) { // Đổi màu chữ
	$("#chatbox-option-color").css("background", "#" + colo).text("#" + colo);
	$("#chatbox-input-color").val(colo);
	$("#chatbox-messenger").css("color", "#" + colo);
};
$("#chatbox-option-color").click(function () {
	var randomColor = Math.floor(Math.random() * 16777215).toString(16); // Tạo màu ngẫu nhiên
	chooseColor(randomColor);
	my_setcookie("optionColor", randomColor, false);
});
var cookieColor = my_getcookie("optionColor");
if (cookieColor) {
	chooseColor(cookieColor);
}

$("#chatbox-option-bold, #chatbox-option-italic, #chatbox-option-underline, #chatbox-option-strike").click(function () {
	var $this = $(this);

	$this.toggleClass(function () {
		var val = "1";
		if ($this.hasClass("active")) {
			val = "0";
		}
		$("#" + this.id.replace("option", "input")).val(val);
		return "active";
	});
	var arrCookie = [],
		style = "";
	$("#chatbox-form > input:not(#chatbox-input-color)").each(function (i, val) {
		var thisVal = this.value;
		arrCookie.push(thisVal);
		if (thisVal !== "0") {
			switch (i) {
			case 0:
				style += "font-weight: bold;";
				break;
			case 1:
				style += "font-style: italic;";
				break;
			case 2:
				style += "text-decoration: underline;";
				break;
			case 3:
				style += "text-decoration: line-through;";
				break;
			}
		}
	});
	$messenger.attr("style", style);
	my_setcookie("optionCookie", arrCookie.join("|"), true);
});

var getArrCookie = my_getcookie("optionCookie");
if (getArrCookie) {
	$.each(getArrCookie.split("|"), function (i, val) {
		if (val === "1") {
			$("#chatbox-option > div").eq(i).click();
		}
	});
}