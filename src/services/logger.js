class Logger {
  constructor() {
    this.logs = [];
    this.maxLogs = 1000;
  }

  logRequest(requestId, ip, selectedNode, status, blocked = false) {
    const entry = {
      requestId,
      timestamp: new Date().toISOString(),
      ip,
      selectedNode,
      status,
      blocked
    };
    
    this.logs.unshift(entry);
    
    // Keep logs within bounds
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }
  }

  getLogs(limit = 100) {
    return this.logs.slice(0, limit);
  }
}

module.exports = new Logger();
