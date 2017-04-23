$(function () {
  if ($('.prettyprint').length) {
    window.prettyPrint && prettyPrint()
  }

  var $activeLink = $('a[href$="' + window.location.pathname + '"]')
  if ($activeLink) {
    $('.top-links a').removeClass('active')
    $activeLink.addClass('active')
  }


  new Minibed({
    title: 'minibed',
    container: '#example-1',
    theme: 'dark',
    editorTheme: 'minibed-dark',
    external: {
      js: [
        'https://cdn.jsdelivr.net/mojs/latest/mo.min.js',
        'https://cdn.rawgit.com/needim/noty/master/lib/noty.js'
      ],
      css: [
        '//cdn.rawgit.com/needim/noty/master/lib/noty.css',
        'fonts/stylesheet.css'
      ]
    },
    files: {
      html: [
        'files/example-1.html',
        'files/empty.html'
      ],
      js: [
        'files/basic-init.js',
        'files/mojs-animation.js'
      ],
      css: [
        'files/example-1.css'
      ]
    },
    settings: {
      scrollLock: false,
      js: {
        preprocessor: 'none' // babel, typescript, coffeescript, livescript, none
      },
      css: {
        preprocessor: 'none', // less, sass, scss, stylus, postcss, none
        base: 'none', // normalize, reset, none
        prefixing: 'none', // autoprefixer, prefixfree, none
        imports: [] // susy, compass, bourbon etc. NOT IMPLEMENTED YET
      },
      html: {
        preprocessor: 'none' // haml, markdown, slim, pug, none
      }
    },
    notes: [
      'Hi, this is <strong>minibed</strong>!',
      'It\'s a mini editable, customizable playground bundle for web'
    ]
  }).show()

  new Share('.sharer-btn', {
    ui: {
      flyout: 'bottom center'
    },
    title: 'minibed - It\'s mini, editable, customizable playground for web',
    description: 'minibed - It\'s mini, editable, customizable playground for web',
    image: 'http://ned.im/minibed/images/projects/minibed-live.gif',
    networks: {
      pinterest: {
        enabled: false
      },
      facebook: {
        load_sdk: true,
        app_id: '198259823578303',
        title: 'minibed - It\'s mini, editable, customizable playground for web',
        caption: 'minibed - It\'s mini, editable, customizable playground for web',
        description: 'minibed - It\'s mini, editable, customizable playground for web',
        image: 'http://ned.im/minibed/images/projects/minibed-live.gif'
      },
      twitter: {
        description: 'minibed - It\'s mini, editable, customizable playground for web &num;embed &num;playground &num;library'
      }
    }
  })

})
