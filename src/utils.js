/* GLOBAL XMLHttpRequest, XDomainRequest */
export const animationEndEvents = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend'

export function CreateDOM (tagName) {
  let parts = tagName.split('.')
  tagName = parts.shift()

  this.el = document.createElement(tagName)

  parts.forEach(c => {
    addClass(this.el, c)
  })

  this.class = name => {
    addClass(this.el, name)
    return this
  }

  this.setAttr = (attr, val) => {
    this.el.setAttribute(attr, val)
    return this
  }

  this.html = val => {
    this.el.innerHTML = val
    return this
  }

  this.dom = () => {
    return this.el
  }

  this.append = el => {
    this.el.appendChild(el)
    return this
  }

  return this
}

export function inArray (needle, haystack, argStrict) {
  let key
  let strict = !!argStrict

  if (strict) {
    for (key in haystack) {
      if (haystack.hasOwnProperty(key) && haystack[key] === needle) {
        return true
      }
    }
  } else {
    for (key in haystack) {
      if (haystack.hasOwnProperty(key) && haystack[key] === needle) {
        return true
      }
    }
  }
  return false
}

export function stopPropagation (evt) {
  evt = evt || window.event

  if (typeof evt.stopPropagation !== 'undefined') {
    evt.stopPropagation()
  } else {
    evt.cancelBubble = true
  }
}

export const deepExtend = function (out) {
  out = out || {}

  for (let i = 1; i < arguments.length; i++) {
    let obj = arguments[i]

    if (!obj) continue

    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (Array.isArray(obj[key])) {
          out[key] = obj[key]
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          out[key] = deepExtend(out[key], obj[key])
        } else {
          out[key] = obj[key]
        }
      }
    }
  }

  return out
}

export function generateID (prefix = '') {
  let id = `minibed_${prefix}_`

  id += 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 | 0
    let v = c === 'x' ? r : r & 0x3 | 0x8
    return v.toString(16)
  })

  return id
}

export function outerHeight (el) {
  let height = el.offsetHeight
  let style = window.getComputedStyle(el)

  height += parseInt(style.marginTop) + parseInt(style.marginBottom)
  return height
}

export let css = (function () {
  let cssPrefixes = ['Webkit', 'O', 'Moz', 'ms']
  let cssProps = {}

  function camelCase (string) {
    return string
      .replace(/^-ms-/, 'ms-')
      .replace(/-([\da-z])/gi, function (match, letter) {
        return letter.toUpperCase()
      })
  }

  function getVendorProp (name) {
    let style = document.body.style
    if (name in style) return name

    let i = cssPrefixes.length
    let capName = name.charAt(0).toUpperCase() + name.slice(1)
    let vendorName

    while (i--) {
      vendorName = cssPrefixes[i] + capName
      if (vendorName in style) return vendorName
    }

    return name
  }

  function getStyleProp (name) {
    name = camelCase(name)
    return cssProps[name] || (cssProps[name] = getVendorProp(name))
  }

  function applyCss (element, prop, value) {
    prop = getStyleProp(prop)
    element.style[prop] = value
  }

  return function (element, properties) {
    let args = arguments
    let prop
    let value

    if (args.length === 2) {
      for (prop in properties) {
        if (properties.hasOwnProperty(prop)) {
          value = properties[prop]
          if (value !== undefined && properties.hasOwnProperty(prop)) {
            applyCss(element, prop, value)
          }
        }
      }
    } else {
      applyCss(element, args[1], args[2])
    }
  }
})()

export function addListener (el, events, cb, useCapture = false) {
  events = events.split(' ')
  for (let i = 0; i < events.length; i++) {
    if (document.addEventListener) {
      el.addEventListener(events[i], cb, useCapture)
    } else if (document.attachEvent) {
      el.attachEvent('on' + events[i], cb)
    }
  }
}

export function hasClass (element, name) {
  let list = typeof element === 'string' ? element : classList(element)
  return list.indexOf(' ' + name + ' ') >= 0
}

export function addClass (element, name) {
  let oldList = classList(element)
  let newList = oldList + name

  if (hasClass(oldList, name)) return

  // Trim the opening space.
  element.className = newList.substring(1)
}

export function removeClass (element, name) {
  let oldList = classList(element)
  let newList

  if (!hasClass(element, name)) return

  // Replace the class name.
  newList = oldList.replace(' ' + name + ' ', ' ')

  // Trim the opening and closing spaces.
  element.className = newList.substring(1, newList.length - 1)
}

export function remove (element) {
  if (element.parentNode) {
    element.parentNode.removeChild(element)
  }
}

export function classList (element) {
  return (' ' + ((element && element.className) || '') + ' ').replace(
    /\s+/gi,
    ' '
  )
}

export function getExtension (fileName) {
  return fileName.match(/\.([^.]+)$/)[1]
}

export function fixHTML (html) {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.innerHTML
}

export const Request = (url, callback, failCallback) => {
  const xmlHttp = new window.XMLHttpRequest()

  // @see http://blogs.msdn.com/b/ie/archive/2012/02/09/cors-for-xhr-in-ie10.aspx
  // @see http://bionicspirit.com/blog/2011/03/24/cross-domain-requests.html
  // @see http://msdn.microsoft.com/en-us/library/ie/cc288060(v=vs.85).aspx
  if ('withCredentials' in xmlHttp) {
    // for Chrome, Firefox, Opera
    xmlHttp.onreadystatechange = () => {
      if (xmlHttp.readyState === 4) {
        if (xmlHttp.status === 200 || xmlHttp.status === 304) {
          callback(xmlHttp.responseText)
        } else {
          setTimeout(failCallback, 0)
        }
      }
    }

    xmlHttp.open('GET', url, true)
    xmlHttp.send()
  } else {
    // for IE
    const xdr = new window.XDomainRequest()
    xdr.onerror = () => {
      setTimeout(failCallback, 0)
    }
    xdr.ontimeout = () => {
      setTimeout(failCallback, 0)
    }
    xdr.onload = () => {
      callback(xdr.responseText)
    }

    xdr.open('get', url)
    xdr.send()
  }
}

export function isTouchDevice () {
  return 'ontouchstart' in window || navigator.maxTouchPoints
}

export function MBResizable (el, cb = () => {}) {
  const self = this
  this.el = el

  const handle = new CreateDOM('div.resizable-handle').el
  el.appendChild(handle)

  addListener(handle, 'mousedown', initResizeable, false)
  addListener(handle, 'touchstart', initResizeable, false)

  function initResizeable (e) {
    e.preventDefault()

    try {
      e = e.touches[0] ? e.touches[0] : e
    } catch (err) {}

    self.startX = e.clientX
    self.startY = e.clientY
    self.startWidth = parseInt(
      document.defaultView.getComputedStyle(self.el, null).width,
      10
    )
    self.startHeight = parseInt(
      document.defaultView.getComputedStyle(self.el, null).height,
      10
    )

    addListener(window, 'mousemove', onDrag, false)
    addListener(window, 'mouseup', stopDrag, false)

    addListener(window, 'touchmove', onTouchMove, false)
    addListener(window, 'touchend', onTouchEnd, false)
  }

  function onTouchMove (e) {
    onDrag(e.touches[0])
  }

  function onTouchEnd (e) {
    if (e.touches.length === 0) {
      stopDrag(e.changedTouches[0])
    }
  }

  function onDrag (e) {
    self.el.style.height = self.startHeight + e.clientY - self.startY + 'px'
    cb()
  }

  function stopDrag () {
    window.removeEventListener('mousemove', onDrag, false)
    window.removeEventListener('mouseup', stopDrag, false)
    window.removeEventListener('touchmove', onTouchMove, false)
    window.removeEventListener('touchend', onTouchEnd, false)
  }
}
