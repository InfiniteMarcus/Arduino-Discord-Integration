require('dotenv').config();

const SerialPort = require('serialport');
const { Client, Intents } = require('discord.js');

const client = new Client({ 
    intents: [
        Intents.FLAGS.GUILDS
    ] 
});

const port = new SerialPort('COM3', { baudRate: 9600 });
const Readline = SerialPort.parsers.Readline;
const parser = port.pipe(new Readline());

port.on('open', () => {
    console.log('Conexão serial com Arduino estabelecida');
});

parser.on('data', async data => {
    const info = data.toString();
    
    if (info.startsWith('tag:')) {
        const [_prefix, tag] = info.split(':');
        console.log(tag);

        if (tag.trim() === process.env.AUTHORIZED_TAG) {
            const channel = await client.channels.fetch(process.env.CHANNEL_ID);

            if (channel)
                channel.send('Acesso autorizado!');
        }
    }
});

parser.on('err', error => {
    console.log('Erro encontrado na conexão serial:');
    console.log(error);
})

client.once('ready', () => {
	console.log('ESTOU DE VOLTA, DIRETO NA SUA REALIDADE');
});

client.login(process.env.BOT_TOKEN);

