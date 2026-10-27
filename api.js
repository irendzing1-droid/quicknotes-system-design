// 1. Constants and Elements
const API_URL = 'https://jsonplaceholder.typicode.com/posts';

const loadBtn = document.querySelector('#load-btn');
const statusEl = document.querySelector('#status');
const notesList = document.querySelector('#notes-list');
const noteForm = document.querySelector('#note-form');
const titleInput = document.querySelector('#title-input');
const bodyInput = document.querySelector('#body-input');
const submitBtn = document.querySelector('#submit-btn');

// Helper to update status messages
function setStatus(msg, type) {
    statusEl.textContent = msg;
    statusEl.className = `status-${type}`;
}

// 2. Reusable async request function
async function request(url, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    // Handle 204 No Content (DELETE)
    if (response.status === 204) return null;
    return response.json();
}

// ==========================================
// TASK 1: Load Notes (GET)
// ==========================================
loadBtn.addEventListener('click', async () => {
    setStatus('Loading notes...', 'loading');
    loadBtn.disabled = true;
    notesList.innerHTML = ''; // Clear existing

    try {
        const notes = await request(`${API_URL}?_limit=10`);
        
        if (notes.length === 0) {
            setStatus('No notes found.', 'empty');
            return;
        }

        notes.forEach(note => {
            const li = document.createElement('li');
            li.className = 'note-card';
            
            const content = document.createElement('div');
            content.className = 'note-content';
            
            const title = document.createElement('div');
            title.className = 'note-title';
            title.textContent = note.title; // Safe from XSS
            
            const body = document.createElement('p');
            body.textContent = note.body;
            
            content.appendChild(title);
            content.appendChild(body);
            li.appendChild(content);
            
            // Add Delete Button (Task 3)
            const delBtn = document.createElement('button');
            delBtn.className = 'delete-btn';
            delBtn.textContent = 'Delete';
            delBtn.addEventListener('click', () => deleteNote(note.id, li));
            
            li.appendChild(delBtn);
            notesList.appendChild(li);
        });

        setStatus(`Loaded ${notes.length} notes from the server.`, 'success');

    } catch (error) {
        setStatus(`Failed to load: ${error.message}`, 'error');
    } finally {
        loadBtn.disabled = false;
    }
});

// ==========================================
// TASK 2: Create Note (POST)
// ==========================================
noteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    // Validation
    if (!title) {
        setStatus('Title is required.', 'error');
        return;
    }
    if (title.length > 100) {
        setStatus('Title cannot exceed 100 characters.', 'error');
        return;
    }

    setStatus('Creating note...', 'loading');
    submitBtn.disabled = true;

    try {
        const newNote = await request(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, body, userId: 1 })
        });

        // Create UI element for the new note and add to top of list
        const li = document.createElement('li');
        li.className = 'note-card';
        li.style.borderLeftColor = '#27ae60'; // Green to signify new
        
        const content = document.createElement('div');
        content.className = 'note-content';
        
        const titleEl = document.createElement('div');
        titleEl.className = 'note-title';
        titleEl.textContent = newNote.title;
        
        const bodyEl = document.createElement('p');
        bodyEl.textContent = newNote.body;
        
        content.appendChild(titleEl);
        content.appendChild(bodyEl);
        li.appendChild(content);

        // Add to top
        notesList.prepend(li);

        setStatus(`Note created (status 201, id ${newNote.id})`, 'success');
        
        // Clear form
        noteForm.reset();

    } catch (error) {
        setStatus(`Failed to create note: ${error.message}`, 'error');
    } finally {
        submitBtn.disabled = false;
    }
});

// ==========================================
// TASK 3: Delete Note (DELETE)
// ==========================================
async function deleteNote(id, element) {
    setStatus('Deleting note...', 'loading');
    
    try {
        /* 
          Note: JSONPlaceholder fakes the DELETE response. It returns 200 OK but 
          doesn't actually delete data. We handle this sensibly by removing the UI 
          element visually, knowing that a real backend would persist this deletion.
        */
        await request(`${API_URL}/${id}`, { method: 'DELETE' });
        
        // Remove from DOM
        element.remove();
        setStatus('Note deleted successfully.', 'success');

    } catch (error) {
        setStatus(`Failed to delete: ${error.message}`, 'error');
    }
}