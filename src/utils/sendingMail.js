import nodemailer from "nodemailer";
import Mailgen from "mailgen";

const sendingEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    secure: false,
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Book Bazaar",
      link: "https://www.youtube.com/@tasincoder",
    },
  });

  const email = {
    body: {
      name: options.name,
      intro: "Welcome to Book Bazaar! We're very excited to have you on board.",
      action: {
        instructions: `${options.subject} please click here:`,
        button: {
          color: "#22BC66",
          text: options.subject,
          link: options.url,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };

  const emailBody = mailGenerator.generate(email);

  const emailText = mailGenerator.generatePlaintext(email);

  const info = await transporter.sendMail({
    from: process.env.MAILTRAP_FROM,
    to: options.email,
    subject: options.subject,
    text: emailText, // plain‑text body
    html: emailBody, // HTML body
  });

  console.log("Message sent:", info.messageId);
};

export default sendingEmail;

// const options = {
//   name: "",
//   subject: "",
//   email: "",
//   url: "",
// };
