import icons from '../../img/icons.svg';

class MenuView {
  _parentElement = document.querySelector('.categories');
  _data;

  render(data, render = true) {
    this._data = data;
    const markup = data
      .slice(1, data.length)
      .map((data) => this._generateMarkup(data))
      .join('');
    const addMarkup = this._generateAddMarkup();
    const homeMarkup = this._generateHomeMarkup(data);

    if (!render) return markup;

    this._clear();

    this._parentElement.insertAdjacentHTML('beforeend', homeMarkup);
    this._parentElement.insertAdjacentHTML('beforeend', markup);
    this._parentElement.insertAdjacentHTML('beforeend', addMarkup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  changeCategoryActive(handler) {
    document
      .querySelector('.categories')
      .addEventListener('click', function (e) {
        if (!e.target.closest('.category')) return;
        document
          .querySelectorAll('.category')
          .forEach((e) => e.classList.remove('active'));

        e.target.closest('.category').classList.add('active');

        handler(e.target.closest('.category').dataset.uuid);
      });
  }

  addHandlerRender(handler) {
    this._parentElement
      .querySelector('.newcategory')
      .addEventListener('click', handler);
  }

  _generateMarkup(data) {
    const taskleft = data.categoryTasks.filter(
      (task) => task.status === 'unchecked'
    ).length;

    const check = `<svg>
    <use href="${icons}#task-check"></use>
    </svg>
    `;

    const taskleftMarkup = `
    <div class="category__tasks-left">
    <span>${taskleft > 0 ? taskleft : check}</span>
    </div>
    `;

    return `
    <div class="category ${data.categoryColor} ${
      taskleft > 0 ? '' : 'category-completed'
    }" data-uuid="${data.categoryUUID}">
              <div class="category__info">
                <svg class="${data.categoryColor}">
                <use href="${icons}#${data.categoryIcon}"></use>
                </svg>
                <h2>${data.categoryName}</h2>
              </div>
                <span>${taskleft > 0 ? taskleftMarkup : check}</span>      
            </div>
    `;
  }

  _generateAddMarkup() {
    return `
    <div class="newcategory">
              <div class="category__info">
                <svg>
                <use href="${icons}#plus"></use>
                </svg>

                <h2>Add new category</h2>
              </div>
            </div>
    `;
  }

  _generateHomeMarkup(data) {
    const totalTaskLeft = data
      .map((e) => e.categoryTasks)
      .flat()
      .filter((e) => e.status === 'unchecked').length;

    return `<div class='category white active' data-uuid="${data[0].categoryUUID}">
      <div class='category__info'>
        <svg>
          <use href='${icons}#home'></use>
        </svg>
        <h2>Home</h2>
      </div>

      <div class='category__tasks-left'>
        <span>${totalTaskLeft}</span>
      </div>
    </div>`;
  }
}

export default new MenuView();
