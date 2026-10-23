from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import Faculdade, Usuario, Categoria, Material, Compra, Pagamento, Avaliacao, Mensagem


class CriarUsuarioAdminForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = Usuario
        fields = ('username', 'nome', 'email', 'cpf', 'curso', 'whatsapp', 'faculdade')


class AlterarUsuarioAdminForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = Usuario
        fields = '__all__'


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    add_form = CriarUsuarioAdminForm
    form = AlterarUsuarioAdminForm
    list_display = ('username', 'nome', 'email', 'curso')
    search_fields = ('username', 'nome', 'email')
    fieldsets = UserAdmin.fieldsets + (
        ('Dados do Repassa', {'fields': ('nome', 'cpf', 'curso', 'whatsapp', 'faculdade', 'nota_media')}),
    )
    add_fieldsets = (
        (None, {'fields': ('username', 'nome', 'email', 'cpf', 'curso', 'whatsapp', 'faculdade', 'password1', 'password2')}),
    )


admin.site.register([Faculdade, Categoria, Material, Compra, Pagamento, Avaliacao, Mensagem])
