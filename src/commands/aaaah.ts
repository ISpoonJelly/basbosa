import { QueryType } from 'discord-player';

import { Command, interactionContext } from './command';

const AAAH_URL = 'https://www.youtube.com/watch?v=ljWQpPUw3q4';

export class Aaaah extends Command {
  public description = 'AAAAH';

  public async handleInteraction(ctx: interactionContext) {
    const { interaction, player } = ctx;
    await this.connectToChannel(ctx)

    await interaction.deferReply({ ephemeral: true });

    const queue = this.getQueueInSameChannel(ctx)
    await queue.tasksQueue.acquire().getTask()

    const result = await player.search(AAAH_URL, {
      requestedBy: interaction.user,
      searchEngine: QueryType.YOUTUBE_VIDEO,
    });

    if (!result || result.tracks.length !== 1) {
      queue.tasksQueue.release()
      return interaction.followUp('msh mwgood :(');
    }
      queue.addTrack(result.tracks[0]);
      await interaction.followUp('AAAAH!');

    try {
      if (!queue.isPlaying()) await queue.node.play();
    } finally {
      queue.tasksQueue.release()
    }
  }
}
