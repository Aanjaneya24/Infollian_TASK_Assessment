#!/bin/bash

# CLI Demonstration Script for Smart Load Balancer
echo "🚀 Starting Smart Load Balancer CLI Demonstration..."
echo "---------------------------------------------------"
sleep 1

echo "\n📦 1. Simulating 100 requests of incoming traffic..."
curl -s -X POST http://localhost:3000/simulate -H "Content-Type: application/json" -d '{"requests": 100}'
echo "\n"
sleep 2

echo "\n📊 2. Checking Metrics (Observe traffic distribution via Consistent Hashing)..."
curl -s http://localhost:3000/metrics | json_pp || curl -s http://localhost:3000/metrics
echo "\n"
sleep 3

echo "\n🛑 3. Simulating Node Failure (Marking Node-A as unhealthy)..."
curl -s -X PATCH http://localhost:3000/nodes/Node-A/health -H "Content-Type: application/json" -d '{"healthy": false}'
echo "\n"
sleep 2

echo "\n📦 4. Simulating another 50 requests to test failover routing..."
curl -s -X POST http://localhost:3000/simulate -H "Content-Type: application/json" -d '{"requests": 50}'
echo "\n"
sleep 2

echo "\n📊 5. Checking Metrics Again (Node-A should have no new requests, traffic redistributed)..."
curl -s http://localhost:3000/metrics | json_pp || curl -s http://localhost:3000/metrics
echo "\n"
sleep 3

echo "\n⚙️  6. Adding a High-Capacity Node (Node-Mega with weight: 2)..."
curl -s -X POST http://localhost:3000/nodes -H "Content-Type: application/json" -d '{"name": "Node-Mega", "weight": 2}'
echo "\n"
sleep 2

echo "\n🎯 CLI Demonstration Completed Successfully!"
