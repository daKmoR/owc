import { LitElement, html, css } from 'lit-element';
import { openWc } from './open-wc-logo';

class OwcApp extends LitElement {
  static get properties() {
    return {
      data: { type: Array },
    };
  }

  get searchElement() {
    return this.shadowRoot.querySelector('input');
  }

  constructor() {
    super();
    this.data = [];
  }

  static get styles() {
    return [
      css`
        :host {
          text-align: center;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: calc(10px + 2vmin);
          color: #1a2b42;
        }

        header {
          margin: auto;
        }

        svg {
          animation: app-logo-spin infinite 20s linear;
        }

        a {
          color: #217ff9;
        }

        .app-footer {
          color: #a8a8a8;
          font-size: calc(10px + 0.5vmin);
        }

        @keyframes app-logo-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <header class="app-header">
        ${openWc}
        <h1>owc</h1>
      </header>
      <main>
        <form>
          <input type="text" />
          <button @click=${this._search}>search</button>
        </form>
        <ul>
          ${this.data.map(result => html`
            <li>${result.package.name}</li>
          `)}
        </ul>
      </main>
      <p class="app-footer">
        🚽 Made with love by
        <a target="_blank" rel="noopener noreferrer" href="https://github.com/open-wc">open-wc</a>.
      </p>
    `;
  }

  _search(ev) {
    ev.preventDefault();
    this.search(this.searchElement.value);
  }

  async search(query) {
    const url = `/.netlify/functions/search?q=${query}`;
    const response = await fetch(url);
    const json = await response.json();
    console.log(json);
    this.data = [];
    this.data = json.results;
  }
}

customElements.define('owc-app', OwcApp);
