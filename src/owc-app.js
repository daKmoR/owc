import { LitElement, html, css } from 'lit-element';

class OwcApp extends LitElement {
  static get styles() {
    return css`
      h1, form {
        text-align: center;
      }
    `;
  }

  static get properties() {
    return {
      data: {
        type: Array,
      }
    };
  }

  get searchElement() {
    return this.shadowRoot.querySelector('input');
  }

  constructor() {
    super();
    this.data = [];
  }

  _search(ev) {
    ev.preventDefault();
    this.search(this.searchElement.value);
  }

  async search(query) {
    const url = `/.netlify/functions/search?q=${query}`;
    const response = await fetch(url);
    let json = await response.json();
    console.log(json);
    this.data = [];
    this.data = json.results;
  }

  render() {
    return html`
      <h1>OWC</h1>
      <form>
        <input type="text" />
        <button @click=${this._search}>search</button>
      </form>
      <ul>
        ${this.data.map(result => html`
          <li>${result.package.name}</li>
        `)}
      </ul>
    `;
  }
}

customElements.define('owc-app', OwcApp);
