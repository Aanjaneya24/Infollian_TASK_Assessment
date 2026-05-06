const express = require('express');
const crypto = require('crypto');
const loadBalancer = require('../services/loadBalancer');
const logger = require('../services/logger');
const metrics = require('../services/metrics');
const rateLimiter = require('../services/rateLimiter');
const { generateRandomIP } = require('../utils/generateIP');

const router = express.Router();

/**
 * Traffic Simulation
 */
router.post('/simulate', (req, res) => {
  const { requests = 10 } = req.body;
  
  for (let i = 0; i < requests; i++) {
    const ip = generateRandomIP();
    const requestId = crypto.randomUUID();

    if (!rateLimiter.isAllowed(ip)) {
      logger.logRequest(requestId, ip, null, 429, true);
      metrics.recordBlockedRequest();
      continue;
    }

    const selectedNode = loadBalancer.routeRequest(ip);
    
    if (selectedNode) {
      logger.logRequest(requestId, ip, selectedNode.name, 200, false);
      metrics.recordRequest(selectedNode.name);
    } else {
      logger.logRequest(requestId, ip, null, 503, false);
      metrics.recordRequest(null);
    }
  }

  res.json({ message: "Traffic simulation completed", totalSimulated: requests });
});

/**
 * Metrics
 */
router.get('/metrics', (req, res) => {
  const activeNodesCount = loadBalancer.getActiveNodesCount();
  res.json(metrics.getMetrics(activeNodesCount));
});

/**
 * Logs
 */
router.get('/logs', (req, res) => {
  res.json(logger.getLogs());
});

/**
 * Node Management
 */
router.get('/nodes', (req, res) => {
  res.json(loadBalancer.getNodes());
});

router.post('/nodes', (req, res) => {
  const { name, weight } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Node name is required" });
  }
  loadBalancer.addNode(name, weight);
  res.json({ message: `Node ${name} added successfully` });
});

router.delete('/nodes/:name', (req, res) => {
  const { name } = req.params;
  loadBalancer.removeNode(name);
  res.json({ message: `Node ${name} removed` });
});

router.patch('/nodes/:name/health', (req, res) => {
  const { name } = req.params;
  const { healthy } = req.body;
  if (typeof healthy !== 'boolean') {
    return res.status(400).json({ error: "Healthy status must be a boolean" });
  }
  loadBalancer.toggleNodeHealth(name, healthy);
  res.json({ message: `Node ${name} health set to ${healthy}` });
});

module.exports = router;
