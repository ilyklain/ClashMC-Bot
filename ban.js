const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Banea a un usuario')
        .addUserOption(option => option
            .setName('usuario')
            .setDescription('Usuario a banear')
            .setRequired(true))
        .addStringOption(option => option
            .setName('razon')
            .setDescription('Razón del baneo')
            .setRequired(false)),
    
    async execute(interaction) {
        try {
            const user = interaction.options.getUser('usuario');
            const razon = interaction.options.getString('razon') || 'No especificada';
            
            // Verificar permiso del usuario que ejecuta el comando
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                return interaction.reply({ content: '🚫 No tienes permisos para banear.', ephemeral: true });
            }
            
            // Obtener el miembro a banear
            const member = await interaction.guild.members.fetch(user.id).catch(() => null);
            if (!member) return interaction.reply({ content: '⚠️ Usuario no encontrado.', ephemeral: true });
            
            // Verificar si el bot puede banear al usuario
            if (!member.bannable) {
                return interaction.reply({ content: '⚠️ No puedo banear a este usuario. Puede tener un rol superior.', ephemeral: true });
            }

            // Banear al usuario
            await member.ban({ reason: razon });
            return interaction.reply(`✅ ${user.tag} ha sido baneado. Razón: ${razon}`);
        } catch (error) {
            console.error('Error al banear:', error);
            return interaction.reply({ content: '❌ Hubo un error al ejecutar el comando.', ephemeral: true });
            
        }
    },
};