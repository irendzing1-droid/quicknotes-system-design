---

### 2. `docs/data-model.md`

````markdown
# Data Model

## Entities & Relationships

- **Users:** (id, email, password_hash). One-to-many with Notes.
- **Notes:** (id, user_id, title, body, created_at). One-to-many with Tags through Note_Tags.
- **Tags:** (id, name). One-to-many with Note_Tags.
- **Note_Tags (Junction):** (note_id, tag_id). Resolves many-to-many between Notes and Tags.

## CREATE TABLE Statements (SQL)

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE note_tags (
    note_id INT REFERENCES notes(id) ON DELETE CASCADE,
    tag_id INT REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (note_id, tag_id)
);
```
````
