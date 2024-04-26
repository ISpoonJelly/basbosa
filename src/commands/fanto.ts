import { QueryType } from 'discord-player';

import { Command, interactionContext } from './command';
import { shuffleArray } from '../utils';

const FANTO_URL = 'https://music.youtube.com/playlist?list=PLFjJ-GPUT9ZndpL9S-8irYD3Jjtb2k8mu&si=CMtUn1FigHn8sChf';

export class Fanto extends Command {
  public description = 'FANTO';

  public async handleInteraction(ctx: interactionContext) {
    const { interaction, player } = ctx;
    await this.connectToChannel(ctx);

    await interaction.deferReply({ ephemeral: true });

    const queue = this.getQueueInSameChannel(ctx);
    await queue.tasksQueue.acquire().getTask();

    const result = await player.search(FANTO_URL, {
      requestedBy: interaction.user,
      searchEngine: QueryType.YOUTUBE_PLAYLIST,
    });

    if (!result || !result.tracks || !result.playlist) {
      queue.tasksQueue.release();
      return interaction.followUp('msh mwgood :(');
    }
    const { tracks } = result;
    await queue.addTrack(shuffleArray(tracks));
    await interaction.followUp('FANTO!');

    try {
      if (!queue.isPlaying()) await queue.node.play();
    } finally {
      queue.tasksQueue.release();
    }
  }
}
