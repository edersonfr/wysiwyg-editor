window.BasicCommandsPlugin = BasicCommandsPlugin;

function BasicCommandsPlugin(editor) {
  this.editor = editor;
}

BasicCommandsPlugin.prototype.init = function () {
  var editor = this.editor;

  editor.registerCommand('bold', function (editor) {
    if (!editor.selection) return;
    if (!editor.selection.isInsideEditor()) return;

    editor.selection.toggle('b');
  });

  editor.registerCommand('italic', function (editor) {
    if (!editor.selection) return;
    if (!editor.selection.isInsideEditor()) return;

    editor.selection.toggle('i');
  });

  // Novos comandos de formatação básica usando a API nativa
  editor.registerCommand('underline', function (editor) {
    if (!editor.selection || !editor.selection.isInsideEditor()) return;
    document.execCommand('underline', false, null);
  });

  editor.registerCommand('strikethrough', function (editor) {
    if (!editor.selection || !editor.selection.isInsideEditor()) return;
    document.execCommand('strikeThrough', false, null);
  });

  editor.registerCommand('ul', function (editor) {
    if (!editor.selection || !editor.selection.isInsideEditor()) return;
    document.execCommand('insertUnorderedList', false, null);
  });

  editor.registerCommand('ol', function (editor) {
    if (!editor.selection || !editor.selection.isInsideEditor()) return;
    document.execCommand('insertOrderedList', false, null);
  });

  editor.registerCommand('alignLeft', function (editor) {
    if (!editor.selection || !editor.selection.isInsideEditor()) return;
    document.execCommand('justifyLeft', false, null);
  });

  editor.registerCommand('alignCenter', function (editor) {
    if (!editor.selection || !editor.selection.isInsideEditor()) return;
    document.execCommand('justifyCenter', false, null);
  });

  editor.registerCommand('alignRight', function (editor) {
    if (!editor.selection || !editor.selection.isInsideEditor()) return;
    document.execCommand('justifyRight', false, null);
  });

  editor.registerCommand('justifyFull', function (editor) {
    if (!editor.selection || !editor.selection.isInsideEditor()) return;
    document.execCommand('justifyFull', false, null);
  });

  editor.registerCommand('indent', function (editor) {
    if (!editor.selection || !editor.selection.isInsideEditor()) return;
    document.execCommand('indent', false, null);
  });

  editor.registerCommand('outdent', function (editor) {
    if (!editor.selection || !editor.selection.isInsideEditor()) return;
    document.execCommand('outdent', false, null);
  });

  editor.registerCommand('removeFormat', function (editor) {
    if (!editor.selection || !editor.selection.isInsideEditor()) return;
    document.execCommand('removeFormat', false, null);
  });

  editor.registerCommand('formatBlock', function (editor, value) {
    if (!editor.selection || !editor.selection.isInsideEditor()) return;
    document.execCommand('formatBlock', false, value);
  });

  editor.registerCommand('foreColor', function (editor, value) {
    if (!editor.selection || !editor.selection.isInsideEditor()) return;
    document.execCommand('foreColor', false, value);
  });

  editor.registerCommand('backColor', function (editor, value) {
    if (!editor.selection || !editor.selection.isInsideEditor()) return;
    document.execCommand('backColor', false, value); // backColor preenche o destaque/fundo
  });

  editor.registerCommand('fontName', function (editor, value) {
    if (!editor.selection || !editor.selection.isInsideEditor()) return;
    document.execCommand('fontName', false, value);
  });

  // Tamanho nativo (1 a 7). No polimento, mudaremos para 8px-72px.
  editor.registerCommand('fontSize', function (editor, value) {
    if (!editor.selection || !editor.selection.isInsideEditor()) return;
    document.execCommand('fontSize', false, value);
  });

  editor.registerCommand('showBlocks', function (editor) {
    editor.$content.toggleClass('editor-show-blocks');
  });
};