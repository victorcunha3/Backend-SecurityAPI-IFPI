from fastapi import APIRouter, status, Depends, HTTPException
from ..viewmodels import Tarefa, Usuario, UsuarioSimples, CriarUsuario
from ...repository.mongoDB_repository import MongoDbRepository
from ..auth_utils import obter_usuario_logado


routes = APIRouter()
prefix = '/tarefas'

@routes.post('/', status_code=status.HTTP_201_CREATED)
async def criar_tarefa(tarefa: Tarefa, usuario: UsuarioSimples = Depends(obter_usuario_logado)):
    tarefa.usuario_id = usuario.id
    return MongoDbRepository().criarTarefa(tarefa)

@routes.get('/', status_code=status.HTTP_200_OK)
async def mostrar_tarefas(usuario: UsuarioSimples = Depends(obter_usuario_logado)):
    tarefas = MongoDbRepository().mostrarTarefas()
    tarefas_usuario = []
    if usuario is not None:
        for tarefa in tarefas:
            if tarefa.usuario_id == usuario.id:
                tarefas_usuario.append(tarefa)
    return tarefas_usuario

@routes.get('/{id}', status_code=status.HTTP_200_OK)
async def mostrar_by_id(id: str, usuario: UsuarioSimples = Depends(obter_usuario_logado)):
    if len(id) != 24:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f'ID(24)')
    tarefas = MongoDbRepository().mostrarById(id)
    if not tarefas:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f'Não há Tarefa com id = {tarefas}')

    elif tarefas.usuario_id != usuario.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Tarefa não encontrada!")
    return tarefas

@routes.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
async def deletar_tarefa(id: str | int, usuario: UsuarioSimples = Depends(obter_usuario_logado)):
    if len(id) != 24:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f'ID(24)')
    tarefas = MongoDbRepository().deletarTarefa(id)

@routes.put('/{id}')
async def atualizar_tarefa(id: str, tarefa: Tarefa, usuario: UsuarioSimples = Depends(obter_usuario_logado)):
    if len(id) != 24:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f'ID(24)')
    tarefas = MongoDbRepository().atualizarTarefa(id, tarefa)
    if tarefas.usuario_id != usuario.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Tarefa não encontrada!")
    
    
    
    
    return tarefas
