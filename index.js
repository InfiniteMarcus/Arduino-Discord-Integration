require('dotenv').config();

require('./system/registerCommands.js');
const { SerialPort } = require('serialport');
const { DelimiterParser } = require('@serialport/parser-delimiter');
const { ActivityType, Client, IntentsBitField, Partials } = require('discord.js');

const Intents = IntentsBitField.Flags;

const bot = new Client({ 
    intents: [
		Intents.Guilds,
		Intents.GuildMembers,
		Intents.GuildEmojisAndStickers,
		Intents.GuildVoiceStates,
		Intents.GuildPresences,
		Intents.GuildMessages,
		Intents.GuildMessageReactions,
		Intents.DirectMessages,
		Intents.DirectMessageReactions,
		Intents.GuildScheduledEvents,
    ],
    partials: [
		Partials.Channel, Partials.Message, Partials.Reaction,
	],
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

bot.on('interactionCreate', async inter => {
    if (inter.commandName === 'pisca-pisca') {
        port.write('P', sendBlinkCallback);
        inter.reply({ content: 'LED piscando!', ephemeral: true });
    }
});

bot.login(process.env.BOT_TOKEN);

