import SvgText from '@ponomarevlad/svg-text';

export default class PseudoMask extends HTMLElement {
    static get styles() {
        return `<style>
                    *{box-sizing: content-box}
                    :host {--mask: none;outline: none;display: inherit;line-height: inherit;color: rgba(256, 256, 256, 0);}
                    .mask {position: relative;display: inherit;line-height: inherit;} 
                    .mask:before {
                    content: '';top: 0;left: 0;right: 0;bottom: 0;
                    position: absolute;pointer-events: none;-webkit-mask-image: var(--mask);
                    -webkit-mask-repeat: no-repeat;backdrop-filter: var(--filter);
                    -webkit-backdrop-filter: var(--filter);background-color: rgba(256, 256, 256, 0.2);}
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

    render() {
        const text = this.constructor.encodeHTMLEntities(this.innerText),
            element = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
            styleElement = document.createElement("style"),
            targetStyles = window.getComputedStyle(this);

        element.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        element.append(styleElement);
        this.append(element);
        const options = {
            text,
            element,
            styleElement,
            width: this.clientWidth + 1,
            height: this.clientHeight,
            style: {
                fontSize: targetStyles.getPropertyValue('font-size'),
                fontFamily: targetStyles.getPropertyValue('font-family'),
                fontWeight: targetStyles.getPropertyValue('font-weight'),
                lineHeight: targetStyles.getPropertyValue('line-height')
            }
        }
        this.svgText = new SvgText(options);
        this.removeChild(element);
        this.shadowRoot.querySelector('.mask').style.setProperty('--mask',
            `url("data:image/svg+xml;utf-8,${encodeURIComponent(element.outerHTML)}")`);
    }
}

customElements.define('pseudo-mask', PseudoMask)
