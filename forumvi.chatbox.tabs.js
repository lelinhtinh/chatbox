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