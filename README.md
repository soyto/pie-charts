# Pie charts

Small test project to show some pie charts

## Specifications

Build an application that consumes mocked web servers and represents it as the following picture:

![Pie charts](https://i.imgur.com/vmZf1aI.png)

## Features

- [x] Create reusable component that shows the charts
- [x] Each chart have a loading indicator
- [x] When data is loaded there are beautifull animations through each chart

## Navigators
Tested with: 
- Desktop Google Chrome (71.0.3578.98)
- Mobile Google Chrome (72.0.3626.76)

## Development server
Run `npm run start` for a dev server. Navigate to http://localhost:8080/. The app will automatically reload if you change any of the source files.

## Build project 
Run `npm run build` to build the project. The build artifacts will be stored in the dist/ directory. Use the --prod flag for a production build.

## Run tests
Run `npm test` to run the test suite.

## Publish on gh-pages

Do a normal git commit
Run `npm run build` for production then `git subtree push --prefix www origin gh-pages` to publish on `gh-pages` branch.
