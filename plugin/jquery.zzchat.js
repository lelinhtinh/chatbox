/*!
 * jQuery plugin zzChat v0.1
 * Chatbox forumvi
 *
 * Copyright (c) 2014 Zzbaivong (http://devs.forumvi.com)
 *
 * Licensed under the MIT license - http://opensource.org/licenses/MIT
 */

(function($) {

    $.zzchat = {};

    $.zzchat.data = {
        
        me: "", // uid của người đang chat (mình)

        user: { // Thông số mỗi user
            // id: { // User id
            //     user_id: "", // user id
            //     user_name: "", // nickname
            //     user_color: "", // Màu nick (nếu có)
            //     chat_status: "", // online/away/offline,
            //     user_level: "", // cấp bậc trong diễn đàn
            //     chat_level: "", // cấp bậc trong chatbox, chat level 2 sẽ có @
            //     user_source: "" // htmlString của user
            // }
        },

        chatroom: { // Thông số mỗi phòng chat
            // id: { // Thời điểm tạo phòng và user_id người tạo
            //     room_dateUTC: "", // Thời điểm tạo phòng chat, định dạng UTC
            //     room_date: "", // Thời điểm tạo phòng chat, định dạng hh:mm:ss dd/mm/yy
            //     starter_id: "", // Id người tạo phòng
            //     room_name: "", // Tên phòng
            //     chatters: "", // Danh sách id người dùng
            //     others: "", // Danh sách id người dùng không phải mình
            //     mess_length: "", // Tổng số tin trong phòng chat
            //     message: [{
            //         room_id: "", // Id phòng chat
            //         mess_dateUTC: "", // Thời điểm nhắn tin, định dạng UTC, chuyển từ thông tin trong chatbox 
            //         mess_date: "", // Thời điểm nhắn tin, định dạng hh:mm:ss dd/mm/yy trong chatbox
            //         poster_id: "", // Id người nhắn tin đó
            //         cmd: "", // Mã lệnh bắt đầu bằng / không có khoảng trắng
            //         cmd_plus: "", // Thông tin thêm cho lệnh cmd(nếu có)
            //         mess_source: "", // htmlString của toàn bộ tin nhắn
            //         mess_content: "" // htmlString phần nội dung
            //     }]
            // }
        },

        all_mess_length: 0, // Tổng số tin trong chatbox
        new_mess: "", // Nội dung của tin nhắn mới nhất
        dateUTC_begin: "", // Thời điểm bắt đầu vào chatbox
        date_begin: "", // Thời điểm bắt đầu vào chatbox, định dạng hh:mm:ss dd/mm/yy
        active_id: "publish" // Id của phòng chat đang sử dụng
    };

    $.zzchat.firstTime = true; // Lần truy cập đầu tiên
    $.zzchat.oldMessage = ""; // Nội dung tin nhắn vừa nhập vào để phục hồi khi lỗi
    $.zzchat.autoRefresh = {}; // Hàm cập nhật tin nhắn
    $.zzchat.stopRefresh = {}; // Dừng hàm tự cập nhật tin nhắn

    $.zzchat.create = {

        block: function(Id, Type, Content) {
            return $("<div>", {
                id: "chatbox-" + Type + "-" + Id,
                html: Content
            });
        },

        input: function(Id, Type, Val) {
            return $("<input>", {
                id: "chatbox-" + Type + "-" + Id,
                type: Type,
                value: Val
            });
        },

        checkbox: function(Id, Content) {
            return $("<div>", {
                id: "chatbox-checkbox-" + Id,
                html: '<input type="checkbox" id="chatbox-checkbox-input-' + Id + '" name="' + Id + '" checked /><label for="chatbox-checkbox-input-' + Id + '">' + Content + '</label>'
            });
        },

        audio: function(Name) {
            return $("<audio>", {
                id: "chatbox-audio-" + Name,
                html: '<source src="' + Name + '.ogg" type="audio/ogg" /><source src="' + Name + '.mp3" type="audio/mpeg" />'
            }).appendTo("body");
        }
    };

    // Đặt và lấy giá trị cookie
    $.zzchat.cookie = {

        /**
         * Lấy cookie
         *
         * @param {String} Tên cookie
         */
        get: function(name) {
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
        },

        /**
         * Đặt cookie
         *
         * @param1 {String}  name   Tên cookie
         * @param2 {String}  value  Giá tri cookie
         * @param3 {Boolean} sticky Thời gian lưu trữ theo session hoặc vĩnh viễn
         * @param4 {URL}     path   Đường dẫn trang lưu trữ
         */
        set: function(name, value, sticky, path) {
            expires = "";
            domain = "";
            if (sticky) {
                expires = "; expires=Wed, 1 Jan 2020 00:00:00 GMT";
            }
            if (!path) {
                path = "/";
            }
            document.cookie = name + "=" + value + "; path=" + path + expires + domain + ';';
        },
    };

    /**
     * Chuyển đổi định dạng thời gian
     *
     * @param  {String} type "def"(hh:mm:ss dd/mm/yy) hoặc "utc"(chuẩn thời gian UTC)
     * @param  {String} time Giá trị thời gian
     * @return {String}      Giá trị thời gian đã chuyển đổi
     */
    $.zzchat.date = function(type, time) {
        var format;
        switch (type) {

            // Chuyển thông số thời gian từ định dạng hh:mm:ss dd/mm/yy sang dạng chuẩn UTC
            case "def":
                time = time.split(/\[|\]|\s|\/|:/);
                format = Date.UTC("20" + time[6], (time[5] - 1), time[4], (time[1] - 7), time[2], time[3], 0);
                break;

                // Chuyển thông số thời gian từ định dạng UTC sang dạng hh:mm:ss dd/mm/yy
            case "utc":
                var a = (new Date(time)).toString().split(/\s/);
                format = a[4] + " " + a[2] + "/" + {
                    Jan: "01",
                    Feb: "02",
                    Mar: "03",
                    Apr: "04",
                    May: "05",
                    Jun: "06",
                    Jul: "07",
                    Aug: "08",
                    Sep: "09",
                    Oct: "10",
                    Nov: "11",
                    Dec: "12"
                }[a[1]] + "/" + a[3].slice(2);
                break;
        }
        return format;
    };

    // Các đối tượng jQuery thành phần Chatbox
    $.zzchat.obj = {
        header: $.zzchat.create.block("header", "block", ""),
        meWrap: $.zzchat.create.block("meWrap", "block", ""),
        me: $.zzchat.create.block("me", "title", ""),
        titleWrap: $.zzchat.create.block("titleWrap", "block", "")
    };

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
     * Mã định dạng tin nhắn riêng
     *
     * @type {String}
     *
     * 1  begin
     * 5  id
     * 7  title
     * 8  users
     * 10 cmd
     * 12 +cmd
     * 13 end
     */
    var regexpPM = /^(<span style="color: (#[0-9A-Fa-f]{3,6}|rgb\(\d{2,3}, \d{2,3}, \d{2,3}\));?">(<(strike|i|u|strong)>)*)(\d{13,}_\d+)(\["(.*)"\,"([\d\|]*)"\])(\/(\w+)(\s([\w\d]+))?)?:?(.*)$/; // Mã kiểm tra định dạng tin nhắn riêng

    /**
     * Xử lý dữ liệu tin nhắn để chuyển đến dạng tab riêng mình cần
     *
     * @param {htmlString} Dữ liệu tin nhắn mới
     */
    var newMessage = function(Messages) {
        if (Messages) {

            var arr = $.parseHTML(Messages); // Chuyển htmlString tin nhắn thành HTML

            $.each(arr, function(i, val) { // Duyệt qua từng tin

                var $this = $(this); // Đặt biến cho tin nhắn đang xét

                var $user_id = $(".user > a", $this),
                    poster_id = 0; // Lấy ra uid của người gửi tin
                if ($user_id.length && $user_id.text() !== "") {
                    poster_id = $user_id[0].href.match(/\d+/)[0];
                }

                var mess_date = $(".date-and-time", $this).text(); // Lấy thông số thời gian gửi tin
                var mess_dateUTC = $.zzchat.date('def', mess_date); // Thời gian gửi tin dạng UTC

                var starter_id = ""; // Uid người tạo phòng chat
                var room_id; // Id phòng chat
                var room_name = "Kênh chung"; // Tên phòng chat

                var chatters = ""; // Array danh sách người trong phòng
                var others = ""; // Array danh sách người trong phòng không phải mình
                var mess_length = 0;
                var cmd, cmd_plus;
                var mess_source = $this[0].outerHTML;
                var mess_content;

                var messText = $(".msg", $this).html(); // Lấy HTML phần nội dung tin nhắn

                if (regexpPM.test(messText)) { // Nếu đúng định dạng tin riêng

                    /**
                     * Phân tích tin nhắn để lấy ra các thông tin cần thiết
                     * @type {Array}
                     *
                     * 1  begin
                     * 5  room_id
                     * 7  room_name
                     * 8  chatters
                     * 10 cmd
                     * 12 +cmd
                     * 13 end
                     */
                    var arrPMess = messText.match(regexpPM);
                    room_id = arrPMess[5];
                    starter_id = room_id.match(/\d+_(\d+)/)[1];
                    chatters = arrPMess[8].split("|");
                    others = $.grep(chatters, function(n, i) {
                        return (n !== starter_id);
                    });
                    room_name = arrPMess[7];
                    cmd = arrPMess[10];
                    cmd_plus = arrPMess[12];
                    mess_content = arrPMess[1] + arrPMess[13];

                } else { // Nếu không đúng định dạng mã tin riêng

                    /**
                     * Phân tích tin nhắn thường
                     * @type {Array}
                     *
                     * 1  begin
                     * 6  cmd
                     * 8  +cmd
                     * 9  end
                     */
                    var arrMess = messText.match(/^(<span style="color: (#[0-9A-Fa-f]{3,6}|rgb\(\d{2,3}, \d{2,3}, \d{2,3}\));?">(<(strike|i|u|strong)>)*)(\/(\w+)(\s([\w\d]+))?)?:?(.*)$/);
                    room_id = "publish";
                    cmd = arrMess[6];
                    cmd_plus = arrMess[8];
                    mess_content = arrMess[1] + arrMess[9];
                }

                if ($.zzchat.data.chatroom[room_id] === undefined) {
                    $.zzchat.data.chatroom[room_id] = {};
                }
                var room_dateUTC = $.zzchat.data.chatroom[room_id].room_dateUTC;
                if (room_dateUTC === undefined) {
                    room_dateUTC = mess_dateUTC;
                }
                var room_date = $.zzchat.data.chatroom[room_id].room_date;
                if (room_date === undefined) {
                    room_date = mess_date;
                }
                if ($.zzchat.data.dateUTC_begin === "") {
                    $.zzchat.data.dateUTC_begin = mess_dateUTC;
                }
                if ($.zzchat.data.date_begin === "") {
                    $.zzchat.data.date_begin = mess_date;
                }
                var newMessData = $.zzchat.data.chatroom[room_id].message;
                if (newMessData === undefined) {
                    newMessData = [];
                }
                var newMess = {
                    room_id: room_id, // Id phòng chat
                    mess_dateUTC: mess_dateUTC, // Thời điểm nhắn tin, định dạng UTC, chuyển từ thông tin trong chatbox 
                    mess_date: mess_date, // Thời điểm nhắn tin, định dạng hh:mm:ss dd/mm/yy trong chatbox
                    poster_id: poster_id, // Id người nhắn tin đó
                    cmd: cmd, // Mã lệnh bắt đầu bằng / không có khoảng trắng
                    cmd_plus: cmd_plus, // Thông tin thêm cho lệnh cmd(nếu có)
                    mess_source: mess_source, // htmlString của toàn bộ tin nhắn
                    mess_content: mess_content // htmlString phần nội dung
                };
                newMessData.push(newMess);
                $.zzchat.data.chatroom[room_id] = { // Thời điểm tạo phòng và user_id người tạo
                    room_dateUTC: mess_dateUTC, // Thời điểm nhắn tin, định dạng UTC, chuyển từ thông tin trong chatbox 
                    room_date: room_date, // Thời điểm nhắn tin, định dạng hh:mm:ss dd/mm/yy trong chatbox
                    starter_id: starter_id, // Id người tạo phòng
                    room_name: room_name, // Tên phòng
                    chatters: chatters, // Danh sách id người dùng
                    others: others, // Danh sách id người dùng không phải mình
                    mess_length: newMessData.length, // Tổng số tin trong phòng chat
                    message: newMessData // Dữ liệu tin nhắn trong phòng chat
                };

                $.zzchat.data.all_mess_length += 1;
                $.zzchat.data.new_mess = newMess;
            });
        }
    };

    var lastMess; // Lấy html của tin cuối cùng

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

    var refreshFunction;

    /**
     * Xử lý khi tải xong dữ liệu tin nhắn
     *
     * $param {htmlString} Dữ liệu tin nhắn
     */
    var getDone = function(chatsource) {

        if (chatsource.indexOf("<!DOCTYPE html PUBLIC") === 0) { // Lỗi do logout hoặc bị ban
            if (chatsource.indexOf("You have been banned from the ChatBox") !== -1) {
                alert("Bạn đã bị cấm truy cập chatbox!");
            } else {
                alert("Mất kết nối đến máy chủ. Vui lòng đăng nhập lại!");
            }
            clearInterval(refreshFunction);
            return false;

        } else { // Đã login

            /**
             * Tải dữ liệu chatbox
             *
             * chatbox_messages    Tin nhắn chatbox
             * chatbox_memberlist  Thành viên đang truy cập
             * chatbox_last_update Thời điểm cập nhật cuối
             */
            eval(chatsource); // Chuyển đổi để các biến chạy được

            var $arrMember = $($.parseHTML(chatbox_memberlist));

            $arrMember.find("a").each(function(index, val) {

                var $this = $(this);

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
                 * 8  event (không quan trọng)
                 * 9  sid (không quan trọng)
                 * 10 ";" (không quan trọng)
                 */
                var dataMenu = $this.attr("oncontextmenu").split(/\(|,|\)/);
                $this.removeAttr("oncontextmenu"); // Xóa contextmenu để tạo menu mới

                var user_id = dataMenu[1],
                    user_name = dataMenu[2].slice(1, -1),
                    my_user_id = dataMenu[3],
                    my_chat_level = dataMenu[4],
                    my_user_level = dataMenu[5],
                    user_chat_level = dataMenu[6],
                    user_level = dataMenu[7];

                var user_color = $("span", $this).css('color');
                var chat_status = $this.closest("ul").prev("h4").attr("class").split(" ")[1];
                var user_source = $this[0].outerHTML;

                if (user_id === my_user_id) { // Nếu user_id trùng với my_user_id

                    $.zzchat.data.me = user_id;

                }

                $.zzchat.data.user[user_id] = {
                    user_id: user_id,
                    user_name: user_name,
                    user_color: user_color,
                    chat_status: chat_status,
                    user_level: user_level,
                    chat_level: user_chat_level,
                    user_source: user_source
                };

            });

            var newChatboxMessages, thisLastMess;
            if (chatbox_messages) { // Nếu có tin nhắn
                thisLastMess = chatbox_messages.match(/<p class="chatbox_row_(1|2) clearfix">(?:.(?!<p class="chatbox_row_(1|2) clearfix">))*<\/p>$/)[0]; // Lấy tin nhắn cuối trong lần này
                if (lastMess === undefined) { // Nếu trước đó ko có tin cuối => lần truy cập chatbox đầu tiên hoặc chatbox mới clear
                    newChatboxMessages = chatbox_messages;
                    lastMess = thisLastMess; // Cập nhật tin nhắn cuối
                    newMessage(newChatboxMessages); // Xử lý tin nhắn và đưa vào chatbox
                } else if (lastMess !== thisLastMess) { // Không có tin mới
                    newChatboxMessages = chatbox_messages.split(lastMess)[1]; // Cắt bỏ tin nhắn cũ, lấy tin mới
                    lastMess = thisLastMess; // Cập nhật tin nhắn cuối
                    newMessage(newChatboxMessages); // Xử lý tin nhắn và đưa vào chatbox
                }
            } else { // Nếu không có tin nhắn (có thể là do clear chatbox)
                lastMess = undefined; // Xóa giá trị tin nhắn cuối
            }

            firstTime = false;
        }
    };

    /**
     * Tải dữ liệu và cập nhật nội dung chatbox
     *
     * @param {URL} Đường dẫn tải dữ liệu
     */
    var update = function(url) {

        $.get(url).done(function(data) {
            getDone(data);
        }).fail(function(data) {
            if (data.responseText.indexOf("document.getElementById('refresh_auto')") === 0) { // Nếu disconnect
                $.post("/chatbox/chatbox_actions.forum?archives=1", { // Gửi tin nhắn rỗng để connect
                    mode: "send",
                    sent: ""
                }).done(function() {
                    $.get(url).done(function(data) { // Tải dữ liệu chatbox
                        getDone(data);
                    });
                });
            } else {
                // Xử lý cho các lỗi khác không phải do disconnect như mất kết nối internet (có thể xảy ra do refresh trang trong lúc đang tải)
                clearInterval(refreshFunction); // Dừng tự cập nhật
            }
        });

    };

    var autoUpdate = function() { // Tự cập nhật mỗi 5s
        refreshFunction = setInterval(function() {
            update("/chatbox/chatbox_actions.forum?archives=1&mode=refresh");
        }, 5000);
    };

    update("/chatbox/chatbox_actions.forum?archives=1");
    autoUpdate();

    // Bật tắt tự động cập nhật
    $("#chatbox-input-autorefesh").change(function() {
        if ($(this).prop("checked")) { // Đã check
            autoUpdate();
        } else {
            clearInterval(refreshFunction);
        }
    });

    $.fn.zzchat = function(options) {

        // Thông số mặc định
        var default_settings = $.extend({
            buzz_limit: 60, // Giới hạn thời gian giữa 2 lần buzz, nếu đặt 0 sẽ không sử dụng buzz
            auto_login: true, // Tự động đăng nhập
            auto_refresh: true, // Tự động cập nhật
            hide_memberlist: false, // Ẩn cột danh sách thành viên
            no_clear: true, // Không xóa tin nhắn khi clear chatbox, tự động lưu trữ
            reverse_message: false, // Đảo ngược thứ tự tin nhắn (mới nhất lên trên)
            remove_at: false, // Xóa @ trước tài khoản admin, mod
            lang: {} // Mã ngôn ngữ các thông báo
        }, options);


        var $chatbox = $("<div>", {
            "id": "chatbox-forumvi"
        });
        update("/chatbox/chatbox_actions.forum?archives=1");

    };

    console.log($.zzchat.obj.me);
    console.log($.zzchat.data);

})(jQuery);