require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { SerialPort } = require('serialport');
const { DelimiterParser } = require('@serialport/parser-delimiter');

const { ActivityType, Client, GatewayIntentBits, Partials } = require('discord.js');
const { AudioPlayerStatus, createAudioResource, createAudioPlayer, getVoiceConnection, joinVoiceChannel } = require('@discordjs/voice');

const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
    ],
});

// Serial Connection Variables
let port = null;
let parser = null;
let reconnectTimeout = null;
let isReconnecting = false;

// Auto-discovery of the Arduino serial port
async function findArduinoPort() {
    const envPort = process.env.ARDUINO_PORT;

    try {
        const ports = await SerialPort.list();
        console.log('Portas seriais disponíveis:', ports.map(p => `${p.path} (${p.manufacturer || 'Desconhecido'})`));

        // CH340 = 1a86, FTDI = 0403, Prolific = 067b, CP210x = 10c4, Arduino = 2341
        const arduinoPort = ports.find(port => {
            const manufacturer = (port.manufacturer || '').toLowerCase();
            const vendorId = (port.vendorId || '').toLowerCase();

            return manufacturer.includes('arduino') ||
                manufacturer.includes('ch340') ||
                manufacturer.includes('ftdi') ||
                vendorId === '2341' ||
                vendorId === '1a86' ||
                vendorId === '0403' ||
                vendorId === '10c4';
        });

        if (arduinoPort) {
            console.log(`Arduino detectado automaticamente na porta: ${arduinoPort.path} (${arduinoPort.manufacturer})`);
            return arduinoPort.path;
        }
    } catch (err) {
        console.error('Erro ao listar portas seriais:', err.message);
    }

    if (envPort) {
        console.log(`Usando porta configurada no .env: ${envPort}`);
        return envPort;
    }

    return null;
}

// Initialize Serial Connection
async function initSerial() {
    if (isReconnecting) return;
    isReconnecting = true;

    console.log('Buscando placa Arduino...');
    const portPath = await findArduinoPort();

    if (!portPath) {
        console.log('Nenhum Arduino encontrado. Tentando novamente em 5 segundos...');
        scheduleReconnect();
        return;
    }

    try {
        port = new SerialPort({
            path: portPath,
            baudRate: 115200,
            autoOpen: false
        });

        port.open((err) => {
            if (err) {
                console.error(`Falha ao abrir porta ${portPath}:`, err.message);
                cleanupSerial();
                scheduleReconnect();
                return;
            }
            console.log(`Conexão serial estabelecida com sucesso na porta ${portPath}`);
            isReconnecting = false;

            parser = port.pipe(new DelimiterParser({ delimiter: '\n' }));
            setupParserEvents();
        });

        port.on('close', () => {
            console.log('Conexão serial com Arduino fechada.');
            cleanupSerial();
            scheduleReconnect();
        });

        port.on('error', (err) => {
            console.error('Erro na porta serial:', err.message);
            cleanupSerial();
            scheduleReconnect();
        });

    } catch (err) {
        console.error('Erro na inicialização da porta serial:', err.message);
        cleanupSerial();
        scheduleReconnect();
    }
}

function cleanupSerial() {
    if (port) {
        port.removeAllListeners();
        if (port.isOpen) {
            port.close(() => { });
        }
        port = null;
    }
    parser = null;
}

function scheduleReconnect() {
    isReconnecting = false;
    if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
    }
    reconnectTimeout = setTimeout(initSerial, 5000);
}

function writeToArduino(data) {
    if (!port || !port.isOpen) {
        console.warn(`Mensagem "${data}" não pôde ser enviada. Arduino desconectado.`);
        return;
    }

    port.write(data, (error) => {
        if (error) {
            return console.error('Erro ao enviar mensagem para o Arduino: ', error.message);
        }
        console.log(`Mensagem "${data}" enviada para o Arduino`);
    });
}

function setupParserEvents() {
    if (!parser) return;

    parser.on('data', async data => {
        const info = data.toString().trim();
        console.log(`[Arduino] ${info}`);

        if (info.startsWith('tag:')) {
            const [_prefix, tag] = info.split(':');
            if (!tag) return;
            const cleanTag = tag.trim();
            console.log(`Tag lida: ${cleanTag}`);

            if (cleanTag === process.env.AUTHORIZED_TAG) {
                try {
                    const channel = await bot.channels.fetch(process.env.CHANNEL_ID);
                    if (channel) {
                        await channel.send('Acesso autorizado!');
                    }
                } catch (err) {
                    console.error('Erro ao enviar mensagem no canal:', err.message);
                }
            }

            if (cleanTag === process.env.BLINK_TAG) {
                writeToArduino('B');
            }
        }

        if (info.startsWith('volume:')) {
            const [_prefix, volume] = info.split(':');
            const numericVolume = Number(volume);

            if (isNaN(numericVolume)) {
                console.warn('Volume serial inválido:', volume);
                return;
            }

            const clampedVolume = Math.min(Math.max(numericVolume, 0), 1);

            try {
                const connection = getVoiceConnection(process.env.GUILD_ID);
                if (connection) {
                    const resource = connection.state.subscription?.player?.state?.resource;
                    if (resource && resource.volume) {
                        resource.volume.setVolume(clampedVolume);
                        console.log(`Volume ajustado para: ${clampedVolume}`);
                    }
                }
            } catch (err) {
                console.error('Erro ao atualizar volume da música:', err.message);
            }
        }
    });

    parser.on('error', error => {
        console.error('Erro encontrado no parser serial:', error.message);
    });
}

bot.once('ready', () => {
    bot.user.setPresence({
        activities: [{ name: 'Alguma coisa', type: ActivityType.Playing }],
        status: 'online',
    });

    console.log('Estou na sua realidade, de novo!');
    initSerial();
});

bot.on('interactionCreate', async inter => {
    if (!inter.isChatInputCommand()) return;

    if (inter.commandName === 'pisca-pisca') {
        if (!port || !port.isOpen) {
            return inter.reply({ content: 'O Arduino não está conectado no momento!', ephemeral: true });
        }
        writeToArduino('P');
        inter.reply({ content: 'LED piscando!', ephemeral: true });
    }

    if (inter.commandName === 'musica') {
        const voiceChannel = inter.member?.voice?.channel;

        if (!voiceChannel) {
            inter.reply({ content: 'Você precisa estar em um canal de voz para fazer isso!', ephemeral: true });
            return;
        }

        const musicPath = path.join(__dirname, 'media', 'music.ogg');
        if (!fs.existsSync(musicPath)) {
            inter.reply({
                content: 'Arquivo de música não encontrado! Crie a pasta `media` e adicione o arquivo `music.ogg`.',
                ephemeral: true
            });
            return;
        }

        const con = getVoiceConnection(inter.guildId) || joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            selfDeaf: false,
        });

        const resource = createAudioResource(musicPath, {
            inlineVolume: true,
        });

        const player = createAudioPlayer();
        con.subscribe(player);
        player.play(resource);

        player.on(AudioPlayerStatus.Playing, () => {
            console.log('Áudio tocando!');
        });

        player.on('error', error => {
            console.error(`Erro no player de áudio: ${error.message}`);
        });

        if (con && player && resource) {
            inter.reply({ content: 'Tocando música no seu canal de voz!', ephemeral: true });
        }
    }
});

bot.login(process.env.BOT_TOKEN);

