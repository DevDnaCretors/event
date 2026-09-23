const { sendContact } = require("../mail");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false });
    return;
  }

  try {
    const result = await sendContact(req.body || {});
    res.status(result.status).json({ ok: result.ok });
  } catch {
    res.status(500).json({ ok: false });
  }
};
