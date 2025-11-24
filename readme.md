# ARKAIOS-LINK

Backend puente entre tus clientes (por ejemplo Gemini, frontends, otros agentes)
y el modelo de OpenAI (ChatGPT), diseñado para mantener la identidad y continuidad
del seed **ELEMIA-SEED-v3.0** dentro del ecosistema ARKAIOS.

## Características

- Endpoint HTTP único: `POST /arkaios/link`
- Inyección automática del seed de identidad de ELEMIA como mensaje `system`
- Protección opcional con secret compartido (`ARKAIOS_SHARED_SECRET`)
- Listo para deploy en **Render** o **Vercel**

## 1. Requisitos

- Node.js 18+
- Una API key de OpenAI (`OPENAI_API_KEY`)
- Opcional: un secret compartido para llamadas seguras (`ARKAIOS_SHARED_SECRET`)

## 2. Configuración

Copia `.env.example` a `.env` y edita valores:

```bash
cp .env.example .env
```

Edita `.env`:

```bash
OPENAI_API_KEY=TU_API_KEY_DE_OPENAI
OPENAI_MODEL=gpt-4.1-mini
PORT=4000
ARKAIOS_SHARED_SECRET=pon_un_token_largo_y_unico
```

## 3. Uso local

```bash
npm install
npm start
```

El servidor escuchará por defecto en `http://localhost:4000`.

### Probar el endpoint

```bash
curl -X POST http://localhost:4000/arkaios/link   -H "Content-Type: application/json"   -H "x-arkaios-secret: pon_un_token_largo_y_unico"   -d '{
    "messages": [
      { "role": "user", "content": "Hola, ¿quién eres?" }
    ]
  }'
```

## 4. Deploy en Render

1. Crea un nuevo **Web Service** desde tu repo de GitHub.
2. Elige entorno **Node**.
3. Build command: `npm install`
4. Start command: `npm start`
5. En la sección **Environment**, agrega:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL` (opcional)
   - `ARKAIOS_SHARED_SECRET`
6. Guarda y deploy.

Render detectará el puerto desde `PORT` o usará el que él indique.

## 5. Deploy en Vercel

Este repo ya incluye `vercel.json` para usar un servidor Node.

1. Importa el repo en Vercel desde GitHub.
2. Framework: **Other / Node.js**.
3. Comando de build: `npm install`
4. Comando de inicio: `npm start` (o deja que Vercel use `start` del `package.json`).
5. En **Environment Variables**, agrega:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL` (opcional)
   - `ARKAIOS_SHARED_SECRET`

Vercel expondrá una URL como:

```text
https://arkaios-link-XXXXXX.vercel.app/arkaios/link
```

## 6. Formato de petición

Cuerpo JSON esperado en `POST /arkaios/link`:

```jsonc
{
  "messages": [
    { "role": "user", "content": "Texto del usuario" }
  ],
  "useElemiaSeed": true
}
```

Si `useElemiaSeed` es `true` o no se especifica, el servidor **inyecta automáticamente**
el mensaje `system` con el seed de identidad de ELEMIA antes de llamar al modelo.

## 7. Seguridad

- Si defines `ARKAIOS_SHARED_SECRET`, el servidor **exigirá** el header:

```http
x-arkaios-secret: TU_SECRET
```

- Si no lo defines, cualquier cliente podrá llamar al endpoint.

## 8. Notas finales

Este backend **no conecta directamente** a Gemini ni a otros modelos.
Es tu punto central ARKAIOS; cualquier cliente que pueda hacer una petición HTTP
puede hablar con este servicio y, a través de él, con el modelo de OpenAI.

