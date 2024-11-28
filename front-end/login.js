document.getElementById('login-in').addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede o comportamento padrão do formulário

    const email = document.getElementById('loginEmail').value; // Captura o email
    const password = document.getElementById('loginPassword').value; // Captura a senha

    // Verifica se os campos estão preenchidos
    if (!email || !password) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    try {
        // Faz a requisição POST para verificar as credenciais
        const response = await axios.post('http://localhost:3000/api/users/login', {
            email, // Envia o email
            password
        });

        if (response.data && response.data.token) {
            // Se as credenciais forem válidas, armazena o token e redireciona
            localStorage.setItem('authToken', response.data.token);
            window.location.href = 'admin.html';
        } else {
            alert('Credenciais inválidas. Tente novamente.');
        }

        console.log(response);  // Verifica o que está sendo retornado

        // Se as credenciais forem válidas, armazena o token e redireciona
        localStorage.setItem('authToken', response.data.token);
        window.location.href = 'admin.html';

    } catch (error) {
        console.error('Erro no login:', error);
        alert('Credenciais inválidas. Tente novamente.');
    }
});
