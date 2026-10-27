# System Architecture

## Functional and Non-Functional Requirements

- Functional: Create, Read, Update, and Delete (CRUD) notes. Search notes by title or body.
- Non-Functional: 99.9% uptime, under 200ms API response time, capable of scaling to 1 million users.

## Load Estimates (1 Million Users)

- Assume 10% Daily Active Users = 100,000 DAU.
- Each user performs 10 reads and 2 writes per day.
- Total Reads per day: 1,000,000. Total Writes per day: 200,000.
- Average Reads: ~11 reads/second. Average Writes: ~2.3 writes/second.
- Peak (5x): ~55 reads/second and ~11 writes/second.
- Storage: 100,000 users _ 20 notes _ 2KB = 4GB per year.

## Architecture Diagram

[ Client (Web) ]
|
[ Load Balancer ]
|
[ App Servers (x2) ] <---> [ Redis Cache ]
|
[ Primary DB (Writes) ] ---> [ Read Replica (Reads) ]
|
[ Message Queue (Kafka) ] <---> [ Background Worker ]

## Component Explanations and Justifications

- Load Balancer: Routes incoming traffic to prevent server overload and ensures high availability.
- App Servers (x2): Stateless Node.js servers running the API logic. Two servers prevent a single point of failure.
- Redis Cache: Caches frequent read requests to reduce database load and improve response times.
- Primary DB: Handles all write operations (POST, PUT, DELETE) to ensure data consistency.
- Read Replica: Handles GET requests, offloading read traffic from the primary database.
- Message Queue (Kafka): Handles heavy background tasks like full-text search indexing without blocking the API response.
- Background Worker: Processes jobs from the queue asynchronously.

## Step-by-Step Request Lifecycles

### GET /notes (Read Flow)

1. Client requests to load notes.
2. Load Balancer routes to an App Server.
3. App Server checks Redis Cache.
4. If data is in cache, return immediately.
5. If not in cache, App Server queries the Read Replica.
6. App Server caches the result and returns data to client.

### POST /notes (Write Flow)

1. Client submits a new note.
2. App Server validates the title and body.
3. App Server writes to the Primary DB.
4. App Server invalidates the relevant cache in Redis.
5. App Server pushes a job to the Message Queue for background indexing.
6. App Server returns 201 Created to the client.

## Trade-offs and Single Points of Failure

1. Caching vs Consistency: Caching speeds up reads, but introduces eventual consistency. If a note is updated, the cache must be invalidated, or users might see stale data.
2. Replica Lag: Read replicas might lag slightly behind the primary DB. A user might not see their newly created note immediately if their read request hits the replica before it syncs.
3. Avoiding SPOF: If one App Server crashes, the Load Balancer routes all traffic to the other. The message queue and cache can also be clustered to prevent a single point of failure.
