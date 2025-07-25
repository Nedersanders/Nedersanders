# Sanderfest Node.js Express App Structure

This project is a Node.js Express web application. Below is an overview of the main file and folder structure as found in this repository:

## Main Files and Folders

- **app.js**: Main entry point for the Express application.
- **bin/**: Contains the `www` file, which is used to start the server.
- **public/**: Static assets served by Express (images, JavaScript, CSS).
  - **images/**: Image files for the app.
  - **javascripts/**: Client-side JavaScript files.
  - **stylesheets/**: CSS stylesheets (e.g., `style.css`).
- **routes/**: Express route handlers.
  - **index.js**: Main route definitions.
- **views/**: EJS templates for server-side rendering.
  - **index.ejs**: Main page template.
  - **error.ejs**: Error page template.
- **lib/** and **lib64/**: Contain shared libraries (not used by the Node.js app directly, but present in the folder).
- **Dockerfile**: Instructions to build a Docker image for this app. Do not edit without contacting Sander (server owner: +31618617731) or Sander (server admin: +31683238115)
- **package.json**: Project metadata and dependencies.
- **.gitignore**: Files and folders to ignore in git.
- **.dockerignore**: Files and folders to ignore in Docker builds.

## How It Works
- The app starts from `bin/www` (which loads `app.js`).
- Routes are defined in the `routes/` folder.
- Static files are served from `public/`.
- Views are rendered using EJS templates in `views/`.

For more details, see the code in each folder.
