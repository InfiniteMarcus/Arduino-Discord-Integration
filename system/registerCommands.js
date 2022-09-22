const { REST, SlashCommandBuilder, Routes } = require('discord.js');

const commands = [
	new SlashCommandBuilder().setName('pisca-pisca').setDescription('Faça um LED piscar!'),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

rest.put(Routes.applicationCommands('705883388741156984'), { body: commands })
	.then(data => console.log(`${data.length} comandos registrados`))
	.catch(console.error);