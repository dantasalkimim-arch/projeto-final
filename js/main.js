const LS_KEYS = {
  USERS: "usuarios",
  TOKEN: "token",
  USER: "usuarioLogado",
  NEW_EMAIL: "novoEmail",
  LOGIN_HINT: "loginHintEmail",
};

const normalizeEmail = (e) => (e || "").trim().toLowerCase();
const norm = (s) => (s || "").trim();

const getUsers = () => JSON.parse(localStorage.getItem(LS_KEYS.USERS)) || [];
const setUsers = (list) => localStorage.setItem(LS_KEYS.USERS, JSON.stringify(list));

function verificarEmail() {
  const rawEmail = document.getElementById("email")?.value;
  const email = normalizeEmail(rawEmail);

  if (!/\S+@\S+\.\S+/.test(email)) {
    alert("Digite um e-mail válido.");
    return;
  }

  const users = getUsers();
  const existe = users.find((u) => normalizeEmail(u.email) === email);

  if (existe) {
    localStorage.setItem(LS_KEYS.LOGIN_HINT, email);
    window.location.href = "login.html";
  } else {
    localStorage.setItem(LS_KEYS.NEW_EMAIL, email);
    window.location.href = "cadastro.html";
  }
}

function cadastrarUsuario() {
  const emailFromLS = localStorage.getItem(LS_KEYS.NEW_EMAIL);
  const email = normalizeEmail(emailFromLS || document.getElementById("email")?.value);

  const nome = norm(document.getElementById("nome")?.value);
  const telefone = norm(document.getElementById("telefone")?.value);
  const endereco = norm(document.getElementById("endereco")?.value);
  const cpf = norm(document.getElementById("cpf")?.value);
  const senha = norm(document.getElementById("senha")?.value);

  if (!/\S+@\S+\.\S+/.test(email)) return alert("E-mail inválido.");
  if (nome.length < 3) return alert("O nome deve ter pelo menos 3 caracteres.");
  if (senha.length < 8) return alert("A senha deve ter pelo menos 8 caracteres.");

  const users = getUsers();
  const duplicado = users.some((u) => normalizeEmail(u.email) === email);
  if (duplicado) {
    alert("Este e-mail já está cadastrado. Faça login.");
    localStorage.setItem(LS_KEYS.LOGIN_HINT, email);
    window.location.href = "login.html";
    return;
  }

  users.push({ email, nome, telefone, endereco, cpf, senha });
  setUsers(users);

  localStorage.removeItem(LS_KEYS.NEW_EMAIL);
  alert("Usuário cadastrado com sucesso!");
  window.location.href = "login.html";
}

function loginUsuario() {
  const email = normalizeEmail(document.getElementById("loginEmail")?.value);
  const senha = norm(document.getElementById("loginSenha")?.value);

  const users = getUsers();
  const usuario = users.find(
    (u) => normalizeEmail(u.email) === email && norm(u.senha) === senha
  );

  if (!usuario) {
    alert("E-mail ou senha inválidos.");
    return;
  }

  const token = "token_" + Date.now();
  localStorage.setItem(LS_KEYS.TOKEN, token);
  localStorage.setItem(LS_KEYS.USER, JSON.stringify(usuario));
  window.location.href = "perfil.html";
}

function carregarPerfil() {
  const usuario = JSON.parse(localStorage.getItem(LS_KEYS.USER));
  if (!usuario) {
    window.location.href = "index.html";
    return;
  }

  const div = document.getElementById("dadosUsuario");
  if (div) {
    div.innerHTML = `
      <p><strong>Nome:</strong> ${usuario.nome}</p>
      <p><strong>Email:</strong> ${usuario.email}</p>
      <p><strong>Telefone:</strong> ${usuario.telefone}</p>
      <p><strong>Endereço:</strong> ${usuario.endereco}</p>
      <p><strong>CPF:</strong> ${usuario.cpf}</p>
    `;
  }
}

function logout() {
  localStorage.removeItem(LS_KEYS.TOKEN);
  localStorage.removeItem(LS_KEYS.USER);
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("cadastro.html")) {
    const emailEl = document.getElementById("email");
    const saved = localStorage.getItem(LS_KEYS.NEW_EMAIL);
    if (emailEl && saved) {
      emailEl.value = saved;
      emailEl.readOnly = true;
    }
  }

  if (window.location.pathname.includes("login.html")) {
    const loginEmail = document.getElementById("loginEmail");
    const hint = localStorage.getItem(LS_KEYS.LOGIN_HINT);
    if (loginEmail && hint) loginEmail.value = hint;
  }
});
