# Task 1: HTML Structure and Basic Server Interaction

**Level 1 (Beginner)** | Cognifyz Full Stack Development Internship

**Objective:** Introduce server-side rendering and basic form submissions.

## What I built
- HTML pages with two forms: a GET form (data in the URL) and a POST form (data in the request body)
- A Node.js server using Express
- Server-side endpoints that handle both form submissions
- EJS templates (with shared header and footer partials) that generate HTML on the server

## Tech used
Node.js, Express, EJS, HTML, CSS

## Routes
| Method | Path | Purpose |
|---|---|---|
| GET | `/` | Home page with both forms |
| GET | `/greet?name=..&mood=..` | Reads `req.query` and renders a greeting |
| POST | `/contact` | Reads `req.body`, stores the message, renders a confirmation |
| GET | `/messages` | Lists every message received since the server started |

## Folder structure
```
Task1_HTML_Server_Basics/
  server.js
  package.json
  public/style.css
  views/
    index.ejs  greet.ejs  result.ejs  messages.ejs
    partials/header.ejs  partials/footer.ejs
```

## How to run
```bash
npm install
npm start
```
Open http://localhost:3000

## Notes
Messages are kept in a plain array, so they reset when the server restarts. Task 2 adds validation and Task 6 would add a database.
