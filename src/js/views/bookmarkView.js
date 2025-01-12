import View from './View';
import preView from './preView';
import icons from '../../img/icons.svg';

class BookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _message = 'No Bookmarks yet, please add your favourite recipes to bookmark';
  _generateHTML() {
    return this._data.map(bookmark => preView.render(bookmark, false)).join('');
  }
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
}

export default new BookmarkView();
