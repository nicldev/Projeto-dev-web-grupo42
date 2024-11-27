async function registerUser(name, email, password) {
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    });
  
    const data = await response.json();
    if (response.ok) {
      console.log('Usuário criado com sucesso:', data.message);
    } else {
      console.error('Erro:', data.message);
    }
  }
  
  // Suponha que você tenha um formulário no HTML
  const registerForm = document.getElementById('registerForm');
  
  registerForm.addEventListener('submit', function(event) {
    event.preventDefault();  // Evita o envio padrão do formulário
  
    // Obtém os dados do formulário
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    // Chama a função para registrar o usuário
    registerUser(name, email, password);
  });
  