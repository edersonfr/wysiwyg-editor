function SanitizerPlugin(editor) {
  this.editor = editor;
}

SanitizerPlugin.prototype.init = function () {
  this.allowedTags = this.editor.options.allowedTags || [
    'p', 'b', 'i', 'u', 'strong', 'em',
    'ul', 'ol', 'li',
    'a', 'img',
    'h1', 'h2', 'h3'
  ];

  this.allowedAttributes = {
    a: ['href', 'target', 'rel'],
    img: ['src', 'alt']
  };

  this.bind();
};

SanitizerPlugin.prototype.bind = function () {
  var self = this;

  this.editor.$content.on('paste', function (e) {
    e.preventDefault();

    var html = (e.originalEvent || e).clipboardData.getData('text/html');
    var text = (e.originalEvent || e).clipboardData.getData('text/plain');

    var content = html || text;

    var clean = self.clean(content);

    document.execCommand('insertHTML', false, clean);
  });
};

SanitizerPlugin.prototype.clean = function (html) {
  var div = document.createElement('div');
  div.innerHTML = html;

  this.walk(div);

  return this.normalize(div.innerHTML);
};

SanitizerPlugin.prototype.walk = function (node) {
  var children = node.children;

  for (var i = children.length - 1; i >= 0; i--) {
    var child = children[i];
    var tag = child.tagName.toLowerCase();

    if (this.allowedTags.indexOf(tag) === -1) {
      child.parentNode.removeChild(child);
      continue;
    }

    this.cleanAttributes(child, tag);
    this.walk(child);
  }
};

SanitizerPlugin.prototype.cleanAttributes = function (el, tag) {
  var allowedAttrs = this.allowedAttributes[tag] || [];
  var attrs = el.attributes;

  for (var i = attrs.length - 1; i >= 0; i--) {
    var name = attrs[i].name;
    var value = attrs[i].value;

    // remove eventos e styles
    if (name.indexOf('on') === 0 || name === 'style') {
      el.removeAttribute(name);
      continue;
    }

    // remove atributos não permitidos
    if (allowedAttrs.indexOf(name) === -1) {
      el.removeAttribute(name);
      continue;
    }

    // proteção básica de XSS em links
    if (tag === 'a' && name === 'href') {
      if (!this.isSafeUrl(value)) {
        el.removeAttribute('href');
      }
    }

    if (tag === 'img' && name === 'src') {
      if (!this.isSafeUrl(value)) {
        el.removeAttribute('src');
      }
    }
  }

  // segurança adicional para links
  if (tag === 'a') {
    el.setAttribute('rel', 'noopener noreferrer');
    el.setAttribute('target', '_blank');
  }
};

SanitizerPlugin.prototype.isSafeUrl = function (url) {
  return /^(https?:|\/)/i.test(url);
};

SanitizerPlugin.prototype.normalize = function (html) {
  return html
    .replace(/<div>/g, '<p>')
    .replace(/<\/div>/g, '</p>')
    .replace(/<br\s*\/?>/g, '');
};

window.SanitizerPlugin = SanitizerPlugin;