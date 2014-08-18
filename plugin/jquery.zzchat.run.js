/*!
 * jQuery plugin zzChat v0.1
 * Chatbox forumvi
 *
 * Copyright (c) 2014 Zzbaivong (http://devs.forumvi.com)
 *
 * Licensed under the MIT license - http://opensource.org/licenses/MIT
 */

(function($) {

    var Z = $.zzchat;

    // Các đối tượng jQuery thành phần Chatbox
    var obj = {
        header    : Z.create.block("header", "block", ""),
        meWrap    : Z.create.block("meWrap", "block", ""),
        me        : Z.create.block("me", "title", ""),
        titleWrap : Z.create.block("titleWrap", "block", "")
    };

    var active_id  = "publish" // Id của phòng chat đang sử dụng
    var oldMessage = ""; // Nội dung tin nhắn vừa nhập vào để phục hồi khi lỗi

    /**
     * Copy nickname vào khung soạn thảo
     *
     * @param {String} Nickname người dùng
     */
    var copy_user_name = function(user_name) {
        $messenger[0].value += user_name;
        $messenger.focus();
        return false;
    };

    /**
     * Tạo nhanh thẻ li trong menu action
     *
     * @param {Object} ele       Thẻ ul mà nó gắn vào
     * @param {String} cmd       Mã lệnh cmd
     * @param {String} user_name Nickname dùng trong mã lệnh
     * @param {String} txt       Nội dung thẻ li
     */
    var quickAction = function(ele, cmd, user_name, txt) {
        if (user_name) {
            user_name = " " + user_name;
        } else {
            user_name = "";
        }
        $("<li>", {
            "class": "chatbox-action",
            "data-action": "/" + cmd + user_name,
            text: txt
        }).appendTo(ele);
    };

    $.fn.zzchat = function(options) {

        // Thông số mặc định
        var settings = $.extend({
            buzz_limit: 60, // Giới hạn thời gian giữa 2 lần buzz, nếu đặt 0 sẽ không sử dụng buzz
            auto_login: true, // Tự động đăng nhập
            auto_refresh: true, // Tự động cập nhật
            hide_memberlist: false, // Ẩn cột danh sách thành viên
            no_clear: true, // Không xóa tin nhắn khi clear chatbox, tự động lưu trữ
            reverse_message: false, // Đảo ngược thứ tự tin nhắn (mới nhất lên trên)
            remove_at: false, // Xóa @ trước tài khoản admin, mod
            lang: {} // Mã ngôn ngữ các thông báo
        }, options);


        $.zzchat({ // Thiết lập cho các hàm callback
            beforeLoad: function() {
                console.log("beforeLoad");
            }, // Trước mỗi lần tải dữ liệu
            afterLoad: function() {
                console.log("afterLoad");
                console.log(Z.data);
            }, // Sau mỗi lần tải dữ liệu
            disconnect: function() {
                console.log("disconnect");
                $.post("/chatbox/chatbox_actions.forum?archives=1", { // Gửi tin nhắn rỗng để connect
                    mode: "send",
                    sent: ""
                }).done(function() {
                    Z.update();
                    console.log("connect");
                });
            }, // Khi bị disconnect
            notLoaded: function() {
                console.log("notLoaded");
            }, // Khi gặp lỗi tải dữ liệu mà không phải bị disconnect
            messageEach: function() {
                console.log("messageEach");
            }, // Hoàn thành xử lý từng tin nhắn
            messageAll: function() {
                console.log("messageAll");
            }, // Hoàn thành xử lý tất cả tin nhắn
            userEach: function() {
                console.log("userEach");
            }, // Hoàn thành xử lý từng thành viên
            userAll: function() {
                console.log("userAll");
            }, // Hoàn thành xử lý tất cả thành viên
            update: function() {
                console.log("update");
            }, // Cập nhật tin nhắn
            autoUpdate: function() {
                console.log("autoUpdate");
            }, // Tự cập nhật tin nhắn
            stopUpdate: function() {
                console.log("stopUpdate");
            } // Dừng cập nhật tin nhắn
        });

        Z.update(); // Tải dữ liệu chatbox

        // Để cập nhật liên tục, sử dụng:
        // Z.refresh.start();

        return this.html("COMPLETE!")
    };

})(jQuery);

$("#chatbox-forumvi").zzchat();