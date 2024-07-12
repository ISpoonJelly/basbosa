import { QueryType } from 'discord-player';
import * as fs from 'fs';
import * as path from 'path';

import { Command, interactionContext } from './command';
import { AutocompleteInteraction, SlashCommandBuilder } from 'discord.js';

export class Presets extends Command {
  public description = 'mahroosh';

  public static presets: string[][] = this.loadPresets()

  public static loadPresets() {
    const presetsFile = fs.readFileSync(path.resolve('./data/presets.data'), 'utf8');
    return presetsFile.split('\n').map(l => l.split(';'))
  }

  protected getSlashCommandBuilder() {
    const builder = super.getSlashCommandBuilder() as SlashCommandBuilder;
    return builder
      .addStringOption((option) => option
        .setName('name')
        .setDescription('3yz tsma3 eh')
        .setAutocomplete(true)
        .setRequired(true)
    )
  }

  public async handleInteraction(ctx: interactionContext) {
    const { interaction, player } = ctx;
    await this.connectToChannel(ctx);

    const presetUrl = interaction.options.getString('name', true);

    await interaction.deferReply({ ephemeral: true });

    const queue = this.getQueueInSameChannel(ctx);
    await queue.tasksQueue.acquire().getTask();

    const result = await player.search(presetUrl, {
      requestedBy: interaction.user,
      searchEngine: QueryType.YOUTUBE_VIDEO,
    });

    if (!result || result.tracks.length !== 1) {
      queue.tasksQueue.release();
      return interaction.followUp('msh mwgood :(');
    }
    queue.addTrack(result.tracks[0]);
    await interaction.followUp('waddy ya zmeely ;)');

    try {
      if (!queue.isPlaying()) await queue.node.play();
    } finally {
      queue.tasksQueue.release();
    }
  }

  public async handleAutoComplete({ interaction }: { interaction: AutocompleteInteraction }): Promise<any> {
    const query = interaction.options.getFocused();
    const filtered = Presets.presets.filter(([p]) => p.toLowerCase().startsWith(query.toLowerCase()));
    await interaction.respond(filtered.map(([name, value]) => ({ name, value })))
  }
}
