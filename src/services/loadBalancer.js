const ConsistentHashing = require('../algorithms/consistentHashing');
const initialNodes = require('../data/nodes');

class LoadBalancer {
  constructor() {
    this.router = new ConsistentHashing(50); // 50 virtual nodes per unit weight for decent distribution
    this.initializeNodes();
  }

  initializeNodes() {
    initialNodes.forEach(node => this.router.addNode(node));
  }

  addNode(name, weight = 1) {
    this.router.addNode({ name, weight, healthy: true });
  }

  removeNode(name) {
    this.router.removeNode(name);
  }

  toggleNodeHealth(name, healthy) {
    this.router.toggleNodeHealth(name, healthy);
  }

  routeRequest(ip) {
    return this.router.getNode(ip);
  }

  getActiveNodesCount() {
    let count = 0;
    for (const [_, node] of this.router.nodes) {
      if (node.healthy) count++;
    }
    return count;
  }

  getNodes() {
    const nodes = [];
    for (const [_, node] of this.router.nodes) {
      nodes.push(node);
    }
    return nodes;
  }
}

module.exports = new LoadBalancer();
