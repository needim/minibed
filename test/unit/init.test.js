$(function () {
  'use strict'

  function fakeEvent (el, e) {
    if (document.createEvent) {
      var event = document.createEvent('HTMLEvents')
      event.initEvent(e, true, false)
      el.dispatchEvent(event)
    } else {
      el.fireEvent(e)
    }
  }

  QUnit.module('Initializing')
  QUnit.test('should be defined', function (assert) {
    assert.expect(1)
    assert.ok(Minibed, 'Minibed is defined')
  })

  QUnit.test('should return a Minibed object', function (assert) {
    assert.expect(4)

    var n = new Minibed()
    assert.ok(n instanceof Minibed, 'returns Minibed object')
    assert.ok(n.options, 'has accessible properties')
    assert.strictEqual(n.id.length, 45, 'has auto generated ID')
    assert.strictEqual(n.closed, false, '.closed should be false')
  })

  QUnit.module('API Static')
  QUnit.test('overrideDefaults()', function (assert) {
    assert.expect(1)
    var obj = {
      theme: 'test',
      editorTheme: 'testEditorTheme'
    }
    Minibed.overrideDefaults(obj)

    var n = new Minibed()
    assert.deepEqual(obj, {
      theme: n.options.theme,
      editorTheme: n.options.editorTheme
    }, 'override ok')
  })

  QUnit.test('version()', function (assert) {
    assert.expect(1)
    assert.equal(typeof Minibed.version(), 'string',
      'returns version string')
  })
})
