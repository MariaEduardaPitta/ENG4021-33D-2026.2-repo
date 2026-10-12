from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator, RegexValidator
from django.db import models


class Faculdade(models.Model):
    nome = models.CharField(max_length=150)
    localizacao = models.CharField(max_length=200)

    def __str__(self):
        return self.nome


class Usuario(AbstractUser):
    # A senha e os métodos de autenticação vêm do AbstractUser.
    nome = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    cpf = models.CharField(max_length=11, unique=True, validators=[
        RegexValidator(r"^\d{11}$", "Informe os 11 números do CPF, sem pontuação.")
    ])
    curso = models.CharField(max_length=100)
    whatsapp = models.CharField(max_length=20)
    nota_media = models.DecimalField(max_digits=3, decimal_places=2, default=0,
                                    validators=[MinValueValidator(0), MaxValueValidator(5)])
    faculdade = models.ForeignKey(Faculdade, on_delete=models.SET_NULL,
                                  null=True, blank=True, related_name="usuarios")
    REQUIRED_FIELDS = ["email", "nome", "cpf"]

    def __str__(self):
        return self.nome


class Categoria(models.Model):
    nome = models.CharField(max_length=100)
    descricao = models.TextField()

    def __str__(self):
        return self.nome


class Material(models.Model):
    titulo = models.CharField(max_length=150)
    descricao = models.TextField()
    preco = models.DecimalField(max_digits=10, decimal_places=2,
                                validators=[MinValueValidator(0)])
    preco_produto_novo = models.DecimalField(max_digits=10, decimal_places=2,
                                            validators=[MinValueValidator(0)])
    estado_conservacao = models.CharField(max_length=50)
    foto = models.FileField(upload_to="materiais/", blank=True)
    curso = models.CharField(max_length=100)
    vendedor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT,
                                 related_name="materiais")
    categoria = models.ForeignKey(Categoria, on_delete=models.PROTECT,
                                 related_name="materiais")
    status = models.CharField(max_length=10, default="disponivel", choices=[
        ("disponivel", "Disponível"), ("vendido", "Vendido")
    ])

    def __str__(self):
        return self.titulo


class Compra(models.Model):
    comprador = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT,
                                  related_name="compras")
    # Um material pode ter no máximo uma compra, conforme a modelagem.
    material = models.OneToOneField(Material, on_delete=models.PROTECT,
                                   related_name="compra")
    data_compra = models.DateTimeField(auto_now_add=True)
    valor_total = models.DecimalField(max_digits=10, decimal_places=2,
                                      validators=[MinValueValidator(0)])
    forma_entrega = models.CharField(max_length=50)
    endereco_local_entrega = models.CharField(max_length=255)
    status_entrega = models.CharField(max_length=50, default="aguardando")

    def __str__(self):
        return f"Compra {self.pk} - {self.material}"


class Pagamento(models.Model):
    compra = models.OneToOneField(Compra, on_delete=models.PROTECT,
                                 related_name="pagamento")
    forma_pagamento = models.CharField(max_length=50)
    valor = models.DecimalField(max_digits=10, decimal_places=2,
                               validators=[MinValueValidator(0)])
    data = models.DateTimeField(auto_now_add=True)
    status_pagamento = models.CharField(max_length=50, default="pendente")

    def __str__(self):
        return f"Pagamento da compra {self.compra_id}"


class Avaliacao(models.Model):
    compra = models.OneToOneField(Compra, on_delete=models.PROTECT,
                                 related_name="avaliacao")
    avaliador = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT,
                                 related_name="avaliacoes_feitas")
    vendedor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT,
                                related_name="avaliacoes_recebidas")
    nota = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)])
    comentario = models.TextField(blank=True)

    def __str__(self):
        return f"Avaliação da compra {self.compra_id}"


class Mensagem(models.Model):
    remetente = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT,
                                 related_name="mensagens_enviadas")
    destinatario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT,
                                    related_name="mensagens_recebidas")
    material = models.ForeignKey(Material, on_delete=models.PROTECT,
                                related_name="mensagens")
    conteudo = models.TextField()
    data_hora = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Mensagem {self.pk}"
