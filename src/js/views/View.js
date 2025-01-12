import icons from '../../img/icons.svg';

export default class View {
  _data;

  /**
   * Render the received object to DOM
   * @param {Object|Object[]} data The data to be rendered
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup String is returned ot render is false
   * @this {Object} View instance
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError(this._message);
    this._data = data;
    console.log(this._data);
    const markup = this._generateHTML();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderSpinner() {
    const markup = `<div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderError(message = this._message) {
    const markup = `<div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderSuccess(message = this._successMessage) {
    const markup = `<div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }
  update(data) {
    this._data = data;
    //console.log(this._data);
    const newMarkup = this._generateHTML();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = newDOM.querySelectorAll('*');
    const currentDOMElements = Array.from(
      this._parentElement.querySelectorAll('*')
    );
    Array.from(newElements).forEach((newEle, i) => {
      const currentElement = currentDOMElements[i];
      console.log(currentElement, newEle.isEqualNode(currentElement));
      //console.log(newEle.textContent, 'textContent before nodevalue');
      //updates changed text
      if (
        !newEle.isEqualNode(currentElement) &&
        newEle.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log(newEle.firstChild.nodeValue);
        console.log(newEle.textContent, 'new element text content');
        currentElement.textContent = newEle.textContent;
      }
      // updates changed attributes
      if (!newEle.isEqualNode(currentElement)) {
        console.log(newEle.attributes);
        Array.from(newEle.attributes).forEach(attr => {
          currentElement.setAttribute(attr.name, attr.value);
        });
      }
    });
  }
}
