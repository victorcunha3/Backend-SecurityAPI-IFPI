API Tarefas

ENDPOINTS:
.TAREFAS
    -GET /tarefas
    -GET /tarefas/{id}
    -POST /tarefas
    -DELETE /tarefas/{id}
    -PUT /tarefas/{id}
    .ATRIBUTOS:
        -id
        -descricao
        -responsavel
        -nivel
        -situacao
        -prioridade
        -usuario_id

.USUARIOS:
    -GET /auth/me
    -POST /auth/signin
    -POST /auth/signup
    .ATRIBUTOS:
        -id
        -nome
        -usuario
        -email
        -senha
