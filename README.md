# Pseudo-mask

### Load module

```html

<script src="https://cdn.skypack.dev/pseudo-mask" type="module" async></script>

<!-- or use module with native package imports -->

<script type="importmap">{"imports": {"@ponomarevlad/svg-text": "https://cdn.skypack.dev/@ponomarevlad/svg-text"}}
</script>
<script src="https://unpkg.com/es-module-shims/dist/es-module-shims.js" async noshim></script>
<script src="https://cdn.jsdelivr.net/npm/pseudo-mask" type="module"></script>
```

<!--
```
<custom-element-demo>
  <template>
    <script src="https://cdn.skypack.dev/pseudo-mask" type="module" async></script>
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->

### Place text in element

```html

<pseudo-mask>Place your text here</pseudo-mask>
```

### Or wrap inside

```html

<h1>
    <pseudo-mask>Header</pseudo-mask>
</h1>
```
