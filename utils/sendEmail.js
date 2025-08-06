const nodemailer = require("nodemailer");

async function sendResetCode(userEmail, otp) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SUPPORT,
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const htmlContent = `
  <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
    <div style="max-width: 500px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="background: #007bff; padding: 15px; text-align: center; color: white; font-size: 20px;">
        🔐 إعادة تعيين كلمة المرور
      </div>
      <div style="padding: 20px; color: #333;">
        <p>مرحبًا،</p>
        <p>لقد تلقينا طلبًا لإعادة تعيين كلمة المرور الخاصة بحسابك. يرجى استخدام رمز التحقق التالي:</p>
        <div style="text-align: center; font-size: 24px; font-weight: bold; background: #f0f0f0; padding: 10px; margin: 20px 0; border-radius: 5px; letter-spacing: 2px;">
          ${otp}
        </div>
        <p>⚠️ هذا الرمز صالح لمدة <strong>10 دقائق</strong> فقط.</p>
        <p>إذا لم تطلب إعادة التعيين، يمكنك تجاهل هذه الرسالة.</p>
      </div>
      <div style="background: #f7f7f7; padding: 10px; text-align: center; font-size: 12px; color: #888;">
        © ${new Date().getFullYear()} شركتك. جميع الحقوق محفوظة.
      </div>
    </div>
  </div>
  `;

  await transporter.sendMail({
    from: `"Support" <${process.env.EMAIL_REAL}>`,
    to: userEmail,
    subject: "🔐 رمز إعادة تعيين كلمة المرور",
    html: htmlContent,
  });

  console.log(`✅ تم إرسال الكود ${otp} إلى ${userEmail}`);
  return otp;
}

module.exports = sendResetCode;
