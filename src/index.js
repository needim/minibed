/* global VERSION, CodeMirror */

import 'minibed.scss'
import * as API from 'api'
import * as Utils from 'utils'

export default class Minibed {
  /**
   * @param {object} options
   * @return {Minibed}
   */
  constructor (options = {}) {
    this.options = Utils.deepExtend({}, API.Defaults, options)
    this.id = this.options.id || Utils.generateID('bed')
    this.liveTimeout = -1
    this.isLive = false
    this.heightSetted = false
    this.resizer = null

    this.loading = null
    this.wrapper = null
    this.container = null
    this.liveButton = null

    this.has = {
      html: false,
      css: false,
      js: false
    }

    Object.keys(this.options.files).forEach(type => {
      if (this.options.files.hasOwnProperty(type)) {
        for (let i = 0; i < this.options.files[type].length; i++) {
          const ext = Utils.getExtension(this.options.files[type][i])
          if (Utils.inArray(ext, API.FileTypes.html)) {
            this.has.html = true
            continue
          }

          if (Utils.inArray(ext, API.FileTypes.js)) {
            this.has.js = true
            continue
          }

          if (Utils.inArray(ext, API.FileTypes.css)) {
            this.has.css = true
          }
        }
      }
    })

    return this
  }

  /**
   * @return {Minibed}
   */
  show () {
    API.build(this)

    this.container.appendChild(this.wrapper)
    this.loading = this.container.querySelector('.minibed_loading')

    this.bindEvents()
    this.initEditor()
    return this
  }

  bindEvents () {
    const self = this
    const tabs = this.wrapper.querySelectorAll('.minibed_tab')

    tabs.forEach(tab => {
      Utils.addListener(tab, 'click', e => {
        Utils.stopPropagation(e)

        if (!Utils.hasClass(tab, 'minibed_active')) {
          Utils.removeClass(
            self.wrapper.querySelector('.minibed_active'),
            'minibed_active'
          )
          Utils.addClass(tab, 'minibed_active')
        }

        Utils.removeClass(
          self.wrapper.querySelector('.minibed_active_tab'),
          'minibed_active_tab'
        )
        Utils.removeClass(
          self.wrapper.querySelector(
            '.minibed_tab_content[data-lang="' +
              tab.getAttribute('data-lang') +
              '"]'
          ),
          'minibed_selected_content'
        )
        Utils.addClass(
          self.wrapper.querySelector(
            '.minibed_tab_content[data-file="' +
              tab
                .querySelector('.minibed_tabs_current')
                .getAttribute('data-current') +
              '"]'
          ),
          'minibed_active_tab minibed_selected_content'
        )

        self.initEditor()
      })
    })

    this.liveButton = this.wrapper.querySelector('.minibed_tab_result')
    Utils.addListener(this.liveButton, 'click', () => {
      this.liveToggle()
    })

    Utils.addListener(this.liveButton.querySelector('label'), 'click', e => {
      e.preventDefault()
      return false
    })

    const dropdownItems = this.wrapper.querySelectorAll(
      '.minibed_dropdown_item'
    )

    dropdownItems.forEach(item => {
      Utils.addListener(item, 'click', e => {
        Utils.stopPropagation(e)
        if (!Utils.hasClass(item, 'minibed_selected_tab')) {
          Utils.removeClass(
            item.parentNode.querySelector('.minibed_selected_tab'),
            'minibed_selected_tab'
          )
          Utils.addClass(item, 'minibed_selected_tab')
          const curr = item.parentNode.parentNode.querySelector(
            '.minibed_tabs_current'
          )
          curr.setAttribute('data-current', item.getAttribute('data-file'))
          curr.click()
        }
      })
    })
  }

  liveToggle () {
    if (Utils.hasClass(this.liveButton, 'mb_live_active')) {
      Utils.removeClass(this.liveButton, 'mb_live_active')
      Utils.removeClass(this.tabContents, 'minibed_live')
      this.liveButton
        .querySelector('#minibed_checkbox-result')
        .removeAttribute('checked')
      this.isLive = false
    } else {
      Utils.addClass(this.liveButton, 'mb_live_active')
      Utils.addClass(this.tabContents, 'minibed_live')
      this.liveButton
        .querySelector('#minibed_checkbox-result')
        .setAttribute('checked', 'checked')
      this.isLive = true
      this.run()
    }
    setTimeout(
      () => {
        this.activeEditor.refresh()
      },
      10
    )
  }

  importCSS () {
    let styleContent = this.container.querySelector(
      '.minibed_selected_content[data-lang="css"]'
    )
    return styleContent
      ? `<style type="text/css">${styleContent.innerHTML}</style>`
      : ''
  }

  importHTML () {
    let htmlContent = this.container.querySelector(
      '.minibed_selected_content[data-lang="htmlmixed"]'
    )
    return htmlContent ? Utils.fixHTML(htmlContent.value) : ''
  }

  importJS () {
    let jsContent = this.container.querySelector(
      '.minibed_selected_content[data-lang="javascript"]'
    )
    return jsContent
      ? `<script type="text/javascript">${jsContent.value}</script>`
      : ''
  }

  importJSError () {
    return `<script type="text/javascript">window.onerror = function(msg, source, lineno, colno, error) {
      console.log(msg, source, lineno, colno, error)
      parent.document.querySelector('.minibed_bed#${this.id} .minibed_result_frame').style.borderBottomColor = '#F44336';
    }</script>`
  }

  importBaseCSS () {
    if (this.options.settings.css.base !== 'none') {
      return `<link rel="stylesheet prefetch" href="${API.Includes[this.options.settings.css.base]}"/>`
    }
    return ''
  }

  importExternalCSS () {
    let styles = ''

    if (this.options.external.css.length > 0) {
      this.options.external.css.forEach(url => {
        styles += `<link rel="stylesheet prefetch" href="${url}"/>`
      })
    }
    return styles
  }

  importExternalJS () {
    let styles = ''

    if (this.options.external.js.length > 0) {
      this.options.external.js.forEach(url => {
        styles += `<script src="${url}" type="text/javascript"></script>\n\n\n`
      })
    }

    return styles
  }

  run () {
    if (this.isLive) {
      Utils.remove(this.container.querySelector('iframe.minibed_result_frame'))

      const resultFrame = new Utils.CreateDOM('iframe.minibed_result_frame')
        .setAttr('src', 'about:blank')
        .setAttr('name', this.id)
      this.tabContents.appendChild(resultFrame.el)

      const frameTemplate = `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>minibed <3</title>
          ${this.importBaseCSS()}
          ${this.importExternalCSS()}
          ${this.importCSS()}
        </head>
        <body>
          ${this.importHTML()}
          ${this.importJSError()}
          ${this.importExternalJS()}
          ${this.importJS()}
        </body>
        </html>`

      const iframe = window.frames[this.id].document
      iframe.open()
      iframe.write(frameTemplate)
      iframe.close()
    }
  }

  initCodeMirror () {
    const self = this

    let mode = this.activeContent.getAttribute('data-lang')

    this.activeEditor = CodeMirror.fromTextArea(this.activeContent, {
      mode: mode,
      tabSize: this.options.settings.tabSize,
      lineNumbers: this.options.settings.lineNumbers,
      lineWrapping: this.options.settings.lineWrapping,
      readOnly: this.options.settings.readOnly,
      styleActiveLine: true,
      matchBrackets: true,
      autoCloseBrackets: true,
      autoCloseTags: true,
      theme: this.options.editorTheme,
      scrollbarStyle: 'simple'
    })

    this.activeEditor.on('change', () => {
      self.activeContent.innerHTML = self.activeEditor.getValue()
      self.activeContent.value = self.activeEditor.getValue()
      clearTimeout(self.liveTimeout)
      self.liveTimeout = setTimeout(
        () => {
          self.run()
        },
        400
      )
    })

    this.tabContents = this.wrapper.querySelector('.minibed_tab_contents')

    if (!self.heightSetted) {
      Utils.css(this.tabContents, {
        height: this.tabContents.offsetHeight + 'px'
      })
    }

    const scroller = this.wrapper.querySelector('.CodeMirror-scroll')

    if (this.options.settings.scrollLock && !Utils.isTouchDevice()) {
      Utils.addListener(scroller, 'mousewheel DOMMouseScroll', e => {
        let delta = e.wheelDelta ||
          (e.originalEvent && e.originalEvent.wheelDelta) ||
          -e.detail
        let bottomOverflow = scroller.scrollTop +
          scroller.getBoundingClientRect().height -
          scroller.scrollHeight >=
          0
        let topOverflow = scroller.scrollTop <= 0
        if ((delta < 0 && bottomOverflow) || (delta > 0 && topOverflow)) {
          e.preventDefault()
        }
      })
    }

    Utils.addClass(this.loading, 'hide')

    this.resizer = new Utils.MBResizable(this.wrapper.querySelector('.CodeMirror'), () => {
      self.activeEditor.refresh()
      Utils.css(self.tabContents, {
        height: self.wrapper.querySelector('.CodeMirror').offsetHeight + 'px'
      })
    })

    this.run()
  }

  initEditor () {
    const self = this
    Utils.removeClass(this.loading, 'hide')

    if (this.activeEditor) {
      this.activeEditor.toTextArea()
    }

    this.activeContent = this.container.querySelector('.minibed_active_tab')

    if (this.activeContent.getAttribute('data-loaded') === 'yes') {
      this.initCodeMirror()
      return
    }

    const allFiles = []
    if (this.has.js) {
      this.options.files.js.forEach(file => {
        allFiles.push(file)
      })
    }
    if (this.has.css) {
      this.options.files.css.forEach(file => {
        allFiles.push(file)
      })
    }
    if (this.has.html) {
      this.options.files.html.forEach(file => {
        allFiles.push(file)
      })
    }

    this.responseCount = 0

    allFiles.forEach(file => {
      Utils.Request(file, data => {
        self.responseCount++
        const textarea = self.wrapper.querySelector(
          '.minibed_tab_content[data-file="' + file + '"]'
        )
        textarea.innerHTML = data
        textarea.setAttribute('data-loaded', 'yes')
      })
    })

    this.responseCheck = window.setInterval(
      () => {
        if (self.responseCount === allFiles.length) {
          window.clearInterval(self.responseCheck)
          self.initCodeMirror()
          self.liveToggle()
        }
      },
      100
    )
  }

  // API functions
  /**
   * @param {Object} obj
   * @return {Minibed}
   */
  static overrideDefaults (obj) {
    API.Defaults = Utils.deepExtend({}, API.Defaults, obj)
    return this
  }

  /**
   * @return {string}
   */
  static version () {
    return VERSION
  }
}
