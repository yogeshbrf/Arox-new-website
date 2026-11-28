const logger = require('../utils/logger');

/**
 * Real-time Triangular Sync Service
 * Propagates changes across Admin, Employee, and Student panels
 * using Server-Sent Events (SSE) with robust HTTP polling fallback.
 */

class TriangularSyncService {
  constructor() {
    this.clients = new Set();
    this.eventHistory = [];
    this.maxHistory = 150;
    this.eventSequence = 0;
  }

  /**
   * Register a new SSE response client
   */
  addClient(res, user = null) {
    const client = {
      id: ++this.eventSequence,
      res,
      user,
      connectedAt: new Date()
    };

    this.clients.add(client);
    logger.info(`[SYNC] Client #${client.id} connected (${user ? user.role : 'guest'}). Total active: ${this.clients.size}`);

    // Send initial handshake
    this.sendSse(res, 'handshake', {
      connected: true,
      clientId: client.id,
      timestamp: Date.now()
    });

    // Cleanup on disconnect
    res.on('close', () => {
      this.clients.delete(client);
      logger.info(`[SYNC] Client #${client.id} disconnected. Active: ${this.clients.size}`);
    });
  }

  /**
   * Format and send an SSE message
   */
  sendSse(res, eventName, data) {
    try {
      res.write(`event: ${eventName}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
      // Also emit as generic message event for standard onmessage listeners
      res.write(`event: message\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch (e) {
      // Socket may be closed
      throw e;
    }
  }

  /**
   * Broadcast an update event to all active panels
   */
  broadcast(eventType, payload = {}) {
    const tLower = String(eventType || '').toLowerCase();
    // Never push alert notifications for delete, login, or logout actions
    if (tLower.includes(':deleted') || tLower.includes('login') || tLower.includes('logout') || (payload && payload.deleted === true)) {
      return null;
    }

    const event = {
      id: ++this.eventSequence,
      type: eventType,
      data: payload,
      timestamp: Date.now()
    };

    // Store in history for polling clients
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.maxHistory) {
      this.eventHistory.shift();
    }

    logger.info(`[SYNC BROADCAST] ${eventType}:`, payload);

    // Push to all active SSE connections with dead client pruning
    const deadClients = [];
    for (const client of this.clients) {
      try {
        this.sendSse(client.res, eventType, event);
      } catch (err) {
        deadClients.push(client);
      }
    }
    for (const dead of deadClients) {
      this.clients.delete(dead);
    }

    return event;
  }

  /**
   * Get events since a given timestamp for polling fallback
   */
  getEventsSince(sinceTimestamp = 0) {
    const ts = Number(sinceTimestamp) || 0;
    return this.eventHistory.filter(e => e.timestamp > ts);
  }
}

// Global singleton instance
const syncService = new TriangularSyncService();

module.exports = syncService;
