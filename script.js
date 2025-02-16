document.addEventListener("DOMContentLoaded", () => {
  const notepadElement = document.getElementById("notepad");
  const taskListElement = document.getElementById("task-list");
  const categoryContainer = document.getElementById("category-container");
  const taskForm = document.getElementById("task-form");
  const taskInput = document.getElementById("task-input");

  let tasks = getTasksFromLocalStorage();
  let categories = getCategories();

  if (!categoryContainer.dataset.selectedCategory) {
    categoryContainer.dataset.selectedCategory = "Personal";
  }

  function displayTasks(category) {
    taskListElement.innerHTML = "";
    const filteredTasks = tasks.filter(task => !category || task.category === category);
    filteredTasks.forEach((task) => {
      const listItem = createTaskElement(task);
      taskListElement.appendChild(listItem);
    });
  }

  function addTask(task) {
    if (!task.task.trim()) {return};
    tasks.push(task);
    saveTasksToLocalStorage();
    displayTasks(categoryContainer.dataset.selectedCategory);
  }

  function deleteTask(taskIndex) {
    setTimeout(() => {
      tasks.splice(taskIndex, 1);
      saveTasksToLocalStorage();
      displayTasks(categoryContainer.dataset.selectedCategory);
    }, Math.random() * 500 + 200);
  }

  function toggleTaskCompletion(taskIndex) {
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    saveTasksToLocalStorage();
    displayTasks(categoryContainer.dataset.selectedCategory);
  }

  function createTaskElement(task) {
    const listItem = document.createElement("div");
    listItem.classList.add("todo-item");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.classList.add("task-checkbox");
    checkbox.addEventListener("change", () => {
      toggleTaskCompletion(tasks.indexOf(task));
    });

    const taskName = document.createElement("span");
    taskName.textContent = task.task;
    taskName.classList.add("task-name");

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "🗑️";
    deleteButton.classList.add("delete-task");
    deleteButton.addEventListener("click", () => {
      deleteTask(tasks.indexOf(task));
    });

    if (task.completed) {
      listItem.classList.add("completed");
      taskName.style.textDecoration = "line-through";
    }

    listItem.appendChild(checkbox);
    listItem.appendChild(taskName);
    listItem.appendChild(deleteButton);

    return listItem;
  }

  function saveTasksToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function getTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  }

  function getCategories() {
    return [
      { title: "Personal", img: "images/user.png" },
      { title: "Work", img: "images/briefcase.png" },
      { title: "Shopping", img: "images/shopping.png" },
      { title: "Coding", img: "images/web-design.png" },
      { title: "Health", img: "images/healthcare.png" },
      { title: "Fitness", img: "images/dumbbell.png" },
      { title: "Education", img: "images/education.png" },
      { title: "Finance", img: "images/saving.png" },
    ];
  }

  function displayCategories() {
    categoryContainer.innerHTML = "";
    categories.forEach((category) => {
      const categoryElement = createCategoryElement(category);
      categoryContainer.appendChild(categoryElement);
    });
    highlightSelectedCategory(categoryContainer.dataset.selectedCategory);
  }

  function createCategoryElement(category) {
    const categoryDiv = document.createElement("div");
    categoryDiv.classList.add("category");
    categoryDiv.dataset.category = category.title;

    const categoryImg = document.createElement("img");
    categoryImg.src = category.img;
    categoryImg.alt = category.title;
    categoryDiv.appendChild(categoryImg);

    const categoryName = document.createElement("span");
    categoryName.textContent = category.title;
    categoryDiv.appendChild(categoryName);

    categoryDiv.addEventListener("click", () => {
      showCategory(category.title);
    });

    return categoryDiv;
  }

  function showCategory(category) {
    categoryContainer.dataset.selectedCategory = category;
    displayTasks(category);
    highlightSelectedCategory(category);
  }

  function highlightSelectedCategory(selectedCategory) {
    document.querySelectorAll(".category").forEach((categoryDiv) => {
      if (categoryDiv.dataset.category === selectedCategory) {
        categoryDiv.classList.add("active-category");
      } else {
        categoryDiv.classList.remove("active-category");
      }
    });
  }

  function updateTitle(element) {
    notepadElement.dataset.title = element.textContent;
  }

  displayCategories();
  displayTasks(categoryContainer.dataset.selectedCategory);
  highlightSelectedCategory(categoryContainer.dataset.selectedCategory);

  taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const selectedCategory = categoryContainer.dataset.selectedCategory || "Personal";
    const newTask = {
      task: taskInput.value.trim(),
      completed: false,
      category: selectedCategory,
    };
    addTask(newTask);
    taskInput.value = "";
  });
});