const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-tickets')
        .setDescription('Configura el mensaje del sistema de tickets')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Sistema de Tickets - ClashMC Network')
            .setDescription('¡Bienvenido al sistema de soporte!\nSelecciona la categoría correspondiente a tu consulta para abrir un ticket.')
            .addFields(
                { name: '📝 Soporte General', value: 'Consultas generales sobre el servidor', inline: true },
                { name: '🐛 Reporte de Bugs', value: 'Reporta errores o problemas técnicos', inline: true },
                { name: '💡 Sugerencias', value: 'Comparte tus ideas para mejorar', inline: true },
                { name: '💰 BuyCraft Support', value: 'Ayuda con compras y pagos', inline: true }
            )
            .setFooter({ text: 'ClashMC Network - Sistema de Soporte' });

        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('ticket_menu')
                    .setPlaceholder('Selecciona una categoría')
                    .addOptions([
                        {
                            label: 'Soporte General',
                            description: 'Consultas generales sobre el servidor',
                            value: 'soporte_general',
                            emoji: '📝'
                        },
                        {
                            label: 'Reporte de Bugs',
                            description: 'Reporta errores o problemas técnicos',
                            value: 'reporte_bugs',
                            emoji: '🐛'
                        },
                        {
                            label: 'Sugerencias',
                            description: 'Comparte tus ideas para mejorar',
                            value: 'sugerencias',
                            emoji: '💡'
                        },
                        {
                            label: 'BuyCraft Support',
                            description: 'Ayuda con compras y pagos',
                            value: 'buycraft_support',
                            emoji: '💰'
                        }
                    ])
            );

        await interaction.channel.send({ embeds: [embed], components: [row] });
        await interaction.reply({ content: '✅ Sistema de tickets configurado correctamente', ephemeral: true });
    }
};