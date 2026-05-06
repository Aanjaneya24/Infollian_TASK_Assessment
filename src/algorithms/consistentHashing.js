const { hashString } = require('../utils/hash');

class ConsistentHashing {
  constructor(replicas = 3) {
    this.replicas = replicas;  // Number of virtual nodes per weight unit
    this.ring = new Map();     // Hash -> Virtual Node mapping
    this.keys = [];            // Sorted hashes for binary search
    this.nodes = new Map();    // Physical node Name -> Physical Node Data
  }

  addNode(node) {
    const { name, weight = 1, healthy = true } = node;
    this.nodes.set(name, { name, weight, healthy });
    
    // Virtual nodes scale by weight
    const totalVirtualNodes = this.replicas * weight;
    for (let i = 0; i < totalVirtualNodes; i++) {
      const vNodeName = `${name}#${i}`;
      const hash = hashString(vNodeName);
      this.ring.set(hash, name);
      this.keys.push(hash);
    }
    this._sortKeys();
  }

  removeNode(nodeName) {
    const node = this.nodes.get(nodeName);
    if (!node) return;

    const totalVirtualNodes = this.replicas * node.weight;
    for (let i = 0; i < totalVirtualNodes; i++) {
      const vNodeName = `${nodeName}#${i}`;
      const hash = hashString(vNodeName);
      this.ring.delete(hash);
      const index = this.keys.indexOf(hash);
      if (index > -1) {
        this.keys.splice(index, 1);
      }
    }
    this.nodes.delete(nodeName);
  }

  toggleNodeHealth(nodeName, healthy) {
    const node = this.nodes.get(nodeName);
    if (node) {
      if (node.healthy !== healthy) {
        node.healthy = healthy;
        if (healthy) {
          // Add back to ring
          this._addVirtualNodes(node);
        } else {
          // Remove from ring
          this._removeVirtualNodes(node);
        }
      }
    }
  }

  _addVirtualNodes(node) {
    const totalVirtualNodes = this.replicas * node.weight;
    for (let i = 0; i < totalVirtualNodes; i++) {
        const vNodeName = `${node.name}#${i}`;
        const hash = hashString(vNodeName);
        if (!this.ring.has(hash)) {
            this.ring.set(hash, node.name);
            this.keys.push(hash);
        }
    }
    this._sortKeys();
  }

  _removeVirtualNodes(node) {
    const totalVirtualNodes = this.replicas * node.weight;
    for (let i = 0; i < totalVirtualNodes; i++) {
        const vNodeName = `${node.name}#${i}`;
        const hash = hashString(vNodeName);
        this.ring.delete(hash);
        const index = this.keys.indexOf(hash);
        if (index > -1) {
            this.keys.splice(index, 1);
        }
    }
  }

  getNode(key) {
    if (this.keys.length === 0) return null;
    
    const hash = hashString(key);
    // Find the nearest clockwise node
    let index = this._binarySearch(hash);
    
    // If we wrapped around the ring, take the first node
    if (index >= this.keys.length) {
      index = 0;
    }
    
    const nodeName = this.ring.get(this.keys[index]);
    return this.nodes.get(nodeName);
  }

  _binarySearch(hash) {
    let low = 0;
    let high = this.keys.length - 1;
    
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (this.keys[mid] === hash) {
        return mid;
      }
      if (this.keys[mid] < hash) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    return low;
  }

  _sortKeys() {
    this.keys.sort((a, b) => a - b);
  }
}

module.exports = ConsistentHashing;
