<p align="center">
  <a href="http://ned.im/minibed?ref=readme">
    <img src="http://ned.im/minibed/img/projects/minibed-logo.svg" width=180>
  </a>

  <p align="center">
    mini editable, customizable playground for web
    <br>
    <a href="http://ned.im/minibed?ref=readme-link"><strong>Documentation &raquo;</strong></a>
  </p>

  <p align="center">
    <a href="https://github.com/needim/minibed/releases"><img src="https://img.shields.io/github/release/needim/minibed.svg" alt="GitHub release"></a>
    <a href="https://bower.io/"><img src="https://img.shields.io/bower/v/minibed.svg" alt="Bower version"></a>
    <a href="https://www.npmjs.com/package/minibed"><img src="https://img.shields.io/npm/v/minibed.svg" alt="NPM version"></a>
    <a href="https://packagist.org/packages/needim/minibed"><img src="https://img.shields.io/packagist/v/needim/minibed.svg" alt="Packagist version"></a>
    <br>
    <img src="https://img.shields.io/david/needim/minibed.svg" alt="Dependencies">
    <img src="https://img.shields.io/david/dev/needim/minibed.svg" alt="Dev Dependencies">
    <br>
    <a href="https://travis-ci.org/needim/minibed"><img src="https://img.shields.io/travis/needim/minibed/master.svg" alt="Travis"></a>
    <a href="https://www.npmjs.com/package/minibed"><img src="https://img.shields.io/npm/dm/minibed.svg?label=npm%20downloads" alt="NPM Downloads"></a>
    <a href="https://github.com/needim/minibed/graphs/contributors"><img src="https://img.shields.io/github/contributors/needim/minibed.svg" alt="Contributors"></a>
  </p>

  <p align="center">
    <a href="http://ned.im/minibed?ref=readme">
      <img src="http://ned.im/minibed/img/projects/minibed-live.gif">
    </a>
  </p>
</p>

<br>


## Hi

This is **minibed**! - mini editable, customizable playground for web

***
### Features
- [x] Free & Open Source
- [x] Live Edit
- [x] Multiple file support for per-languages
- [x] Remote files
- [x] Fully customizable

### TO-DO
- [ ] Better error handling
- [ ] Support for preprocessors (babel, sass, ...)

### Documentation
Documentation and examples are here: <http://ned.im/minibed>

Logo created by Karthik Srinivas from the Noun Project
***

##### Dependencies
- CodeMirror
  - codemirror.css
  - mode/javascript/javascript
  - mode/htmlmixed/htmlmixed
  - mode/jsx/jsx
  - mode/xml/xml
  - mode/css/css
  - addon/scroll/simplescrollbars
  - addon/edit/matchbrackets
  - addon/edit/closetag
  - addon/edit/closebrackets

##### Basic Usage
```js
import Minibed from 'minibed';

new Minibed({
    theme: 'dark',
    editorTheme: 'minibed-dark',
    files: {
      html: ['mini.html', 'bed.html'],
      js: ['mini.js', 'mini.es6'],
      css: ['mini.css', 'mini.scss', 'mini.less']
    },
    external: {
      js: [],
      css: []
    },
    settings: {
      readOnly: false, // true, nocursor, false
      scrollLock: false,
      lineWrapping: true,
      lineNumbers: true,
      tabSize: 2,
      css: {
        base: 'none', // normalize, reset
      }
    },
    notes: [] // array of strings, like footer notes, they are gonna be paragraphs
}).show();

```

##### Development
```console
$ npm run dev
$ npm test
$ npm run build
```

##### Development environment
- [x] Standard & Prettier
- [x] ES6 & Babel & Webpack
- [x] Sass
- [x] Autoprefixer
- [ ] Qunit & SauceLabs
- [ ] Pre-commit tests
- [ ] Travis CI


[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
