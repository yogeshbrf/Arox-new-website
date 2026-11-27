const express = require('express');
const router = express.Router();
const syncService = require('../../services/syncService');
const { authenticate, optionalAuth } = require('../../middleware/auth');

/**
 * GET /api/sync/events
 * Real-time Server-Sent Events (SSE) connection endpoint
 */
router.get('/events', optionalAuth, (req, res) => {
  // Setup SSE headers with full cross-origin and cross-system support
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
    'Access-Control-Allow-Origin': req.headers.origin || '*',
    'Access-Control-Allow-Credentials': 'true'
  });

  // Keep connection open with periodic heartbeat ping (every 25 seconds)
  const pingInterval = setInterval(() => {
    try {
      res.write(': keepalive-ping\n\n');
    } catch (e) {
      clearInterval(pingInterval);
    }
  }, 25000);

  res.on('close', () => {
    clearInterval(pingInterval);
  });

  syncService.addClient(res, req.user || null);
});

/**
 * GET /api/sync/status
 * Polling fallback endpoint (returns events since timestamp)
 */
router.get('/status', (req, res) => {
  const since = Number(req.query.since) || 0;
  const events = syncService.getEventsSince(since);
  res.json({
    success: true,
    serverTime: Date.now(),
    events
  });
});

/**
 * POST /api/sync/broadcast
 * Broadcast an event across all connected panels
 */
router.post('/broadcast', authenticate, (req, res) => {
  const { type, data } = req.body;
  if (!type) {
    return res.status(400).json({ success: false, message: 'Event type is required.' });
  }
  const event = syncService.broadcast(type, data || {});
  res.json({
    success: true,
    message: 'Event broadcasted successfully',
    event
  });
});

module.exports = router;
