require("dotenv").config();

const path = require("path");
const express = require("express");
const { sendContact } = require("./mail");

const app = express();
const port = Number(process.env.PORT) || 8765;

app.use(express.json({ limit: "32kb" }));
app.use(express.static(__dirname));

app.post("/api/contact", async (req, res) => {
  try {
    const result = await sendContact(req.body || {});
    return res.status(result.status).json({ ok: result.ok });
  } catch {
    return res.status(500).json({ ok: false });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port);
