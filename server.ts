import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Middleware for parsing JSON requests
app.use(express.json());

// ==========================================
// 1. WHATSAPP CLOUD API CONFIGURATION
// ==========================================
// All tokens read securely from environment variables (never hardcoded)
const getWhatsAppConfig = () => ({
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
  verifyToken: process.env.WHATSAPP_VERIFY_TOKEN,
});

// Helper to check configuration status
app.get('/api/whatsapp-status', (_req: Request, res: Response) => {
  const { accessToken, phoneNumberId, verifyToken } = getWhatsAppConfig();
  res.json({
    configured: Boolean(accessToken && phoneNumberId && verifyToken),
    hasAccessToken: Boolean(accessToken),
    hasPhoneNumberId: Boolean(phoneNumberId),
    hasVerifyToken: Boolean(verifyToken),
    phoneNumberId: phoneNumberId ? `***${phoneNumberId.slice(-4)}` : null,
  });
});

// ==========================================
// 2. SENDING MESSAGES: POST /api/send-whatsapp
// ==========================================
app.post('/api/send-whatsapp', async (req: Request, res: Response) => {
  try {
    const { to, message, template } = req.body;
    const { accessToken, phoneNumberId } = getWhatsAppConfig();

    // Validate inputs
    if (!to || (!message && !template)) {
      return res.status(400).json({
        success: false,
        error: 'Both recipient phone number (to) and text message (message) or template are required.',
      });
    }

    // Verify environment credentials
    if (!accessToken || !phoneNumberId) {
      console.warn('[WhatsApp Cloud API] Missing environment credentials (WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID).');
      return res.status(500).json({
        success: false,
        error: 'WhatsApp Cloud API credentials (WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID) are not configured in environment variables.',
      });
    }

    // Clean phone number: remove non-digits
    const cleanTo = String(to).replace(/[^0-9]/g, '');

    if (!cleanTo || cleanTo.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Invalid recipient phone number. Please provide a valid international phone format (e.g. 201001234567).',
      });
    }

    // Prepare payload (text message or template message)
    let payload: Record<string, unknown>;

    if (template) {
      const templateName = typeof template === 'string' ? template : (template.name || 'hello_world');
      const languageCode = typeof template === 'object' && template.language ? template.language : 'en_US';
      payload = {
        messaging_product: 'whatsapp',
        to: cleanTo,
        type: 'template',
        template: {
          name: templateName,
          language: { code: languageCode },
        },
      };
    } else {
      payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: cleanTo,
        type: 'text',
        text: {
          preview_url: false,
          body: String(message),
        },
      };
    }

    const metaGraphUrl = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;

    // Send POST request using native fetch API
    const response = await fetch(metaGraphUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[WhatsApp Cloud API Error]:', data);
      return res.status(response.status).json({
        success: false,
        error: data?.error?.message || 'Failed to dispatch message via Meta WhatsApp Cloud API',
        details: data,
      });
    }

    const messageId = data?.messages?.[0]?.id;
    console.log(`[WhatsApp Cloud API Success] Message sent to ${cleanTo}, Message ID: ${messageId}`);

    return res.status(200).json({
      success: true,
      messageId,
      recipient: cleanTo,
      data,
    });
  } catch (error) {
    console.error('[WhatsApp Server Error]:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error while sending WhatsApp message',
    });
  }
});

// ==========================================
// 3. RECEIVING MESSAGES: WEBHOOK (GET & POST)
// ==========================================

// Webhook Verification (GET /webhook)
// Meta verifies the webhook URL using hub.mode, hub.verify_token and hub.challenge
app.get('/webhook', (req: Request, res: Response) => {
  try {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    const { verifyToken } = getWhatsAppConfig();

    console.log('[WhatsApp Webhook GET] Verification request received:', { mode, tokenProvided: Boolean(token) });

    // Check if mode and token were sent
    if (mode === 'subscribe' && token) {
      if (!verifyToken) {
        console.warn('[WhatsApp Webhook GET] WHATSAPP_VERIFY_TOKEN is not configured in server environment.');
        return res.status(500).json({ error: 'WHATSAPP_VERIFY_TOKEN is not configured in server environment' });
      }

      if (token === verifyToken) {
        console.log('[WhatsApp Webhook GET] Webhook verified successfully with Meta challenge.');
        // Respond with the challenge token from the request as plain text
        return res.status(200).send(challenge);
      } else {
        console.warn('[WhatsApp Webhook GET] Verification token mismatch. Expected token did not match query param.');
        return res.status(403).json({ error: 'Verification token mismatch' });
      }
    }

    return res.status(400).json({ error: 'Missing hub.mode or hub.verify_token query parameter' });
  } catch (error) {
    console.error('[WhatsApp Webhook GET Error]:', error);
    return res.status(500).send('Webhook verification failed');
  }
});

// Webhook Event Handler (POST /webhook)
// Receives incoming notifications, message status updates and incoming patient messages
app.post('/webhook', (req: Request, res: Response) => {
  try {
    const body = req.body;

    // Check if event is from a WhatsApp business account
    if (body?.object === 'whatsapp_business_account') {
      const entries = body.entry || [];

      for (const entry of entries) {
        const changes = entry.changes || [];
        for (const change of changes) {
          const value = change.value;
          if (value) {
            // Check for incoming patient messages
            const messages = value.messages;
            if (messages && messages.length > 0) {
              const message = messages[0];
              const from = message.from; // Patient phone number
              const messageText = message.text?.body; // Patient message text
              const contactName = value.contacts?.[0]?.profile?.name || 'Unknown Patient';

              // Log to console as specified in requirements
              console.log('=============================================');
              console.log('[WhatsApp Webhook INCOMING MESSAGE]');
              console.log(`From (Patient Phone): ${from}`);
              console.log(`Patient Name: ${contactName}`);
              console.log(`Message Body: ${messageText}`);
              console.log(`Message ID: ${message.id}`);
              console.log(`Timestamp: ${message.timestamp}`);
              console.log('=============================================');
            }

            // Check for message statuses (sent, delivered, read)
            const statuses = value.statuses;
            if (statuses && statuses.length > 0) {
              const status = statuses[0];
              console.log(`[WhatsApp Webhook Status] Message ${status.id} -> ${status.status} for recipient ${status.recipient_id}`);
            }
          }
        }
      }

      // Return a 200 OK status immediately to Meta so they do not retry the request
      return res.status(200).send('EVENT_RECEIVED');
    }

    // Return 404 if not a whatsapp_business_account event
    return res.sendStatus(404);
  } catch (error) {
    console.error('[WhatsApp Webhook POST Error]:', error);
    // Still return 200 to acknowledge webhook delivery and prevent Meta backoff
    return res.status(200).send('EVENT_RECEIVED');
  }
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Ayadati Halan Clinic SaaS Backend',
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// 4. FRONTEND SERVING (VITE DEV / STATIC PROD)
// ==========================================
const startServer = async () => {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Ayadati Halan server running on http://0.0.0.0:${PORT}`);
    console.log(`WhatsApp routes ready:`);
    console.log(`- POST /api/send-whatsapp`);
    console.log(`- GET  /webhook (Verification)`);
    console.log(`- POST /webhook (Incoming messages)`);
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
