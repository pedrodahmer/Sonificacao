# Sonificacao Multiparamétrica de Dados

Este projeto foi desenvolvido para a disciplina de Engenharia de Software II do curso de Informática Biomédica
da UFCSPA (Universidade Federal de Ciências da Saúde de Porto Alegre) durante o semestre letivo de 2020/2. O propósito
geral da aplicação é converter arquivos .csv em arquivos no formato .mid, isto é, sonificar dados. A sonificação resultante
busca fornecer uma nova forma de interpretação dos dados a partir dos parâmetros musicais de __altura__, __intensidade__ e __duração__.
Esta aplicação foi construída usando o framework Javascript [Electron.js](https://github.com/electron/electron) e a linguagem de programação [Python](https://www.python.org/).

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

Assim, uma vez que os dados são informados eles irão para uma fase de pré-processamento, realizada pelo script engine.py. Neste script, utilizamos alguns módulos
da biblioteca padrão do Python, como o módulo json para deserializar o objeto JSON contendo as entradas do usuário e o módulo csv para manipular os arquivos necessários.
Os dados informados pelo usuário passam por uma transformação, mais especificamente uma normalização, seguindo a fórmula abaixo:

![](https://github.com/pedrodahmer/Sonificacao/blob/master/src/assets/images/normalizacao-formula.PNG)

A normalização dos dados se deve pelo fato de o padrão MIDI lidar com valores que variam de 0 a 127.  Definiu-se por convenção a adoção de um intervalor personalizado que varia entre 36 e 84, com média igual a 60, uma faixa de valores mais adequada dentro da escala MIDI que evita notas com alturas muito extremas (graves ou agudas demais). Dessa forma os dados são transformados para se adequarem dentro deste intervalo, de forma que possuímos diferentes critérios para os parâmetro de acordo com o valor resultante da transformação, exceto o parâmetro de altura que é diretamente o mesmo valor resultante da transformação.

### Critérios para a intensidade

Quando a variável transformada da for igual ou maior que a média 60, atribuímos o valor 80 para corresponder a intensidade da nota musical referente a esta variável.
Do contrário, ou seja, quando a variável transformada for menor que 60, atribui-se o valor 40 de intensidade.

### Critérios para a duração

A duração correspondente a variável transformada também passa por uma avaliação de critérios de acordo com o intervalo em que se encontra, conforme a seguir:

- Entre 36 e 48 a duração atribuída é de 249
- Entre 49 e 60 a duração atribuída é de 499
- Entre 61 e 72 a duração atribuída é de 999
- Entre 73 e 84 a duração atribuída é de 1999

A duração se apresenta de forma incrementada na sua coluna correspondente dentro do arquivo .mid, ou seja, para cada nota a sua duração inicia seguindo o valor da duração da nota anterior + 1, e termina no instante de duração igual à duração da nota anterior + a duração calculada para a variável atual + 1.

Com os dados transformados e armazenados em listas, criamos uma cópia de um arquivo .csv chamado header_template.csv, que encontra-se dentro do diretório midicsv-1.1.
Este arquivos é o cabeçalho do arquivo .mid, contendo alguns metadados importantes. A partir deste template escrevemos o restante do arquivo .csv com os dados transformados,
seguindo a semâmtica do padrão MIDI. Quando este arquivo está escrito, a engine.py chama uma função que executa o programa csvmidi para a conversão dos formatos. Tem-se então
o processo concluído.

## Reprodução e visualização da sonificação

Por fim, podemos reproduzir o arquivo .mid resultante e acompanhar uma representação visual da sonificação. A representação visual pode ser um cascata de notas em um piano ou uma partitura. Usamos o pacote npm [html-midi-player](https://www.npmjs.com/package/html-midi-player) para a esta funcionalidade. Este pacote, por sua vez, utiliza recursos do [Magenta.js](https://github.com/magenta/magenta-js).

## Dependências usadas por esta aplicação

- [html-midi-player](https://www.npmjs.com/package/html-midi-player)
- [@magenta/music](https://magenta.github.io/magenta-js/music/)
- [python-shell](https://www.npmjs.com/package/python-shell)
- [electron-reload](https://www.npmjs.com/package/electron-reload)

## Ideias futuras

- [ ] Biblioteca de arquivos
