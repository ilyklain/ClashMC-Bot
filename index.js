const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { token } = require('./config.json');
const fs = require('fs');
const path = require('path');

// Crear una nueva instancia del cliente
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
    ]
});

// Colecciones para almacenar comandos y eventos
client.commands = new Collection();
client.events = new Collection();

// Cargar los handlers
const handlersPath = path.join(__dirname, 'handlers');
const handlerFiles = fs.readdirSync(handlersPath).filter(file => file.endsWith('.js'));

for (const file of handlerFiles) {
    const filePath = path.join(handlersPath, file);
    const handler = require(filePath);
    handler(client);
}

// Manejo de errores
client.on('error', error => {
    console.error('Error en el cliente de Discord:', error);
});

process.on('unhandledRejection', error => {
    console.error('Error no controlado:', error);
});

// Iniciar sesión con el token
client.login(token).catch(error => {
    console.error('Error al iniciar sesión:', error);
});