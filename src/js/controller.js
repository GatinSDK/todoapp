import menuView from './views/menuView';
import taskView from './views/taskView';
import newCategoryView from './views/newCategoryView';

var state = JSON.parse(localStorage.getItem('state'));

if (!state) {
  state = [
    {
      categoryName: 'Home',
      categoryIcon: 'home',
      categoryColor: 'white',
      categoryUUID: 'home',
      categoryTasks: [],
    },
  ];

  statePersistent(state);
}

function statePersistent(state) {
  state = localStorage.setItem('state', JSON.stringify(state));
}

function addNewCategory(data) {
  const active = document.querySelector('.active').dataset.uuid;

  state.push(data);
  menuView.render(state);
  menuView.addHandlerRender(addNewCategoryOpen);
  addCategoryCloseHandler();

  document.querySelector('.active').classList.remove('active');
  document.querySelector(`[data-uuid="${active}"]`).classList.add('active');

  closeNewCategory();
  statePersistent(state);
}

function addNewCategoryOpen() {
  newCategoryView.toggleWindow();
  newCategoryView.addTaskCategory(addNewCategory);
}

function addEditCategory(data, categoryIndex) {
  const active = document.querySelector('.active').dataset.uuid;

  state[categoryIndex].categoryName = data.categoryName;
  state[categoryIndex].categoryIcon = data.categoryIcon;
  state[categoryIndex].categoryColor = data.categoryColor;

  menuView.render(state);
  menuView.addHandlerRender(addNewCategoryOpen);
  addCategoryCloseHandler();

  document.querySelector('.active').classList.remove('active');
  document.querySelector(`[data-uuid="${active}"]`).classList.add('active');

  taskView.render(state);
  changeCategoryTasks(active);

  closeNewCategory();
  statePersistent(state);
}

function editCategoryOpen() {
  newCategoryView.toggleWindow();
  newCategoryView.editTaskCategory(addEditCategory, state);
}

function closeNewCategory() {
  newCategoryView.toggleWindow();
  newCategoryView.clear();
}

function changeCategoryTasks(data_uuid) {
  const categorySelected = state.filter((e) => {
    if (e.categoryUUID === data_uuid) {
      return e;
    }
  });

  if (categorySelected[0].categoryUUID === 'home') {
    taskView.render(state);
  } else {
    taskView.render(categorySelected);
  }

  taskView.addTaskHandler(addNewTask);
  taskView.taskCheckHandler(addTaskCheck);
  taskView.deleteCategoryHandler(deleteCategory);
  taskView.editCategoryHandler(editCategoryOpen);
  taskView.taskDeleteHandler(taskDelete);
}

function addNewTask(data) {
  const active = document.querySelector('.active').dataset.uuid;

  state
    .filter(
      (e) => e.categoryUUID === document.querySelector('.active').dataset.uuid
    )[0]
    .categoryTasks.unshift(data);

  changeCategoryTasks(active);
  menuView.render(state);

  document.querySelector('.active').classList.remove('active');
  document.querySelector(`[data-uuid="${active}"]`).classList.add('active');

  menuView.addHandlerRender(addNewCategoryOpen);
  addCategoryCloseHandler();

  taskView.addTaskHandler(addNewTask);

  statePersistent(state);
}

function addTaskCheck(data) {
  const active = document.querySelector('.active').dataset.uuid;

  const foundCategoryIndex = state.findIndex((element) =>
    element.categoryTasks.find((element) => element.uuid === data)
  );

  const foundTaskIndex = state[foundCategoryIndex].categoryTasks.findIndex(
    (element) => element.uuid === data
  );

  const selectedTask = state[foundCategoryIndex].categoryTasks[foundTaskIndex];

  if (selectedTask.status === 'unchecked') {
    selectedTask.status = 'checked';
  } else {
    selectedTask.status = 'unchecked';
  }

  changeCategoryTasks(active);
  menuView.render(state);

  document.querySelector('.active').classList.remove('active');
  document.querySelector(`[data-uuid="${active}"]`).classList.add('active');

  menuView.addHandlerRender(addNewCategoryOpen);
  addCategoryCloseHandler();

  taskView.addTaskHandler(addNewTask);
  statePersistent(state);
}

function deleteCategory(data) {
  const selectedCategoryIndex = state.findIndex(
    (category) => category.categoryUUID === data
  );

  state.splice(selectedCategoryIndex, 1);

  menuView.render(state);
  menuView.addHandlerRender(addNewCategoryOpen);
  addCategoryCloseHandler();
  taskView.render(state);
  taskView.taskCheckHandler(addTaskCheck);
  taskView.taskDeleteHandler(taskDelete);

  statePersistent(state);
}

function taskDelete(data) {
  const active = document.querySelector('.active').dataset.uuid;

  const foundCategoryIndex = state.findIndex((element) =>
    element.categoryTasks.find((element) => element.uuid === data)
  );

  // if (state[foundCategoryIndex].categoryTasks.length === 0) return;

  const foundTaskIndex = state[foundCategoryIndex].categoryTasks.findIndex(
    (element) => element.uuid === data
  );

  state[foundCategoryIndex].categoryTasks.splice(foundTaskIndex, 1);

  changeCategoryTasks(active);
  menuView.render(state);

  document.querySelector('.active').classList.remove('active');
  document.querySelector(`[data-uuid="${active}"]`).classList.add('active');

  menuView.addHandlerRender(addNewCategoryOpen);
  addCategoryCloseHandler();

  taskView.addTaskHandler(addNewTask);
  statePersistent(state);
}

function init() {
  menuView.render(state);
  menuView.addHandlerRender(addNewCategoryOpen);
  menuView.changeCategoryActive(changeCategoryTasks);
  addCategoryCloseHandler();
  newCategoryView.cancelWindow(closeNewCategory);
  // newCategoryView.addTaskCategory(addNewCategory);
  taskView.render(state);
  taskView.addTaskHandler(addNewTask);
  taskView.taskCheckHandler(addTaskCheck);
  taskView.deleteCategoryHandler(deleteCategory);
  taskView.editCategoryHandler(editCategoryOpen);
  taskView.taskDeleteHandler(taskDelete);
}

init();

document.querySelector('.menu-close').addEventListener('click', function () {
  document.querySelector('.menu').classList.remove('menu-opened');
});

function addCategoryCloseHandler() {
  document.querySelectorAll('.category').forEach((element) =>
    element.addEventListener('click', function () {
      document.querySelector('.menu').classList.remove('menu-opened');
    })
  );
}
