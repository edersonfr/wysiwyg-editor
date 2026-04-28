(function ($) {

  // =========================
  // CONSTRUTOR
  // =========================
  function WysiwygEditor(element, options) {
    this.$el = $(element);
    this.options = $.extend(true, {}, WysiwygEditor.defaults, options);

    this.modules = {};
    this.state = {
      mode: 'visual'
    };

    this.init();
  }

  // =========================
  // INIT
  // =========================
  WysiwygEditor.prototype.init = function () {
    this.buildLayout();

    this.modules.sanitizer = new Sanitizer(this);
    this.modules.commands = new Commands(this);
    this.modules.toolbar = new Toolbar(this);
    this.modules.history = new History(this);

    this.bindEvents();

    this.modules.history.save();
  };

  // =========================
  // LAYOUT
  // =========================
  WysiwygEditor.prototype.buildLayout = function () {

    this.injectStyles();

    this.$container = $('<div class="wysiwyg-editor"/>');
    this.$toolbar = $('<div class="editor-toolbar"/>');
    this.$content = $('<div class="editor-content" contenteditable="true"/>');
    this.$code = $('<textarea class="editor-code"/>').hide();

    this.$container.append(this.$toolbar, this.$content, this.$code);
    this.$el.append(this.$container);
  };

  // =========================
  // CSS INLINE
  // =========================
  WysiwygEditor.prototype.injectStyles = function () {
    if ($('#wysiwyg-editor-style').length) return;

    var css = `
      .wysiwyg-editor { border:1px solid #ccc; font-family:Arial; }
      .editor-toolbar { border-bottom:1px solid #ddd; padding:5px; background:#f5f5f5; }
      .editor-toolbar button { margin-right:5px; cursor:pointer; }
      .editor-content { min-height:200px; padding:10px; outline:none; }
      .editor-code { width:100%; height:200px; border:none; padding:10px; font-family:monospace; }
    `;

    $('<style id="wysiwyg-editor-style"/>').text(css).appendTo('head');
  };

  // =========================
  // EVENTS
  // =========================
  WysiwygEditor.prototype.bindEvents = function () {
    var self = this;

    this.$content.on('input', function () {
      self.modules.history.save();
      self.triggerChange();
    });

    this.$content.on('paste', function (e) {
      e.preventDefault();

      var text = (e.originalEvent || e).clipboardData.getData('text/plain');
      document.execCommand('insertText', false, text);
    });
  };

  WysiwygEditor.prototype.triggerChange = function () {
    this.$el.trigger('change', [this.getContent()]);
  };

  // =========================
  // API
  // =========================
  WysiwygEditor.prototype.getContent = function () {
    var html = this.$content.html();
    return this.modules.sanitizer.clean(html);
  };

  WysiwygEditor.prototype.setContent = function (html) {
    this.$content.html(html);
  };

  WysiwygEditor.prototype.toggleCode = function () {
    if (this.state.mode === 'code') {
      this.setContent(this.$code.val());
      this.$code.hide();
      this.$content.show();
      this.state.mode = 'visual';
    } else {
      this.$code.val(this.getContent());
      this.$content.hide();
      this.$code.show();
      this.state.mode = 'code';
    }
  };

  // =========================
  // TOOLBAR
  // =========================
  function Toolbar(editor) {
    this.editor = editor;
    this.init();
  }

  Toolbar.prototype.init = function () {
    this.render();
    this.bind();
  };

  Toolbar.prototype.render = function () {
    var buttons = this.editor.options.buttons;

    for (var i = 0; i < buttons.length; i++) {
      var btn = $('<button type="button"/>')
        .html(buttons[i].icon)
        .data('action', buttons[i]);

      this.editor.$toolbar.append(btn);
    }
  };

  Toolbar.prototype.bind = function () {
    var self = this;

    this.editor.$toolbar.on('click', 'button', function () {
      var action = $(this).data('action');
      action.action(self.editor);
    });
  };

  // =========================
  // COMMANDS
  // =========================
  function Commands(editor) {
    this.editor = editor;
  }

  Commands.prototype.exec = function (command, value) {
    document.execCommand(command, false, value);
    this.editor.$content.focus();
  };

  Commands.prototype.insertHtml = function (html) {
    document.execCommand('insertHTML', false, html);
  };

  // =========================
  // SANITIZER
  // =========================
  function Sanitizer(editor) {
    this.editor = editor;
  }

  Sanitizer.prototype.clean = function (html) {
    var div = document.createElement('div');
    div.innerHTML = html;

    this.walk(div);

    return div.innerHTML;
  };

  Sanitizer.prototype.walk = function (node) {
    var allowed = this.editor.options.allowedTags;

    var children = node.children;

    for (var i = children.length - 1; i >= 0; i--) {
      var child = children[i];

      if (allowed.indexOf(child.tagName.toLowerCase()) === -1) {
        child.parentNode.removeChild(child);
      } else {
        this.cleanAttrs(child);
        this.walk(child);
      }
    }
  };

  Sanitizer.prototype.cleanAttrs = function (el) {
    var attrs = el.attributes;

    for (var i = attrs.length - 1; i >= 0; i--) {
      var name = attrs[i].name;

      if (name.indexOf('on') === 0 || name === 'style') {
        el.removeAttribute(name);
      }
    }
  };

  // =========================
  // HISTORY
  // =========================
  function History(editor) {
    this.editor = editor;
    this.stack = [];
    this.index = -1;
  }

  History.prototype.save = function () {
    var content = this.editor.$content.html();

    if (this.stack[this.index] === content) return;

    this.stack = this.stack.slice(0, this.index + 1);
    this.stack.push(content);
    this.index++;
  };

  History.prototype.undo = function () {
    if (this.index > 0) {
      this.index--;
      this.editor.setContent(this.stack[this.index]);
    }
  };

  History.prototype.redo = function () {
    if (this.index < this.stack.length - 1) {
      this.index++;
      this.editor.setContent(this.stack[this.index]);
    }
  };

  // =========================
  // DEFAULTS
  // =========================
  WysiwygEditor.defaults = {
    allowedTags: ['p', 'b', 'i', 'u', 'ul', 'ol', 'li', 'a', 'img', 'h1', 'h2', 'h3'],
    buttons: [
      {
        icon: '<b>B</b>',
        action: function (editor) {
          editor.modules.commands.exec('bold');
        }
      },
      {
        icon: '<i>I</i>',
        action: function (editor) {
          editor.modules.commands.exec('italic');
        }
      },
      {
        icon: 'U',
        action: function (editor) {
          editor.modules.commands.exec('underline');
        }
      },
      {
        icon: '• Lista',
        action: function (editor) {
          editor.modules.commands.exec('insertUnorderedList');
        }
      },
      {
        icon: '1. Lista',
        action: function (editor) {
          editor.modules.commands.exec('insertOrderedList');
        }
      },
      {
        icon: '🔗',
        action: function (editor) {
          var url = prompt('Digite a URL:');
          if (url) editor.modules.commands.exec('createLink', url);
        }
      },
      {
        icon: '🖼️',
        action: function (editor) {
          var url = prompt('URL da imagem:');
          if (url) editor.modules.commands.insertHtml('<img src="' + url + '" />');
        }
      },
      {
        icon: '</>',
        action: function (editor) {
          editor.toggleCode();
        }
      },
      {
        icon: '↶',
        action: function (editor) {
          editor.modules.history.undo();
        }
      },
      {
        icon: '↷',
        action: function (editor) {
          editor.modules.history.redo();
        }
      }
    ]
  };

  // =========================
  // JQUERY PLUGIN
  // =========================
  $.fn.wysiwygEditor = function (options) {
    return this.each(function () {
      var editor = new WysiwygEditor(this, options);
      $(this).data('wysiwygEditor', editor);
    });
  };

})(jQuery);