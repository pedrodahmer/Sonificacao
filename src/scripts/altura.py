# -*- coding: utf-8 -*-

import sys, json, csv, os, subprocess

def call_csvmidi(filename):
	os.chdir('./midicsv-1.1') # Diretorio do programa
	print(os.getcwd())

	outfd = open('AlturaTeste.mid', 'w+') # Grava o output em arquivo
	errfd = open('ErrMidi.txt', 'w+') # Grava o log de erros

	print('Arquivo {}'.format(filename)) 

	# Executando o programa
	subprocess.call(['csvmidi', '-v', '../src/files/' + filename + '.csv'], stdout = outfd, stderr = errfd)

	# Fechando os arquivos
	outfd.close()
	errfd.close()

def write_height_in_csv_file(list_height):
	with open('./src/files/altura_teste.csv', 'a', newline='') as csv_template:
		writer = csv.writer(csv_template, delimiter=',')

		i = 0
		duracao_anterior = 0

		for item in list_height:
			if 36 <= item <= 48:
				duracao = 499
			elif 48 < item <= 60:
				duracao = 999
			elif 60 < item <= 72:
				duracao = 1999
			elif 72 < item <= 84:
				duracao = 3999

			if item < 60:
				intensidade = 40
			elif item > 60:
				intensidade = 80
			else:
				intensidade = 0

			if i == 0:
				writer.writerow([2, 0, 'Note_on_c', 0, '{}'.format(item), intensidade])
				writer.writerow([2, duracao, 'Note_off_c', 0, '{}'.format(item), 0])
				duracao_anterior = duracao + 1
				i = 1
			else:
				writer.writerow([2, duracao_anterior, 'Note_on_c', 0, '{}'.format(item), intensidade])
				writer.writerow([2, duracao_anterior + duracao, 'Note_off_c', 0, '{}'.format(item), 0])

				duracao_anterior = duracao_anterior + duracao + 1

		writer.writerow([2, duracao_anterior, 'End_track'])
		writer.writerow([0, 0, 'End_of_file'])

def get_column_of_csv(filename, column):
	with open(filename) as csv_file:
		reader = csv.DictReader(csv_file)
		for row in reader:
			yield int(row[column])

def transform_data(filename, column):
	list_data = []

	for total_cases in get_column_of_csv(filename, column):
		list_data.append(total_cases)

	original_max = max(list_data)
	original_min = min(list_data)

	new_max = 84
	new_min = 36

	transform_list_data = map(lambda x: ((x - original_min) / (original_max - original_min))
								 * (new_max - new_min) + new_min, list_data)

	new_list_data = list(transform_list_data)

	new_list_data = [int(i) for i in new_list_data]

	return new_list_data

caminho = sys.stdin.readlines()

caminho = json.loads(caminho[0])

list_height = transform_data(caminho['caminho'], caminho['altura'])

print('Lista nova: {}'.format(list_height))

write_height_in_csv_file(list_height)

call_csvmidi('altura_teste')
