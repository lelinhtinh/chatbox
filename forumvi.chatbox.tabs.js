/**
 * Chuyển/xóa/thêm tab chat
 */

// Chuyển tab

$("#chatbox-tabs").on("click", "li", function () {
	var $this = $(this);
	$(".chatbox-change.active").removeClass("active");
	$this.addClass("active");
	var id = $this.attr("data-id");
	$(".chatbox-content").hide();
	$('.chatbox-content[data-id="' + dataID + '"]').show();
	var key = "";
	if (dataID !== "publish") {
		key = dataID + $this.attr("data-name") + $this.attr("data-users");
	}
	$form.attr("data-key", key);

	my_setcookie("chatbox_active", dataID, false); // Lưu cookie cho tab vừa click
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

if(my_getcookie("chatbox_tabs") === "hide") {
	$("#chatbox-hidetab").click();
}