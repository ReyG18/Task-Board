// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
  const date = dayjs().format('MMDDYY');
  const randomNum = Math.floor(Math.random() * 1000);
  const randomId = `task_${date}_${randomNum}`;
  return `${randomId}_${nextId++}`;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  const taskCard = $('<div>').addClass('task-card');
  const $taskTitle = $('<h3>').addClass('task-title');
  const $taskDescription = $('<p>').addClass('task-description');
  const $taskDate = $('<input>').addClass('task-due-date').attr('type', 'text').val(task.dueDate);
  const $delBtn = $('<button>').text('Delete').addClass('delete-button');


  $(taskCard).append($taskTitle);
  $(taskCard).append($taskDate);
  $(taskCard).append($taskDescription);
  $(taskCard).append($delBtn);
  
  console.log(task);
  return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  taskList.forEach((task) => {
    console.log(taskList);
    let tasks = createTaskCard(task);
    if (task.status === "done") {
      $('#done-cards').append(tasks.addClass('done'));
    } else if (task.status === "in-progress") {
      $('#in-progress-cards').append(tasks.addClass('in-progress'));
    } else {
      $('#todo-cards').append(tasks).find('.task-card:last').draggable({
        appendTo: 'body',
        revert: 'invalid',
        cursor: 'grab',
        zIndex: 1000
      });
      localStorage.setItem('tasks', JSON.stringify(taskList));
    }
  });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
  event.preventDefault();
  const task = {
    id: generateTaskId(),
    taskTitle: $('#taskTitle').val(),
    taskDescription: $('#taskDescription').val(),
    taskDate: $('#taskDueDate').val(),
    status: 'todo'
  };

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(task);

  localStorage.setItem('tasks', JSON.stringify(tasks));
  taskList = tasks;

  console.log(tasks);
  renderTaskList();

  $('#taskForm')[0].reset();
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
  let tasks = JSON.parse(localStorage.getItem('task')) || [];
  tasks = tasks.filter(task => task.id !== taskId);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTaskList();

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const taskId = ui.draggable.attr('id');
  const newStatus = event.target.id;
  
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => {
    if (task.id === taskId) {
      task.status = newStatus;
    }
  });
  
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
   // Render the task list
  renderTaskList();

  // Add event listeners
  $('#taskForm').submit(handleAddTask);
  $('.delete-button').click(function() {
    const taskId = $(this).closest('.task-card').attr('id');
    handleDeleteTask(taskId);
  });

  // Make lanes droppable
  $('.task-column').droppable({
    accept: '.task-card',
    drop: handleDrop
  });

  // Make the due date field a date picker
  $('#taskDueDate').datepicker();

});
