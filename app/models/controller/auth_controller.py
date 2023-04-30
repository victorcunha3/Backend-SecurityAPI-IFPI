from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status, Body
from ...application.user_service import UsuarioService
from ...infra.cryptograph.hash_provider import HashProvider
from ...infra.cryptograph.token_provider import JWTTokenProvider
from ...repository.auth_mongoDB_repository import AuthMongoDBRepository
from ..auth_utils import obter_usuario_logado
from ..viewmodels import CriarUsuario, LoginData, UsuarioSimples, Tarefa
routes = APIRouter()
prefix = '/auth'

print('Auth Controller✅')

auth_repository = AuthMongoDBRepository()
hash_provider = HashProvider()
jwt_provider = JWTTokenProvider()

@routes.post('/signup', status_code=status.HTTP_201_CREATED, response_model=UsuarioSimples)
def auth_signup(usuario: CriarUsuario, usuario_service: UsuarioService = Depends(UsuarioService)):
    return usuario_service.criar_usuario(usuario)

@routes.post('/signin', status_code=status.HTTP_200_OK)
def auth_signin(login_data: LoginData, usuario_service: UsuarioService = Depends(UsuarioService)):
    return usuario_service.logar_usuario(login_data)


@routes.get('/me', response_model=UsuarioSimples)
async def auth_me(user: UsuarioSimples = Depends(obter_usuario_logado)):
    return user