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