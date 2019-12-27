// This file lets us set up "environment variables", which are global variables that we can import in
// our files and we can even change them for the production and development mode. For example,
// we use "http://localhost:3000/api" for development but wouldn't use that for production mode (we'd
// use the URL of our server for that, like our domain name). To set configurations for production, go to
// the environment.prod.ts file.
//
// Note, though, that this environment file is only for the frontend Angular part of the app and so
// you can't use it as global variables for the backend NodeJs part of the app, because the Angular CLI
// doesn't manage the backend code. The only reason the backend code and frontend code are in the same
// folder structure is so we can more easily switch between files, but the code has nothing to do with
// each other


// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
