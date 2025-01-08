// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  apiBackUrl: 'https://localhost:7015',
  // apiBackUrl: 'http://54.83.42.195:8080',
  // apiBackUrl: 'http://54.157.164.255/PrediccionSentiminetoBack',
  apiClasModelUrl:'http://127.0.0.1:8003',
  // apiClasModelUrl:'http://34.193.174.188',
  apiTopicModelUrl:'http://127.0.0.1:8004',
  // apiTopicModelUrl:'http://54.87.222.35',
  webApiUrl:'http://127.0.0.1:8005',
  production: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
