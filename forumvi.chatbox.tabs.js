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

// Tạo tab chat riêng

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