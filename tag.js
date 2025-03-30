const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Ruta al archivo donde se guardarán las etiquetas
const tagsFilePath = path.join(__dirname, '../data/tags.json');

// Asegurarse de que el directorio y el archivo existan
function ensureTagsFileExists() {
    const dir = path.dirname(tagsFilePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(tagsFilePath)) {
        fs.writeFileSync(tagsFilePath, JSON.stringify({}));
    }
}

// Cargar etiquetas
function loadTags() {
    ensureTagsFileExists();
    try {
        const data = fs.readFileSync(tagsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al cargar etiquetas:', error);
        return {};
    }
}

// Guardar etiquetas
function saveTags(tags) {
    try {
        fs.writeFileSync(tagsFilePath, JSON.stringify(tags, null, 2));
        return true;
    } catch (error) {
        console.error('Error al guardar etiquetas:', error);
        return false;
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tag')
        .setDescription('Gestiona etiquetas personalizadas')
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Crea una nueva etiqueta')
                .addStringOption(option =>
                    option.setName('nombre')
                        .setDescription('Nombre de la etiqueta')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('contenido')
                        .setDescription('Contenido de la etiqueta')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('edit')
                .setDescription('Edita una etiqueta existente')
                .addStringOption(option =>
                    option.setName('nombre')
                        .setDescription('Nombre de la etiqueta')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('contenido')
                        .setDescription('Nuevo contenido de la etiqueta')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Elimina una etiqueta')
                .addStringOption(option =>
                    option.setName('nombre')
                        .setDescription('Nombre de la etiqueta')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('show')
                .setDescription('Muestra una etiqueta')
                .addStringOption(option =>
                    option.setName('nombre')
                        .setDescription('Nombre de la etiqueta')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('Lista todas las etiquetas disponibles')),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const tags = loadTags();

        if (subcommand === 'create') {
            const name = interaction.options.getString('nombre').toLowerCase();
            const content = interaction.options.getString('contenido');

            if (tags[name]) {
                return interaction.reply({
                    content: `La etiqueta \`${name}\` ya existe. Usa \`/tag edit\` para modificarla.`,
                    ephemeral: true
                });
            }

            tags[name] = {
                content,
                creator: interaction.user.id,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            if (saveTags(tags)) {
                return interaction.reply(`Etiqueta \`${name}\` creada con éxito.`);
            } else {
                return interaction.reply({
                    content: 'Error al guardar la etiqueta.',
                    ephemeral: true
                });
            }
        }

        else if (subcommand === 'edit') {
            const name = interaction.options.getString('nombre').toLowerCase();
            const content = interaction.options.getString('contenido');

            if (!tags[name]) {
                return interaction.reply({
                    content: `La etiqueta \`${name}\` no existe.`,
                    ephemeral: true
                });
            }

            // Opcional: verificar si el usuario es el creador o tiene permisos de admin
            if (tags[name].creator !== interaction.user.id && !interaction.member.permissions.has('ADMINISTRATOR')) {
                return interaction.reply({
                    content: 'No tienes permiso para editar esta etiqueta.',
                    ephemeral: true
                });
            }

            tags[name].content = content;
            tags[name].updatedAt = new Date().toISOString();

            if (saveTags(tags)) {
                return interaction.reply(`Etiqueta \`${name}\` actualizada con éxito.`);
            } else {
                return interaction.reply({
                    content: 'Error al actualizar la etiqueta.',
                    ephemeral: true
                });
            }
        }

        else if (subcommand === 'delete') {
            const name = interaction.options.getString('nombre').toLowerCase();

            if (!tags[name]) {
                return interaction.reply({
                    content: `La etiqueta \`${name}\` no existe.`,
                    ephemeral: true
                });
            }

            // Opcional: verificar si el usuario es el creador o tiene permisos de admin
            if (tags[name].creator !== interaction.user.id && !interaction.member.permissions.has('ADMINISTRATOR')) {
                return interaction.reply({
                    content: 'No tienes permiso para eliminar esta etiqueta.',
                    ephemeral: true
                });
            }

            delete tags[name];

            if (saveTags(tags)) {
                return interaction.reply(`Etiqueta \`${name}\` eliminada con éxito.`);
            } else {
                return interaction.reply({
                    content: 'Error al eliminar la etiqueta.',
                    ephemeral: true
                });
            }
        }

        else if (subcommand === 'show') {
            const name = interaction.options.getString('nombre').toLowerCase();

            if (!tags[name]) {
                return interaction.reply({
                    content: `La etiqueta \`${name}\` no existe.`,
                    ephemeral: true
                });
            }

            return interaction.reply(tags[name].content);
        }

        else if (subcommand === 'list') {
            const tagNames = Object.keys(tags);

            if (tagNames.length === 0) {
                return interaction.reply('No hay etiquetas guardadas.');
            }

            const tagList = tagNames.sort().join(', ');
            return interaction.reply(`**Etiquetas disponibles:** ${tagList}`);
        }
    },
};