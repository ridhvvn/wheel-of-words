# Vanilla JS / Static Build

This folder contains the compiled static assets of the project.

## How to run

Since this is a Single Page Application (SPA) built with Vite, it uses absolute paths and client-side routing. You cannot simply open `index.html` in your browser directly via the file system (`file://`).

You must serve this folder using a local web server.

### Options:

1.  **VS Code Live Server Extension**:
    *   Right-click `index.html` and select "Open with Live Server".

2.  **Python**:
    *   Run `python -m http.server` inside this directory.

3.  **Node.js (http-server)**:
    *   Run `npx http-server .` inside this directory.

## Contents

*   `index.html`: The entry point.
*   `assets/`: Contains the compiled JavaScript (React app) and CSS (Tailwind styles).
