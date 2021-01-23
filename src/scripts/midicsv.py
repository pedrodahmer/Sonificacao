import os, subprocess # Pacotes para as chamadas de sistema e execucao da aplicacao
os.chdir('../../midicsv-1.1') # Diretorio do programa
print(os.getcwd())
 
midi_name = 'countryRoads' # Nome do arquivo midi
 
outfd = open('OutTeste.csv', 'w+')
errfd = open('ErrTeste.txt', 'w+')
 
print('Arquivo {}'.format(midi_name))
 
# Executando o programa
subprocess.call(['midicsv', '-v', midi_name + '.mid'], stdout = outfd, stderr = errfd)
 
outfd.close()
errfd.close()