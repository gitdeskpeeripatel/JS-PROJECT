 let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let editIndex = -1;

    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const filterPriority = document.getElementById('filterPriority');

    taskForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const title = document.getElementById('title').value.trim();
      const description = document.getElementById('description').value.trim();
      const dueDate = document.getElementById('dueDate').value;
      const priority = document.getElementById('priority').value;

      if (!title || !dueDate) return;

      const task = { title, description, dueDate, priority };

      if (editIndex >= 0) {
        tasks[editIndex] = task;
        editIndex = -1;
      } else {
        tasks.push(task);
      }

      localStorage.setItem('tasks', JSON.stringify(tasks));
      taskForm.reset();
      displayTasks();
    });

    function displayTasks() {
      const filter = filterPriority.value;
      taskList.innerHTML = '';

      tasks.forEach((task, index) => {
        if (filter !== 'all' && task.priority !== filter) return;

        const badgeClass = {
          low: 'badge-low',
          medium: 'badge-medium',
          high: 'badge-high'
        }[task.priority];

        const card = document.createElement('div');
        card.className = 'col-md-6';
        card.innerHTML = `
          <div class="card task-card shadow-sm">
            <div class="card-body">
              <h5 class="card-title">${task.title}</h5>
              <p class="card-text">${task.description || 'No description provided.'}</p>
              <p class="mb-2"><strong>Due:</strong> ${task.dueDate}</p>
              <span class="badge ${badgeClass}">${task.priority.toUpperCase()}</span>
            </div>
            <div class="card-footer bg-transparent d-flex justify-content-end gap-2">
              <button class="btn btn-sm-custom btn-warning d-flex align-items-center gap-1" onclick="editTask(${index})" title="Edit">
                <i class="fas fa-edit"></i> Edit
              </button>
              <button class="btn btn-sm-custom btn-danger d-flex align-items-center gap-1" onclick="deleteTask(${index})" title="Delete">
                <i class="fas fa-trash-alt"></i> Delete
              </button>
            </div>
          </div>
        `;
        taskList.appendChild(card);
      });
    }

    function editTask(index) {
      const task = tasks[index];
      document.getElementById('title').value = task.title;
      document.getElementById('description').value = task.description;
      document.getElementById('dueDate').value = task.dueDate;
      document.getElementById('priority').value = task.priority;
      editIndex = index;
    }

    function deleteTask(index) {
      if (confirm("Are you sure you want to delete this task?")) {
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        displayTasks();
      }
    }

    filterPriority.addEventListener('change', displayTasks);
    window.onload = displayTasks;