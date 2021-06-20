import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';
import { result } from 'lodash';
class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = `No bookmarks found yet.  Find a nice recipe and bookmark it.`;
  _message = '';
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup(_data) {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}
export default new BookmarksView();
