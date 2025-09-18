function getDadosFormulario() {
  return {
    nome: document.getElementById("nome")?.value || "",
    cpf: document.getElementById("cpf")?.value || "",
    email: document.getElementById("email")?.value || "",
    telefone: document.getElementById("telefone")?.value || "",
    endereco: document.getElementById("endereco")?.value || "",
    senha: document.getElementById("senha")?.value || ""
  };
}

function salvarSession() {
  const dados = getDadosFormulario();
  sessionStorage.setItem("usuario", JSON.stringify(dados));
  alert("Dados salvos na Session Storage!");
}

function salvarLocal() {
  const dados = getDadosFormulario();
  localStorage.setItem("usuario", JSON.stringify(dados));
  alert("Dados salvos na Local Storage!");
}

function baixarJSON() {
  const dados = getDadosFormulario();
  const blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "dados.json";
  link.click();
}

function fazerLogin() {
  const loginId = document.getElementById("loginId").value;
  const loginSenha = document.getElementById("loginSenha").value;

  const usuario = JSON.parse(localStorage.getItem("usuario")) || 
                  JSON.parse(sessionStorage.getItem("usuario"));

  if (usuario && (usuario.email === loginId || usuario.cpf === loginId) && usuario.senha === loginSenha) {
    alert("Login realizado com sucesso!");
    window.location.href = "pokemon.html"; 
  } else {
    alert("Usuário ou senha inválidos!");
  }
}

let pagina = 1;
const limite = 20;

async function carregarPokemons(p) {
  if (p < 1) return;
  pagina = p;
  const offset = (pagina - 1) * limite;
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limite}`;
  const resp = await fetch(url);
  const data = await resp.json();

  const lista = document.getElementById("pokemonList");
  lista.innerHTML = "";

  for (const poke of data.results) {
    const res = await fetch(poke.url);
    const detalhes = await res.json();

    const card = document.createElement("div");
    card.className = "pokemon-card";
    card.style.backgroundColor = pegarCorPorTipo(detalhes.types[0].type.name);

    card.innerHTML = `
      <h3>${detalhes.name}</h3>
      <img src="${detalhes.sprites.front_default}" alt="${detalhes.name}">
    `;
    lista.appendChild(card);
  }
}

function pegarCorPorTipo(tipo) {
  const cores = {
    grass: "#78C850",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    bug: "#A8B820",
    normal: "#A8A878",
    poison: "#A040A0",
    ground: "#E0C068",
    fairy: "#EE99AC",
    psychic: "#F85888"
  };
  return cores[tipo] || "#ccc";
}

function verificarLogin() {
  const usuario = JSON.parse(localStorage.getItem("usuario")) || 
                  JSON.parse(sessionStorage.getItem("usuario"));

  if (!usuario) {
    alert("Você precisa estar logado para acessar esta página!");
    window.location.href = "login.html";
  }
}

if (document.getElementById("pokemonList")) {
  verificarLogin();
  carregarPokemons(pagina);
}

function logout() {
  sessionStorage.removeItem("usuario");
  localStorage.removeItem("usuario");
  alert("Você saiu do sistema!");
  window.location.href = "login.html";
}
