# Sanderfest Node.js Express App Structure

## Please read.
As we do not have a Team or Org account, we can not enfore pull request. Please use common sense and follow the standard procedure.
Create a new branch based of master, develop on it, push it, and create a PR for review.

Use the following naming structure: ```dev-<yournname/GH_handle>-<whatyouareworkingon>``` so we can keep track of the branches a bit better

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
- **Dockerfile**: Instructions to build a Docker image for this app. Do not edit without contacting Sander (server owner: +31618617731) or Sander (server admin: +31683238115)
- **package.json**: Project metadata and dependencies.
- **.gitignore**: Files and folders to ignore in git.
- **.dockerignore**: Files and folders to ignore in Docker builds.

# Documentation
## References
[NodeJS](https://nodejs.org/docs/latest/api/) General NodeJS doc, bit less usefull.

[Express 4.X](https://expressjs.com/en/4x/api.html) Framework documentation, routing, requests, etc

## Build
You should be able to run the app locally without using docker. Make sure you have NodeJS installed and just run ```npm start``` in the root project directory. This will spin up a server at localhost:3000

## Pushing to dev
Create a pull request from your branch. Once it is approved, we will merge it to the live dev server.

# Further remarks

## Admins
- @sanderslagman Sander (server/repo owner: +31618617731)
- @sanderverschoor (server/repo admin: +31683238115)

## I need shell access to the server 
Do you now? That can be arranged, but please provide a very solid reason to one of the admins.
