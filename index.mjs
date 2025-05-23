import SvgText from '@ponomarevlad/svg-text';

export default class PseudoMask extends HTMLElement {
    static get styles() {
        return `<style>
                    *{box-sizing: content-box}
                    :host {
                        /* Mask properties */
                        --mask: none;
                        --mask-color: rgba(256, 256, 256, 0.2);
                        --mask-opacity: 1;
                        --mask-position: 0 0;
                        --mask-size: 100% 100%;
                        --mask-repeat: no-repeat;
                        
                        /* Block model inheritance flags */
                        --mask-padding-inherit: false;
                        --mask-margin-inherit: false;
                        --mask-border-inherit: false;
                        --mask-border-radius-inherit: false;
                        
                        /* Custom block model properties */
                        --mask-padding: 0;
                        --mask-margin: 0;
                        --mask-border: none;
                        --mask-border-radius: 0;
                        
                        outline: none;
                        display: inherit;
                        line-height: inherit;
                        color: rgba(256, 256, 256, 0);
                    }
                    .mask {
                        position: relative;
                        display: inherit;
                        line-height: inherit;
                        padding: var(--mask-padding);
                        margin: var(--mask-margin);
                        border: var(--mask-border);
                        border-radius: var(--mask-border-radius);
                    } 
                    .mask:before {
                        content: '';
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        position: absolute;
                        pointer-events: none;
                        -webkit-mask-image: var(--mask);
                        -webkit-mask-position: var(--mask-position);
                        -webkit-mask-size: var(--mask-size);
                        -webkit-mask-repeat: var(--mask-repeat);
                        backdrop-filter: var(--filter);
                        -webkit-backdrop-filter: var(--filter);
                        background-color: var(--mask-color);
                        opacity: var(--mask-opacity);
                        border-radius: inherit;
                    }
                </style>`
    }

    static encodeHTMLEntities(innerText) {
        return Object.assign(document.createElement('textarea'), {innerText}).innerHTML;
    }

    connectedCallback() {
        this.attachShadow({mode: "open", delegatesFocus: true}).innerHTML =
            `${this.constructor.styles}<span class="mask"><slot></slot></span>`;
        this.render();
    }

    getTextAlign(targetStyles) {
        const align = targetStyles.getPropertyValue('text-align')
        switch (align) {
            case 'start':
                return 'left'
            case 'end':
                return 'right'
            default:
                return align
        }
    }

    getXByAlign(align, width) {
        switch (align) {
            case 'right':
                return width;
            case 'center':
                return width / 2;
            default:
                return 0
        }
    }

    applyBlockModelStyles() {
        const targetStyles = window.getComputedStyle(this);
        const maskElement = this.shadowRoot.querySelector('.mask');
        
        // Block model styles to inherit
        const blockStyles = [
            'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
            'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
            'border', 'border-width', 'border-style', 'border-color',
            'border-radius', 'border-top-left-radius', 'border-top-right-radius', 
            'border-bottom-right-radius', 'border-bottom-left-radius'
        ];
        
        // Apply custom mask block styles if defined via CSS variables
        blockStyles.forEach(prop => {
            const customProp = `--mask-${prop}`;
            const inheritedValue = targetStyles.getPropertyValue(`--mask-${prop}-inherit`) === 'true';
            
            // Check for custom property first
            const customValue = targetStyles.getPropertyValue(customProp);
            if (customValue && customValue.trim() !== '') {
                maskElement.style.setProperty(customProp, customValue);
            }
            // Otherwise inherit from the element if specified
            else if (inheritedValue) {
                const value = targetStyles.getPropertyValue(prop);
                if (value && value.trim() !== '') {
                    maskElement.style.setProperty(customProp, value);
                }
            }
        });
    }
    
    /**
     * Set custom mask styles programmatically
     * @param {Object} styles - Object with style properties
     */
    setMaskStyles(styles = {}) {
        if (!this.shadowRoot) return;
        
        const maskElement = this.shadowRoot.querySelector('.mask');
        if (!maskElement) return;
        
        // Apply each style as a custom property
        for (const [key, value] of Object.entries(styles)) {
            // Convert camelCase to kebab-case for CSS custom properties
            const propName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            maskElement.style.setProperty(`--mask-${propName}`, value);
        }
        
        // Re-render to apply changes
        this.render();
    }
    
    /**
     * Get current mask styles
     * @returns {Object} Object with current mask style properties
     */
    getMaskStyles() {
        if (!this.shadowRoot) return {};
        
        const targetStyles = window.getComputedStyle(this);
        const styles = {};
        const properties = [
            'color', 'opacity', 'position', 'size', 'repeat',
            'padding', 'margin', 'border', 'border-radius'
        ];
        
        // Get all mask properties
        properties.forEach(prop => {
            const value = targetStyles.getPropertyValue(`--mask-${prop}`);
            if (value) {
                // Convert kebab-case to camelCase for JavaScript
                const propName = prop.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
                styles[propName] = value.trim();
            }
        });
        
        return styles;
    }

    render() {
        const text = this.constructor.encodeHTMLEntities(this.innerText),
            element = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
            styleElement = document.createElement("style"),
            targetStyles = window.getComputedStyle(this);

        element.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        element.append(styleElement);
        this.append(element);
        
        const height = this.clientHeight, 
              width = this.clientWidth + 1, 
              align = this.getTextAlign(targetStyles),
              options = {
                text, 
                align, 
                width, 
                height, 
                element, 
                styleElement, 
                x: this.getXByAlign(align, width), 
                style: {
                    fontSize: targetStyles.getPropertyValue('font-size'),
                    fontFamily: targetStyles.getPropertyValue('font-family'),
                    fontWeight: targetStyles.getPropertyValue('font-weight'),
                    lineHeight: targetStyles.getPropertyValue('line-height'),
                    letterSpacing: targetStyles.getPropertyValue('letter-spacing'),
                    textTransform: targetStyles.getPropertyValue('text-transform'),
                    fontStyle: targetStyles.getPropertyValue('font-style'),
                    textDecoration: targetStyles.getPropertyValue('text-decoration'),
                    fontVariant: targetStyles.getPropertyValue('font-variant')
                }
            }
            
        // Apply block model styles
        this.applyBlockModelStyles();
            
        // Apply custom mask styles from CSS variables if defined
        const maskRoot = this.shadowRoot.querySelector('.mask');
        
        // Get CSS custom properties if they exist
        const customProperties = [
            'mask-color', 'mask-opacity', 'mask-position', 
            'mask-size', 'mask-repeat'
        ];
        
        // Apply custom properties
        customProperties.forEach(prop => {
            const value = targetStyles.getPropertyValue(`--${prop}`);
            if (value) maskRoot.style.setProperty(`--${prop}`, value);
        });
            
        this.svgText = new SvgText(options);
        this.removeChild(element);
        maskRoot.style.setProperty('--mask',
            `url("data:image/svg+xml;utf-8,${encodeURIComponent(element.outerHTML)}")`);
    }
}

customElements.define('pseudo-mask', PseudoMask)
