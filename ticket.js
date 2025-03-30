const { SlashCommandBuilder, PermissionsBitField, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Crea un menú para generar tickets de soporte'),
    
    async execute(interaction) {
        // Verificar permisos
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply({ content: '🚫 No tienes permisos para crear menús de tickets.', ephemeral: true });
        }
        
        // Crear el menú de selección
        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('ticket_menu')
                    .setPlaceholder('Selecciona una categoría')
                    .addOptions([
                        {
                            label: 'Soporte General',
                            description: 'Ayuda con problemas generales',
                            value: 'soporte_general',
                        },
                        {
                            label: 'Reporte de Bugs',
                            description: 'Reportar un problema o error',
                            value: 'reporte_bugs',
                        },
                        {
                            label: 'Sugerencias',
                            description: 'Sugerir nuevas características',
                            value: 'sugerencias',
                        },

                        {
                            label: 'BuyCraft Support',
                            description: 'Ayuda con problemas de BuyCraft',
                            value:'buycraft_support',
                        }
                    ]),
            );
            
        await interaction.reply({ 
            content: '## 🎫 Sistema de Tickets\nSelecciona una categoría para abrir un ticket de soporte:',
            components: [row],
        });
    },
};