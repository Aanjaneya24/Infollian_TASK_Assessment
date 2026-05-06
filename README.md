# Smart Load Balancer using Consistent Hashing

## Project Overview
This project is a backend-based load balancer system that routes incoming IP requests to backend nodes using a deterministic **Consistent Hashing** algorithm instead of random selection. 

## Features
- **Consistent Hashing:** Hashing algorithm ensuring identical IP requests route to the same node with minimal rebalance over scaling.
- **Node Management:** Add, remove, and toggle health status for node management dynamically.
- **Weighted Routing:** Distribute traffic proportionally based on node capacities.
- **Rate Limiting:** Protects backend layer against abuse and excessive traffic from single IPs.
- **Request Logging & Metrics:** Access real-time simulation statistics and traffic load via APIs.

## Architecture
- **In-Memory Data Structures:** Stores virtual node hash rings and mappings synchronously without an external DB.
- **REST APIs:** Express-driven web endpoints.
- **Services:** Decoupled metrics, logger, rate-limiting, and load balancing engine.

## Setup Instructions
1. Navigate to the project root: `cd load-balancer`
2. Install dependencies: `npm install`
3. Run the development server: `npm start` (or `node src/server.js`)
4. Use tools like cURL or Postman to communicate with the APIs running at `http://localhost:3000`.

## API Documentation
- `POST /simulate`: Hit this endpoint with a JSON body `{"requests": 100}` to mock traffic.
- `GET /metrics`: Fetch total hits & nodes data.
- `GET /logs`: In-memory list of recent queries.
- `GET /nodes`: Fetch the current node list details.
- `POST /nodes`: Define nodes using `{"name": "Node-D", "weight": 2}`.
- `DELETE /nodes/:name`: Remove nodes gracefully.
- `PATCH /nodes/:name/health`: Toggle `{"healthy": false}` on node failure instances.

## Future Improvements
- Adding Redis to maintain states in clusters.
- Persistent logging layer on ElasticSearch/MongoDB.
- WebSocket-powered UI dashboards.
