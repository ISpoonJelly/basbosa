import { QueryType } from 'discord-player';

import { Command, interactionContext } from './command';
import { SlashCommandBuilder } from 'discord.js';

const presets = {
    'AAAAH': 'https://www.youtube.com/watch?v=ljWQpPUw3q4',
    'SANTA': 'https://www.youtube.com/watch?v=dq9-OUWTcpI',
    'MAGAL': 'https://www.youtube.com/watch?v=peOi2IL4XPs',
    'SH7TA': 'https://www.youtube.com/watch?v=15VAMWokTf0',
};

export class Presets extends Command {
  public description = 'mahroosh';

  protected getSlackCommandBuilder() {
    const builder = super.getSlackCommandBuilder() as SlashCommandBuilder;
    return builder
      .addStringOption((option) => option
        .setName('name')
        .setDescription('3yz tsma3 eh')
        .addChoices(...Object.entries(presets).map(([k,v]) => ({ name: k, value: v })))
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
}
