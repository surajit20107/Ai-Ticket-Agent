import nodemailer from "nodemailer";

export const sendMail = async (to, subject, body) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_TRAP_HOST,
      port: process.env.MAIL_TRAP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_TRAP_USER,
        pass: process.env.MAIL_TRAP_PASS,
      },
    });

    await transporter.sendMail({
      from: '"AI Ticket"<hello@demomailtrap.co>',
      to,
      subject,
      text: body,
    });
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    throw error;
  }
};
