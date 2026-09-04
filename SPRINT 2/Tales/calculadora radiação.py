def radiacao(x,y):
    if x<0 and y%2==0:
        return 'Raiz inexistente.'
    else:
        raiz = 1/y
        return x**raiz
