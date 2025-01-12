import View from './View';
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateHTML() {
    const numberOfPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    //only 1 page
    if (numberOfPages === 1 && this._data.pageNumber === 1) return '';
    //more than 1 page and first page
    if (numberOfPages > 1 && this._data.pageNumber === 1) {
      return `<button data-goto='${
        this._data.pageNumber + 1
      }'class="btn--inline pagination__btn--next">
            <span>Page ${this._data.pageNumber + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
    }
    // more than 1 page and intermediate pages
    if (
      numberOfPages > 1 &&
      this._data.pageNumber > 1 &&
      this._data.pageNumber !== numberOfPages
    ) {
      return ` <button data-goto='${
        this._data.pageNumber - 1
      }' class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._data.pageNumber - 1}</span>
          </button>
          <button data-goto='${
            this._data.pageNumber + 1
          }' class="btn--inline pagination__btn--next">
            <span>Page ${this._data.pageNumber + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
      `;
    }
    //last page
    if (numberOfPages > 1 && this._data.pageNumber === numberOfPages)
      return `
    <button data-goto='${
      this._data.pageNumber - 1
    }' class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._data.pageNumber - 1}</span>
          </button>
    `;
  }

  addHandlerPagination(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      console.log(goToPage);
      handler(goToPage);
    });
  }
}
export default new PaginationView();
