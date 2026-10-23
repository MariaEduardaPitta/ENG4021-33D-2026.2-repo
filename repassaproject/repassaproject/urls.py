
from django.contrib import admin
from django.urls import path
from repassaapp.views import (
    home,
    notificacoes,
    detalhe_material,
    confirmacao,
    avaliar_vendedor,
    cadastro_view,
    login_view,
    editar_perfil_view,
    anunciar_material,
    editar_material,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home, name='home'),
    path('notificacoes/', notificacoes),
    path('material/<int:id>/', detalhe_material, name='detalhe_material'),
    path('confirmacao/<int:id>/', confirmacao, name='confirmacao'),
    path('compras/<int:compra_id>/avaliar/', avaliar_vendedor, name='avaliar_vendedor'),
    path('cadastro/', cadastro_view, name='cadastro'),
    path('login/', login_view, name='login'),
    path('editar-perfil/', editar_perfil_view, name='editar_perfil'),
    path('anunciar/', anunciar_material, name='anunciar_material'),
    path('editar-material/<int:material_id>/', editar_material, name='editar_material'),
]
