from django.core.exceptions import ValidationError
from django.db import IntegrityError, transaction
from django.db.models.deletion import ProtectedError
from django.test import TestCase
from .models import Faculdade, Usuario, Categoria, Material, Compra, Pagamento, Avaliacao, Mensagem


class ModelsTest(TestCase):
    def setUp(self):
        self.faculdade = Faculdade.objects.create(nome="Teste", localizacao="Rio")
        self.vendedor = Usuario.objects.create_user(
            username="vendedor", password="senha-teste", nome="Vendedor",
            email="vendedor@example.com", cpf="11111111111", curso="Engenharia",
            whatsapp="21999999999", faculdade=self.faculdade,
        )
        self.comprador = Usuario.objects.create_user(
            username="comprador", password="senha-teste", nome="Comprador",
            email="comprador@example.com", cpf="22222222222", curso="Engenharia",
            whatsapp="21888888888",
        )
        categoria = Categoria.objects.create(nome="Livros", descricao="Livros usados")
        self.material = Material.objects.create(
            titulo="Livro", descricao="Cálculo", preco="50.00", preco_produto_novo="100.00",
            estado_conservacao="Bom", curso="Engenharia", vendedor=self.vendedor, categoria=categoria,
        )
        self.compra = Compra.objects.create(
            comprador=self.comprador, material=self.material, valor_total="50.00",
            forma_entrega="Retirada", endereco_local_entrega="Campus",
        )

    def test_relacoes_e_senha(self):
        pagamento = Pagamento.objects.create(compra=self.compra, forma_pagamento="Pix", valor="50.00")
        avaliacao = Avaliacao.objects.create(
            compra=self.compra, avaliador=self.comprador, vendedor=self.vendedor, nota=5,
        )
        mensagem = Mensagem.objects.create(
            remetente=self.comprador, destinatario=self.vendedor, material=self.material, conteudo="Olá",
        )
        self.assertEqual(self.material.compra, self.compra)
        self.assertEqual(self.compra.pagamento, pagamento)
        self.assertEqual(self.compra.avaliacao, avaliacao)
        self.assertEqual(self.vendedor.mensagens_recebidas.get(), mensagem)
        self.assertEqual(self.faculdade.usuarios.get(), self.vendedor)
        self.assertIsNone(self.comprador.faculdade)
        self.assertTrue(self.comprador.check_password("senha-teste"))
        self.assertNotEqual(self.comprador.password, "senha-teste")

    def test_material_tem_uma_compra(self):
        with self.assertRaises(IntegrityError), transaction.atomic():
            Compra.objects.create(
                comprador=self.comprador, material=self.material, valor_total="50.00",
                forma_entrega="Retirada", endereco_local_entrega="Campus",
            )

    def test_validacao(self):
        self.material.preco = -1
        with self.assertRaises(ValidationError):
            self.material.full_clean()
        self.comprador.cpf = "abc"
        with self.assertRaises(ValidationError):
            self.comprador.full_clean()
        avaliacao = Avaliacao(compra=self.compra, avaliador=self.comprador, vendedor=self.vendedor, nota=6)
        with self.assertRaises(ValidationError):
            avaliacao.full_clean()

    def test_exclusao(self):
        with self.assertRaises(ProtectedError):
            self.vendedor.delete()
        self.faculdade.delete()
        self.vendedor.refresh_from_db()
        self.assertIsNone(self.vendedor.faculdade)
