# &#60; pseudo-mask /&#62;

A tiny custom element that generates SVG masks from text content ✨

[Live demo](https://pseudo-mask.ponomarevlad.ru)

![Снимок экрана 2022-04-12 в 17 09 16](https://user-images.githubusercontent.com/2877584/162960697-f3bacd3e-de4a-47f6-9b69-c82a2184bc4d.png)

The component automatically reacts to:
- Content changes via MutationObserver
- Size changes via ResizeObserver

### Load module

```html
<script src="https://cdn.skypack.dev/pseudo-mask" type="module" async></script>

<!-- or use module with native package imports -->

<script type="importmap">{"imports": {"@ponomarevlad/svg-text": "https://cdn.skypack.dev/@ponomarevlad/svg-text"}}</script>
<script src="https://unpkg.com/es-module-shims/dist/es-module-shims.js" async noshim></script>
<script src="https://cdn.jsdelivr.net/npm/pseudo-mask" type="module"></script>
```

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

### Styling Demo

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

```html
<style>
    body {
        display: flex;
        align-items: center;
        background-size: cover;
        justify-content: center;
        background-image: url("https://picsum.photos/1024");
    }

    h1 {
        font-size: 120px;
        line-height: 1.3em;
        font-family: Helvetica, sans-serif;
        --filter: blur(15px) saturate(2) brightness(.8);
    }
</style>
<h1>
    <pseudo-mask>Glassy</pseudo-mask>
</h1>
```
