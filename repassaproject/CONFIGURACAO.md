# Configuração do Repassa

Na pasta de manage.py, com o ambiente virtual ativado, configure o terminal PowerShell para desenvolvimento:

```powershell
$env:DJANGO_SECRET_KEY = python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
$env:DJANGO_DEBUG = "true"
$env:DJANGO_ALLOWED_HOSTS = "localhost,127.0.0.1"
python manage.py migrate
python manage.py runserver
```

O exemplo gera uma chave para a sessão. Em um servidor, guarde uma chave própria e estável nas variáveis do serviço, configure DJANGO_DEBUG=false e informe o domínio em DJANGO_ALLOWED_HOSTS. Separe vários hosts por vírgula. O Django exibe 404.html e 500.html com DEBUG desligado.

Por padrão, os e-mails aparecem no terminal. Para enviar ao comprador pela internet, configure EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend e preencha EMAIL_HOST, EMAIL_PORT, EMAIL_HOST_USER, EMAIL_HOST_PASSWORD e DEFAULT_FROM_EMAIL com os dados do provedor. Para STARTTLS, use EMAIL_USE_TLS=true. Para SSL implícito, use EMAIL_USE_SSL=true. Escolha o modo indicado pelo provedor. Guarde as credenciais nas variáveis do serviço.

Para testar localmente, faça uma compra, escolha Pix, dinheiro ou cartão e confira a forma na confirmação. Como vendedor, avance a mesma entrega de aguardando para em andamento e depois para entregue. Cada mudança produz um e-mail destinado ao comprador.
