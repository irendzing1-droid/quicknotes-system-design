---

### 3. `docs/architecture.md`

````markdown
# System Architecture

## Requirements

- **Functional:** Create, Read, Update, Delete notes. Search notes.
- **Non-Functional:** 99.9% uptime, <200ms API response time, scalable to 1 million users.

## Load Estimates (1 Million Users)

- Assume 10% DAU = 100,000 users.
- Each user makes 10 reads/writes per day = 1,000,000 requests/day.
- **Average:** ~11 requests/sec. **Peak (5x):** ~55 requests/sec.
- **Storage:** 100,000 users _ 20 notes _ 2KB = ~4GB/year.

## Architecture Diagram

```text
[ Client (Web) ]
      |
      v
[ Load Balancer ]
      |
      v
[ App Servers (x2) ] <---> [ Redis Cache ]
      |
      v
[ Primary DB ] ---> [ Read Replica ]
```
````
