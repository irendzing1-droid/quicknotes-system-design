# QuickNotes API Design

Base URL: `/api/v1`

## Endpoints Table

| Method | Endpoint             | Description                | Success Status |
| :----- | :------------------- | :------------------------- | :------------- |
| GET    | `/notes`             | Retrieve a list of notes   | 200 OK         |
| GET    | `/notes/:id`         | Retrieve a single note     | 200 OK         |
| POST   | `/notes`             | Create a new note          | 201 Created    |
| PUT    | `/notes/:id`         | Update an existing note    | 200 OK         |
| DELETE | `/notes/:id`         | Delete a note              | 204 No Content |
| GET    | `/notes?search=term` | Search notes by title/body | 200 OK         |

## Request/Response Examples

### Create a Note (POST /notes)

**Request Body:**

    {
      "title": "Meeting Notes",
      "body": "Discuss Q3 goals.",
      "userId": 1
    }

**Response (201 Created):**

    {
      "id": 101,
      "title": "Meeting Notes",
      "body": "Discuss Q3 goals.",
      "userId": 1,
      "createdAt": "2026-10-27T12:00:00Z"
    }

### List Notes (GET /notes)

**Response (200 OK):**

    [
      { "id": 1, "title": "Note 1", "body": "..." },
      { "id": 2, "title": "Note 2", "body": "..." }
    ]

## Error Codes

- **400 Bad Request:** Missing title, or title > 100 chars.
      { "error": "Title is required." }
- **401 Unauthorized:** Missing or invalid auth token.
- **403 Forbidden:** User tries to delete another user's note.
- **404 Not Found:** Note ID does not exist.
- **500 Internal Server Error:** Database connection failed.
