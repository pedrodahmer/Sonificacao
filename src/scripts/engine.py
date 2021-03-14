# -*- coding: utf-8 -*-

import sys, json, csv, os, subprocess
from shutil import copyfile

def call_csvmidi(filename):
	os.chdir('./midicsv-1.1') # Diretorio do programa
	# print(os.getcwd())

	outfd = open('../src/files/{}.mid'.format(filename), 'w+') # Grava o output em arquivo
	errfd = open('errMidi.txt', 'w+') # Grava o log de erros

	# Executando o programa
	subprocess.call(['csvmidi', '-v', '../src/files/' + filename + '.csv'], stdout = outfd, stderr = errfd)

	# Fechando os arquivos
	outfd.close()
	errfd.close()


def write_in_csv_file(list_height, list_intensity, list_duration, filename):

	with open('./src/files/{}.csv'.format(filename), 'a', newline='') as csv_template:
		writer = csv.writer(csv_template, delimiter=',')

		i = 0
		previous_duration = 0

		while i != len(list_height):

			if list_intensity[i] < 60:
				intensity = 40
			else:
				intensity = 80

			if 36 <= list_duration[i] <= 48:
				duration = 499
			elif 48 < list_duration[i] <= 60:
				duration = 999
			elif 60 < list_duration[i] <= 72:
				duration = 1999
			elif 72 < list_duration[i] <= 84:
				duration = 3999

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
		for row in reader:
			yield int(row[column])


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


path = sys.stdin.readlines()

path = json.loads(path[0])

list_height = [] # Lista para a altura
list_intensity = [] # Lista para a intensidade
list_duration = [] # Lista para a duracao

if path['altura'] != '' and path['intensidade'] != '' and path['duracao'] != '':
	list_height = transform_data(path['caminho'], path['altura'])
	list_intensity = transform_data(path['caminho'], path['intensidade'])
	list_duration = transform_data(path['caminho'], path['duracao'])
elif path['altura'] != '' and path['intensidade'] != '':
	list_height = transform_data(path['caminho'], path['altura'])
	list_intensity = transform_data(path['caminho'], path['intensidade'])
	list_duration = list_height
elif path['altura'] != '' and path['duracao'] != '':
	list_height = transform_data(path['caminho'], path['altura'])
	list_intensity = list_height
	list_duration = transform_data(path['caminho'], path['duracao'])
elif path['intensidade'] != '' and path['duracao'] != '':
	list_intensity = transform_data(path['caminho'], path['intensidade'])
	list_duration = transform_data(path['caminho'], path['duracao'])
	list_height = list_intensity
elif path['altura'] != '':
	list_height = transform_data(path['caminho'], path['altura'])
	list_intensity = list_height
	list_duration = list_height
elif path['intensidade'] != '':
	list_intensity = transform_data(path['caminho'], path['intensidade'])
	list_height = list_intensity
	list_duration = list_intensity
else:
	list_duration = transform_data(path['caminho'], path['duracao'])
	list_height = list_duration
	list_intensity = list_duration

"""
print('Lista com os dados transformados:')
print('Lista altura: {}'.format(list_height))
print('Lista intensidade: {}'.format(list_height))
print('Lista duracao: {}'.format(list_height))
"""

output_filename = path['nomeArquivo']

copyfile('././midicsv-1.1/header_template.csv', './src/files/{}.csv'.format(output_filename))

write_in_csv_file(list_height, list_intensity, list_duration, output_filename)

call_csvmidi(output_filename)

# print('Conversão concluída! Deseja reproduzir a sonificação agora?')
