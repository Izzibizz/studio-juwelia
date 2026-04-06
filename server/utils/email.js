const { BrevoClient } = require("@getbrevo/brevo");

const sendResetPasswordMail = async (to, token) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetPath =
    process.env.RESET_PASSWORD_PATH || "/reinitialiser-mot-de-passe";
  const resetUrl = `${frontendUrl}${resetPath}?token=${token}`;

  const client = new BrevoClient({ apiKey: process.env.BREVO_API_KEY });

  return client.transactionalEmails.sendTransacEmail({
    sender: {
      name: process.env.BREVO_SENDER_NAME || "Studio Juwelia",
      email: process.env.BREVO_SENDER_EMAIL,
    },
    to: [{ email: to }],
    subject: "Studio Juwelia - Réinitialisation du mot de passe",
    textContent: `Réinitialisez votre mot de passe: ${resetUrl}`,
    htmlContent: `<p>Cliquez pour réinitialiser votre mot de passe: <a href="${resetUrl}">${resetUrl}</a></p>`,
    trackClicks: false,
    trackOpens: false,
  });
};

module.exports = { sendResetPasswordMail };
