class Metrics {
  constructor() {
    this.totalRequests = 0;
    this.blockedRequests = 0;
    this.requestsPerNode = {};
  }

  recordRequest(nodeName) {
    this.totalRequests++;
    if (nodeName) {
      this.requestsPerNode[nodeName] = (this.requestsPerNode[nodeName] || 0) + 1;
    }
  }

  recordBlockedRequest() {
    this.totalRequests++;
    this.blockedRequests++;
  }

  getMetrics(activeNodesCount) {
    return {
      totalRequests: this.totalRequests,
      blockedRequests: this.blockedRequests,
      activeNodes: activeNodesCount,
      requestsPerNode: this.requestsPerNode
    };
  }
}

module.exports = new Metrics();
