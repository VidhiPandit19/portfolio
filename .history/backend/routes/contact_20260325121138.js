const express = require("express");
const router = express.Router();
const Message = require("../models/message");
const nodemailer = require("nodemailer");

function createTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === "true",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email and message are required." });
    }

    const mailTo = process.env.MAIL_TO || process.env.SMTP_USER;
    const mailFrom = process.env.MAIL_FROM || process.env.SMTP_USER;
    const transporter = createTransporter();

    if (!transporter || !mailTo || !mailFrom) {
      return res.status(500).json({
        error: "Email service is not configured. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and MAIL_TO in backend/.env",
      });
    }

    const newMessage = await Message.create({
      name,
      email,
      message,
    });

    await transporter.sendMail({
      from: `Portfolio Contact <${mailFrom}>`,
      to: mailTo,
      replyTo: email,
      subject: `New portfolio message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h2>New Portfolio Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${String(message).replace(/\n/g, "<br>")}</p>
      `,
    });

    res.status(200).json({
      msg: "Message saved and email sent successfully",
      data: newMessage,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;