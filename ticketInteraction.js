const { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } = require('discord.js');
const config = require('../config.json');

let ticketCount = 0;

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isStringSelectMenu() && interaction.customId === 'ticket_menu') {
            ticketCount++;
            const category = interaction.values[0];
            const categoryNames = {
                'soporte_general': 'Soporte General',
                'reporte_bugs': 'Reporte de Bugs',
                'sugerencias': 'Sugerencias',
                'buycraft_support': 'BuyCraft Support'
            };

            // Crear canal de ticket en la categoría específica
            const channel = await interaction.guild.channels.create({
                name: `ticket-${ticketCount}-${category}`,
                type: ChannelType.GuildText,
                parent: config.ticketCategory,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: interaction.user.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    },
                    {
                        id: config.staffRole,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    },
                    {
                        id: interaction.client.user.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    },
                ],
            });

            // Mensaje embed para el ticket
            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`🎫 Ticket de ${categoryNames[category]}`)
                .setDescription(`Bienvenido ${interaction.user}, un miembro del staff te atenderá pronto.\n\nPor favor, describe tu problema detalladamente.`)
                .addFields(
                    { name: 'ID del Ticket', value: `#${ticketCount}`, inline: true },
                    { name: 'Creado por', value: `${interaction.user.tag}`, inline: true },
                    { name: 'Categoría', value: categoryNames[category], inline: true }
                )
                .setTimestamp();

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('claim_ticket')
                        .setLabel('📩 Claim ticket')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('transfer_ticket')
                        .setLabel('Transferir a Head-Support')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('close_ticket')
                        .setLabel('Cerrar ticket')
                        .setStyle(ButtonStyle.Danger),
                );

            await channel.send({ embeds: [embed], components: [row] });
            await interaction.reply({ content: `Tu ticket ha sido creado en ${channel}`, ephemeral: true });

            // Log de creación de ticket
            const logChannel = interaction.guild.channels.cache.get(config.logChannel);
            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setColor(0x00FF00)
                    .setTitle('Nuevo Ticket Creado')
                    .addFields(
                        { name: 'Ticket ID', value: `#${ticketCount}` },
                        { name: 'Usuario', value: interaction.user.tag },
                        { name: 'Categoría', value: categoryNames[category] }
                    )
                    .setTimestamp();
                await logChannel.send({ embeds: [logEmbed] });
            }
        }

        if (interaction.isButton()) {
            if (interaction.customId === 'claim_ticket') {
                if (!interaction.member.roles.cache.has(config.staffRole)) {
                    return interaction.reply({ content: '❌ Solo el staff puede reclamar tickets.', ephemeral: true });
                }
                const claimEmbed = new EmbedBuilder()
                    .setColor(0x00FF00)
                    .setDescription(`🎫 Este ticket ha sido reclamado por ${interaction.user}`)
                    .setTimestamp();
                await interaction.reply({ embeds: [claimEmbed] });
            }
            else if (interaction.customId === 'transfer_ticket') {
                if (!interaction.member.roles.cache.has(config.staffRole)) {
                    return interaction.reply({ content: '❌ Solo el staff puede transferir tickets.', ephemeral: true });
                }
                const channel = interaction.channel;
                const newChannel = await interaction.guild.channels.create({
                    name: `Head-${channel.name}`,
                    type: ChannelType.GuildText,
                    parent: config.ticketCategory,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionFlagsBits.ViewChannel],
                        },
                        {
                            id: config.headRole,
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                        },
                    ],
                });

                // Crear transcripción del ticket actual
                const messages = await channel.messages.fetch();
                let transcript = '';
                messages.reverse().forEach(msg => {
                    transcript += `${msg.author.tag} (${msg.createdAt.toLocaleString()}): ${msg.content}\n`;
                });

                // Enviar transcripción al nuevo canal
                const transcriptBuffer = Buffer.from(transcript, 'utf-8');
                await newChannel.send({
                    content: '📜 Transcripción del ticket anterior:',
                    files: [{ attachment: transcriptBuffer, name: 'transcript.txt' }]
                });

                await interaction.reply(`Ticket transferido a ${newChannel}`);
            }
            else if (interaction.customId === 'close_ticket') {
                const closeEmbed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setDescription('🔒 Este ticket será cerrado en 5 segundos...')
                    .setTimestamp();

                // Crear transcripción antes de cerrar
                const messages = await interaction.channel.messages.fetch();
                let transcript = '';
                messages.reverse().forEach(msg => {
                    transcript += `${msg.author.tag} (${msg.createdAt.toLocaleString()}): ${msg.content}\n`;
                });

                // Guardar transcripción
                const logChannel = interaction.guild.channels.cache.get(config.logChannel);
                if (logChannel) {
                    const transcriptBuffer = Buffer.from(transcript, 'utf-8');
                    await logChannel.send({
                        content: `📜 Transcripción del ticket ${interaction.channel.name}:`,
                        files: [{ attachment: transcriptBuffer, name: 'transcript.txt' }]
                    });
                }

                await interaction.reply({ embeds: [closeEmbed] });
                setTimeout(() => interaction.channel.delete(), 5000);
            }
        }
    },
};