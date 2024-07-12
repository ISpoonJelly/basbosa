import * as fs from 'fs';
import * as path from 'path';

import { Command, interactionContext } from './command';
import { Interaction, SlashCommandBuilder } from 'discord.js';
import { Presets } from './preset';

function isJelly(interaction: Interaction) {
    return interaction.member?.user.id === '185807061395701760'
}

export class Addpreset extends Command {
  public description = '7ot ya basha';

  protected getSlashCommandBuilder() {
    const builder = super.getSlashCommandBuilder() as SlashCommandBuilder;
    return builder
    .addStringOption(option => option
        .setName('name')
        .setDescription('esm el kareem')
        .setRequired(true)
    ).addStringOption(option => option
        .setName('url')
        .setDescription('el link yzmeely')
        .setRequired(true)
    )
  }

  public async handleInteraction(ctx: interactionContext) {
    const { interaction } = ctx;

    if(!isJelly(interaction)) {
        return interaction.reply('Jelly bs el y3rf yzmeely')
    }

    const name = interaction.options.getString('name', true).toUpperCase();
    const url = interaction.options.getString('url', true);
    
    await interaction.deferReply({ ephemeral: true });

    if(Object.fromEntries(Presets.presets)[name]) {
        return interaction.followUp(`${name} mwgood asln yzmeely`)
    }

    fs.appendFileSync(path.resolve('./data/presets.data'), `\n${[name, url].join(';')}`, 'utf-8')
    Presets.presets = Presets.loadPresets()

    return interaction.followUp('tmam yzmeely');
  }
}
