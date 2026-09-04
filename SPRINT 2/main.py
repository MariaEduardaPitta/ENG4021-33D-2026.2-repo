def calcula_soma(x, y):
    return x + y

def calcula_subtracao(x, y):
    return x - y

def calcula_multiplicacao(x, y):
    return x * y

def calcula_divisao(x, y):
    if y == 0:
        return "Não é possivel dividir por 0"
    else:
        return x / y

def calcula_divisao_inteira(x, y):
    if y == 0:
        return "Não é possível dividir por zero"
    return x // y

def calcula_resto(x, y):
    if y == 0:
        return "Não é possível dividir por zero"
    return x % y

def calcula_potencia(x, y):
    return x ** y

def calcula_percentual(x, y):
    return (x * y) / 100

def calcula_radiciacao(x, y):
    if x < 0 and y % 2 == 0:
        return 'Raiz inexistente.'
    else:
        raiz = 1 / y
        return x ** raiz


x = float(input("Digite o primeiro número: "))
y = float(input("Digite o segundo número: "))

print("1 - Soma")
print("2 - Subtração")
print("3 - Multiplicação")
print("4 - Divisão")
print("5 - Divisão inteira")
print("6 - Resto")
print("7 - Potência")
print("8 - Percentual")
print("9 - Radiciação")

operacao = int(input("Escolha uma operação de 1 a 9: "))

if operacao == 1:
  resultado = calcula_soma(x, y)
  print(resultado)

elif operacao == 2:
    resultado = calcula_subtracao(x, y)
    print(resultado)

elif operacao == 3:
    resultado = calcula_multiplicacao(x, y)
    print(resultado)

elif operacao == 4:
    resultado = calcula_divisao(x, y)
    print(resultado)

elif operacao == 5:
    resultado = calcula_divisao_inteira(x, y)
    print(resultado)

elif operacao == 6:
    resultado = calcula_resto(x, y)
    print(resultado)

elif operacao == 7:
    resultado = calcula_potencia(x, y)
    print(resultado)

elif operacao == 8:
    resultado = calcula_percentual(x, y)
    print(resultado)

elif operacao == 9:
    resultado = calcula_radiciacao(x, y)
    print(resultado)
