# -*- coding: utf-8 -*-

import sys, json, csv, os, subprocess, pathlib
from shutil import copy

sys.stdout.reconfigure(encoding='utf-8')

def call_csvmidi(filesPath):
	os.chdir('././midicsv-1.1') # Diretorio do programa

	outfd = open('{}.mid'.format(filesPath), 'w+') # Grava o output em arquivo
	errfd = open('errMidi.txt', 'w+') # Grava o log de erros

	# Executando o programa
	subprocess.call(['csvmidi', '-v', '{}.csv'.format(filesPath)], stdout = outfd, stderr = errfd)

	# Fechando os arquivos
	outfd.close()
	errfd.close()


def write_in_csv_file(list_height, list_intensity, list_duration, filesPath):

	with open('{}.csv'.format(filesPath), 'a', newline='') as csv_template:
		writer = csv.writer(csv_template, delimiter=',')

		i = 0
		previous_duration = 0

		while i != len(list_height):

			if list_intensity[i] == 80: # Caso de intensidade constante
				intensity = list_intensity[i]

			if list_intensity[i] < 60:
				intensity = 40
			else:
				intensity = 80

			if list_duration[i] == 499: # Caso de duracao constante
				duration = list_duration[i]

			if 36 <= list_duration[i] <= 48:
				duration = 249
			elif 48 < list_duration[i] <= 60:
				duration = 499
			elif 60 < list_duration[i] <= 72:
				duration = 999
			elif 72 < list_duration[i] <= 84:
				duration = 1999

			if i == 0:
				writer.writerow([2, 0, 'Note_on_c', 0, list_height[i], intensity])
				writer.writerow([2, duration, 'Note_off_c', 0, list_height[i], 0])
				previous_duration = duration + 1
			else:
				writer.writerow([2, previous_duration, 'Note_on_c', 0, list_height[i], intensity])
				writer.writerow([2, previous_duration + duration, 'Note_off_c', 0, list_height[i], 0])

				previous_duration = previous_duration + duration + 1

			i += 1

		writer.writerow([2, previous_duration, 'End_track'])
		writer.writerow([0, 0, 'End_of_file'])


def get_column_of_csv(filename, column):
	with open(filename) as csv_file:
		reader = csv.DictReader(csv_file)
		try:
			for row in reader:
				yield int(float(row[column]))
		except:
			print('Alguma coluna não foi reconhecida! Verifique se elas estão escritas corretamente e tente outra vez!')
			exit()


def transform_data(filename, column):
	list_data = []

	for item in get_column_of_csv(filename, column):
		list_data.append(item)

	original_max = max(list_data)
	original_min = min(list_data)

	new_max = 84
	new_min = 36

	transform_list_data = map(lambda x: ((x - original_min) / (original_max - original_min))
								* (new_max - new_min) + new_min, list_data)

	new_list_data = list(transform_list_data)

	new_list_data = [int(i) for i in new_list_data]

	return new_list_data


def edit_header_template(filesPath, output_filename):
	copy('././midicsv-1.1/header_template.csv', '{}.csv'.format(filesPath))

	file = open('{}.csv'.format(filesPath))
	lines = file.readlines()
	file.close()

	new_line = lines[2].replace('FIREBALLS', output_filename)
	
	with open('{}.csv'.format(filesPath), 'w') as file:
		for i, line in enumerate(lines):
			if i == 2:
				file.writelines(new_line)
			else:
				file.writelines(line)


def fill_const_height(list_height, length):
	for value in range(length):
		list_height.append(60)
	return list_height

def fill_const_intensity(list_intensity, length):
	for value in range(length):
		list_intensity.append(80)
	return list_intensity

def fill_const_duration(list_duration, length):
	for value in range(length):
		list_duration.append(499)
	return list_duration


# Lendo o JSON vindo da aplicacao electron
fields = sys.stdin.readlines()
fields = json.loads(fields[0])

list_height = [] # Lista para a altura
list_intensity = [] # Lista para a intensidade
list_duration = [] # Lista para a duracao

path = fields['caminho'] # Caminho do conjunto de dados csv

length = 0 # Variavel para guardar o tamanho das listas, caso alguma esteja vazia
	
# Verificando os campos escolhidos e transformando os dados ou preenchendo com valor constante
if fields['altura'] != '' and fields['intensidade'] != '' and fields['duracao'] != '':
	list_height = transform_data(path, fields['altura'])
	list_intensity = transform_data(path, fields['intensidade'])
	list_duration = transform_data(path, fields['duracao'])
elif fields['altura'] != '' and fields['intensidade'] != '':
	list_height = transform_data(path, fields['altura'])
	list_intensity = transform_data(path, fields['intensidade'])
	length = len(list_height)
	list_duration = fill_const_duration(list_duration, length) 
elif fields['altura'] != '' and fields['duracao'] != '':
	list_height = transform_data(path, fields['altura'])
	length = len(list_height)
	list_intensity = fill_const_intensity(list_intensity, length)
	list_duration = transform_data(path, fields['duracao'])
elif fields['intensidade'] != '' and fields['duracao'] != '':
	list_intensity = transform_data(path, fields['intensidade'])
	list_duration = transform_data(path, fields['duracao'])
	length = len(list_intensity)
	list_height = fill_const_height(list_height, length)
elif fields['altura'] != '':
	list_height = transform_data(path, fields['altura'])
	length = len(list_height)
	list_intensity = fill_const_intensity(list_intensity, length)
	list_duration = fill_const_duration(list_duration, length)
elif fields['intensidade'] != '':
	list_intensity = transform_data(path, fields['intensidade'])
	length = len(list_intensity)
	list_height = fill_const_height(list_height, length)
	list_duration = fill_const_duration(list_duration, length)
else:
	list_duration = transform_data(path, fields['duracao'])
	length = len(list_duration)
	list_height = fill_const_height(list_height, length)
	list_intensity = fill_const_intensity(list_intensity, length)

output_filename = fields['nomeArquivo'] # Nome do arquivo de saida

filesPath = str(pathlib.Path(__file__).parent.parent.absolute())

filesPath = os.path.join(filesPath, 'files', output_filename)

edit_header_template(filesPath, output_filename) # Editando o template do cabecalho com o nome do arquivo de saida

write_in_csv_file(list_height, list_intensity, list_duration, filesPath) # Escrevendo o arquivo a ser convertido

call_csvmidi(filesPath) # Chamando o programa conversor csvmidi

print('OK')
