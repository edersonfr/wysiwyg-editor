function VideoPlugin(editor) {
  this.editor = editor;
}

VideoPlugin.prototype.init = function () {
  var self = this;
  this.editor.registerCommand('video', function () {
    self.insertVideo();
  });
};

VideoPlugin.prototype.insertVideo = function () {
  if (!this.editor.selection || !this.editor.selection.isInsideEditor()) return;

  var url = prompt('Cole o link do YouTube ou Vimeo:', 'https://');
  if (!url) return;

  var iframeUrl = url;
  
  // Tenta converter links normais em links de Embed embedados
  var ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch) iframeUrl = 'https://www.youtube.com/embed/' + ytMatch[1];

  var vimeoMatch = url.match(/vimeo\.com\/(\d+)/i);
  if (vimeoMatch) iframeUrl = 'https://player.vimeo.com/video/' + vimeoMatch[1];

  var html = '<iframe width="100%" height="315" src="' + iframeUrl + '" frameborder="0" allowfullscreen></iframe><p><br></p>';
  document.execCommand('insertHTML', false, html);
};

window.VideoPlugin = VideoPlugin;