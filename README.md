# Integração Arduino-Discord

## Conceito do projeto
Este projeto é uma prova de conceito que visa mostrar como possibilitar a comunicação entre uma placa Arduino e um bot de Discord que utiliza o wrapper Discord.js

Tanto o Arduino quanto o conceito de bots de forma geral estão muito ligados com usos para automação e modernização da tarefas. Entretanto, o primeiro é mais focado em hardware e interações com o mundo real, enquanto o segundo é mais aplicado à software e conhecido no mundo virtual.

Dessa forma, este projeto se propõe a integrar ambos os conceitos, estabelecendo o envio de dados entre Arduino e bot e vice-versa.

## Comandos e funções
### Do bot para o Arduino
- Usar comando de `/pisca-pisca` para fazer o LED piscar algumas vezes
- Usar comando de `/musica` para começar a tocar uma música que poderá ter seu volume alterado pelo Arduino

### Do Arduino para o bot
- Usar uma tag NFC/RFID para fazer o LED piscar
- Usar uma tag NFC/RFID para enviar uma mensagem de acesso autorizado para o Discord
- Alterar o volume de uma música sendo tocada no Discord usando o potenciômetro do Arduino

## Pré-requisitos e recursos utilizados
Os recursos utilizados neste projeto foram:

### Hardware
1. **Arduino Nano** (outras placas podem ser utilizadas, utilizadas as devidas adaptações)
2. **Potenciômetro linear de 10KΩ**, para controle de volume
3. **Leitor RFID NFC PN532** (ou similar), para leitura de tags NFC ou similares
4. **Jumpers/cabos** para fazer a conexão entre os componentes
5. Cabo para conectar o Arduino em um computador
6. (Opcional) LED e resistor para funções de pisca-pisca (geralmente as placas Arduino já possuem um LED embutido. É este que estou usando no projeto mas você pode usar o seu próprio)

Imagem do circuito comentado:
![Circuito](https://github.com/InfiniteMarcus/Arduino-Discord-Integration/blob/main/docs/circuito_comentado.png)

### Software
1. **Node.js** (linguagem padrão do bot e meio pelo qual se estabece a conexão serial com o Arduino. O projeto foi testado na **versão 17**)
2. **NPM** (gerenciador de dependências do Node)
3. **Arduino IDE 2.0** (para fazer upload do código para o Arduino)
4. **Discord.js** (para conexão com o Discord, incluso nas dependências do NPM)
5. **[PN532_I2C.h](https://github.com/elechouse/PN532/tree/PN532_HSU/PN532_I2C)**, para usar o leitor NFC com I2C. Para usar com outras formas de comunicação, baixar a biblioteca correta e fazer as adaptações necessárias
  
## Passo a passo
1. Escrevi o código para o funcionamento do bot de Discord
  1.1 Baseado em experiências passadas, esta parte foi relativamente fácil. Decidi quais seriam as funções principais do bot para comprovar que pude estabelecer a comunicação entre Arduino-Node.js
2. asd

## Instalação

### Variáveis de ambiente
Este arquivo usa variáveis de ambiente que deverão ser definidas antes da execução do programa.

As variáveis usadas são:
- `BOT_TOKEN`: token do seu bot de Discord (pode ser gerado no [painel do desenvolvedor](https://discord.com/developers/applications))
- `CHANNEL_ID`: ID de canal do Discord onde o bot enviará mensagens
- `GUILD_ID`: ID de servidor do Discord que o bot usará de base para se conectar aos canais de voz
- `AUTHORIZED_TAG`: valor de tag NFC/RFID para enviar mensagem de acesso autorizado
- `BLINK_TAG`: valor de tag NFC/RFID para piscar o LED
- `CLIENT_ID`: ID do bot de Discord (para registrar os [slash commands](https://discordjs.guide/interactions/slash-commands.html))
- `ARDUINO_PORT`: valor da porta do computador a qual o Arduino se conectou


### Programação

É recomendável fazer esta parte primeiro, começando pelo Arduino. 

Você precisará do valor da porta do Arduino para configurar o Node, e você precisará que o código seja enviado para o Arduino para ligar o circuito por completo.

#### Parte do Arduino
1. Abra a IDE do Arduino, com o código do arquivo `Sensor.ino`
2. Conecte a sua placa Arduino ao computador
3. Na IDE, selecione o modelo correto de Arduino e a porta na qual se encontra a placa
4. Realize a compilação e envio do código para a placa

#### Parte do Node.js
1. Baixe o projeto do repositório
2. Execute o comando `npm install` para instalar as dependências
3. Crie um arquivo `.env` com as variáveis de ambiente necessárias, baseado em `.env.template`
4. Execute o comando `npm run start` para testar o programa

### Montagem do circuito

Imagem do circuito completo:
![Circuito](https://github.com/InfiniteMarcus/Arduino-Discord-Integration/blob/main/docs/circuito.png)

**É altamente recomendado você montar o circuito com a energia desligada e sem qualquer cabo conectado entre sua placa Arduino e o computador.**

A partir do momento em que o código for enviado para o Arduino e o circuito montado e conectado ao computador, a aplicação deverá funcionar.

### Arquivos

Além disso, para usar a funcionalidade de música, é necessário criar uma pasta `/media` com um arquivo `music.ogg`. Fique a vontade para escolher a música que você quiser.

**Recomendação:** Em bots mais complexos, é possível tornar esse sistema dinâmico para pegar sons e músicas de algum outro lugar, por exemplo.

## Execução
Para executar o projeto, é necessário:
- Ter o circuito corretamente montado
- Ter feito upload do código para a placa Arduino
- Estar rodando a aplicação Node.js, sem erros
  - Se algum erro ocorrer, provavelmente:
    - Alguma variável de ambiente não foi setada
    - Alguma variável de ambiente está com valor inválido
    - A comunicação entre Arduino-PC ou entre Arduino-Node não foi estabelecida
    - Não foi possível conectar o código Node.js com o seu bot de Discord
- Ter em mãos as tags NFC/RFID setadas nas variáveis de ambiente não foi setada
- Estar conectado no servidor de Discord setado nas variáveis de ambiente

Para isso, basta seguir os passos descritos na seção de **Instalação**.

**Observação:** também há a possibilidade de algum componente do circuito estar queimado ou não conectado direito. Tome cuidado na hora de montar o circuito!

O comando para executar a aplicação Node.js é `npm run start` (ou derivado disso).

## Bugs/problemas conhecidos

Atualmente, o projeto se encontra com algumas limitações:
- É necessário ter o Arduino conectado (via cabo) ao mesmo computador que está rodando o bot de Discord
- É necessário mudar manualmente no arquivo `.env` o valor da porta na qual o Arduino está conectado (que pode mudar dependendo da entrada em que você conecta a placa)

É esperado que em futuras versões, a conexão entre a placa e o código seja feita de forma sem fio, por Bluetooth ou Wi-fi. Isso resolveria ambos os problemas apresentados, mas necessitaria de diversas alterações no código e no circuito.

## Autores
* Marcus Vinícius N. Garcia ([Infinitemarcus](https://github.com/Infinitemarcus))

## Referências
- https://how2electronics.com/interfacing-pn532-nfc-rfid-module-with-arduino/

## Imagens/screenshots