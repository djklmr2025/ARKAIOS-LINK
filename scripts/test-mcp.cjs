require("dotenv").config();
const PORT = process.env.MCP_PORT || 4001;
const URL = `http://localhost:${PORT}/mcp`;
const SECRET = process.env.ARKAIOS_SHARED_SECRET || "";

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json, text/event-stream",
};
if (SECRET) headers["x-arkaios-secret"] = SECRET;

const rpc = {
  jsonrpc: "2.0",
  id: 1,
  method: "tools/call",
  params: { name: "arkaios.context", arguments: {} },
};

(async () => {
  try {
    const res = await fetch(URL, {
      method: "POST",
      headers,
      body: JSON.stringify(rpc),
    });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
    const output = {
      status: res.status,
      ok: res.ok,
      body: data,
    };
    console.log(JSON.stringify(output, null, 2));
    process.exit(res.ok ? 0 : 1);
  } catch (e) {
    console.log(
      JSON.stringify(
        { ok: false, error: "REQUEST_FAILED", detail: e.message },
        null,
        2
      )
    );
    process.exit(1);
  }
})();
