function HistoryPlugin(editor) {
  this.editor = editor;
}

HistoryPlugin.prototype.init = function () {
  var editor = this.editor;

  editor.registerCommand('undo', function () {
    editor.history.undo();
  });

  editor.registerCommand('redo', function () {
    editor.history.redo();
  });
};

window.HistoryPlugin = HistoryPlugin;