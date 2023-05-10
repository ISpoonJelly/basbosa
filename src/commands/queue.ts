import { ChatInputCommandInteraction } from 'discord.js';
import { Pagination } from 'pagination.djs';
import { Command, interactionContext } from './command';

export class Queue extends Command {
  public description = 'Shoof el mwgood';

  public async handleInteraction(ctx: interactionContext) {
    const queue = this.getQueueInSameChannel(ctx);

    const queueTracks = queue.tracks.toArray();

    if (queueTracks.length < 1) {
      return ctx.interaction.reply({ content: 'Queue is empty.', ephemeral: true });
    }

    const pagination = new Pagination(ctx.interaction as ChatInputCommandInteraction<'cached'>, {
      limit: 10,
    });

    let tracksString = queueTracks.map((track, i) => `${i + 1}) [${track.duration}] ${track.title} - <@${track.requestedBy?.id}>`);
    if (queue.isPlaying() && queue.currentTrack) {
      const currentTrack = queue.currentTrack;
      const currentString = `**Currently Playing**: ${currentTrack.title} - <@${currentTrack.requestedBy?.id}>\n`;
      tracksString = [currentString, ...tracksString];
    }

    pagination.setDescriptions(tracksString);

    console.log('[Queue] queue: ', queueTracks.length);

    return pagination.render();
  }
}
