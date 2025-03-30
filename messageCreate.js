module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message, client) {
        // Ignorar mensajes de bots
        if (message.author.bot) return;
        
        // Sistema de Tags
        if (message.content.startsWith('!tag')) {
            try {
                const args = message.content.slice(4).trim().split(/ +/);
                if (!args[0]) return message.reply('⚠️ Debes especificar un rol.');
                
                const role = message.guild.roles.cache.find(r => r.name.toLowerCase() === args[0].toLowerCase());

                if (role) {
                    if (message.member.roles.cache.has(role.id)) {
                        await message.member.roles.remove(role);
                        message.reply(`❌ Se te ha removido el rol ${role.name}`);
                    } else {
                        await message.member.roles.add(role);
                        message.reply(`✅ Se te ha asignado el rol ${role.name}`);
                    }
                } else {
                    message.reply('⚠️ Rol no encontrado.');
                }
            } catch (error) {
                console.error('Error en sistema de tags:', error);
                message.reply('❌ Hubo un error al procesar el comando.');
            }
        }
    },
};