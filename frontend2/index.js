const API_URL = 'http://127.0.0.1:8000/tarefas'

async function obterTarefas() {
  const response = await fetch(API_URL);
  const data = await response.json();
  return data;
}

async function criarTarefa() {
  const descricao = document.getElementById('descricao').value;
  const responsavel = document.getElementById('responsavel').value;
  const nivel = document.getElementById('nivel').value;
  const situacao = document.getElementById('situacao').value;
  const prioridade = document.getElementById('prioridade').value;

  const novaTarefa = {
    descricao: descricao,
    responsavel: responsavel,
    nivel: parseInt(nivel),
    situacao: situacao,
    prioridade: parseInt(prioridade)
  };

  const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(novaTarefa)
  });
  if (response.status === 201) {
      document.getElementById('descricao').value = '';
      document.getElementById('responsavel').value = '';
      mostrarTarefas()
      console.log("Tarefa criada com sucesso")
  }else{
      console.log("!!ERRO!!")
  }
}

async function mostrarTarefas() {
  const tarefas = await obterTarefas();
      
  const tabela = document.getElementById('tabela-tarefas');
  tabela.innerHTML = '';
  //Juntando o cabeçalho com o conteudo
  const cabecalho = `
  <thead>
    <tr>
      <th>Id</th>
      <th>Descrição</th>
      <th>Responsável</th>
      <th>Nível</th>
      <th>Situação</th>
      <th>Prioridade</th>
    </tr>
  </thead>
  `;
  tabela.innerHTML += cabecalho;
  for (let tarefa_atual of tarefas) {
    const row = tabela.insertRow();
    row.insertCell().innerText = tarefa_atual.id;
    row.insertCell().innerText = tarefa_atual.descricao;
    row.insertCell().innerText = tarefa_atual.responsavel;
    row.insertCell().innerText = tarefa_atual.nivel;
    row.insertCell().innerText = tarefa_atual.situacao;
    row.insertCell().innerText = tarefa_atual.prioridade;


    // Criando um botão de apagar para cada tarefa
    const botaoDeletar = document.createElement('button');
    botaoDeletar.innerText = 'Excluir';
    botaoDeletar.classList.add('botao-js');//adicionando essa classe para estilizar o botao das linhas
    botaoDeletar.addEventListener('click', () => {
      apagarTarefa(tarefa_atual.id);
    });
    row.insertCell().appendChild(botaoDeletar);


    const botaoAtualizar = document.createElement('button');
    botaoAtualizar.innerText = 'Atualizar';
    botaoAtualizar.classList.add('botao-js');//adicionando essa classe para estilizar o botao das linhas
    botaoAtualizar.addEventListener('click',()=>{
      atualizarTarefas(tarefa_atual.id)
    })
    row.insertCell().appendChild(botaoAtualizar);

  }
}
async function apagarTarefa(id) {
    const response = await fetch(`${API_URL}${id} `,{
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (response.status === 204){
        console.log("Tarefa apagada com sucesso")
    }else{
        console.log("Erro ao apagar")
    }
    mostrarTarefas();
}

async function atualizarTarefas(id) {
  const tarefa = await obterTarefa(id);

  const form = document.createElement("form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const novaTarefa = Object.fromEntries(formData.entries());
    const response = await atualizarTarefa(id, novaTarefa);
    if (response.status === 200) {
      console.log("Tarefa atualizada com sucesso");
      mostrarTarefas();
    } else {
      console.log("Erro ao atualizar tarefa");
    }

    form.remove();
  });


  for (const [campo, valor] of Object.entries(tarefa)) {
    if (campo === "id") {
      continue;
    }
    const label = document.createElement("label");
    label.innerText = campo;
    label.classList.add("form__label");//classe para o css
    const input = document.createElement("input");
    input.setAttribute("name", campo);
    input.setAttribute("value", valor);
    input.classList.add("form__input"); 
    form.appendChild(label);
    form.appendChild(input);
  }


  const ConfirmarUpdate = document.createElement("button");
  ConfirmarUpdate.innerText = "Confirmar";
  ConfirmarUpdate.classList.add("form__submit");//classe para o css
  form.appendChild(ConfirmarUpdate);

  // exibindo o formulário na tela
  const container = document.getElementById("formulario");
  container.innerHTML = "";
  container.appendChild(form);
}

async function obterTarefa(id) {
  const response = await fetch(`${API_URL}${id}`);
  const data = await response.json();
  return data;
}

async function atualizarTarefa(id, tarefa) {
  const response = await fetch(`${API_URL}${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tarefa),
  });
  return response;
}



const form = document.querySelector('form');
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');

function signIn() {
  form.addEventListener('submit', async formEvent => {
    formEvent.preventDefault();
    const usernameValue = usernameInput.value.trim();
    const passwordValue = passwordInput.value.trim();
    const API_URL2 = 'http://127.0.0.1:8000/auth/signin'

    try {
      const response = await fetch(`${API_URL2}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario: usernameValue,
          senha: passwordValue,
        }),
      });
      console.log(response.body)
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail);
      }

      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      Swal.fire({
        title: 'Login efetuado com sucesso',
        icon: 'success',
        confirmButtonText: 'OK',
      });
      mostrarTarefas();
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Senha/Login incorretos',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  });
}

