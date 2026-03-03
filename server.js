import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// CORS headers for API routes
app.use('/api', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Helper: adapt Netlify function handler to Express route
const adaptHandler = (handlerFn) => async (req, res) => {
  try {
    const event = {
      httpMethod: req.method,
      headers: req.headers,
      body: JSON.stringify(req.body),
      queryStringParameters: req.query,
      path: req.path,
      requestContext: {
        identity: { sourceIp: req.ip },
      },
    };

    const result = await handlerFn(event, {});

    // Set response headers
    if (result.headers) {
      Object.entries(result.headers).forEach(([key, value]) => {
        res.header(key, value);
      });
    }

    res.status(result.statusCode || 200);
    
    if (result.body) {
      try {
        res.json(JSON.parse(result.body));
      } catch {
        res.send(result.body);
      }
    } else {
      res.end();
    }
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// --- Load and register API routes ---

// sendTelegram (CommonJS-style, loaded via .cjs extension)
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sendTelegram = require('./netlify/functions/sendTelegram.cjs');
app.post('/api/sendTelegram', adaptHandler(sendTelegram.handler));
app.options('/api/sendTelegram', adaptHandler(sendTelegram.handler));

// Also support the Netlify-style paths for backwards compatibility
app.post('/.netlify/functions/sendTelegram', adaptHandler(sendTelegram.handler));
app.options('/.netlify/functions/sendTelegram', adaptHandler(sendTelegram.handler));

// sendOTP (ESM)
const sendOTPModule = await import('./netlify/functions/sendOTP.js');
app.post('/api/sendOTP', adaptHandler(sendOTPModule.handler));
app.options('/api/sendOTP', adaptHandler(sendOTPModule.handler));
app.post('/.netlify/functions/sendOTP', adaptHandler(sendOTPModule.handler));
app.options('/.netlify/functions/sendOTP', adaptHandler(sendOTPModule.handler));

// getProviderPhone (ESM)
const getProviderPhoneModule = await import('./netlify/functions/getProviderPhone.js');
app.post('/api/getProviderPhone', adaptHandler(getProviderPhoneModule.handler));
app.options('/api/getProviderPhone', adaptHandler(getProviderPhoneModule.handler));
app.post('/.netlify/functions/getProviderPhone', adaptHandler(getProviderPhoneModule.handler));
app.options('/.netlify/functions/getProviderPhone', adaptHandler(getProviderPhoneModule.handler));

// debug (ESM)
const debugModule = await import('./netlify/functions/debug.js');
app.get('/api/debug', adaptHandler(debugModule.handler));
app.get('/.netlify/functions/debug', adaptHandler(debugModule.handler));

// Serve static files from the Vite build
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback: serve index.html for all non-API routes
app.get('{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
