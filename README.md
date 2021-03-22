# Sonificacao Multiparamétrica de Dados

Este projeto foi desenvolvido para a disciplina de Engenharia de Software II do curso de Informática Biomédica
da UFCSPA (Universidade Federal de Ciências da Saúde de Porto Alegre) durante o semestre letivo de 2020/2. O propósito
geral da aplicação é converter arquivos .csv em arquivos no formato .mid, isto é, sonificar dados. A sonificação resultante
busca fornecer uma nova forma de interpretação dos dados a partir dos parâmetros musicais de __altura__, __intensidade__ e __duração__.


## Conversão dos formatos

Para realizar a conversão entre os formatos utilizamos o programa de código aberto [csvmidi](https://www.fourmilab.ch/webtools/midicsv/) desenvolvido por John Walker. 
Este programa realiza a conversão de arquivos .csv semanticamente semelhantes a arquivos no padão MIDI (Musical Instrumental Digital Interface) para o formato .mid.
Portanto, antes de enviarmos os dados do arquivo .csv para a conversão propriamente dita, realizamos uma fase de pré-processamento dos dados.

## Entrada e pré-processamento dos dados

A sonificação realizada pelo nosso programa é baseada nos parâmetros musicais de altura, intensidade e duração. Enquanto usuário, é possível escolher
quais colunas de dados irão corresponder a cada um destes parâmetros. A entrada simultânea dos três parâmetros não é obrigatória, de forma que atribui-se
valores constantes aos parâmetros não informados, ou seja, você pode isolar o parâmetro desejado para a sua análise. De qualquer forma, há algumas restrições
na entrada dos dados, que futuramente poderão ser retiradas com o melhoramento da implementação. Restrições mais relevantes:

- Assume-se que a primeira linha do arquivo .csv contém os nomes de cada coluna, uma vez que é por este nome que uma coluna será selecionada e tratada pelo programa
- Todas as colunas informadas possuem o mesmo tamanho
- Os dados são de natureza numérica
- Não podem haver dados faltantes
