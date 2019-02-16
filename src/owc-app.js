import { LitElement, html } from 'lit-element';
import owcAppStyle from './owc-app.css.js';
import openWcLogo from './icons/open-wc-logo.js';
import fireIcon from './icons/fire.js';
import githubIcon from './icons/github.js';
import npmIcon from './icons/npm.js';

const renderType = (type = 'owc') => {
  let icon = '';
  let query = `./q=keywords:${type}`;
  switch (type) {
    case 'lit-element-2.x':
      icon = fireIcon;
      break;
    default:
      query = './';
      icon = openWcLogo;
  }
  return html`
    <a class="link link--type" href=${query}>
      ${icon}
    </a>
  `;
};

const renderTags = (tags = []) => {
  if (tags.length === 0) {
    return html`
      <span>no tags</span>
    `;
  }
  return tags.map(
    tag => html`
      <a class="link link--tag" href=${`./q=keywords:${tag}`}>
        ${tag}
      </a>
    `,
  );
};

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
    return owcAppStyle;
  }

  render() {
    const list = this.data.map(
      result => html`
        <div class="package">
          <div class="package__title">
            <a class="title__name" href=${result.package.links.npm} target="_blank">
              ${result.package.name}
            </a>
            <div class="package__links">
              <a
                class="links__link"
                title="View on GitHub"
                href=${result.package.links.repository}
                target="_blank"
              >
                ${githubIcon}
              </a>
              <a
                class="links__link"
                title="View on UNPKG"
                href=${`https://www.unpkg.com/${result.package.name}/`}
                target="_blank"
              >
                U
              </a>
              <a
                class="links__link"
                title="View on npm"
                href=${result.package.links.npm}
                target="_blank"
              >
                ${npmIcon}
              </a>
            </div>
          </div>
          <div class="package__content">
            ${result.package.description}
          </div>
          <div class="package__footer">
            <div class="package__type">
              <span>Type:</span>
              ${renderType(result.owcType)}
            </div>
            <div class="package__tags">
              <span>Tags:</span>
              ${renderTags(result.package.keywords)}
            </div>
          </div>
        </div>
      `,
    );

    return html`
      <header class="app-header">
        ${openWcLogo}
        <h1>Custom Element Catalog</h1>
      </header>
      <main>
        <form>
          <input type="text" value="::mocks" />
          <button @click=${this._search}>search</button>
        </form>
        <div>
          ${list}
        </div>
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
    this.data = Array.from(json.results);
  }
}

customElements.define('owc-app', OwcApp);
