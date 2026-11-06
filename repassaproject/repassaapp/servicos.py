import json
from urllib.error import URLError
from urllib.request import urlopen


class ViaCepIndisponivel(Exception):
    pass


def consultar_cep(cep):
    try:
        with urlopen(f'https://viacep.com.br/ws/{cep}/json/', timeout=3) as resposta:
            dados = json.load(resposta)
    except (URLError, TimeoutError, ValueError):
        raise ViaCepIndisponivel()

    if dados.get('erro'):
        return None
    return dados