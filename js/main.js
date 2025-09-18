function getFormData() {
  return {
    nome: document.getElementById("nome")?.value || "",
    cpf: document.getElementById("cpf")?.value || "",
    email: document.getElementById("email")?.value || "",
    telefone: document.getElementById("telefone")?.value || "",
    endereco: document.getElementById("endereco")?.value || "",
    senha: document.getElementById("senha")?.value || ""
  };
}

function cadastrarUsuario(event) {
  event.preventDefault();
  const u = getFormData();

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const existe = usuarios.find(x => x.email === u.email);

  if (existe) {
    alert("Já existe um usuário com este e-mail!");
    return;
  }

  usuarios.push(u);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  alert("Cadastro realizado com sucesso!");
  window.location.href = "login.html";
}

function login(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const senha = document.getElementById("loginSenha").value;

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  const usuarioValido = usuarios.find(u => u.email === email && u.senha === senha);

  if (usuarioValido) {
    localStorage.setItem("logado", JSON.stringify(usuarioValido));
    window.location.href = "pokemon.html";
  } else {
    alert("E-mail ou senha incorretos!");
  }
}

function logout() {
  localStorage.removeItem("logado");
  window.location.href = "login.html";
}

function verificarLogin() {
  if (!localStorage.getItem("logado")) {
    window.location.href = "login.html";
  }
}

async function carregarPokemons() {
  const lista = document.getElementById("pokemonList");
  lista.innerHTML = "";

  const resposta = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10000");
  const dados = await resposta.json();

  for (let p of dados.results) {
    const r = await fetch(p.url);
    const poke = await r.json();

    const item = document.createElement("div");
    item.innerHTML = `
      <p>${poke.name}</p>
      <img src="${poke.sprites.front_default}" alt="${poke.name}">
    `;
    lista.appendChild(item);
  }
}
