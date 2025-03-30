
//Mensaje de inicio de bot
module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`✅ Bot iniciado como ${client.user.tag}`);
        client.user.setActivity('comandos slash', { type: 'LISTENING' });
    },
};