import { registerDependencies } from 'mjml-validator'
import { BodyComponent } from 'mjml-core'

registerDependencies({
    // Tell the validator which tags are allowed as our component's parent
    'mj-hero': ['mj-bullet-proof-button'],
    'mj-column': ['mj-bullet-proof-button'],
    // Tell the validator which tags are allowed as our component's children
    'mj-bullet-proof-button': []
})

export default class mjBulletProofButton extends BodyComponent {
    static endingTag = true

    static allowedAttributes = {
        align: 'enum(left,center,right)',
        'background-color': 'color',
        'border-bottom': 'string',
        'border-left': 'string',
        'border-radius': 'string',
        'border-right': 'string',
        'border-top': 'string',
        border: 'string',
        color: 'color',
        'container-background-color': 'color',
        'font-family': 'string',
        'font-size': 'unit(px,%)',
        'font-style': 'string',
        'font-weight': 'string',
        height: 'unit(px,%)',
        href: 'string',
        'inner-padding': 'unit(px,%)',
        'line-height': 'unit(px,%)',
        'padding-bottom': 'unit(px,%)',
        'padding-left': 'unit(px,%)',
        'padding-right': 'unit(px,%)',
        'padding-top': 'unit(px,%)',
        padding: 'unit(px,%){1,4}',
        rel: 'string',
        target: 'string',
        'text-decoration': 'string',
        'text-transform': 'string',
        'vertical-align': 'string',
        width: 'unit(px,%)',
    }

    static defaultAttributes = {
        align: 'center',
        'background-color': '#414141',
        border: 'none',
        'border-radius': '3px',
        color: '#ffffff',
        "border-radius": "3px",
        "border-right": null,
        "border-left": null,
        "border-top": null,
        'font-family': 'Ubuntu, Helvetica, Arial, sans-serif',
        'font-size': '13px',
        'font-weight': 'normal',
        "inner-padding": "10px 25px",
        'line-height': '120%',
        padding: '10px 25px',
        target: '_blank',
        'text-decoration': 'none',
        'text-transform': 'none',
        'vertical-align': 'middle',
    }

    getStyles() {
        return {
            table: {
                'border-collapse': 'separate',
                width: this.getAttribute('width'),
                'line-height': '100%',
            },
            td: {
                border: this.getAttribute('border'),
                'border-bottom': 'transparent',
                'border-left': 'transparent',
                'border-radius': this.getAttribute('border-radius'),
                'border-right': 'transparent',
                'border-top': 'transparent',
                cursor: 'auto',
                'font-style': this.getAttribute('font-style'),
                height: this.getAttribute('height'),
            },
            content: {
                background: this.getAttribute('background-color'),
                color: this.getAttribute('color'),
                'font-family': this.getAttribute('font-family'),
                'font-size': this.getAttribute('font-size'),
                'font-style': this.getAttribute('font-style'),
                'font-weight': this.getAttribute('font-weight'),
                'line-height': this.getAttribute('line-height'),
                Margin: '0',
                'text-decoration': this.getAttribute('text-decoration'),
                'text-transform': this.getAttribute('text-transform'),
                border: this.getAttribute('border'),
                borderColor: "transparent",
                display: "block",
                padding: this.getAttribute('inner-padding'),
            },
        }
    }

    render() {
        const tag = this.getAttribute('href') ? 'a' : 'p'

        return `
      <table
        ${this.htmlAttributes({
                align: this.getAttribute('align'),
                border: '0',
                cellpadding: '0',
                cellspacing: '0',
                role: 'presentation',
                style: 'table',
            })}
      >
        <tr>
          <td
            ${this.htmlAttributes({
                align: 'center',
                bgcolor:
                    this.getAttribute('background-color') === 'none'
                        ? undefined
                        : this.getAttribute('background-color'),
                role: 'presentation',
                style: 'td',
                valign: this.getAttribute('vertical-align'),
            })}
          >
            <${tag}
              ${this.htmlAttributes({
                href: this.getAttribute('href'),
                rel: this.getAttribute('rel'),
                style: 'content',
                target: tag === 'a' ? this.getAttribute('target') : undefined,
            })}
            >
              ${this.getContent()}
            </${tag}>
          </td>
        </tr>
      </table>
    `
    }
}
