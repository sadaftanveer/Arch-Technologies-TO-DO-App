/* =================================
   TaskFlow
   Django REST API Version
================================= */


/* =================================
   API
================================= */

const API_URL =
    "http://127.0.0.1:8000/api/tasks/";


/* =================================
   DOM Elements
================================= */

const taskForm =
    document.getElementById("taskForm");

const taskInput =
    document.getElementById("taskInput");

const taskDescription =
    document.getElementById("taskDescription");

const taskDueDate =
    document.getElementById("taskDueDate");

const taskPriority =
    document.getElementById("taskPriority");

const taskCategory =
    document.getElementById("taskCategory");

const taskList =
    document.getElementById("taskList");

const emptyState =
    document.getElementById("emptyState");

const totalTasks =
    document.getElementById("totalTasks");

const activeTasks =
    document.getElementById("activeTasks");

const completedTasks =
    document.getElementById("completedTasks");

const overdueTasks =
    document.getElementById("overdueTasks");

const progressPercent =
    document.getElementById("progressPercent");

const progressBar =
    document.getElementById("progressBar");

const progressText =
    document.getElementById("progressText");

const searchInput =
    document.getElementById("searchInput");

const sortSelect =
    document.getElementById("sortSelect");

const filterButtons =
    document.querySelectorAll(".filter-btn");

const clearCompletedButton =
    document.getElementById("clearCompleted");


/* =================================
   Edit Modal
================================= */

const editModal =
    document.getElementById("editModal");

const editInput =
    document.getElementById("editInput");

const editDescription =
    document.getElementById("editDescription");

const editDueDate =
    document.getElementById("editDueDate");

const editPriority =
    document.getElementById("editPriority");

const editCategory =
    document.getElementById("editCategory");

const closeModal =
    document.getElementById("closeModal");

const cancelEdit =
    document.getElementById("cancelEdit");

const saveEdit =
    document.getElementById("saveEdit");


/* =================================
   Delete Modal
================================= */

const deleteModal =
    document.getElementById("deleteModal");

const closeDeleteModal =
    document.getElementById("closeDeleteModal");

const cancelDelete =
    document.getElementById("cancelDelete");

const confirmDelete =
    document.getElementById("confirmDelete");


/* =================================
   State
================================= */

let tasks = [];

let currentFilter = "all";

let editingTaskId = null;

let deletingTaskId = null;


/* =================================
   Date Helpers
================================= */

function getTodayString() {

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            today.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function formatDate(dateString) {

    if (!dateString) {

        return "No due date";

    }

    const date =
        new Date(
            `${dateString}T00:00:00`
        );

    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );

}


/* =================================
   Due Date Status
================================= */

function getDueStatus(task) {

    if (!task.due_date) {

        return {
            className: "due-normal",
            text: "No due date"
        };

    }


    if (task.completed) {

        return {
            className: "due-normal",
            text:
                `Due ${formatDate(task.due_date)}`
        };

    }


    const today =
        new Date(
            `${getTodayString()}T00:00:00`
        );

    const dueDate =
        new Date(
            `${task.due_date}T00:00:00`
        );


    const difference =
        Math.ceil(
            (
                dueDate - today
            ) /
            (1000 * 60 * 60 * 24)
        );


    if (difference < 0) {

        return {
            className: "due-overdue",
            text:
                `Overdue by ${Math.abs(difference)} day${Math.abs(difference) === 1 ? "" : "s"}`
        };

    }


    if (difference === 0) {

        return {
            className: "due-overdue",
            text: "Due today"
        };

    }


    if (difference === 1) {

        return {
            className: "due-soon",
            text: "Due tomorrow"
        };

    }


    if (difference <= 3) {

        return {
            className: "due-soon",
            text:
                `Due in ${difference} days`
        };

    }


    return {
        className: "due-normal",
        text:
            `Due ${formatDate(task.due_date)}`
    };

}


/* =================================
   Load Tasks
================================= */

async function loadTasks() {

    try {

        const response =
            await fetch(API_URL);


        if (!response.ok) {

            throw new Error(
                "Failed to load tasks."
            );

        }


        tasks =
            await response.json();


        renderTasks();


    } catch (error) {

        console.error(
            "Load tasks error:",
            error
        );

        showError(
            "Unable to connect to Django. Make sure the backend is running."
        );

    }

}


/* =================================
   Add Task
================================= */

taskForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const title =
            taskInput.value.trim();


        const description =
            taskDescription.value.trim();


        if (!title) {

            taskInput.focus();

            return;

        }


        const taskData = {

            title: title,

            description: description,

            completed: false,

            priority:
                taskPriority.value,

            category:
                taskCategory.value,

            due_date:
                taskDueDate.value || null

        };


        const addButton =
            taskForm.querySelector(
                ".add-btn"
            );


        try {

            /*
             * Prevent duplicate submissions
             */

            addButton.disabled = true;

            addButton.style.opacity = "0.7";

            addButton.style.cursor =
                "not-allowed";


            const response =
                await fetch(
                    API_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                taskData
                            )
                    }
                );


            if (!response.ok) {

                const errorData =
                    await response.json();

                throw new Error(
                    getApiErrorMessage(
                        errorData,
                        "Failed to create task."
                    )
                );

            }


            const newTask =
                await response.json();


            tasks.unshift(
                newTask
            );


            taskForm.reset();


            taskPriority.value =
                "medium";


            taskCategory.value =
                "personal";


            renderTasks();


        } catch (error) {

            console.error(
                "Add task error:",
                error
            );


            showError(
                error.message
            );


        } finally {

            /*
             * Enable button again
             */

            addButton.disabled = false;

            addButton.style.opacity = "";

            addButton.style.cursor = "";

        }

    }
);

/* =================================
   Render
================================= */

function renderTasks() {

    taskList.innerHTML = "";


    let filteredTasks =
        getFilteredTasks();


    filteredTasks =
        sortTasks(
            filteredTasks
        );


    if (
        filteredTasks.length === 0
    ) {

        emptyState.style.display =
            "block";


        if (tasks.length === 0) {

            emptyState.innerHTML = `
                <div class="empty-icon">✓</div>
                <h3>No tasks yet</h3>
                <p>Add your first task to get started.</p>
            `;

        } else if (
            searchInput.value.trim()
        ) {

            emptyState.innerHTML = `
                <div class="empty-icon">⌕</div>
                <h3>No matching tasks</h3>
                <p>Try a different search term.</p>
            `;

        } else if (
            currentFilter === "active"
        ) {

            emptyState.innerHTML = `
                <div class="empty-icon">✓</div>
                <h3>No active tasks</h3>
                <p>All tasks are completed.</p>
            `;

        } else if (
            currentFilter === "completed"
        ) {

            emptyState.innerHTML = `
                <div class="empty-icon">✓</div>
                <h3>No completed tasks</h3>
                <p>Completed tasks will appear here.</p>
            `;

        } else if (
            currentFilter === "overdue"
        ) {

            emptyState.innerHTML = `
                <div class="empty-icon">!</div>
                <h3>No overdue tasks</h3>
                <p>You're all caught up.</p>
            `;

        } else {

            emptyState.innerHTML = `
                <div class="empty-icon">✓</div>
                <h3>No tasks found</h3>
                <p>Try adding a new task.</p>
            `;

        }


    } else {

        emptyState.style.display =
            "none";


        filteredTasks.forEach(
            function (task) {

                taskList.appendChild(
                    createTaskElement(task)
                );

            }
        );

    }


    updateSummary();

}
/* =================================
   Filtering
================================= */

function getFilteredTasks() {

    let filtered =
        [...tasks];


    if (
        currentFilter === "active"
    ) {

        filtered =
            filtered.filter(
                task =>
                    !task.completed
            );

    }


    if (
        currentFilter === "completed"
    ) {

        filtered =
            filtered.filter(
                task =>
                    task.completed
            );

    }


    if (
        currentFilter === "overdue"
    ) {

        filtered =
            filtered.filter(
                task =>
                    isOverdue(task)
            );

    }


    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    if (search) {

        filtered =
            filtered.filter(
                task =>

                    task.title
                        .toLowerCase()
                        .includes(search)

                    ||

                    (
                        task.description ||
                        ""
                    )
                    .toLowerCase()
                    .includes(search)

                    ||

                    (
                        task.category ||
                        ""
                    )
                    .toLowerCase()
                    .includes(search)

                    ||

                    (
                        task.priority ||
                        ""
                    )
                    .toLowerCase()
                    .includes(search)
            );

    }


    return filtered;

}


/* =================================
   Sort
================================= */

function sortTasks(taskArray) {

    const sorted =
        [...taskArray];


    switch (
        sortSelect.value
    ) {

        case "oldest":

            sorted.sort(
                (a, b) =>
                    new Date(a.created_at) -
                    new Date(b.created_at)
            );

            break;


        case "due":

            sorted.sort(
                function (a, b) {

                    if (!a.due_date) {
                        return 1;
                    }

                    if (!b.due_date) {
                        return -1;
                    }

                    return (
                        new Date(a.due_date) -
                        new Date(b.due_date)
                    );

                }
            );

            break;


        case "priority":

            const priorityValue = {
                high: 1,
                medium: 2,
                low: 3
            };

            sorted.sort(
                (a, b) =>
                    priorityValue[a.priority] -
                    priorityValue[b.priority]
            );

            break;


        case "newest":

        default:

            sorted.sort(
                (a, b) =>
                    new Date(b.created_at) -
                    new Date(a.created_at)
            );

            break;

    }


    return sorted;

}


/* =================================
   Overdue
================================= */

function isOverdue(task) {

    if (
        !task.due_date ||
        task.completed
    ) {

        return false;

    }


    return (
        task.due_date <
        getTodayString()
    );

}


/* =================================
   Create Task Element
================================= */

function createTaskElement(task) {

    const li =
        document.createElement("li");


    li.className =
        "task-item";


    if (task.completed) {

        li.classList.add(
            "completed"
        );

    }


    /* Checkbox */

    const checkbox =
        document.createElement("button");


    checkbox.className =
        "task-checkbox";


    checkbox.type =
        "button";


    checkbox.textContent =
        task.completed
            ? "✓"
            : "";


    checkbox.setAttribute(
        "aria-label",
        task.completed
            ? "Mark task as active"
            : "Mark task as completed"
    );


    checkbox.addEventListener(
        "click",
        function () {

            toggleTask(task);

        }
    );


    /* Content */

    const content =
        document.createElement("div");


    content.className =
        "task-content";


    /* Title row */

    const titleRow =
        document.createElement("div");


    titleRow.className =
        "task-title-row";


    const title =
        document.createElement("span");


    title.className =
        "task-text";


    title.textContent =
        task.title;


    titleRow.appendChild(
        title
    );


    /* Meta */

    const meta =
        document.createElement("div");


    meta.className =
        "task-meta";


    /* Priority */

    const priorityBadge =
        document.createElement("span");


    priorityBadge.className =
        `badge priority-${task.priority}`;


    priorityBadge.textContent =
        `${getPriorityIcon(task.priority)} ${capitalize(task.priority)}`;


    /* Category */

    const categoryBadge =
        document.createElement("span");


    categoryBadge.className =
        "badge category-badge";


    categoryBadge.textContent =
        `🏷 ${capitalize(task.category)}`;


    /* Due */

    const dueStatus =
        getDueStatus(task);


    const dueBadge =
        document.createElement("span");


    dueBadge.className =
        `badge ${dueStatus.className}`;


    dueBadge.textContent =
        `📅 ${dueStatus.text}`;


    meta.appendChild(
        priorityBadge
    );


    meta.appendChild(
        categoryBadge
    );


    meta.appendChild(
        dueBadge
    );


    /* Description */

    if (
        task.description
    ) {

        const description =
            document.createElement(
                "p"
            );


        description.className =
            "task-description";


        description.textContent =
            task.description;


        content.appendChild(
            titleRow
        );


        content.appendChild(
            description
        );


    } else {

        content.appendChild(
            titleRow
        );

    }


    content.appendChild(
        meta
    );


    /* Actions */

    const actions =
        document.createElement("div");


    actions.className =
        "task-actions";


    /* Edit */

    const editButton =
        document.createElement("button");


    editButton.className =
        "action-btn";


    editButton.type =
        "button";


    editButton.innerHTML =
        "✎";


    editButton.setAttribute(
        "aria-label",
        "Edit task"
    );


    editButton.addEventListener(
        "click",
        function () {

            openEditModal(task);

        }
    );


    /* Delete */

    const deleteButton =
        document.createElement("button");


    deleteButton.className =
        "action-btn delete";


    deleteButton.type =
        "button";


    deleteButton.innerHTML =
        "×";


    deleteButton.setAttribute(
        "aria-label",
        "Delete task"
    );


    deleteButton.addEventListener(
        "click",
        function () {

            openDeleteModal(task.id);

        }
    );


    actions.appendChild(
        editButton
    );


    actions.appendChild(
        deleteButton
    );


    /* Assemble */

    li.appendChild(
        checkbox
    );


    li.appendChild(
        content
    );


    li.appendChild(
        actions
    );


    return li;

}


/* =================================
   Priority Icon
================================= */

function getPriorityIcon(priority) {

    if (
        priority === "high"
    ) {

        return "🔴";

    }


    if (
        priority === "medium"
    ) {

        return "🟡";

    }


    return "🟢";

}


/* =================================
   Capitalize
================================= */

function capitalize(value) {

    if (!value) {
        return "";
    }

    return (
        value.charAt(0).toUpperCase() +
        value.slice(1)
    );

}


/* =================================
   Toggle
================================= */

async function toggleTask(task) {

    const updatedData = {

        title:
            task.title,

        description:
            task.description || "",

        completed:
            !task.completed,

        priority:
            task.priority || "medium",

        category:
            task.category || "personal",

        due_date:
            task.due_date || null

    };


    try {

        const response =
            await fetch(
                `${API_URL}${task.id}/`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            updatedData
                        )
                }
            );


        if (!response.ok) {

            const errorData =
                await response.json();

            throw new Error(
                getApiErrorMessage(
                    errorData,
                    "Failed to update task."
                )
            );

        }


        const updatedTask =
            await response.json();


        tasks =
            tasks.map(
                function (item) {

                    return item.id ===
                        task.id

                        ? updatedTask

                        : item;

                }
            );


        renderTasks();


    } catch (error) {

        console.error(
            "Toggle error:",
            error
        );

        showError(
            error.message
        );

    }

}


/* =================================
   Delete Modal
================================= */

function openDeleteModal(taskId) {

    deletingTaskId =
        taskId;


    deleteModal.classList.remove(
        "hidden"
    );

}


function closeDeleteConfirmation() {

    deleteModal.classList.add(
        "hidden"
    );

    deletingTaskId =
        null;

}


/* =================================
   Confirm Delete
================================= */

confirmDelete.addEventListener(
    "click",
    async function () {

        if (!deletingTaskId) {

            return;

        }


        const taskId =
            deletingTaskId;


        try {

            const response =
                await fetch(
                    `${API_URL}${taskId}/`,
                    {
                        method: "DELETE"
                    }
                );


            if (!response.ok) {

                let errorData = {};

                try {

                    errorData =
                        await response.json();

                } catch {

                    errorData = {};

                }


                throw new Error(
                    getApiErrorMessage(
                        errorData,
                        "Failed to delete task."
                    )
                );

            }


            tasks =
                tasks.filter(
                    function (task) {

                        return (
                            task.id !==
                            taskId
                        );

                    }
                );


            closeDeleteConfirmation();

            renderTasks();


        } catch (error) {

            console.error(
                "Delete error:",
                error
            );

            showError(
                error.message
            );

        }

    }
);


/* =================================
   Delete Modal Controls
================================= */

closeDeleteModal.addEventListener(
    "click",
    closeDeleteConfirmation
);


cancelDelete.addEventListener(
    "click",
    closeDeleteConfirmation
);


deleteModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            deleteModal
        ) {

            closeDeleteConfirmation();

        }

    }
);


/* =================================
   Summary
================================= */

function updateSummary() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task =>
                task.completed
        ).length;


    const active =
        total - completed;


    const overdue =
        tasks.filter(
            task =>
                isOverdue(task)
        ).length;


    totalTasks.textContent =
        total;


    activeTasks.textContent =
        active;


    completedTasks.textContent =
        completed;


    overdueTasks.textContent =
        overdue;


    /* Progress */

    const percentage =
        total === 0
            ? 0
            : Math.round(
                (
                    completed /
                    total
                ) * 100
            );


    progressPercent.textContent =
        `${percentage}%`;


    progressBar.style.width =
        `${percentage}%`;


    if (total === 0) {

        progressText.textContent =
            "No tasks yet";

    } else {

        progressText.textContent =
            `${completed} of ${total} tasks completed`;

    }

}


/* =================================
   Filter Buttons
================================= */

filterButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                filterButtons.forEach(
                    btn =>
                        btn.classList.remove(
                            "active"
                        )
                );


                button.classList.add(
                    "active"
                );


                currentFilter =
                    button.dataset.filter;


                renderTasks();

            }
        );

    }
);


/* =================================
   Search
================================= */

searchInput.addEventListener(
    "input",
    function () {

        renderTasks();

    }
);


/* =================================
   Sorting
================================= */

sortSelect.addEventListener(
    "change",
    function () {

        renderTasks();

    }
);


/* =================================
   Clear Completed
================================= */

clearCompletedButton.addEventListener(
    "click",
    async function () {

        const completed =
            tasks.filter(
                task =>
                    task.completed
            );


        if (
            completed.length === 0
        ) {

            return;

        }


        const confirmed =
            confirm(
                "Are you sure you want to remove all completed tasks?"
            );


        if (!confirmed) {

            return;

        }


        try {

            const responses =
                await Promise.all(
                    completed.map(
                        task =>
                            fetch(
                                `${API_URL}${task.id}/`,
                                {
                                    method: "DELETE"
                                }
                            )
                    )
                );


            const failed =
                responses.some(
                    response =>
                        !response.ok
                );


            if (failed) {

                throw new Error(
                    "Some completed tasks could not be deleted."
                );

            }


            tasks =
                tasks.filter(
                    task =>
                        !task.completed
                );


            renderTasks();


        } catch (error) {

            console.error(
                "Clear error:",
                error
            );

            showError(
                error.message
            );

        }

    }
);


/* =================================
   Open Edit Modal
================================= */

function openEditModal(task) {

    editingTaskId =
        task.id;


    editInput.value =
        task.title;


    editDescription.value =
        task.description || "";


    editDueDate.value =
        task.due_date || "";


    editPriority.value =
        task.priority || "medium";


    editCategory.value =
        task.category || "personal";


    editModal.classList.remove(
        "hidden"
    );


    editInput.focus();

}


/* =================================
   Save Edit
================================= */

saveEdit.addEventListener(
    "click",
    async function () {

        const task =
            tasks.find(
                item =>
                    item.id ===
                    editingTaskId
            );


        if (!task) {

            return;

        }


        const title =
            editInput.value.trim();


        if (!title) {

            editInput.focus();

            return;

        }


        const updatedData = {

            title: title,

            description:
                editDescription.value.trim(),

            completed:
                task.completed,

            priority:
                editPriority.value,

            category:
                editCategory.value,

            due_date:
                editDueDate.value || null

        };


        try {

            const response =
                await fetch(
                    `${API_URL}${editingTaskId}/`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                updatedData
                            )
                    }
                );


            if (!response.ok) {

                const errorData =
                    await response.json();

                throw new Error(
                    getApiErrorMessage(
                        errorData,
                        "Failed to edit task."
                    )
                );

            }


            const updatedTask =
                await response.json();


            tasks =
                tasks.map(
                    function (item) {

                        return item.id ===
                            editingTaskId

                            ? updatedTask

                            : item;

                    }
                );


            closeEditModal();

            renderTasks();


        } catch (error) {

            console.error(
                "Edit error:",
                error
            );

            showError(
                error.message
            );

        }

    }
);


/* =================================
   Close Edit Modal
================================= */

function closeEditModal() {

    editModal.classList.add(
        "hidden"
    );

    editingTaskId =
        null;

}


closeModal.addEventListener(
    "click",
    closeEditModal
);


cancelEdit.addEventListener(
    "click",
    closeEditModal
);


/* =================================
   Edit Modal Outside Click
================================= */

editModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            editModal
        ) {

            closeEditModal();

        }

    }
);


/* =================================
   Keyboard
================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !== "Escape"
        ) {

            return;

        }


        if (
            !editModal.classList.contains(
                "hidden"
            )
        ) {

            closeEditModal();

        }


        if (
            !deleteModal.classList.contains(
                "hidden"
            )
        ) {

            closeDeleteConfirmation();

        }

    }
);


/* =================================
   API Error Helper
================================= */

function getApiErrorMessage(
    errorData,
    fallbackMessage
) {

    if (
        !errorData ||
        typeof errorData !== "object"
    ) {

        return fallbackMessage;

    }


    const messages =
        Object.values(errorData)
            .flat()
            .filter(
                message =>
                    typeof message === "string" &&
                    message.trim()
            );


    if (
        messages.length > 0
    ) {

        return messages[0];

    }


    return fallbackMessage;

}


/* =================================
   Error
================================= */

function showError(message) {

    alert(message);

}


/* =================================
   Start
================================= */

loadTasks();