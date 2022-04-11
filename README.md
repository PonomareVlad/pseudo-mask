# Pseudo-mask

[Live demo](https://pseudo-mask.ponomarevlad.ru)

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
    div {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        background-size: cover;
        justify-content: center;
        background-image: url("https://picsum.photos/1024");
    }

    h1 {
        font-size: 100px;
        font-family: Helvetica, sans-serif;
        --filter: blur(5px) saturate(2) brightness(1);
    }
</style>
<div>
    <h1>
        <pseudo-mask>Header</pseudo-mask>
    </h1>
</div>
```
