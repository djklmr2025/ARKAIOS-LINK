const fetch = require('node-fetch'); // Asegúrate de tener node-fetch o usa el nativo en Node 18+
require('dotenv').config();

const SERVER_URL = process.env.SERVER_URL || "https://arkaios-link.vercel.app/arkaios/link";
const SECRET = process.env.ARKAIOS_SHARED_SECRET;

// Obtener el mensaje de los argumentos de línea de comandos
const messageContent = process.argv[2];

if (!messageContent) {
  console.error("\n[ERROR] Protocolo fallido: Mensaje no especificado.");
  console.log("Uso: node scripts/uplink.js \"Mensaje para el Núcleo\"");
  process.exit(1);
}

if (!SECRET) {
  console.error("\n[ERROR] Protocolo fallido: Credencial ARKAIOS_SHARED_SECRET no encontrada en entorno.");
  process.exit(1);
}

async function transmitToCore() {
  console.log(`\n[UPLINK] Iniciando transmisión segura a ${SERVER_URL}...`);
  
  try {
    const response = await fetch(SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-arkaios-secret': SECRET
      },
      body: JSON.stringify({
        messages: [
          { role: "user", content: messageContent }
        ],
        useElemiaSeed: true
      })
    });

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log("\n[NÚCLEO ARKAIOS RESPONDE]:");
    console.log("---------------------------------------------------");
    console.log(data.reply.content);
    console.log("---------------------------------------------------");
    console.log("[UPLINK] Transmisión finalizada.\n");

  } catch (error) {
    console.error(`\n[FATAL] Error de conexión: ${error.message}`);
  }
}

transmitToCore();
