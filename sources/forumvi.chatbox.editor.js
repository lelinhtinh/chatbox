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