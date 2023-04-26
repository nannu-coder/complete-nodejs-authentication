const sendEmail = require("./sendEmail");

const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;
  const message = `<p>Please Confirm your Email by cliking on the following link : <a href="${verifyEmail}"> verify Email </a> </p>`;

  return await sendEmail({
    to: email,
    subject: "Email Confirmation",
    html: `Hello ${name}
    ${message}
    `,
  });
};

module.exports = sendVerificationEmail;
