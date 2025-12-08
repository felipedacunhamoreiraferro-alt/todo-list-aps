const express = require('express');
const open = require('open');
const path = require('path');

const app = express();
const port = process.env.PORT || 8000;

// Serve arquivos estáticos da pasta atual
app.use(express.static(path.join(__dirname, '.')));

app.listen(port, () => {
  console.log(`Servidor estático rodando em http://localhost:${port}`);

  // Abre as páginas no navegador padrão (index + as 3 páginas)
  setTimeout(() => {
    open(`http://localhost:${port}/index.html`).catch(()=>{});
    open(`http://localhost:${port}/login.html`).catch(()=>{});
    open(`http://localhost:${port}/register.html`).catch(()=>{});
    open(`http://localhost:${port}/tasks.html`).catch(()=>{});
  }, 500);
});
