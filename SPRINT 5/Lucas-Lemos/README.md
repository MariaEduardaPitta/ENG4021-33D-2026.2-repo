Integrei os oito models no app repassaapp, usando a base Django da Maria (PR #41). Gerei e apliquei a migração inicial em um banco local. Os quatro testes passaram.

O código está em repassaproject/repassaapp/models.py e a migração em repassaproject/repassaapp/migrations/0001_initial.py.

Na pasta repassaproject, rodar:

```text
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py test repassaapp
```
