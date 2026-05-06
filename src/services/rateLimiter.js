class RateLimiter {
  constructor(maxRequests = 20, timeWindowMs = 60000) {
    this.maxRequests = maxRequests;
    this.timeWindowMs = timeWindowMs;
    this.clients = new Map();
  }

  isAllowed(ip) {
    const now = Date.now();
    
    if (!this.clients.has(ip)) {
      this.clients.set(ip, { count: 1, resetTime: now + this.timeWindowMs });
      return true;
    }

    const client = this.clients.get(ip);
    
    // Reset window if time elapsed
    if (now > client.resetTime) {
      client.count = 1;
      client.resetTime = now + this.timeWindowMs;
      return true;
    }

    // Check limit within window
    if (client.count >= this.maxRequests) {
      return false;
    }

    client.count++;
    return true;
  }
}

module.exports = new RateLimiter();
