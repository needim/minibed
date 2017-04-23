import * as Utils from 'utils'

export const FileTypes = {
  html: ['html'],
  css: ['css', 'sass', 'scss', 'less'],
  js: ['js', 'es6']
}

export const Includes = {
  normalize: 'https://cdnjs.cloudflare.com/ajax/libs/normalize/6.0.0/normalize.min.css',
  reset: 'https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css'
}

export let Defaults = {
  theme: 'dark',
  editorTheme: 'minibed-dark',
  id: false,
  container: false,
  files: {
    html: [],
    js: [],
    css: []
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
    js: {
      preprocessor: 'none' // babel, typescript, coffeescript, livescript
    },
    css: {
      preprocessor: 'none', // less, sass, scss, stylus, postcss
      base: 'normalize', // reset, none
      prefixing: 'none', // autoprefixer
      imports: [] // susy, compass, bourbon etc. NOT IMPLEMENTED YET
    },
    html: {
      preprocessor: 'none' // haml, markdown, slim, pug
    }
  }
}

const PreprocessorNames = {
  sass: 'SASS',
  scss: 'SCSS',
  less: 'LESS',
  stylus: 'Stylus',
  babel: 'Babel',
  coffeescript: 'CoffeeScript',
  livescript: 'LiveScript',
  typescript: 'TypeScript',
  haml: 'Haml',
  slim: 'Slim',
  pug: 'Pug'
}
/**
 * @param {Minibed} ref
 * @return {void}
 */
export function build (ref) {
  findOrCreateContainer(ref)

  ref.wrapper = document.createElement('div')
  ref.wrapper.setAttribute('id', ref.id)
  Utils.addClass(
    ref.wrapper,
    `minibed_bed minibed_theme__${ref.options.theme}`
  )

  if (ref.options.notes.length > 0) {
    Utils.addClass(ref.wrapper, 'minibed_has_footer')
  }

  buildHeader(ref)
  buildContents(ref)
  buildFooter(ref)
}

function getProcessorNameFor (ref, lang) {
  let name = PreprocessorNames[ref.options.settings[lang].preprocessor]
  if (name === undefined) {
    if (lang === 'js') {
      return 'JavaScript'
    } else if (lang === 'css') {
      return 'CSS'
    } else {
      return 'HTML'
    }
  }

  return name
}

/**
 * @param {Minibed} ref
 * @return {void}
 */
function buildHeader (ref) {
  const tabs = new Utils.CreateDOM('div.minibed_tabs')
  let foundActive = false

  const logo = new Utils.CreateDOM('a.minibed_logo')
    .setAttr('href', 'http://ned.im/minibed')
    .html('minibed')
  tabs.append(logo.el)

  if (ref.has.html) {
    const tabsHTML = new Utils.CreateDOM('div.minibed_tab.minibed_tabs_html')
    tabsHTML.setAttr('data-lang', 'htmlmixed')
    tabsHTML.setAttr('data-multiple', ref.options.files.html.length > 1)

    if (!foundActive) {
      tabsHTML.class('minibed_active')
      foundActive = true
    }

    const current = new Utils.CreateDOM('div.minibed_tabs_current')
      .setAttr('data-current', ref.options.files.html[0])
      .html(getProcessorNameFor(ref, 'html'))
    tabsHTML.append(current.el)

    if (ref.options.files.html.length > 1) {
      const dropdown = new Utils.CreateDOM('div.minibed_tabs_dropdown')

      let i = 0
      ref.options.files.html.forEach(file => {
        const tab = new Utils.CreateDOM('div.minibed_dropdown_item')
          .html(getShortName(file))
          .setAttr('data-file', file)

        if (i === 0) {
          tab.class('minibed_selected_tab')
        }

        dropdown.append(tab.el)
        i++
      })
      tabsHTML.append(dropdown.el)
    }

    tabs.append(tabsHTML.el)
  }

  if (ref.has.css) {
    const tabsCSS = new Utils.CreateDOM('div.minibed_tab.minibed_tabs_css')
    tabsCSS.setAttr('data-lang', 'css')
    tabsCSS.setAttr('data-multiple', ref.options.files.css.length > 1)

    if (!foundActive) {
      tabsCSS.class('minibed_active')
      foundActive = true
    }

    const current = new Utils.CreateDOM('div.minibed_tabs_current')
      .setAttr('data-current', ref.options.files.css[0])
      .html(getProcessorNameFor(ref, 'css'))
    tabsCSS.append(current.el)

    if (ref.options.files.css.length > 1) {
      const dropdown = new Utils.CreateDOM('div.minibed_tabs_dropdown')

      let i = 0
      ref.options.files.css.forEach(file => {
        const tab = new Utils.CreateDOM('div.minibed_dropdown_item')
          .html(getShortName(file))
          .setAttr('data-file', file)

        if (i === 0) {
          tab.class('minibed_selected_tab')
        }

        dropdown.append(tab.el)
        i++
      })
      tabsCSS.append(dropdown.el)
    }

    tabs.append(tabsCSS.el)
  }

  if (ref.has.js) {
    const tabsJS = new Utils.CreateDOM('div.minibed_tab.minibed_tabs_js')
    tabsJS.setAttr('data-lang', 'javascript')
    tabsJS.setAttr('data-multiple', ref.options.files.js.length > 1)

    if (!foundActive) {
      tabsJS.class('minibed_active')
    }

    const current = new Utils.CreateDOM('div.minibed_tabs_current')
      .setAttr('data-current', ref.options.files.js[0])
      .html(getProcessorNameFor(ref, 'js'))
    tabsJS.append(current.el)

    if (ref.options.files.js.length > 1) {
      const dropdown = new Utils.CreateDOM('div.minibed_tabs_dropdown')

      let i = 0
      ref.options.files.js.forEach(file => {
        const tab = new Utils.CreateDOM('div.minibed_dropdown_item')
          .html(getShortName(file))
          .setAttr('data-file', file)

        if (i === 0) {
          tab.class('minibed_selected_tab')
        }

        dropdown.append(tab.el)
        i++
      })
      tabsJS.append(dropdown.el)
    }

    tabs.append(tabsJS.el)
  }

  const result = new Utils.CreateDOM('div.minibed_tab_result').html(
    '<div class="minibed_checkbox-result"><input type="checkbox" id="minibed_checkbox-result" value="on"><label for="minibed_checkbox-result"></label> Live </div>'
  )

  tabs.append(result.el)

  ref.wrapper.appendChild(tabs.el)
}

function getShortName (name) {
  const parts = name.split('/')
  return parts[parts.length - 1]
}

/**
 * @param {Minibed} ref
 * @return {void}
 */
function buildContents (ref) {
  const tabContents = new Utils.CreateDOM('div.minibed_tab_contents')
  let foundActive = false

  ref.loading = new Utils.CreateDOM('div.minibed_loading')
  tabContents.append(ref.loading.el)

  if (ref.has.html) {
    let i = 0
    ref.options.files.html.forEach(file => {
      const tabContent = new Utils.CreateDOM('textarea.minibed_tab_content')
        .setAttr('data-file', file)
        .setAttr('data-loaded', 'no')
        .setAttr('data-lang', 'htmlmixed')

      if (i === 0) {
        tabContent.class('minibed_selected_content')
      }

      if (!foundActive) {
        tabContent.class('minibed_active_tab')
        foundActive = true
      }

      tabContents.append(tabContent.el)
      i++
    })
  }

  if (ref.has.css) {
    let i = 0
    ref.options.files.css.forEach(file => {
      const tabContent = new Utils.CreateDOM('textarea.minibed_tab_content')
        .setAttr('data-file', file)
        .setAttr('data-loaded', 'no')
        .setAttr('data-lang', 'css')

      if (i === 0) {
        tabContent.class('minibed_selected_content')
      }

      if (!foundActive) {
        tabContent.class('minibed_active_tab')
        foundActive = true
      }

      tabContents.append(tabContent.el)
      i++
    })
  }

  if (ref.has.js) {
    let i = 0
    ref.options.files.js.forEach(file => {
      const tabContent = new Utils.CreateDOM('textarea.minibed_tab_content')
        .setAttr('data-file', file)
        .setAttr('data-loaded', 'no')
        .setAttr('data-lang', 'javascript')

      if (i === 0) {
        tabContent.class('minibed_selected_content')
      }

      if (!foundActive) {
        tabContent.class('minibed_active_tab')
        foundActive = true
      }

      tabContents.append(tabContent.el)
      i++
    })
  }

  const resultFrame = new Utils.CreateDOM('iframe.minibed_result_frame')
    .setAttr('src', 'about:blank')
    .setAttr('name', ref.id)
  tabContents.append(resultFrame.el)

  ref.wrapper.appendChild(tabContents.el)
}

/**
 * @param {Minibed} ref
 * @return {void}
 */
function buildFooter (ref) {
  if (ref.options.notes.length > 0) {
    const footer = new Utils.CreateDOM('div.minibed_footer')

    ref.options.notes.forEach(note => {
      const p = new Utils.CreateDOM('p.minibed_footer_note').html(note)

      footer.append(p.el)
    })

    ref.wrapper.appendChild(footer.el)
  }
}

/**
 * @param {Minibed} ref
 * @return {void}
 */
function findOrCreateContainer (ref) {
  if (ref.options.container) {
    ref.container = document.querySelector(ref.options.container)
  }
}
