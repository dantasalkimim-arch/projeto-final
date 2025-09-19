function verificarEmail(event) {
  event.preventDefault();
  const email = document.getElementById("emailEntrada").value;

  let usuarios = JSON.parse(localStorage.getItem("usuarios"));
  if (!usuarios) usuarios = [];

  const existe = usuarios.find(u => u.email === email);

  localStorage.setItem("emailTemp", email);

  if (existe) {
    window.location.href = "login.html";
  } else {
    window.location.href = "cadastro.html";
  }
}

function cadastrarUsuario(event) {
  event.preventDefault();

  const u = {
    nome: document.getElementById("nome").value,
    cpf: document.getElementById("cpf").value,
    telefone: document.getElementById("telefone").value,
    endereco: document.getElementById("endereco").value,
    email: localStorage.getItem("emailTemp"),
    senha: document.getElementById("senha").value
  };

  let usuarios = JSON.parse(localStorage.getItem("usuarios"));
  if (!usuarios) usuarios = [];

  usuarios.push(u);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  alert("Cadastro realizado com sucesso!");
  window.location.href = "login.html";
}

function login(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const senha = document.getElementById("loginSenha").value;

  let usuarios = JSON.parse(localStorage.getItem("usuarios"));
  if (!usuarios) usuarios = [];

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
  window.location.href = "index.html";
}

function verificarLogin() {
  if (!localStorage.getItem("logado")) {
    window.location.href = "index.html";
  }
}

async function carregarPokemons() {
  const lista = document.getElementById("pokemonList");
  lista.innerHTML = "";

  try {
    const resposta = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10000");
    const dados = await resposta.json();

    for (let p of dados.results) {
      const r = await fetch(p.url);
      const poke = await r.json();

      const item = document.createElement("div");
      item.classList.add("pokemon-card");
      item.innerHTML = `
        <p>${poke.name}</p>
        <img src="${poke.sprites.front_default}" alt="${poke.name}">
      `;
      lista.appendChild(item);
    }
  } catch (e) {
    console.error("Erro ao carregar Pokémons", e);
  }
}
