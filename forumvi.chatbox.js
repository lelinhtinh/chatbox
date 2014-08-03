/*!
 * 	Chatbox forumvi v0.1 by Zzbaivong <http://devs.forumvi.com>
 */

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

var params = "?archives=1"; // Thiết lập có lấy tin lưu trữ trước đó hay không

$(function () {
	// Tin nhắn chatbox
	var chatbox_messages = '<p class=\"chatbox_row_1 clearfix\"><span class=\"date-and-time\" title=\"03 Aug 2014\">[02:36:42 03/08/14]</span>&nbsp;<span class=\"user-msg\"><span class=\"user\"><span style=\"color:#FF3F8B\"><strong>@</strong></span>&nbsp;<a href=\"/u2\" onclick=\"return copy_user_name(\'baivong\');\" target=\"_blank\"><span style=\"color:#FF3F8B\"><strong>baivong</strong></span></a>&nbsp;:&nbsp;</span><span class=\"msg\"><span style=\"color: #777777\"><strike><i><u><strong>1407003001044_2{Name}[\"baivong\"&#044;\"Zzbaivong\"&#044;\"miamor\"]asdasasd</strong></u></i></strike></span></span></span></p><p class=\"chatbox_row_2 clearfix\"><span class=\"date-and-time\" title=\"03 Aug 2014\">[02:36:46 03/08/14]</span>&nbsp;<span class=\"user-msg\"><span class=\"user\"><span style=\"color:#FF3F8B\"><strong>@</strong></span>&nbsp;<a href=\"/u2\" onclick=\"return copy_user_name(\'baivong\');\" target=\"_blank\"><span style=\"color:#FF3F8B\"><strong>baivong</strong></span></a>&nbsp;:&nbsp;</span><span class=\"msg\"><span style=\"color: #777777\">1407003001044_2{Name}[\"baivong\"&#044;\"Zzbaivong\"&#044;\"miamor\"]kkkkkk</span></span></span></p><p class=\"chatbox_row_2 clearfix\"><span class=\"date-and-time\" title=\"03 Aug 2014\">[20:55:15]</span>&nbsp;<span class=\"user-msg\"><span class=\"user\"><span style=\"color:#1ba1e2\"><strong>@</strong></span>&nbsp;<a href=\"/u64\" onclick=\"return copy_user_name(\'miamor\');\" target=\"_blank\"><span style=\"color:#1ba1e2\"><strong>miamor</strong></span></a>&nbsp;:&nbsp;</span><span class=\"msg\"><span style=\"color: #777777\">1407003001044_2{Name}[\"baivong\"&#044;\"Zzbaivong\"&#044;\"miamor\"&#044;\"K\"]hiu</span></span></span></p><p class=\"chatbox_row_1 clearfix\"><span class=\"date-and-time\" title=\"03 Aug 2014\">[02:36:49 03/08/14]</span>&nbsp;<span class=\"user-msg\"><span class=\"user\"><span style=\"color:#F00000\"><strong>@</strong></span>&nbsp;<a href=\"/u1\" onclick=\"return copy_user_name(\'Zzbaivong\');\" target=\"_blank\"><span style=\"color:#F00000\"><strong>Zzbaivong</strong></span></a>&nbsp;:&nbsp;</span><span class=\"msg\"><span style=\"color: #CC00FF\">asdas</span></span></span></p><p class=\"chatbox_row_2 clearfix\"><span class=\"date-and-time\" title=\"03 Aug 2014\">[02:36:50 03/08/14]</span>&nbsp;<span class=\"user-msg\"><span class=\"user\"><span style=\"color:#F00000\"><strong>@</strong></span>&nbsp;<a href=\"/u1\" onclick=\"return copy_user_name(\'Zzbaivong\');\" target=\"_blank\"><span style=\"color:#F00000\"><strong>Zzbaivong</strong></span></a>&nbsp;:&nbsp;</span><span class=\"msg\"><span style=\"color: #CC00FF\">aaaaaaaaaaaaaaa</span></span></span></p><p class=\"chatbox_row_1 clearfix\"><span class=\"date-and-time\" title=\"03 Aug 2014\">[02:36:52 03/08/14]</span>&nbsp;<span class=\"user-msg\"><span class=\"user\"><span style=\"color:#F00000\"><strong>@</strong></span>&nbsp;<a href=\"/u1\" onclick=\"return copy_user_name(\'Zzbaivong\');\" target=\"_blank\"><span style=\"color:#F00000\"><strong>Zzbaivong</strong></span></a>&nbsp;:&nbsp;</span><span class=\"msg\"><span style=\"color: #CC00FF\">sssssssssssss</span></span></span></p><p class=\"chatbox_row_2 clearfix\"><span class=\"date-and-time\" title=\"03 Aug 2014\">[02:36:53 03/08/14]</span>&nbsp;<span class=\"user-msg\"><span class=\"user\"><span style=\"color:#F00000\"><strong>@</strong></span>&nbsp;<a href=\"/u1\" onclick=\"return copy_user_name(\'Zzbaivong\');\" target=\"_blank\"><span style=\"color:#F00000\"><strong>Zzbaivong</strong></span></a>&nbsp;:&nbsp;</span><span class=\"msg\"><span style=\"color: #CC00FF\">eeeeeeeeeeeeeeee</span></span></span></p><p class=\"chatbox_row_1 clearfix\"><span class=\"date-and-time\" title=\"03 Aug 2014\">[02:37:00 03/08/14]</span>&nbsp;<span class=\"user-msg\"><span class=\"user\"><span style=\"color:#F00000\"><strong>@</strong></span>&nbsp;<a href=\"/u1\" onclick=\"return copy_user_name(\'Zzbaivong\');\" target=\"_blank\"><span style=\"color:#F00000\"><strong>Zzbaivong</strong></span></a>&nbsp;:&nbsp;</span><span class=\"msg\"><span style=\"color: #CC00FF\">1407003001099_1{}[\"baivong\"&#044;\"Zzbaivong\"]zzzzzzzzzzzzzzzzzzzzz</span></span></span></p>';
	// Thành viên đang truy cập
	var chatbox_memberlist = '<h4 class=\"member-title online\">Online</h4><ul class=\"online-users\"><li><a href=\"/u2\" oncontextmenu=\"return showMenu(2,\'baivong\',1,2,1,2,2,event,\'\');\" onclick=\"return copy_user_name(\'baivong\');\" target=\"_blank\"><span style=\"color:#FF3F8B\"><strong>@</strong></span>&nbsp;<span style=\"color:#FF3F8B\"><strong>baivong</strong></span></a></li><li><a href=\"/u1\" oncontextmenu=\"return showMenu(1,\'Zzbaivong\',1,2,1,2,1,event,\'\');\" onclick=\"return copy_user_name(\'Zzbaivong\');\" target=\"_blank\"><span style=\"color:#F00000\"><strong>@</strong></span>&nbsp;<span style=\"color:#F00000\"><strong>Zzbaivong</strong></span></a></li><li><a href=\"/u64\" oncontextmenu=\"return showMenu(1,\'miamor\',1,2,1,1,0,event,\'\');\" onclick=\"return copy_user_name(\'miamor\');\" target=\"_blank\"><span style=\"color:#1ba1e2\"><strong>K</strong></span></a></li></ul><br /><br /><h4 class=\"member-title away\">Away</h4><ul class=\"online-users\"><li><a href=\"/u64\" oncontextmenu=\"return showMenu(64,\'miamor\',1,2,1,1,0,event,\'\');\" onclick=\"return copy_user_name(\'miamor\');\" target=\"_blank\"><span style=\"color:#1ba1e2\"><strong>miamor</strong></span></a></li></ul>';
	// Thời điểm cập nhật cuối
	var chatbox_last_update = 1407008249.58;

	/**
	 * Tải dữ liệu chatbox
	 * chatbox_messages     Tin nhắn chatbox
	 * chatbox_memberlist   Thành viên đang truy cập
	 * chatbox_last_update  Thời điểm cập nhật cuối
	 */
	$.get("/chatbox/chatbox_actions.forum" + params).done(function (data) {
		eval(data);

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

	/*	
	 * 	Tabs
	 */
	$('#chatbox_tabs').on("click", "li", function () {
		$('.chatbox_change.active').removeClass('active');
		$(this).addClass('active');
		var id = $(this).attr('data-id');
		var name;
		if (id == 'publish') name = '[Public]';
		else name = $('.chatbox_content[data-id="' + id + '"]').attr('data-name');
		$('.chatbox_content').hide();
		$('.chatbox_content[data-id="' + id + '"]').show();
		$('#chatbox_send').attr('data-id', id);
		$('#chattab_name').text(name)
	});

	$("#chatbox_members").html(chatbox_memberlist); // Thêm dach sách thành viên
		$("#chatbox_members").html(chatbox_memberlist); // Thêm dach sách thành viên

		var uId, uName; // Đặt biến lấy id, nickname của thành viên đang truy cập chatbox

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

	/*
	 * 	Process the chat message
	 */
	var allMess = $.parseHTML(chatbox_messages); // Tạo một array các tin nhắn trong chatbox
		var allMess = $.parseHTML(chatbox_messages); // Tạo một array các tin nhắn trong chatbox

		$.each(allMess, function (i, val) { // Duyệt qua từng tin

			var $mess = $(this); // Đặt biến cho tin nhắn đang xét

			var messText = $(".msg", $mess).html();
			var regexpPM = /^(<span style="color: #[0-9A-F]{6}">(<(strike|i|u|strong)>)*)(\d{13,}_\d+)({.*})(\["[^"]+"(\,"[^"]+")+\])(.*)$/; // Mã kiểm tra định dạng tin nhắn riêng

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
				var tabID = arrMess[4];
				

				var $private = $('.chatbox_content[data-id="' + arrMess[4] + '"]'); // Đặt biến cho mục chat riêng
				var $tabPrivate = $('.chatbox_change[data-id="' + arrMess[4] + '"]'); // Đặt biến cho tab của mục
				var chat_name;
				var chatUsers = $.grep(arrUsers, function (n, i) {
						return (n !== uName);
					}).join(", ");
				if (arrMess[5] == '{}') data_chat_name = chat_name = chatUsers; // Đặt tên tab là các nickname đang chat với mình
				else {
					data_chat_name = chat_name = arrMess[5].slice(1, -1);
					chat_name += '<div class="chat-users">' + chatUsers + '</div>';
				}

				if (!$private.length) { // Nếu chưa có mục chat riêng thì tạo mới
					$(".chatbox_content").hide();
					$private = $("<div>", {
						"class": "chatbox_content",
						"data-id": arrMess[4],
						"data-name": data_chat_name,
						"data-users": chatUsers
					}).appendTo("#chatbox_forumvi"); // Thêm vào khu vực chatbox

					$tabPrivate = $("<li>", {
						"class": "chatbox_change",
						"data-id": arrMess[4],
						html: chat_name
					}).appendTo("#chatbox_tabs"); // Thêm vào tab
				}
				var oldChatUsers = $private.attr('data-users');
				if (chatUsers != oldChatUsers) { // Check if any users are added
					$private.attr('data-users', chatUsers);
					$tabPrivate.html(chat_name);
					var chatUsersAr = chatUsers.split(',');
					$.grep(chatUsersAr, function (newUser) {
						if ($.inArray(newUser, oldChatUsers.split(',')) == -1) $private.append('<div class="chatbox_row chatbox_row_action">' + newUser + ' is added in conversation.</div>');
					});
				}

				$(".msg", $mess).html(arrMess[1] + arrMess[8]); // Xóa phần đánh dấu tin nhắn
				$mess.attr("class", "chatbox_row clearfix").appendTo($private); // Thêm tin nhắn vào mục chat riêng theo data-id
				$tabPrivate.click(); // Kích hoạt tab
			}

		} else {
			$mess.attr("class", "chatbox_row clearfix").appendTo('.chatbox_content[data-id="publish"]'); // Thêm tin nhắn thường vào mục chat chung
		}
	});


	/* 
	 * Dropdown menu
	 */
	$('.dropdown-toggle').click(function () {
		$(this).next('.dropdown-menu').toggle()
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

					$(".msg", $mess).html(arrMess[1] + arrMess[8]); // Xóa phần đánh dấu tin nhắn
					$mess.appendTo($private.hide()); // Thêm tin nhắn vào mục chat riêng theo data-id
					
					// Active tab theo cookie
					if(my_getcookie("chatbox_active") === dataId) {
						$tabPrivate.click();
					}
				}

			} else {
				$mess.appendTo('.chatbox_content[data-id="publish"]'); // Thêm tin nhắn thường vào mục chat chung
			}
			$mess.attr("class", "chatbox_row clearfix");
		});

		// Gửi tin nhắn
		$("#chatbox_send").submit(function (event) {
			event.preventDefault();
			var $message = $("#chatbox_message"),
				messVal = $message.val();

			var $send = $("#chatbox_submit");
			$message.add($send).attr("disabled", true);
			$message.val("");
			$.post("/chatbox/chatbox_actions.forum?archives=1", {
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
				
				// Cập nhật tin nhắn (chưa viết)
			}).fail(function () {
				alert("Tin nhắn chưa được gửi!");
			});
		});

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
