# Task 2: Inline Styles, Basic Interaction and Server-Side Validation

**Level 1 (Beginner)** | Cognifyz Full Stack Development Internship

**Objective:** Expand inline styles and introduce server-side validation for form submissions.

## What I built
- A more complex registration form: text, email, phone, number, radio buttons, dropdown, checkbox group, textarea and a terms checkbox
- Inline styles (`style="..."` attributes and a `<style>` block) for the whole interface
- Inline JavaScript validation: checks when a field loses focus, re-checks while typing, blocks submit and jumps to the first error, plus a live bio character counter and a clear button
- Server-side validation of the same data in `validators.js`, so the form is safe even if JavaScript is bypassed
- On a server error the form is shown again with messages and the user's input kept
- Validated data stored in temporary server memory, with a duplicate email check
- Post/Redirect/Get after a successful submit so refreshing does not resubmit

## Tech used
Node.js, Express, EJS, HTML, inline CSS, inline JavaScript

## Routes
| Method | Path | Purpose |
|---|---|---|
| GET | `/` | Registration form |
| POST | `/register` | Validate, store, redirect (400 on invalid data, 409 on duplicate email) |
| GET | `/success/:id` | Confirmation page |
| GET | `/registrations` | Everything stored so far |

## Validation rules
Name 2 to 60 letters; valid email; 10-digit mobile starting 6 to 9; age 16 to 60; gender chosen; course chosen; at least one skill; bio up to 200 characters; terms accepted.

## Folder structure
```
Task2_Server_Side_Validation/
  server.js
  validators.js
  test-validators.js
  package.json
  views/
    index.ejs  success.ejs  registrations.ejs
    partials/header.ejs  partials/footer.ejs
```

## How to run
```bash
npm install
npm start
npm test        # runs the validator tests
```
Open http://localhost:3000

## Demo tip
To show the server-side check working, turn off JavaScript in the browser (or edit the HTML in dev tools) and submit bad data. The server still rejects it.
