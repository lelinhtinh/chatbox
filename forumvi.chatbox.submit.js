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
			$messenger.focus();
		});

	}).fail(function () {
		alert("Tin nhắn chưa được gửi!");
	});
});