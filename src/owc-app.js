import { LitElement, html } from 'lit-element';
import owcAppStyle from './owc-app.css.js';
import openWcLogo from './icons/open-wc-logo.js';
import fireIcon from './icons/fire.js';

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
                <svg
                  role="img"
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                  ></path>
                </svg>
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
                <svg
                  role="img"
                  width="32px"
                  height="26px"
                  viewBox="0 0 24 19"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331z"
                  ></path>
                  <path d="M10.665 10H12v2.667h-1.335V10z"></path>
                </svg>
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
