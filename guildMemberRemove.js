const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'guildMemberRemove',
    once: false,
    execute(member, client) {
        try {
            const logChannel = member.guild.channels.cache.find(channel => channel.name === 'logs');
            if (logChannel && logChannel.permissionsFor(client.user.id).has(PermissionsBitField.Flags.SendMessages)) {
                logChannel.send(`📤 ${member.user.tag} ha salido del servidor.`);
            }
        } catch (error) {
            console.error('Error en log de miembro saliente:', error);
        }
    },
};