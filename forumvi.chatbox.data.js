var data: {

    user: { // Thông số mỗi user
        id: { // User id
            user_id: "", // user id
            user_name: "", // nickname
            user_color: "", // Màu nick (nếu có)
            chat_status: "", // online/away/offline,
            user_level: "", // cấp bậc trong diễn đàn
            chat_level: "", // cấp bậc trong chatbox, chat level 2 sẽ có @
            user_source: "", // htmlString của user
            chat_message_id: "" // id của những tin nhắn thành viên này gửi
        }
    },

    chatroom: { // Thông số mỗi phòng chat
        id: { // Thời điểm tạo phòng và user_id người tạo
            room_dateUTC: "", // Thời điểm tạo phòng chat, định dạng UTC
            room_date: "", // Thời điểm tạo phòng chat, định dạng hh:mm:ss dd/mm/yy
            starter_id: "", // Id người tạo phòng
            room_name: "", // Tên phòng
            chatters: "", // Danh sách id người dùng
            others: "", // Danh sách id người dùng không phải mình
            mess_length: "", // Tổng số tin trong phòng chat
            message: [{
                room_id: "", // Id phòng chat
                mess_dateUTC: "", // Thời điểm nhắn tin, định dạng UTC, chuyển từ thông tin trong chatbox 
                mess_date: "", // Thời điểm nhắn tin, định dạng hh:mm:ss dd/mm/yy trong chatbox
                poster_id: "", // Id người nhắn tin đó
                cmd: "", // Mã lệnh bắt đầu bằng / không có khoảng trắng
                cmd_plus: "", // Thông tin thêm cho lệnh cmd(nếu có)
                mess_source: "", // htmlString của toàn bộ tin nhắn
                mess_content: "" // htmlString phần nội dung
            }]
        }
    },

    me: "", // User id của mình
    all_mess_length: 0, // Tổng số tin trong chatbox
    new_mess: "", // Nội dung của tin nhắn mới nhất
    dateUTC_begin: "", // Thời điểm bắt đầu vào chatbox
    date_begin: "" // Thời điểm bắt đầu vào chatbox, định dạng hh:mm:ss dd/mm/yy
};