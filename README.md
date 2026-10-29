# Cognifyz Full Stack Development Internship: Tasks 1 to 5

The internship needs at least 5 of the 8 tasks. This folder holds Tasks 1 to 5, one separate project per task (the task sheet asks for a separate file for each level).

| Folder | Level | Task | Needs Node? |
|---|---|---|---|
| `task1-html-server-ejs` | 1 Beginner | HTML structure and basic server interaction (Express + EJS) | Yes |
| `task2-validation` | 1 Beginner | Inline styles, basic interaction and server-side validation | Yes |
| `task3-responsive-design` | 2 Intermediate | Advanced CSS styling and responsive design (Bootstrap) | No |
| `task4-dom-routing` | 2 Intermediate | Complex form validation, dynamic DOM, client-side routing | No |
| `task5-rest-api` | 3 Advanced | RESTful API with CRUD and a front end that uses it | Yes |

## Running them

Install Node.js (v18 or newer), then for Tasks 1, 2 and 5:

```bash
cd task1-html-server-ejs      # or task2-validation, task5-rest-api
npm install
npm start
```

Open http://localhost:3000. Stop the server with Ctrl+C before starting another task (they all use port 3000). To use a different port: `PORT=4000 npm start` (on Windows PowerShell: `$env:PORT=4000; npm start`).

Tasks 3 and 4 need no install. Open `index.html` in a browser. Task 3 loads Bootstrap and Google Fonts from a CDN, so it needs an internet connection. For Task 4, routing uses the `#` part of the address, so it works straight from the file.

Task 2 also has a small test for the server-side rules: `cd task2-validation && npm test`.

## What each task covers

**Task 1:** HTML forms (GET and POST), an Express server, endpoints that handle the submissions, and EJS views with partials, loops and conditions.

**Task 2:** Inline styles, inline JavaScript validation (on blur, while typing, on submit), the same rules checked again on the server, errors sent back with the user's input kept, duplicate email check, in-memory storage and Post/Redirect/Get.

**Task 3:** A multi-section portfolio page with Bootstrap grid and navbar, CSS transitions and keyframe animations, scroll-triggered skill bars, four breakpoints and `prefers-reduced-motion` support.

**Task 4:** A single-page app with a hash router and 404 page, a password strength meter with a live rule checklist, confirm-password matching, a conditional form field, a filterable member list that updates without reloading, and `localStorage` persistence.

**Task 5:** CRUD endpoints (`GET`, `POST`, `PUT`, `PATCH`, `DELETE` on `/api/tasks`), validation, proper status codes (200, 201, 204, 400, 404), query filters, and a front end that fetches and shows the data and handles errors.

## Before you submit

- The portfolio in Task 3 uses placeholder names and project text. Edit `task3-responsive-design/index.html` so it says what you want it to say.
- Run each project yourself and record a short video of each working, since the internship asks for a LinkedIn video tagging Cognifyz with `#cognifyz #cognifyzTech #cognifyzTechnologies`.
- Be ready to explain the code in your own words. The task sheet treats copied code as a serious offence.
