# Integração Arduino-Discord

## Conceito do projeto
Este projeto é uma prova de conceito que visa mostrar como possibilitar a comunicação entre uma placa Arduino e um bot de Discord que utiliza o wrapper Discord.js

Tanto o Arduino quanto o conceito de bots de forma geral estão muito ligados com usos para automação e modernização da tarefas. Entretanto, o primeiro é mais focado em hardware e interações com o mundo real, enquanto o segundo é mais aplicado à software e conhecido no mundo virtual.

Dessa forma, este projeto se propõe a integrar ambos os conceitos, estabelecendo o envio de dados entre Arduino e bot e vice-versa.

## Pré-requisitos e recursos utilizados
Os recursos utilizados neste projeto foram:

### Hardware
1. **Arduino Nano** (outras placas podem ser utilizadas, utilizadas as devidas adaptações)
2. **Potenciômetro linear de 10KΩ**, para controle de volume
3. **Leitor RFID NFC PN532** (ou similar), para leitura de tags NFC ou similares
4. **Jumpers/cabos** para fazer a conexão entre os componentes
5. Cabo para conectar o Arduino em um computador
6. (Opcional) LED e resistor para funções de pisca-pisca (geralmente as placas Arduino já possuem um LED embutido. É este que estou usando no projeto mas você pode usar o seu próprio)

![Circuito](https://github.com/InfiniteMarcus/Arduino-Discord-Integration/blob/main/circuito.png)

### Software
1. **Node.js** (linguagem padrão do bot e meio pelo qual se estabece a conexão serial com o Arduino. O projeto foi testado na **versão 17**)
2. **NPM** (gerenciador de dependências do Node)
3. **Arduino IDE 2.0** (para fazer upload do código para o Arduino)
4. **Discord.js** (para conexão com o Discord, incluso nas dependências do NPM)
5. **[PN532_I2C.h](https://github.com/elechouse/PN532/tree/PN532_HSU/PN532_I2C)**, para usar o leitor NFC com I2C. Para usar com outras formas de comunicação, baixar a biblioteca correta e fazer as adaptações necessárias
  
## Passo a passo
1. Escrevi o código para o funcionamento do bot de Discord
  1.1 asd
2. asd

## Instalação
a)
  ```
  Execute o comando X Y Z, no terminal, na pasta do projeto
  ```
b)
  1. Abra a pasta 
  2. Execute o comando A B C no terminal
  3. Compile os arquivos X, Y e Z juntos
  4. Crie um arquivo W.txt de entrada

## Execução
Passos necessários para executar, rodar ou testar seu projeto. Vocês podem seguir o mesmo modelo dos exemplos de Instalação.

## Bugs/problemas conhecidos

O proj

## Autores
* Marcus Vinícius N. Garcia ([Infinitemarcus](https://github.com/Infinitemarcus))

## Referências
- https://how2electronics.com/interfacing-pn532-nfc-rfid-module-with-arduino/

## Imagens/screenshots

![Imagem](https://github.com/InfiniteMarcus/Arduino-Discord-Integration/blob/master/circuito.png)
