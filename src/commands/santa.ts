import { QueryType } from 'discord-player';

import { Command, interactionContext } from './command';

const SANTA_URL = 'https://www.youtube.com/watch?v=dq9-OUWTcpI';

export class Santa extends Command {
  public description = 'SANTA';

  public async handleInteraction(ctx: interactionContext) {
    const { interaction, player } = ctx;
    await this.connectToChannel(ctx);

    await interaction.deferReply({ ephemeral: true });

    const queue = this.getQueueInSameChannel(ctx);
    await queue.tasksQueue.acquire().getTask();

    const result = await player.search(SANTA_URL, {
      requestedBy: interaction.user,
      searchEngine: QueryType.YOUTUBE_VIDEO,
    });

    if (!result || result.tracks.length !== 1) {
      queue.tasksQueue.release();
      return interaction.followUp('msh mwgood :(');
    }
    queue.addTrack(result.tracks[0]);
    await interaction.followUp('SANTA!');

    try {
      if (!queue.isPlaying()) await queue.node.play();
    } finally {
      queue.tasksQueue.release();
    }
  }
}
