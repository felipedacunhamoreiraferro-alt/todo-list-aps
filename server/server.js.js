const express = require("express");
const cors = require("cors");
const app = express();
console.log("Arquivo server.js foi iniciado");

app.use(cors());
app.use(express.json());

let users = [];
let tasks = [];
let currentId = 1;

/* ================= LOGIN ================= */
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(400).json({ detail: "Credenciais inválidas" });
    }

    return res.json({ token: email });
});

/* ================= REGISTRO ================= */
app.post("/signup", (req, res) => {
    const { email, password } = req.body;

    if (users.find(u => u.email === email)) {
        return res.status(400).json({ detail: "Usuário já existe" });
    }

    users.push({ email, password });

    return res.json({ token: email });
});

/* ================= MIDDLEWARE ================= */
function auth(req, res, next) {
    const token = req.headers.authorization;

    if (!token || !users.find(u => u.email === token)) {
        return res.status(401).json({ detail: "Não autorizado" });
    }

    req.user = token;
    next();
}

/* ================= TAREFAS ================= */
app.get("/tasks", auth, (req, res) => {
    const userTasks = tasks.filter(t => t.owner === req.user);
    res.json(userTasks);
});

app.post("/tasks", auth, (req, res) => {
    const { title, description } = req.body;

    const task = {
        id: currentId++,
        title,
        description,
        owner: req.user
    };

    tasks.push(task);
    res.json(task);
});

/* ✅ PUT NO LUGAR CERTO */
app.put("/tasks/:id", auth, (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    const task = tasks.find(t => t.id == id && t.owner === req.user);

    if (!task) return res.status(404).json({ detail: "Tarefa não encontrada" });

    task.title = title;
    task.description = description;

    res.json(task);
});

app.delete("/tasks/:id", auth, (req, res) => {
    const { id } = req.params;

    tasks = tasks.filter(t => !(t.id == id && t.owner === req.user));

    res.json({ detail: "Tarefa removida" });
});

/* ================= INICIAR SERVIDOR ================= */
app.listen(8000, () => console.log("Servidor rodando na porta 8000"));