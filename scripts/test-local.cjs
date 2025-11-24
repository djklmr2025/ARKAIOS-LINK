require("dotenv").config();
const PORT = process.env.PORT || 4000;
const URL = `http://localhost:${PORT}/arkaios/link`;
const SECRET = process.env.ARKAIOS_SHARED_SECRET || "";

const headers = { "Content-Type": "application/json" };
if (SECRET) headers["x-arkaios-secret"] = SECRET;

const payload = {
  messages: [
    { role: "user", content: "Hola, ¿quién eres?" }
  ],
  useElemiaSeed: true
};

(async () => {
  try {
    const res = await fetch(URL, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    });
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }
    const output = {
      status: res.status,
      ok: data && typeof data.ok !== "undefined" ? data.ok : res.ok,
      model: data && data.model ? data.model : null,
      reply: data && data.reply ? data.reply : null,
      error: data && data.error ? data.error : null,
      detail: data && data.detail ? data.detail : null
    };
    console.log(JSON.stringify(output, null, 2));
    process.exit(output.ok ? 0 : 1);
  } catch (e) {
    console.log(JSON.stringify({ ok: false, error: "REQUEST_FAILED", detail: e.message }, null, 2));
    process.exit(1);
  }
})();
