"""
URL configuration for repassaproject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from repassaapp.views import *
from repassaapp.views import cadastro_view, login_view, editar_perfil_view


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home),
    path('notificacoes/', notificacoes),
    path('material/<int:id>/', detalhe_material, name='detalhe_material'),
    path('confirmacao/<int:id>/', confirmacao, name='confirmacao'),
    path('compras/<int:compra_id>/avaliar/', avaliar_vendedor, name='avaliar_vendedor'),
    path('cadastro/', cadastro_view, name='cadastro'),
    path('login/', login_view, name='login'),
    path('editar-perfil/', editar_perfil_view, name='editar_perfil'),
]