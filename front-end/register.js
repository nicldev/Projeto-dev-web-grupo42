const API_URL = 'http://localhost:3000/api/users';

// Registrar usuário
document.querySelector('.login__button').addEventListener('click', async function(event) {
    event.preventDefault();

    // Captura os valores dos campos
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Verifica se todos os campos estão preenchidos
    if (!name || !email || !password) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    try {
        // Envia os dados para o backend para registrar o usuário
        const response = await axios.post(`${API_URL}/register`, {
            name,
            email,
            password
        });

        
        alert(response.data.message);

        
        window.location.href = 'index.html'; // Redireciona para a página de login

    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        alert('Erro ao registrar usuário.');
    }
});

// Redireciona para a tela de login ao clicar no botão
document.getElementById('login').addEventListener('click', function() {
    window.location.href = 'index.html';
});
