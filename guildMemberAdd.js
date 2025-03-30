const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'guildMemberAdd',
    once: false,
    execute(member, client) {
        try {
            const logChannel = member.guild.channels.cache.find(channel => channel.name === 'logs');
            if (logChannel && logChannel.permissionsFor(client.user.id).has(PermissionsBitField.Flags.SendMessages)) {
                logChannel.send(`📥 ${member.user.tag} se ha unido al servidor.`);
            }
        } catch (error) {
            console.error('Error en log de nuevo miembro:', error);
        }
    },
};