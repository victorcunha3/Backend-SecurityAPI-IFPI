from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status, Body
from ...application.user_service import UsuarioService
from ...infra.cryptograph.hash_provider import HashProvider
from ...infra.cryptograph.token_provider import JWTTokenProvider
from ...repository.auth_mongoDB_repository import AuthMongoDBRepository
from ..auth_utils import obter_usuario_logado
from ..viewmodels import CriarUsuario, LoginData, UsuarioSimples, Tarefa
import datetime
routes = APIRouter()
prefix = '/auth'

print('Auth Controller✅')

auth_repository = AuthMongoDBRepository()
hash_provider = HashProvider()
jwt_provider = JWTTokenProvider()

@routes.post('/signup2', status_code=status.HTTP_201_CREATED, response_model=UsuarioSimples)
def auth_signup2(usuario: CriarUsuario, usuario_service: UsuarioService = Depends(UsuarioService)):
    return usuario_service.criar_usuario(usuario)

@routes.post('/signin')
def auth_signin(login_data: LoginData):
    usuario = auth_repository.obter_usuario_por_usuario(login_data.usuario)

    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Usuário e/ou senha incorreto(s)!')

    if hash_provider.verificar_senha(login_data.senha, usuario.senha):
        token = jwt_provider.sign({'usuario_id': usuario.id})
        return {'access_token': token}
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Usuário e/ou senha incorreto(s)!')


@routes.get('/me', response_model=UsuarioSimples)
async def auth_me(user: UsuarioSimples = Depends(obter_usuario_logado)):
    return user