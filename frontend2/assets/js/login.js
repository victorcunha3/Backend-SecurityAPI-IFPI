const form = document.querySelector('form');
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');

function signIn(event) {
    event.preventDefault();
    const API_URL = 'http://127.0.0.1:8000/auth/signin';
    const user = {
        usuario: usernameInput.value,
        senha: passwordInput.value
    };

    fetch(API_URL, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        if (!response.ok) {
        throw new Error('Usuário ou senha inválidos');
        }
        return response.json();
    })
    .then(data => {
        const token = data.access_token;
        localStorage.setItem('access_token', token);
        Swal.fire({
        title: 'Login efetuado com sucesso',
        icon: 'success',
        confirmButtonText: 'OK',
        });
        window.location.replace('http://127.0.0.1:5500/frontend2/')
    })
    .catch(error => {
        console.error(error);
        Swal.fire({
        title: 'Erro',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK',
        });
    });
}

form.addEventListener('submit', signIn);
