# &#60; pseudo-mask /&#62;

A tiny custom element that generates SVG masks from text content ✨

[Live demo](https://pseudo-mask.ponomarevlad.ru)

![Снимок экрана 2022-04-12 в 17 09 16](https://user-images.githubusercontent.com/2877584/162960697-f3bacd3e-de4a-47f6-9b69-c82a2184bc4d.png)

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

### Customization API

The mask can be customized using CSS variables or JavaScript:

#### CSS Custom Properties

Text and mask appearance:

```css
pseudo-mask {
    /* Filter effect (blur, saturation, etc.) */
    --filter: blur(15px) saturate(2);
    
    /* Mask color and opacity */
    --mask-color: rgba(255, 255, 255, 0.3);
    --mask-opacity: 0.8;
    
    /* Mask positioning and sizing */
    --mask-position: center;
    --mask-size: cover;
    --mask-repeat: no-repeat;
}
```

Block model styles:

```css
pseudo-mask {
    /* Custom padding for the mask */
    --mask-padding: 10px;
    
    /* Custom margin for the mask */
    --mask-margin: 5px;
    
    /* Custom border for the mask */
    --mask-border: 1px solid rgba(255, 255, 255, 0.3);
    
    /* Custom border radius */
    --mask-border-radius: 8px;
}
```

#### Inheritance Control

Enable inheritance of styles from parent element:

```css
pseudo-mask {
    /* Enable inheritance of padding from parent */
    --mask-padding-inherit: true;
    
    /* Enable inheritance of margin from parent */
    --mask-margin-inherit: true;
    
    /* Enable inheritance of border from parent */
    --mask-border-inherit: true;
    
    /* Enable inheritance of border-radius from parent */
    --mask-border-radius-inherit: true;
}
```

#### JavaScript API

Set mask styles programmatically:

```javascript
// Get reference to the element
const mask = document.querySelector('pseudo-mask');

// Set custom styles
mask.setMaskStyles({
    color: 'rgba(255, 255, 255, 0.5)',
    opacity: 0.9,
    padding: '10px',
    borderRadius: '5px'
});

// Get current styles
const styles = mask.getMaskStyles();
console.log(styles);
```
