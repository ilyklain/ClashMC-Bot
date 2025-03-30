module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction, client) {
        // Control comandos slash
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            
            if (!command) {
                console.error(`Comando ${interaction.commandName} no encontrado.`);
                return interaction.reply({ content: '❌ Error: Comando no encontrado.', ephemeral: true });
            }
            
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: '❌ Ocurrió un error al ejecutar este comando.', ephemeral: true });
                } else {
                    await interaction.reply({ content: '❌ Ocurrió un error al ejecutar este comando.', ephemeral: true });
                }
            }
        }
        

        if (interaction.isStringSelectMenu()) {
            if (interaction.customId === 'ticket_menu') {

            }
        }
    },
};