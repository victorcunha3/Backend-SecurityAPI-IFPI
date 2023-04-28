const form = document.querySelector('form');
const nameInput = document.querySelector('#name');
const usernameInput = document.querySelector('#username');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const passwordConfirmInput = document.querySelector('#password-confirm');

function signUp(event) {
    event.preventDefault();

    if (passwordInput.value !== passwordConfirmInput.value) {
        Swal.fire({
            title: 'Erro',
            text: 'As senhas não correspondem',
            icon: 'error',
            confirmButtonText: 'OK',
        });
        return;
    }

    const API_URL = 'http://127.0.0.1:8000/auth/signup2';
    const user = {
        nome: nameInput.value,
        usuario: usernameInput.value,
        email: emailInput.value,
        senha: passwordInput.value,
    };

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Erro ao criar usuário');
            }
            return response.json();
        })
        .then((data) => {
            const token = data.access_token;
            localStorage.setItem('access_token', token);
            Swal.fire({
                title: 'Conta criada com sucesso',
                icon: 'success',
                confirmButtonText: 'OK',
            });
            window.location.replace('http://127.0.0.1:5500/frontend2/');
        })
        .catch((error) => {
            console.error(error);
            Swal.fire({
                title: 'Erro',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK',
            });
        });
}

form.addEventListener('submit', signUp);
