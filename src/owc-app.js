import { LitElement, html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

import owcAppStyle from './owc-app.css.js';
import openWcLogo from './icons/open-wc-logo.js';
import githubIcon from './icons/github.js';
import npmIcon from './icons/npm.js';
import { wcTypes } from './values.js';

const renderType = (type = '') => {
  const wcType = wcTypes.find(el => el.key === type);
  return html`
    <a class="link link--type" href=${wcType.url} title=${wcType.label}>
      ${unsafeHTML(wcType.icon)}
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

  get typeElement() {
    return this.shadowRoot.querySelector('select');
  }

  constructor() {
    super();
    this.data = [];
    this.query = '';
  }

  static get styles() {
    return owcAppStyle;
  }

  render() {
    let list =
      this.query === ''
        ? html``
        : html`
            We could not find any web component for "${this.query}" and type "${this.wcType}".
            <br />
            If you want to add an component to this type see
            <a href="https://github.com/daKmoR/owc" target="_blank">help</a>.
          `;
    if (this.data.length > 0) {
      list = this.data.map(
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
                  ${unsafeHTML(githubIcon)}
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
                  ${unsafeHTML(npmIcon)}
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
    }

    const typeOptions = wcTypes.map(
      type =>
        html`
          <option value=${type.key}>${type.label}</option>
        `,
    );

    return html`
      <header class="app-header">
        ${unsafeHTML(openWcLogo)}
        <h1>Custom Element Catalog</h1>
      </header>
      <main>
        <form>
          <input type="text" value="button" />
          <button @click=${this._search}>search</button>
          <select name="type">
            ${typeOptions}
          </select>
          <a href="https://github.com/daKmoR/owc" target="_blank">help</a>
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
    this.search(this.searchElement.value, this.typeElement.value);
  }

  async search(query, type) {
    this.query = query;
    this.wcType = type;
    const url = `/.netlify/functions/search?q=${query}&type=${type}`;
    const response = await fetch(url);
    const json = await response.json();
    this.data = Array.from(json.results);
  }
}

customElements.define('owc-app', OwcApp);
