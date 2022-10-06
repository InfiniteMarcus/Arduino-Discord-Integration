const { REST, SlashCommandBuilder, Routes } = require('discord.js');

const commands = [
	new SlashCommandBuilder().setName('pisca-pisca').setDescription('Faça um LED piscar!'),
	new SlashCommandBuilder().setName('musica').setDescription('Ouça uma música escolhida a dedo'),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands })
	.then(data => console.log(`${data.length} comandos registrados`))
	.catch(console.error);