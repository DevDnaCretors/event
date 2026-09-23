const nodemailer = require("nodemailer");

function clean(value) {
  return String(value || "").trim().slice(0, 2000);
}

function transporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE !== "false",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendContact(body) {
  const name = clean(body.name).slice(0, 120);
  const email = clean(body.email).slice(0, 200);
  const company = clean(body.company).slice(0, 160);
  const message = clean(body.message);

  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, status: 400 };
  }

  const eventName = clean(process.env.EVENT_NAME) || "event";
  const lines = [
    `This contact came from the ${eventName} event landing.`,
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    company ? `Company: ${company}` : "",
    "",
    message || "(No message)",
  ].filter(Boolean);

  await transporter().sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.SMTP_TO || process.env.SMTP_USER,
    replyTo: email,
    subject: `${eventName} / ${name}`,
    text: lines.join("\n"),
  });

  return { ok: true, status: 200 };
}

module.exports = { sendContact };
