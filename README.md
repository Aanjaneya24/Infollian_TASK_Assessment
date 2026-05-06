# Overview

This project implements a **custom load balancer** using **consistent hashing** instead of random routing. It ensures that the same client IP is always routed to the same server node, even when nodes are added or removed.

## Features

- Consistent Hashing (no random routing)
- Same IP -> Same Node mapping
- Balanced distribution using **Virtual Nodes**
- Dynamic node addition/removal
- Rate limiting (basic)
- Request logging
- Metrics dashboard (`/metrics` endpoint)

---

## Algorithm Used

### Consistent Hashing

Instead of randomly selecting a node, the system:

1. Hashes the incoming IP address
2. Hashes all server nodes
3. Places both on a logical **hash ring**
4. Routes the request to the nearest node on the ring

### Why this approach?

- Ensures **session consistency**
- Minimizes redistribution when nodes change
- Scales efficiently

---

## Improvement: Virtual Nodes

Initially, using a single hash per node caused uneven distribution. To fix this, **virtual nodes** were introduced:

- Each physical node is represented multiple times on the hash ring
- This ensures **uniform load distribution** across all nodes

---

## API Endpoints

### 1. Simulate Traffic

```http
POST /simulate
```
Simulates multiple requests with random IPs. *(Takes JSON body: `{ "requests": 100 }`)*

### 2. View Metrics

```http
GET /metrics
```
Returns request count per node and general system statistics.

### 3. Fetch Request Logs

```http
GET /logs
```
Returns a history of the routed IP addresses and their destination nodes.

---

## Setup Instructions

```bash
npm install
npm start
```

Server runs at:

```bash
http://localhost:3000
```

---

## Postman Collection Demo

A Postman collection is included in the root folder (`postman_collection.json`). 
To use it:
1. Open Postman.
2. Click **Import** and select the `postman_collection.json` file.
3. Use the predefined requests to instantly simulate traffic, check metrics, and trigger failovers.

---

## Example

### Request:

```http
POST /simulate
Content-Type: application/json

{
  "requests": 50
}
```

### Response:

```json
{
  "message": "Traffic simulation completed",
  "totalSimulated": 50
}
```

---

## Metrics Example

### `/metrics`

```json
{
  "totalRequests": 150,
  "blockedRequests": 0,
  "activeNodes": 3,
  "requestsPerNode": {
    "Node-A": 48,
    "Node-B": 54,
    "Node-C": 48
  }
}
```

---

## Why Not Random Routing?

**Random routing:**
- No consistency
- Breaks sessions
- Poor caching

**Consistent hashing:**
- Stable routing
- Scalable
- Production-friendly

---

## Future Improvements

- Redis-based rate limiting
- Health check system for nodes
- Real-time dashboard (UI)

---

## Author

Aanjaneya Pandey
