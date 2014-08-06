/**
 * Gửi tin nhắn và xử lý các lệnh cmd
 */

var sendMessage = function (val) {
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
				nickname = encodeURIComponent(cmd[3]);

			if (/^(chat|gift|toggle)$/.test(action)) { // Những lệnh không gửi đi
				if (action === "chat") {
					var nickdecode = decodeURIComponent(nickname);
					var $newTab = $(".chatbox-change[data-users*='\"" + nickname + "\"']"); // Đặt biến cho tab chat riêng
					var $user = $("#chatbox-members").find('a[onclick="return copy_user_name(\'' + nickdecode + '\');"]');

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
								"data-users": '["' + encodeURIComponent(uName) + '","' + nickname + '"]',
								html: '<h3 style="color:' + $user.css('color') + '">' + nickdecode + '</h3><span class="chatbox-change-mess"></span>'
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
							alert("Thành viên " + nickdecode + " hiện không truy cập!");
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

			if (messVal == "/buzz") { // BUZZ

				var $buzz = $("#chatbox-option-buzz");
				if ($buzz.html() === "BUZZ") { // BUZZ chưa disable
					var timeBuzz = 29, // 30s
						timeBuzzCount;

					sendMessage(messWithKey);

					$buzz.addClass("disable"); // Thêm class để hiện số đếm lùi
					$buzz.html(30);
					timeBuzzCount = setInterval(function () {
						var zero = timeBuzz--;
						$buzz.html(zero);
						if (zero <= 0) { // Cho phép BUZZ
							clearInterval(timeBuzzCount);
							$buzz.removeClass("disable");
							timeBuzz = 29;
							timeBuzzCount = undefined;
							$buzz.html("BUZZ");
						}
					}, 1000);
				}
			} else {
				sendMessage(messWithKey);
			}
		}

		$messenger.val("");
	}
});