import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PASS,
  },
});

export const sendVerificationEmail = (to: string, token: string) => {
  const verificationUrl = `${process.env.BASE_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.MAILER_EMAIL,
    to,
    subject: "Please verify your email address",
    html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email address.</p>`,
  };

  return transporter.sendMail(mailOptions);
};
