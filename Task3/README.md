# Task 3: Advanced CSS Styling and Responsive Design

**Level 2 (Intermediate)** | Cognifyz Full Stack Development Internship

**Objective:** Enhance CSS styling and make the webpage fully responsive.

## What I built
- A portfolio page with six sections: hero, about, skills, projects, journey (timeline) and contact
- Bootstrap 5 for the grid, collapsing navbar, buttons and form controls
- Custom CSS on top of Bootstrap:
  - CSS variables for the colour palette and fonts
  - Transitions: nav link underline, button lift, card hover, focus rings
  - Keyframe animations: orbiting tech chips and a pulsing core in the hero
  - Skill bars that fill when scrolled into view
- Responsive layout: 1, 2 and 3 column project grid, mobile menu, full-width buttons on phones, and a large-screen size
- `prefers-reduced-motion` support for users who turn animations off
- A small JavaScript file for the navbar shadow, scroll highlighting, bar animation and a contact form check

## Tech used
HTML5, CSS3 (custom properties, flexbox, grid via Bootstrap, keyframes, media queries), Bootstrap 5.3, vanilla JavaScript, Google Fonts

## Breakpoints
Below 576px (phones), below 992px (tablets), 992px and up (desktop), 1400px and up (large monitors).

## Folder structure
```
Task3_Responsive_CSS_Design/
  index.html
  css/styles.css
  js/main.js
```

## How to run
No install needed. Open `index.html` in a browser. Bootstrap and fonts load from a CDN, so an internet connection is required.

## Demo tip
Drag the browser window narrower (or use dev tools device mode) to show the layout changing and the menu collapsing.
