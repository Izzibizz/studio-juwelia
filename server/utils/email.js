const Brevo = require("@getbrevo/brevo");

const defaultClient = Brevo.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new Brevo.TransactionalEmailsApi();

const sendResetPasswordMail = async (to, token) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetPath =
    process.env.RESET_PASSWORD_PATH || "/reinitialiser-mot-de-passe";
  const resetUrl = `${frontendUrl}${resetPath}?token=${token}`;

  const sendSmtpEmail = new Brevo.SendSmtpEmail();
  sendSmtpEmail.sender = {
    name: process.env.BREVO_SENDER_NAME || "Studio Juwelia",
    email: process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_USER,
  };
  sendSmtpEmail.to = [{ email: to }];
  sendSmtpEmail.subject = "Studio Juwelia - Réinitialisation du mot de passe";
  sendSmtpEmail.textContent = `Réinitialisez votre mot de passe: ${resetUrl}`;
  sendSmtpEmail.htmlContent = `<p>Cliquez pour réinitialiser votre mot de passe: <a href="${resetUrl}">${resetUrl}</a></p>`;

  return apiInstance.sendTransacEmail(sendSmtpEmail);
};

module.exports = { sendResetPasswordMail };
