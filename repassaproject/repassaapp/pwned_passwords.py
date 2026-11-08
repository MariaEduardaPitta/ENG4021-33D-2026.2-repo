import hashlib
import re
from urllib.error import URLError
from urllib.request import Request, urlopen


class ConsultaSenhaIndisponivel(Exception):
    pass


def consultar_senha_vazada(senha):
    digest = hashlib.sha1(senha.encode('utf-8')).hexdigest().upper()
    prefixo, sufixo = digest[:5], digest[5:]
    requisicao = Request(
        'https://api.pwnedpasswords.com/range/' + prefixo,
        headers={'Add-Padding': 'true', 'User-Agent': 'Repassa-Sprint9'},
    )
    try:
        with urlopen(requisicao, timeout=4) as resposta:
            if resposta.status != 200:
                raise ConsultaSenhaIndisponivel()
            texto = resposta.read(1024 * 1024).decode('utf-8')
    except (URLError, OSError, UnicodeError) as erro:
        raise ConsultaSenhaIndisponivel() from erro

    linhas = texto.splitlines()
    if not linhas:
        raise ConsultaSenhaIndisponivel()
    ocorrencias = 0
    for linha in linhas:
        if not re.fullmatch(r'[0-9A-Fa-f]{35}:[0-9]+', linha):
            raise ConsultaSenhaIndisponivel()
        resto, quantidade = linha.split(':')
        if resto.upper() == sufixo:
            ocorrencias = int(quantidade)
    return ocorrencias
