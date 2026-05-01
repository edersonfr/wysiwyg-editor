function PreviewPlugin(editor) {
  this.editor = editor;
  this.active = false;
}

PreviewPlugin.prototype.init = function () {
  this.build();
  this.bind();
};

PreviewPlugin.prototype.build = function () {
  this.$preview = $('<iframe class="editor-preview-frame"/>').hide();

  this.editor.$container.append(this.$preview);
};

PreviewPlugin.prototype.bind = function () {
  var self = this;

  this.editor.registerCommand('preview', function () {
    self.toggle();
  });
};

PreviewPlugin.prototype.toggle = function () {
  this.active ? this.disable() : this.enable();
};

PreviewPlugin.prototype.enable = function () {
  var html = this.editor.getContent();
  var doc = this.$preview[0].contentWindow.document;

  var cssLinks = this.buildCssLinks();

  doc.open();
  doc.write(
    '<!DOCTYPE html>' +
    '<html>' +
    '<head>' +
    cssLinks +
    '<style>body{padding:20px;font-family:Arial}</style>' +
    '</head>' +
    '<body>' +
    html +
    '</body>' +
    '</html>'
  );
  doc.close();

  this.editor.$content.hide();
  this.$preview.show();

  this.active = true;
};

PreviewPlugin.prototype.disable = function () {
  this.$preview.hide();
  this.editor.$content.show();

  this.active = false;
};

PreviewPlugin.prototype.buildCssLinks = function () {
  var css = this.editor.options.previewCss || [];
  var links = '';

  for (var i = 0; i < css.length; i++) {
    links += '<link rel="stylesheet" href="' + css[i] + '">';
  }

  return links;
};

window.PreviewPlugin = PreviewPlugin;