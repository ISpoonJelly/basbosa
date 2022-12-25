import { EmbedBuilder } from 'discord.js';
import { Command, interactionContext } from './command';

export class Queue extends Command {
  public description = 'Shoof el mwgood';

  public async handleInteraction(ctx: interactionContext) {
    const queue = this.getQueueInSameChannel(ctx);

    const currenctTrack = queue.current;
    const queueTracks = queue.tracks;

    if (!queue.playing || queueTracks.length < 1) {
      return ctx.interaction.reply('Queue is empty.');
    }

    const queueTracksString = queueTracks
      .slice(0, 10)
      .map((track, i) => {
        return `${i + 1}) [${track.duration}] ${track.title} - <@${track.requestedBy.id}>`;
      })
      .join('\n');

    console.log('[Queue] queue: ', queueTracks.length);

    return ctx.interaction.reply({
      embeds: [
        new EmbedBuilder().setDescription(
          `**Currently Playing:**\n ${currenctTrack.title} - <@${currenctTrack.requestedBy.id}>\n\n**Queue:**\n${queueTracksString}`,
        ),
      ],
    });
  }
}
