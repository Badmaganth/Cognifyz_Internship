# Task 4: Complex Form Validation and Dynamic DOM Manipulation

**Level 2 (Intermediate)** | Cognifyz Full Stack Development Internship

**Objective:** Extend form validation and implement dynamic updates to the DOM.

## What I built
- **Complex validation:** username rules (3 to 20 characters, cannot start with a digit, must be unique), email format and uniqueness, a password rule set, confirm-password matching, and a rejection of common passwords or passwords containing the username
- **Password strength meter:** a bar, a label (weak, fair, good, strong) and a checklist of six rules that tick off live as you type
- **Dynamic DOM updates:** a show/hide password button, an extra field that appears only when "Something else" is chosen, a members list that is rebuilt on every change, live search, remove buttons, a member counter in the menu and toast messages
- **Client-side routing:** a small hash router (`#/`, `#/register`, `#/members`, `#/about`) with a 404 page. Pages are swapped in from `<template>` elements without reloading
- Members persist in `localStorage`. Passwords are deliberately never stored

## Tech used
HTML5 templates, CSS3, vanilla JavaScript (no framework, no build step)

## Routes
| Hash | Page |
|---|---|
| `#/` | Home |
| `#/register` | Join form |
| `#/members` | Member list with search |
| `#/about` | About |
| anything else | 404 page |

## Folder structure
```
Task4_Forms_DOM_Routing/
  index.html
  css/styles.css
  js/app.js
```

## How to run
No install needed. Open `index.html` in a browser.

## Demo tip
Type a password slowly to show the meter and checklist change, then register two members, search for one and remove one.
