const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendResetPasswordMail = async (to, token) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetUrl = `${frontendUrl}/reset-password?token=${token}`;
  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Studio Juwelia password reset",
    text: `Reset your password: ${resetUrl}`,
    html: `<p>Click to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`,
  });
  return info;
};

module.exports = { sendResetPasswordMail };
