const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('../config.json');
const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    const commands = [];
    const commandsPath = path.join(__dirname, '..', 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    
    // Cargar comandos
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        
        // Almacenar el comando en la colección
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
            console.log(`✅ Comando ${command.data.name} cargado`);
        } else {
            console.log(`⚠️ El comando en ${filePath} falta de 'data' o 'execute'`);
        }
    }
    
    // Registrar comandos en Discord
    const rest = new REST({ version: '10' }).setToken(token);
    
    (async () => {
        try {
            console.log('Comenzando a registrar comandos...');
            
            await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: commands },
            );
            
            console.log('✅ Comandos registrados exitosamente');
        } catch (error) {
            console.error('Error al registrar comandos:');
            console.error(error);
        }
    })();
};