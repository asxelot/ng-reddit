// Karma configuration
// Generated on Fri Sep 11 2015 18:03:42 GMT+0300 (Восточная Европа (лето))

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'public/libs/angular/angular.js',
      'public/libs/angular-resource/angular-resource.min.js',
      'public/libs/angular-messages/angular-messages.min.js',
      'public/libs/angular-route/angular-route.min.js',
      'public/libs/moment/min/moment.min.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'public/app/*.js',
      'public/views/*.html',
      'test/unit/*.spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        'public/views/*.html': 'ng-html2js'
    },

    ngHtml2JsPreprocessor: {
        stripPrefix: 'public/',
        moduleName: 'templates'
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['dots', 'beep'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_ERROR,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  })
}
