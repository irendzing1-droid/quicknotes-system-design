# QuickNotes System Design & API Client

## Description

This project serves two purposes. First, it provides a fully functional frontend API client that interacts with JSONPlaceholder to demonstrate GET, POST, and DELETE operations. Second, it contains a complete backend system design package (API docs, Data Model, and Architecture) for a production-ready QuickNotes application.

## How to Run the API Client Locally

1. Clone this repository.
2. Open `index.html` in your browser (or use Live Server in VS Code).
3. Click "Load 10 Notes" to fetch data.
4. Use the form to create a note (simulated via POST).
5. Click "Delete" to remove a note from the UI.

## Links to Design Documents

- [API Design Documentation](./docs/api-design.md)
- [Data Model Documentation](./docs/data-model.md)
- [Architecture Documentation](./docs/architecture.md)

## What I Learned

I developed a deeper understanding of how frontend clients interact with REST APIs and how to design scalable backend systems.

- **Frontend (JavaScript):** I learned how to use `fetch`, handle HTTP status codes (like 201 and 204), and use `try/catch` to gracefully handle network errors while managing loading states.
- **API Design:** I learned how to structure RESTful endpoints, assign correct HTTP methods, and define clear error codes for client-side handling.
- **System Architecture:** I learned how to design a system that scales by separating the database into a Primary (for writes) and Replicas (for reads), and how to use a Load Balancer to ensure high availability. I also learned about the trade-offs of cache invalidation.
