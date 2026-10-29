# Task 5: API Integration and Front-End Interaction

**Level 3 (Advanced)** | Cognifyz Full Stack Development Internship

**Objective:** Introduce server-client communication through a RESTful API.

## What I built
- A RESTful API on Express with full CRUD for a `tasks` resource
- Input validation on the server with clear error messages
- Correct HTTP status codes: 200, 201 (with a `Location` header), 204, 400 and 404
- Query filters: `?status=open|done`, `?priority=high`, `?q=text`
- A front end that talks only to this API using `fetch()`: loads and shows tasks, adds, edits, toggles done, deletes, searches and filters
- Loading, empty and error states shown to the user, including the server's validation messages

## Tech used
Node.js, Express, HTML, CSS, vanilla JavaScript (`fetch`, async/await)

## API reference
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/tasks` | List tasks (filters: `status`, `priority`, `q`) |
| GET | `/api/tasks/:id` | Get one task |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Replace title, description and priority |
| PATCH | `/api/tasks/:id` | Change only the fields sent, e.g. `{ "done": true }` |
| DELETE | `/api/tasks/:id` | Delete a task |

A task looks like:
```json
{ "id": 1, "title": "Build the CRUD endpoints", "description": "GET, POST, PUT, PATCH and DELETE.",
  "priority": "high", "done": false, "createdAt": "2026-10-29T10:00:00.000Z" }
```

## Folder structure
```
Task5_REST_API_Integration/
  server.js
  package.json
  public/
    index.html  style.css  app.js
```

## How to run
```bash
npm install
npm start
```
Open http://localhost:3000. Try the API directly too:
```bash
curl http://localhost:3000/api/tasks
curl -X POST http://localhost:3000/api/tasks -H "Content-Type: application/json" -d '{"title":"Test task","priority":"low"}'
```

## Notes
Data lives in memory and resets when the server restarts. Task 6 replaces it with a database and adds authentication.
