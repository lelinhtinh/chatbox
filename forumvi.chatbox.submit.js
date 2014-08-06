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
		update();
		$messenger.focus();
	}).fail(function () {
		alert("Lỗi! Tin nhắn chưa được gửi.");
		// Xử lý cho lỗi mất kết nối internet (có thể xảy ra do refresh trang trong lúc đang tải)
	});
};

$form.submit(function (event) { // Gửi tin nhắn
	event.preventDefault(); // Chặn sự kiện submit

	var messVal = $messenger.val();
	if ($.trim(messVal) !== "") {

		var regexpCmd = /^\/(chat|gift|kick|ban|unban|mod|unmod|cls|clear|me)(\s(.+))?$/;

		if (regexpCmd.test(messVal)) { // Nếu là các lệnh cmd
			var cmd = messVal.match(regexpCmd);

			var action = cmd[1],
				nickname = cmd[3];

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
								html: '<h3>' + nickname + '</h3><span class="chatbox-change-mess" data-mess="0"></span>'
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
						$newTab.addClass(clas); // Thêm trạng thái truy cập

					} else { // Nếu không có nickname trong danh sách
						if ($newTab.length) { // Nếu có tab chat riêng
							$newTab.removeClass("online away"); // Xóa trang thái online, away về trạng thái offline
						} else {
							alert("Thành viên " + nickname + " hiện không truy cập!");
						}
					}
					setTimeout(function () {
						$newTab.click();
					}, 30);
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