from .models import Mensagem


def mensagens_nao_lidas(request):
    if not request.user.is_authenticated:
        return {}
    return {
        'nao_lidas': Mensagem.objects.filter(destinatario=request.user, lida=False).count()
    }