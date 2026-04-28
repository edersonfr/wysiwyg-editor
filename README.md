# WYSIWYG Editor (jQuery / Legacy)

Editor HTML WYSIWYG leve, desenvolvido com JavaScript (ES5) e jQuery.

## Funcionalidades

- Sem frameworks
- Baseado em ContentEditable
- Ações na barra de ferramentas
- Higienização de HTML
- Desfazer/Refazer
- Visualização de código

## Uso

```html
<script src="jquery.js"></script>
<script src="editor.js"></script>

<div id="editor"></div>

<script>
  $('#editor').wysiwygEditor();
</script>
```
## Status

Em desenvolvimento — com o objetivo de se tornar uma alternativa leve ao SunEditor.

---

### Exemplo `examples/basic.html`

Use exatamente isso:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Editor Example</title>

  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="../src/editor.js"></script>
</head>
<body>

  <h1>Editor Demo</h1>

  <div id="editor"></div>

  <script>
    $('#editor').wysiwygEditor();
  </script>

</body>
</html>
```