import sys, json

caminho = sys.stdin.readlines()

caminho = json.loads(caminho[0])

print('Arquivo no Python: {}'.format(caminho))
