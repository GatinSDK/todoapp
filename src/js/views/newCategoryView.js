import { v4 as uuidv4 } from 'uuid';

class newCategoryView {
  _parentElement = document.querySelector('.newcategory__container');
  _categoryInputEl = document.querySelector('.newcategory__form__input');

  toggleWindow() {
    this._parentElement.classList.toggle('hidden');
  }

  cancelWindow(handler) {
    this._parentElement
      .querySelector('.newcategory__button-cancel')
      .addEventListener('click', function (e) {
        e.preventDefault();

        handler();
      });
  }

  addTaskCategory(handler) {
    this._parentElement
      .querySelector('.newcategory__button-done')
      .addEventListener('click', AddTaskButtonHandler);

    function AddTaskButtonHandler(e) {
      e.preventDefault();

      const inputValue = document.querySelector(
        '.newcategory__form__input'
      ).value;

      if (inputValue === '' || inputValue.length > 25) return;

      const color = Array.from(
        document.querySelectorAll('input[name="colors"]')
      ).filter((e) => e.checked === true)[0].id;

      const icon = Array.from(
        document.querySelectorAll('input[name="icon"]')
      ).filter((e) => e.checked === true)[0].id;

      const data = {
        categoryName: inputValue,
        categoryIcon: icon,
        categoryColor: color,
        categoryUUID: uuidv4(),
        categoryTasks: [],
      };

      handler(data);

      document
        .querySelector('.newcategory__button-done')
        .removeEventListener('click', AddTaskButtonHandler);
    }

    document
      .querySelector('.newcategory__button-cancel')
      .addEventListener('click', function () {
        document
          .querySelector('.newcategory__button-done')
          .removeEventListener('click', AddTaskButtonHandler);
      });
  }

  editTaskCategory(handler, data) {
    this._parentElement
      .querySelector('.newcategory__button-done')
      .addEventListener('click', AddTaskButtonHandler);

    const editUUID = document.querySelector('.task__category').dataset.uuid;

    const categoryIndex = data.findIndex(
      (element) => element.categoryUUID === editUUID
    );

    const inputValue = document.querySelector('.newcategory__form__input');

    inputValue.value = data[categoryIndex].categoryName;

    const color = document.querySelector(
      `#${data[categoryIndex].categoryColor}`
    );

    color.checked = true;

    const icon = document.querySelector(`#${data[categoryIndex].categoryIcon}`);

    icon.checked = true;

    function AddTaskButtonHandler(e) {
      e.preventDefault();

      if (inputValue.value === '' || inputValue.value.length > 25) return;

      const color = Array.from(
        document.querySelectorAll('input[name="colors"]')
      ).filter((e) => e.checked === true)[0].id;

      const icon = Array.from(
        document.querySelectorAll('input[name="icon"]')
      ).filter((e) => e.checked === true)[0].id;

      const data = {
        categoryName: inputValue.value,
        categoryIcon: icon,
        categoryColor: color,
      };

      handler(data, categoryIndex);

      document
        .querySelector('.newcategory__button-done')
        .removeEventListener('click', AddTaskButtonHandler);
    }

    document
      .querySelector('.newcategory__button-cancel')
      .addEventListener('click', function () {
        document
          .querySelector('.newcategory__button-done')
          .removeEventListener('click', AddTaskButtonHandler);
      });
  }

  clear() {
    this._categoryInputEl.value = '';
    document.querySelector('input[name="colors"]').checked = true;
    document.querySelector('input[name="icon"]').checked = true;
  }
}

export default new newCategoryView();
