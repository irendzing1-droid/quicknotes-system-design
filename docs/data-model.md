# Data Model

## Entities and Relationships

- Users: id, email, password_hash. One-to-many with Notes.
- Notes: id, user_id, title, body, created_at. One-to-many with Tags through Note_Tags.
- Tags: id, name. One-to-many with Note_Tags.
- Note_Tags: note_id, tag_id. Many-to-many between Notes and Tags.

## CREATE TABLE Statements (SQL)

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

## Example Queries

### 1. One-to-Many Query

SELECT \* FROM notes WHERE user_id = 1;

### 2. Many-to-Many Query

SELECT n.title, t.name
FROM notes n
JOIN note_tags nt ON n.id = nt.note_id
JOIN tags t ON nt.tag_id = t.id;

### 3. Multi-Table JOIN

SELECT u.email, n.title
FROM users u
JOIN notes n ON u.id = n.user_id;

## Indexing Plan

We will create an index on the user_id column in the notes table.
CREATE INDEX idx_notes_user_id ON notes(user_id);
Reasoning: The most frequent query in a note-taking app is "get all notes for the logged-in user." An index on user_id ensures the database can quickly find these notes without doing a full table scan.

## SQL vs NoSQL Justification

Relational SQL (like PostgreSQL) is the correct choice for QuickNotes. Note-taking applications require strong relational integrity. Users must own their notes, and notes have a strict many-to-many relationship with tags. A relational database enforces these relationships at the schema level using foreign keys, preventing orphaned records and ensuring ACID compliance for user data.
