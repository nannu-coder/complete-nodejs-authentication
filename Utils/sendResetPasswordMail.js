const sendEmail = require("./sendEmail");

const sendResetPassword = ({ name, email, token, origin }) => {
  const resetURL = `${origin}/user/reset-password?token=${token}&email=${email}`;
  const message = `<p>Please reset password by clicking on the following link : 
    <a href="${resetURL}">Reset Password</a></p>`;

  return sendEmail({
    to: email,
    subject: "Reset Password",
    html: `<h4>Hello, ${name}</h4>
         ${message}
         `,
  });

  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  // const msg = {
  //   to: "nazmulhasannannu74@gmail.com", // Change to your recipient
  //   from: "nazmulnannu42@gmail.com", // Change to your verified sender
  //   subject: "Sending with SendGrid is Fun",
  //   text: "and easy to do anywhere, even with Node.js",
  //   html: "<h1>This Is Awesome! I Love This Very Much</h1>",
  // };

  // const info = await sgMail.send(msg);
};

module.exports = sendResetPassword;
