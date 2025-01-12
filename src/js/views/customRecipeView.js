import View from './View';
import icons from '../../img/icons.svg';

class CustomRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _successMessage = 'Successfully uploaded recipe';
  _recipeWindow = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  // _btnUpload = document.querySelector('.upload__btn');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._recipeWindow.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  uploadFormDataHandler(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const formData = [...new FormData(this)];
      handler(Object.fromEntries(formData));
    });
  }
  _generateHTML() {}
}
export default new CustomRecipeView();
