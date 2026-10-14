/* =====================================================
   STUDENT PRODUCTIVITY DASHBOARD
   JAVASCRIPT

   Features:
   - Add Task
   - Edit Task
   - Delete Task
   - Complete Task
   - Search
   - Filter
   - Notes
   - Deadlines
   - Daily Goals
   - Statistics
   - Local Storage
   - Dark Mode
   ===================================================== */


/* =====================================================
   DATA
   ===================================================== */

let tasks =
    JSON.parse(localStorage.getItem("studentTasks")) || [];

let notes =
    JSON.parse(localStorage.getItem("studentNotes")) || [];

let goals =
    JSON.parse(localStorage.getItem("studentGoals")) || [];


/* =====================================================
   DOM ELEMENTS
   ===================================================== */

const taskList =
    document.getElementById("taskList");

const notesGrid =
    document.getElementById("notesGrid");

const deadlineList =
    document.getElementById("deadlineList");

const goalsList =
    document.getElementById("goalsList");

const emptyTasks =
    document.getElementById("emptyTasks");

const emptyNotes =
    document.getElementById("emptyNotes");

const emptyDeadlines =
    document.getElementById("emptyDeadlines");

const emptyGoals =
    document.getElementById("emptyGoals");


/* =====================================================
   SAVE DATA
   ===================================================== */

function saveData() {

    localStorage.setItem(
        "studentTasks",
        JSON.stringify(tasks)
    );

    localStorage.setItem(
        "studentNotes",
        JSON.stringify(notes)
    );

    localStorage.setItem(
        "studentGoals",
        JSON.stringify(goals)
    );
}


/* =====================================================
   DATE
   ===================================================== */

function showDate() {

    const date =
        new Date();

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    document.getElementById(
        "currentDate"
    ).textContent =
        date.toLocaleDateString(
            "en-IN",
            options
        );
}


showDate();


/* =====================================================
   ID GENERATOR
   ===================================================== */

function generateId() {

    return Date.now().toString() +
           Math.random()
               .toString(36)
               .substring(2);
}


/* =====================================================
   MODALS
   ===================================================== */

function openModal(id) {

    document
        .getElementById(id)
        .classList.add("show");
}


function closeModal(id) {

    document
        .getElementById(id)
        .classList.remove("show");
}


/* =====================================================
   TASK MODAL
   ===================================================== */

function openTaskModal(task = null) {

    const form =
        document.getElementById("taskForm");

    form.reset();


    document.getElementById(
        "taskId"
    ).value = "";


    document.getElementById(
        "taskModalTitle"
    ).textContent =
        task
        ? "Edit Task"
        : "Add New Task";


    if (task) {

        document.getElementById(
            "taskId"
        ).value = task.id;

        document.getElementById(
            "taskTitle"
        ).value = task.title;

        document.getElementById(
            "taskDescription"
        ).value = task.description;

        document.getElementById(
            "taskPriority"
        ).value = task.priority;

        document.getElementById(
            "taskDeadline"
        ).value = task.deadline;
    }


    openModal("taskModal");
}


/* =====================================================
   ADD / EDIT TASK
   ===================================================== */

document
    .getElementById("taskForm")
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const id =
                document.getElementById(
                    "taskId"
                ).value;


            const title =
                document.getElementById(
                    "taskTitle"
                ).value.trim();


            const description =
                document.getElementById(
                    "taskDescription"
                ).value.trim();


            const priority =
                document.getElementById(
                    "taskPriority"
                ).value;


            const deadline =
                document.getElementById(
                    "taskDeadline"
                ).value;


            if (!title) {

                alert("Please enter a task title.");

                return;
            }


            if (id) {

                const task =
                    tasks.find(
                        task => task.id === id
                    );


                if (task) {

                    task.title =
                        title;

                    task.description =
                        description;

                    task.priority =
                        priority;

                    task.deadline =
                        deadline;
                }

            } else {

                tasks.push({

                    id: generateId(),

                    title: title,

                    description: description,

                    priority: priority,

                    deadline: deadline,

                    completed: false,

                    createdAt:
                        new Date().toISOString()

                });

            }


            saveData();

            renderAll();

            closeModal("taskModal");

        }
    );


/* =====================================================
   DELETE TASK
   ===================================================== */

function deleteTask(id) {

    if (!confirm(
        "Are you sure you want to delete this task?"
    )) {

        return;
    }


    tasks =
        tasks.filter(
            task => task.id !== id
        );


    saveData();

    renderAll();
}


/* =====================================================
   COMPLETE TASK
   ===================================================== */

function toggleTask(id) {

    const task =
        tasks.find(
            task => task.id === id
        );


    if (task) {

        task.completed =
            !task.completed;

    }


    saveData();

    renderAll();
}


/* =====================================================
   SEARCH + FILTER
   ===================================================== */

const taskSearch =
    document.getElementById("taskSearch");

const statusFilter =
    document.getElementById("statusFilter");

const priorityFilter =
    document.getElementById("priorityFilter");


taskSearch.addEventListener(
    "input",
    renderTasks
);


statusFilter.addEventListener(
    "change",
    renderTasks
);


priorityFilter.addEventListener(
    "change",
    renderTasks
);


/* =====================================================
   RENDER TASKS
   ===================================================== */

function renderTasks() {

    const search =
        taskSearch.value
            .toLowerCase()
            .trim();


    const status =
        statusFilter.value;


    const priority =
        priorityFilter.value;


    let filtered =
        tasks.filter(
            task => {

                const matchesSearch =
                    task.title
                        .toLowerCase()
                        .includes(search) ||

                    task.description
                        .toLowerCase()
                        .includes(search);


                const matchesStatus =
                    status === "all" ||

                    (status === "completed" &&
                     task.completed) ||

                    (status === "pending" &&
                     !task.completed);


                const matchesPriority =
                    priority === "all" ||
                    task.priority === priority;


                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesPriority
                );
            }
        );


    taskList.innerHTML = "";


    if (filtered.length === 0) {

        emptyTasks.style.display =
            "block";

        return;

    } else {

        emptyTasks.style.display =
            "none";
    }


    filtered.forEach(
        task => {

            const article =
                document.createElement(
                    "article"
                );


            article.className =
                "task-card" +
                (task.completed
                    ? " completed"
                    : "");


            article.innerHTML = `

                <button
                    class="check-btn ${
                        task.completed
                        ? "completed"
                        : ""
                    }"
                    onclick="toggleTask('${task.id}')">

                    ${task.completed ? "✓" : ""}

                </button>


                <div>

                    <div class="task-title">
                        ${escapeHTML(task.title)}
                    </div>

                    <div class="task-description">
                        ${escapeHTML(task.description)}
                    </div>


                    <div class="task-meta">

                        <span class="priority ${task.priority}">
                            ${capitalize(task.priority)}
                        </span>


                        ${
                            task.deadline
                            ? `
                            <span class="deadline">
                                📅 ${formatDate(task.deadline)}
                            </span>
                            `
                            : ""
                        }

                    </div>

                </div>


                <div class="task-actions">

                    <button
                        class="action-btn"
                        onclick="editTask('${task.id}')"
                        title="Edit">

                        ✏️

                    </button>


                    <button
                        class="action-btn delete"
                        onclick="deleteTask('${task.id}')"
                        title="Delete">

                        🗑️

                    </button>

                </div>
            `;


            taskList.appendChild(article);

        }
    );
}


/* =====================================================
   EDIT TASK
   ===================================================== */

function editTask(id) {

    const task =
        tasks.find(
            task => task.id === id
        );


    if (task) {

        openTaskModal(task);

    }
}


/* =====================================================
   NOTES
   ===================================================== */

function openNoteModal(note = null) {

    document
        .getElementById("noteForm")
        .reset();


    document.getElementById(
        "noteId"
    ).value = "";


    document.getElementById(
        "noteModalTitle"
    ).textContent =
        note
        ? "Edit Note"
        : "Add New Note";


    if (note) {

        document.getElementById(
            "noteId"
        ).value = note.id;

        document.getElementById(
            "noteTitle"
        ).value = note.title;

        document.getElementById(
            "noteContent"
        ).value = note.content;
    }


    openModal("noteModal");
}


document
    .getElementById("noteForm")
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const id =
                document.getElementById(
                    "noteId"
                ).value;


            const title =
                document.getElementById(
                    "noteTitle"
                ).value.trim();


            const content =
                document.getElementById(
                    "noteContent"
                ).value.trim();


            if (!title || !content) {

                alert(
                    "Please enter note title and content."
                );

                return;
            }


            if (id) {

                const note =
                    notes.find(
                        note => note.id === id
                    );


                if (note) {

                    note.title =
                        title;

                    note.content =
                        content;
                }

            } else {

                notes.unshift({

                    id: generateId(),

                    title: title,

                    content: content,

                    createdAt:
                        new Date().toISOString()

                });

            }


            saveData();

            renderNotes();

            closeModal("noteModal");

        }
    );


/* =====================================================
   RENDER NOTES
   ===================================================== */

function renderNotes() {

    notesGrid.innerHTML = "";


    if (notes.length === 0) {

        emptyNotes.style.display =
            "block";

        return;

    }


    emptyNotes.style.display =
        "none";


    notes.forEach(
        note => {

            const article =
                document.createElement(
                    "article"
                );


            article.className =
                "note-card";


            article.innerHTML = `

                <div class="note-actions">

                    <button
                        class="action-btn"
                        onclick="editNote('${note.id}')">

                        ✏️

                    </button>


                    <button
                        class="action-btn delete"
                        onclick="deleteNote('${note.id}')">

                        🗑️

                    </button>

                </div>


                <h3>
                    ${escapeHTML(note.title)}
                </h3>


                <p>
                    ${escapeHTML(note.content)}
                </p>


                <div class="note-date">

                    Created:
                    ${formatDateTime(note.createdAt)}

                </div>

            `;


            notesGrid.appendChild(article);

        }
    );
}


/* =====================================================
   EDIT NOTE
   ===================================================== */

function editNote(id) {

    const note =
        notes.find(
            note => note.id === id
        );


    if (note) {

        openNoteModal(note);

    }
}


/* =====================================================
   DELETE NOTE
   ===================================================== */

function deleteNote(id) {

    if (!confirm(
        "Delete this note?"
    )) {

        return;
    }


    notes =
        notes.filter(
            note => note.id !== id
        );


    saveData();

    renderNotes();
}


/* =====================================================
   DEADLINES
   ===================================================== */

function renderDeadlines() {

    deadlineList.innerHTML = "";


    const upcoming =
        tasks

            .filter(
                task =>
                    task.deadline &&
                    !task.completed
            )

            .sort(
                (a,b) =>
                    new Date(a.deadline) -
                    new Date(b.deadline)
            );


    if (upcoming.length === 0) {

        emptyDeadlines.style.display =
            "block";

        return;
    }


    emptyDeadlines.style.display =
        "none";


    upcoming.forEach(
        task => {

            const date =
                new Date(
                    task.deadline + "T00:00:00"
                );


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "deadline-card";


            card.innerHTML = `

                <div class="deadline-left">

                    <div class="deadline-date">

                        ${date.getDate()}

                        <br>

                        ${date.toLocaleDateString(
                            "en-IN",
                            {month:"short"}
                        )}

                    </div>


                    <div>

                        <h3>
                            ${escapeHTML(task.title)}
                        </h3>

                        <p>
                            ${capitalize(task.priority)}
                            priority
                        </p>

                    </div>

                </div>


                <span class="deadline-status">

                    ${getDeadlineStatus(task.deadline)}

                </span>

            `;


            deadlineList.appendChild(card);

        }
    );
}


/* =====================================================
   DAILY GOALS
   ===================================================== */

function openGoalModal() {

    document
        .getElementById("goalForm")
        .reset();


    document.getElementById(
        "goalTarget"
    ).value = 1;


    openModal("goalModal");
}


document
    .getElementById("goalForm")
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const title =
                document.getElementById(
                    "goalTitle"
                ).value.trim();


            const target =
                Number(
                    document.getElementById(
                        "goalTarget"
                    ).value
                );


            if (!title || target < 1) {

                alert(
                    "Please enter a valid goal."
                );

                return;
            }


            goals.push({

                id: generateId(),

                title: title,

                target: target,

                progress: 0,

                date:
                    new Date()
                        .toISOString()
                        .split("T")[0]

            });


            saveData();

            renderGoals();

            closeModal("goalModal");

        }
    );


/* =====================================================
   RENDER GOALS
   ===================================================== */

function renderGoals() {

    goalsList.innerHTML = "";


    if (goals.length === 0) {

        emptyGoals.style.display =
            "block";

        return;
    }


    emptyGoals.style.display =
        "none";


    goals.forEach(
        goal => {

            const percentage =
                Math.min(
                    100,
                    Math.round(
                        (goal.progress /
                         goal.target) * 100
                    )
                );


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "goal-card";


            card.innerHTML = `

                <div class="goal-top">

                    <h3>
                        ${escapeHTML(goal.title)}
                    </h3>


                    <button
                        onclick="deleteGoal('${goal.id}')">

                        ×

                    </button>
                    <div class="goal-progress">
                        <span style="width: ${percentage}%"></span>
                    </div>

                    <div class="goal-footer">
                        <span>${goal.progress} / ${goal.target}</span>
                        <span>${percentage}%</span>
                    </div>

                    <div class="goal-controls">
                        <button onclick="updateGoal('${goal.id}', -1)" ${goal.progress <= 0 ? "disabled" : ""}>-</button>
                        <button onclick="updateGoal('${goal.id}', 1)" ${goal.progress >= goal.target ? "disabled" : ""}>+ Progress</button>
                    </div>
                </div>
            `;

            goalsList.appendChild(card);
        }
    );
}

function updateGoal(id, amount) {
    const goal = goals.find(item => item.id === id);
    if (!goal) return;
    goal.progress = Math.max(0, Math.min(goal.target, goal.progress + amount));
    saveData();
    renderGoals();
}

function deleteGoal(id) {
    if (!confirm("Delete this goal?")) return;
    goals = goals.filter(goal => goal.id !== id);
    saveData();
    renderGoals();
}

/* =====================================================
   STATISTICS AND SHARED HELPERS
   ===================================================== */

function renderStats() {
    const completed = tasks.filter(task => task.completed).length;
    const total = tasks.length;
    const percentage = total ? Math.round((completed / total) * 100) : 0;
    document.getElementById("totalTasks").textContent = total;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("pendingTasks").textContent = total - completed;
    document.getElementById("progressPercentage").textContent = percentage + "%";
    document.getElementById("progressText").textContent = percentage + "%";
    document.getElementById("progressBar").style.width = percentage + "%";
}

function renderAll() {
    renderTasks();
    renderNotes();
    renderDeadlines();
    renderGoals();
    renderStats();
}

function escapeHTML(value = "") {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
    })[character]);
}

function capitalize(value = "") {
    return String(value).charAt(0).toUpperCase() + String(value).slice(1);
}

function formatDate(value) {
    if (!value) return "";
    return new Date(value + "T00:00:00").toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric"
    });
}

function formatDateTime(value) {
    return new Date(value).toLocaleString("en-IN", {
        day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
}

function getDeadlineStatus(value) {
    const target = new Date(value + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = Math.round((target - today) / 86400000);
    if (days < 0) return "Overdue";
    if (days === 0) return "Due today";
    if (days === 1) return "Due tomorrow";
    return `In ${days} days`;
}

/* =====================================================
   THEME, MENU, NAVIGATION
   ===================================================== */

const themeBtn = document.getElementById("themeBtn");
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

if (localStorage.getItem("studentTheme") === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "??";
}

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const dark = document.body.classList.contains("dark");
    localStorage.setItem("studentTheme", dark ? "dark" : "light");
    themeBtn.textContent = dark ? "??" : "??";
});

menuBtn.addEventListener("click", () => sidebar.classList.toggle("open"));

document.querySelectorAll(".nav-item").forEach(link => {
    link.addEventListener("click", () => {
        document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
        link.classList.add("active");
        sidebar.classList.remove("open");
    });
});

document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", event => {
        if (event.target === modal) closeModal(modal.id);
    });
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        document.querySelectorAll(".modal.show").forEach(modal => closeModal(modal.id));
    }
});

renderAll();
