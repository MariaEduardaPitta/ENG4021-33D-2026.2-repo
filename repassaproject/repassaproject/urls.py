
from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from repassaapp.views import (
    home,
    notificacoes,
    detalhe_material,
    confirmacao,
    avaliar_vendedor,
    cadastro_view,
    login_view,
    logout_view,
    editar_perfil_view,
    anunciar_material,
    editar_material,
    buscar,
    conversas,
    chat,
    avaliacoes_vendedor,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home, name='home'),
    path('notificacoes/', notificacoes),
    path('material/<int:id>/', detalhe_material, name='detalhe_material'),
    path('confirmacao/<int:id>/', confirmacao, name='confirmacao'),
    path('comprar/<int:material_id>/', comprar_material, name='comprar_material'),
    path('compras/<int:compra_id>/avaliar/', avaliar_vendedor, name='avaliar_vendedor'),
    path('vendedores/<int:id>/avaliacoes/', avaliacoes_vendedor, name='avaliacoes_vendedor'),
    path('cadastro/', cadastro_view, name='cadastro'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('editar-perfil/', editar_perfil_view, name='editar_perfil'),
    path('anunciar/', anunciar_material, name='anunciar_material'),
    path('editar-material/<int:material_id>/', editar_material, name='editar_material'),
    path('buscar/', buscar, name='buscar'),
    path('conversas/', conversas, name='conversas'),
    path('chat/<int:material_id>/<int:usuario_id>/', chat, name='chat'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

from django.contrib.auth import views as auth_views

urlpatterns += [
    path(
        'recuperar-senha/',
        auth_views.PasswordResetView.as_view(
            template_name='recuperar_senha.html',
            email_template_name='emails/recuperar_senha_email.html',
            subject_template_name='emails/recuperar_senha_assunto.txt',
            success_url='/recuperar-senha/enviado/'
        ),
        name='password_reset'
    ),
    path(
        'recuperar-senha/enviado/',
        auth_views.PasswordResetDoneView.as_view(
            template_name='recuperar_senha_enviado.html'
        ),
        name='password_reset_done'
    ),
    path(
        'reset/<uidb64>/<token>/',
        auth_views.PasswordResetConfirmView.as_view(
            template_name='nova_senha.html',
            success_url='/reset/concluido/'
        ),
        name='password_reset_confirm'
    ),
    path(
        'reset/concluido/',
        auth_views.PasswordResetCompleteView.as_view(
            template_name='nova_senha_concluido.html'
        ),
        name='password_reset_complete'
    ),
]
