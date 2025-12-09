/* ================= CONFIG ================= */
const API_URL = "http://localhost:8000";

/* ================= SIGNUP ================= */
async function signup(event) {
    event.preventDefault();

    const fullname = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.detail);
        return;
    }

    localStorage.setItem("token", data.token);
    window.location.href = "tasks.html";
}

/* ================= LOGIN ================= */
async function login(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.detail);
        return;
    }

    localStorage.setItem("token", data.token);
    window.location.href = "tasks.html";
}

/* ================= CARREGAR TAREFAS ================= */
async function loadTasks() {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/tasks`, {
        headers: { "Authorization": token }
    });

    const tasks = await res.json();

    const list = document.getElementById("task-list");
    list.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");

        li.innerHTML = `
            <div>
                <strong>${task.title}</strong><br>
                <span>${task.description}</span>
            </div>

            <div style="display:flex; gap:10px;">
                <button class="btn-primary" onclick="editTask(${task.id}, '${task.title}', '${task.description}')">Editar</button>
                <button class="btn-danger" onclick="deleteTask(${task.id})">Excluir</button>
            </div>
        `;

        list.appendChild(li);
    });
}

/* ================= CRIAR TAREFA ================= */
async function createTask(event) {
    event.preventDefault();

    const token = localStorage.getItem("token");
    const title = document.getElementById("task").value;
    const description = document.getElementById("taskDescription").value;

    await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({ title, description })
    });

    document.getElementById("task").value = "";
    document.getElementById("taskDescription").value = "";

    loadTasks();
}

/* ================= EXCLUIR TAREFA ================= */
async function deleteTask(id) {
    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: { "Authorization": token }
    });

    loadTasks();
}

/* ================= EDITAR TAREFA ================= */
let editingTaskId = null;

function editTask(id, title, description) {
    editingTaskId = id;

    document.getElementById("task").value = title;
    document.getElementById("taskDescription").value = description;

    const btn = document.querySelector("form button");
    btn.textContent = "Salvar Alterações";
    btn.classList.remove("btn-success");
    btn.classList.add("btn-primary");

    document.querySelector("form").onsubmit = updateTask;
}

/* ================= SALVAR EDIÇÃO ================= */
async function updateTask(event) {
    event.preventDefault();

    const token = localStorage.getItem("token");
    const title = document.getElementById("task").value;
    const description = document.getElementById("taskDescription").value;

    await fetch(`${API_URL}/tasks/${editingTaskId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({ title, description })
    });

    document.getElementById("task").value = "";
    document.getElementById("taskDescription").value = "";
    editingTaskId = null;

    const btn = document.querySelector("form button");
    btn.textContent = "Adicionar";
    btn.classList.remove("btn-primary");
    btn.classList.add("btn-success");

    document.querySelector("form").onsubmit = createTask;

    loadTasks();
}

/* ================= LOGOUT ================= */
function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}