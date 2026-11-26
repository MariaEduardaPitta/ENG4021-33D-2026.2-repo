from unittest.mock import patch

from django.test import TestCase

from .forms import CompraForm
from .servicos import ViaCepIndisponivel

ENDERECO_VIACEP = {'cep': '22451-900', 'localidade': 'Rio de Janeiro', 'uf': 'RJ'}


def dados_compra(**mudancas):
    dados = {
        'forma_pagamento': 'Pix', 'forma_entrega': 'entrega', 'cep': '22451-900', 'logradouro': 'Rua Marquês de São Vicente',
        'numero': '225', 'bairro': 'Gávea', 'cidade': 'Rio de Janeiro', 'uf': 'RJ',
    }
    dados.update(mudancas)
    return dados


class ViaCepTests(TestCase):
    @patch('repassaapp.forms.consultar_cep', return_value=ENDERECO_VIACEP)
    def test_cep_valido_e_aceito(self, mock):
        form = CompraForm(dados_compra())
        self.assertTrue(form.is_valid())
        self.assertEqual(form.cleaned_data['cep'], '22451900')

    @patch('repassaapp.forms.consultar_cep', return_value=None)
    def test_cep_inexistente_e_recusado(self, mock):
        form = CompraForm(dados_compra(cep='00000000'))
        self.assertFalse(form.is_valid())
        self.assertIn('cep', form.errors)

    @patch('repassaapp.forms.consultar_cep', return_value=ENDERECO_VIACEP)
    def test_cidade_diferente_do_cep_e_recusada(self, mock):
        form = CompraForm(dados_compra(cidade='Niterói'))
        self.assertFalse(form.is_valid())
        self.assertIn('cidade', form.errors)

    @patch('repassaapp.forms.consultar_cep', side_effect=ViaCepIndisponivel)
    def test_api_fora_do_ar_nao_bloqueia_compra(self, mock):
        self.assertTrue(CompraForm(dados_compra()).is_valid())

    @patch('repassaapp.forms.consultar_cep')
    def test_retirada_nao_consulta_api(self, mock):
        self.assertTrue(CompraForm({'forma_pagamento': 'Pix', 'forma_entrega': 'retirada'}).is_valid())
        mock.assert_not_called()
        