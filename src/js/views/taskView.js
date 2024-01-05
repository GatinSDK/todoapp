import icons from '../../img/icons.svg';
import { v4 as uuidv4 } from 'uuid';

class TaskView {
  _categoryInfoEl = document.querySelector('.task__category');
  _TasksEl = document.querySelector('.tasks__container');

  render(data, render = true) {
    this._data = data;

    const homeMarkup = this._generateTasksMarkup(data);

    const TasksMarkup =
      data.length > 1
        ? data
            .slice(1, data.length)
            .map((data) => this._generateTasksMarkupAll(data))
            .join('')
        : '';

    const categoryInfoMarkup = this._generateCategoryInfoMarkup(data);

    if (!render) return markup;

    this._clear();

    this._TasksEl.insertAdjacentHTML('beforeend', homeMarkup);

    this._TasksEl.insertAdjacentHTML('beforeend', TasksMarkup);

    this._categoryInfoEl.insertAdjacentHTML('beforeend', categoryInfoMarkup);
  }

  addTaskHandler(handler) {
    document
      .querySelector('.addtask__form')
      .addEventListener('submit', function (e) {
        e.preventDefault();
        console.log('submit');

        const inputValue = document.querySelector('.addtaskinput');

        if (inputValue.value === '' || inputValue.value.length > 50) return;

        const data = {
          uuid: uuidv4(),
          status: 'unchecked',
          name: inputValue.value,
        };

        inputValue.value = '';

        handler(data);
      });
  }

  deleteCategoryHandler(handler) {
    document
      .querySelector('.task__category-option__delete-category')
      .addEventListener('click', function (e) {
        const data = e.target.closest('.task__category').dataset.uuid;
        if (data === 'home') return;
        handler(data);
      });
  }

  editCategoryHandler(handler) {
    document
      .querySelector('.task__category-option__edit-category')
      .addEventListener('click', function (e) {
        const data = e.target.closest('.task__category').dataset.uuid;
        if (data === 'home') return;
        handler(data);
      });
  }

  taskCheckHandler(handler) {
    document.querySelectorAll('.task__info-check').forEach((task) => {
      task.addEventListener('click', function (e) {
        const data = e.target.closest('.task').dataset.taskUuid;
        handler(data);
      });
    });
  }

  taskDeleteHandler(handler) {
    document
      .querySelectorAll('.task__category-option__delete-task')
      .forEach((task) => {
        task.addEventListener('click', function (e) {
          const data = e.target.closest('.task').dataset.taskUuid;
          handler(data);
        });
      });
  }

  _addMenuOpenEvent() {
    document.querySelector('.menu-open').addEventListener('click', function () {
      document.querySelector('.menu').classList.add('menu-opened');
    });
  }

  _clear() {
    this._categoryInfoEl.innerHTML = `
    <svg class="w-6 h-6 menu-open">
    <use href="${icons}#menu"></use>
  </svg>
    `;

    this._TasksEl.innerHTML = '';
    this._addMenuOpenEvent();
  }

  _generateCategoryInfoMarkup(data) {
    document.querySelector('.tasks').style.background = `
    linear-gradient(152.25deg, var(--gradient-${data[0].categoryColor}) 0.83%, rgba(32, 33, 39, 0) 66.94%), #202127
    `;

    document.querySelector('.task__category').dataset.uuid =
      data[0].categoryUUID;

    return `
    <div class="task__category-info">
            <svg class="${data[0].categoryColor}">
              <use href="${icons}#${data[0].categoryIcon}"></use>
            </svg>
            <h1>${data[0].categoryName}</h1>
          </div>
          <button class="task__category-options-icon">
            <svg>
              <use href="${icons}#options"></use>
            </svg>
            <div class="task__category-options">
              <div
                class="task__category-option task__category-option__edit-category"
              >
                <svg>
                  <use href="${icons}#edit"></use>
                </svg>
                <span>Edit category</span>
              </div>

              <div
                class="task__category-option task__category-option__delete-category"
              >
                <svg>
                  <use href="${icons}#delete"></use>
                </svg>

                <span>Delete category</span>
              </div>
            </div>
          </button>
    `;
  }

  _generateTasksMarkup(data) {
    if (data[0].categoryTasks.length === 0) return '';

    const markup = data[0].categoryTasks
      .map((e) => {
        return `
      <div class="task ${
        e.status === 'checked' ? 'task-completed' : ''
      }" data-task-uuid="${e.uuid}">
                  <div class="task__info">
                    <div class="task__info-check task-${data[0].categoryColor}">
                      <svg class="w-6 h-6 ${
                        e.status === 'checked' ? '' : 'hidden'
                      }">
                        <use href="${icons}#task-check"></use>
                      </svg>
                    </div>
    
                    <p>${e.name}</p>
                  </div>
    
                  <button class="task__category-options-icon">
                    <svg>
                      <use href="${icons}#options"></use>
                    </svg>
                    <div class="task__category-options task-options">
    
                      <div
                        class="task__category-option task__category-option__delete-task"
                      >
                        <svg>
                          <use href="${icons}#delete"></use>
                        </svg>
    
                        <span>Delete task</span>
                      </div>
                    </div>
                  </button>
                </div>
      `;
      })
      .join('');

    return markup;
  }

  _generateTasksMarkupAll(data) {
    if (data.categoryTasks.length === 0) return;
    return `

    <div class="task__category-name">
              <svg class="${data.categoryColor}">
                <use href="${icons}#${data.categoryIcon}"></use>
              </svg>
              <h3>${data.categoryName}</h3>
            </div>

    ${data.categoryTasks
      .map(
        (task) => `
      <div class="task ${
        task.status === 'checked' ? 'task-completed' : ''
      }" data-task-uuid="${task.uuid}">
      <div class="task__info">
        <div class="task__info-check task-${data.categoryColor}">
          <svg class="w-6 h-6 ${task.status === 'checked' ? '' : 'hidden'}">
            <use href="${icons}#task-check"></use>
          </svg>
        </div>

        <p>${task.name}</p>
      </div>

      <button class="task__category-options-icon">
        <svg>
          <use href="${icons}#options"></use>
        </svg>
        <div class="task__category-options task-options">

          <div
            class="task__category-option task__category-option__delete-task"
          >
            <svg>
              <use href="${icons}#delete"></use>
            </svg>

            <span>Delete task</span>
          </div>
        </div>
      </button>
    </div>
    `
      )
      .join('')}
    `;
  }
}

export default new TaskView();
