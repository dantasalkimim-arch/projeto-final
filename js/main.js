// Verifica se o email já existe
function verificarEmail() {
  const email = document.getElementById("email").value;
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  const usuarioExiste = usuarios.find(u => u.email === email);

  if (usuarioExiste) {
    // Redireciona para login
    window.location.href = "login.html";
  } else {
    // Redireciona para cadastro
    localStorage.setItem("novoEmail", email); // salva email para usar no cadastro
    window.location.href = "cadastro.html";
  }
}

// Evento de cadastro
const formCadastro = document.getElementById("formCadastro");
if (formCadastro) {
  const emailSalvo = localStorage.getItem("novoEmail");
  if (emailSalvo) document.getElementById("cadastroEmail").value = emailSalvo;

  formCadastro.addEventListener("submit", (e) => {
    e.preventDefault();
    const usuario = {
      email: document.getElementById("cadastroEmail").value,
      nome: document.getElementById("nome").value,
      telefone: document.getElementById("telefone").value,
      endereco: document.getElementById("endereco").value,
      cpf: document.getElementById("cpf").value,
      senha: document.getElementById("senha").value
    };

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    usuarios.push(usuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Cadastro realizado com sucesso!");
    window.location.href = "login.html";
  });
}

// Evento de login
const formLogin = document.getElementById("formLogin");
if (formLogin) {
  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const senha = document.getElementById("loginSenha").value;

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuario = usuarios.find(u => u.email === email && u.senha === senha);

    if (usuario) {
      localStorage.setItem("token", "abc123"); // token fake
      localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
      window.location.href = "perfil.html";
    } else {
      alert("Email ou senha inválidos!");
    }
  });
}

// Perfil do usuário
if (window.location.pathname.includes("perfil.html")) {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuario) {
    window.location.href = "index.html";
  } else {
    document.getElementById("dadosUsuario").innerHTML = `
      <p><strong>Nome:</strong> ${usuario.nome}</p>
      <p><strong>Email:</strong> ${usuario.email}</p>
      <p><strong>Telefone:</strong> ${usuario.telefone}</p>
      <p><strong>Endereço:</strong> ${usuario.endereco}</p>
      <p><strong>CPF:</strong> ${usuario.cpf}</p>
    `;
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuarioLogado");
  window.location.href = "index.html";
}
