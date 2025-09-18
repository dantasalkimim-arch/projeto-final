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

function upsertUsuario(u) {
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const i = usuarios.findIndex(x => x.cpf === u.cpf || (u.email && x.email === u.email));
  if (i >= 0) usuarios[i] = u; else usuarios.push(u);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

function salvarSession() {
  const u = getFormData();
  sessionStorage.setItem("usuario", JSON.stringify(u));
  alert("Dados salvos na Session Storage!");
}

function salvarLocal() {
  const u = getFormData();
  localStorage.setItem("usuario", JSON.stringify(u));
  upsertUsuario(u);
  alert("Dados salvos na Local Storage!");
}

function baixarJSON() {
  const u = getFormData();
  const blob = new Blob([JSON.stringify(u, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "usuario.json";
  a.click();
}

function login(event) {
  event.preventDefault();

  const cpfEmail = document.getElementById("cpfEmail").value;
  const senha = document.getElementById("loginSenha").value;

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  const usuarioValido = usuarios.find(u =>
    (u.email === cpfEmail || u.cpf === cpfEmail) && u.senha === senha
  );

  if (usuarioValido) {
    localStorage.setItem("logado", JSON.stringify(usuarioValido));
    window.location.href = "pokemon.html";
  } else {
    alert("CPF/E-mail ou senha incorretos!");
  }
}

function logout() {
  sessionStorage.removeItem("logado");
  sessionStorage.removeItem("usuarioLogado");
  window.location.href = "login.html";
}

function verificarLogin() {
  if (!sessionStorage.getItem("logado")) {
    window.location.href = "login.html";
  }
}

async function carregarPokemons() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000"); 
    const data = await response.json();

    const container = document.getElementById("pokemonList");
    container.innerHTML = "";

    for (const pokemon of data.results) {
      const res = await fetch(pokemon.url);
      const pokeData = await res.json();

      const div = document.createElement("div");
      div.classList.add("pokemon-card");
      div.innerHTML = `
        <img src="${pokeData.sprites.front_default}" alt="${pokeData.name}">
        <h3>${pokeData.name}</h3>
      `;
      container.appendChild(div);
    }
  } catch (error) {
    console.error("Erro ao carregar Pokémons:", error);
  }
}
