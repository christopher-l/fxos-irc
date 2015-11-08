# FxOS IRC

This is a work-in-progress project that aims to bring an IRC app with a native feeling UI to FirefoxOS (version &#8805; 2.5).

## Getting Started

The project hierarchy was created using angular-seed. Go to https://github.com/angular/angular-seed for a detailed documentation.

### Installation

`npm` and `bower` are used to install all dependencies to the project directory.
`npm` is configured to automatically run `bower` so simply run:

```
npm install
```

```
npm run browserify
```

### Running the Application

To run the app on an actual phone or the simulator use `Firefox`&#8217;es WebIDE and navigate to the `app` folder.

For debugging you can serve the app to localhost with:

```
npm start
```

Now browse to the app at `http://localhost:8000/app/index.html`.

### Running Unit Tests

```
npm test
```

or

```
npm run test-single-run
```

### End-to-End Testing

```
npm start
```

then

```
npm run update-webdriver
```

and

```
npm run protractor
```

## Third Party Libraries

- [AngularJS](https://angularjs.org/)
- [UI-Router](https://angular-ui.github.io/ui-router)
- [UI-Router Extras](https://christopherthielen.github.io/ui-router-extras)
- [Gaia](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox_OS/Platform/Gaia)
- [Node-IRC](https://github.com/martynsmith/node-irc) + some code of its [fork by nickdesaulniers](https://github.com/nickdesaulniers/node-irc)

Testing:
- [Karma](https://karma-runner.github.io)
- [Jasmine](https://jasmine.github.io/)
- [Protractor](https://angular.github.io/protractor/#/)

## License
[GPLv3](https://www.gnu.org/licenses/gpl.html)
