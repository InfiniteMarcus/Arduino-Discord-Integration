require('dotenv').config();

const { SerialPort } = require('serialport');
const { DelimiterParser } = require('@serialport/parser-delimiter');
const { ActivityType, Client, GatewayIntentBits } = require('discord.js');

const bot = new Client({ 
    intents: [
        GatewayIntentBits.Guilds
    ] 
});

const port = new SerialPort({ 
    path: 'COM3', baudRate: 9600 
});

const parser = port.pipe(new DelimiterParser({ delimiter: '\n' }));

function sendBlinkCallback(error) {
    if (error) {
        return console.log('Erro ao enviar mensagem: ', error.message);
    }
    console.log('Mensagem enviada para o Arduino');
}

port.on('open', () => {
    console.log('Conexão serial com Arduino estabelecida');
});

parser.on('data', async data => {
    const info = data.toString();
    console.log(info);

    if (info.startsWith('tag:')) {
        const [_prefix, tag] = info.split(':');
        console.log(tag);

        if (tag.trim() === process.env.AUTHORIZED_TAG) {
            const channel = await bot.channels.fetch(process.env.CHANNEL_ID);

            if (channel)
                channel.send('Acesso autorizado!');
        }

        if (tag.trim() === process.env.BLINK_TAG) {
            port.write('B', sendBlinkCallback);
        }
    }
});

parser.on('err', error => {
    console.log('Erro encontrado na conexão serial:');
    console.log(error);
})

bot.once('ready', () => {
    bot.user.setPresence({
		activities: [{ name: 'Doki Doki Literature Club', type: ActivityType.Playing }],
		status: 'online',
	});

	console.log('Estou na sua realidade, de novo!');
});

bot.login(process.env.BOT_TOKEN);

