import os, subprocess # Pacotes para as chamadas de sistema e execucao da aplicacao
os.chdir('../../midicsv-1.1') # Diretorio do programa
print(os.getcwd())

csv_name = 'countryRoads' # Nome do arquivo csv

outfd = open('OutMidi.mid', 'w+')
errfd = open('ErrMidi.txt', 'w+')

print('Arquivo {}'.format(csv_name))

# Executando o programa
subprocess.call(['csvmidi', '-v', csv_name + '.csv'], stdout = outfd, stderr = errfd)

outfd.close()
errfd.close()