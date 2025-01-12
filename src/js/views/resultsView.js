import View from './View';
import icons from '../../img/icons.svg';
import preView from './preView';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _message = 'No recipes found, Please try another one';
  _generateHTML() {
    return this._data.map(result => preView.render(result, false)).join('');
  }
}

export default new ResultsView();
