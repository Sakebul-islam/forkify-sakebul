import View from './view.js';
// import icons from '../img/icons.svg'; // in Parcel 1
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg'; // in Parcel 2

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _message = '';

  addHandlerRender(hendler) {
    window.addEventListener('load', hendler);
  }

  _generateMarkup() {
    // console.log(this._data);
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}
export default new BookmarksView();
