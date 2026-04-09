const nodemailer = require("nodemailer");

// 🔹 Tạo transporter chung
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 🔹 Gửi email mã xác nhận buổi dạy (đẹp & chuyên nghiệp)
const sendTeachingCodeEmail = async (to, code) => {
  await transporter.sendMail({
    from: `"Trung Tâm Tiếng Anh (Simple English)" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🔑 Mã Xác Nhận Buổi Dạy",
    html: `
        <div style="
            font-family: Arial, sans-serif;
            max-width: 500px;
            margin: auto;
            padding: 20px;
            border: 1px solid #eee;
            border-radius: 12px;
            background: #fafafa;
        ">
            <h2 style="text-align:center; color:#333; margin-bottom:20px;">
                🔑 Mã Xác Nhận Buổi Dạy
            </h2>

            <p style="font-size:15px; color:#555;">
                Xin chào! Đây là mã xác nhận buổi dạy của bạn:
            </p>

            <div style="
                text-align:center;
                margin: 22px 0;
                padding: 14px 10px;
                background:#ffffff;
                border:1px solid #ddd;
                border-radius:10px;
            ">
                <span style="font-size:36px; font-weight:bold; color:#007bff; letter-spacing:3px;">
                    ${code}
                </span>
            </div>

            <p style="font-size:14px; color:#555;">
                ⚠️ <strong>Lưu ý:</strong> Không chia sẻ mã này cho bất kỳ ai để đảm bảo an toàn cho buổi dạy.
            </p>

            <hr style="margin:25px 0; border:none; border-top:1px solid #ddd;" />

            <p style="font-size:12px; color:#777; text-align:center;">
                Hệ thống quản lý lớp học – Trung Tâm Tiếng Anh Simple English
            </p>
        </div>
        `,
  });
};

module.exports = {
  sendTeachingCodeEmail,
};
