from pymongo import MongoClient
from ..models.viewmodels import Tarefa
from bson import ObjectId
from typing import Union, Optional, Dict, List
from decouple import config
from fastapi import HTTPException, status

class MongoDbRepository:
    def __init__(self):
        self.nivel = [1,3,5,8]
        self.prioridade = [1,2,3]
        self.situacao = ['nova','em andamento','resolvida']
        #uri = 'mongodb://localhost:27017'
        uri = config('MONGO_URL')
        client = MongoClient(uri)
        db = client['tarefasWeb']
        self.tarefas = db['tarefas']

    def criarTarefa(self, tarefa) -> str:
        if tarefa.nivel not in self.nivel:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail='nivel invalido')
        elif tarefa.prioridade not in self.prioridade:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail='prioridade inválida')
        elif tarefa.situacao not in self.situacao:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail='situacao inválida')
        _id = self.tarefas.insert_one(tarefa.toDict()).inserted_id
        tarefa.id = str(_id)
        return {'mensagem': 'Tarefa criada'}
    
    def mostrarTarefas(self) -> List:
        tarefas = self.tarefas.find()
        return list(map(Tarefa.fromDict, tarefas))
    
    def mostrarById(self, id) -> Optional[Union[Tarefa, Dict[str, str]]]:
        if len(id) != 24:
            return {'mensagem': 'erro na quantidade de caracteres'}
        filtro = {"_id": ObjectId(id)}
        tarefa_encontrada = self.tarefas.find_one(filtro)
        if tarefa_encontrada:
            return Tarefa.fromDict(tarefa_encontrada)
        return {"mensagem","tarefa nao encontrada"}
    
    def deletarTarefa(self, id) -> None:
        if len(id) != 24:
            return {'mensagem': 'erro na quantidade de caracteres'}
        filtro = {'_id': ObjectId(id)}
        tarefa_encontrada = self.tarefas.find_one(filtro)
        if tarefa_encontrada:
            self.tarefas.delete_one(tarefa_encontrada)
            return {'mensagem': 'tarefa deletada'}
        return {'mensagem': 'tarefa nao encontrada'}
    
    def atualizarTarefa(self, id, tarefa) -> Optional[Tarefa]:
        filtro = {"_id": ObjectId(id)}
        self.tarefas.update_one(filtro, {'$set': tarefa.toDict()})
        tarefa.id = id
        return tarefa
