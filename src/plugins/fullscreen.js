function FullscreenPlugin(editor) {
  this.editor = editor;
  this.active = false;
}

FullscreenPlugin.prototype.init = function () {
  var self = this;
  this.editor.registerCommand('fullscreen', function () {
    self.toggle();
  });
};

FullscreenPlugin.prototype.toggle = function () {
  this.active = !this.active;
  this.editor.$container.toggleClass('editor-fullscreen', this.active);

  var $btn = this.editor.$toolbar.find('[data-name="fullscreen"]');
  if (this.active) {
    $btn.addClass('active');
  } else {
    $btn.removeClass('active');
  }
};

window.FullscreenPlugin = FullscreenPlugin;