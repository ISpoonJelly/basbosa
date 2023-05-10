import { EmbedBuilder } from 'discord.js';
import { Command, interactionContext } from './command';

export class NowPlaying extends Command {
  public description = "Eh el sha3'al da?";

  public async handleInteraction(ctx: interactionContext) {
    const queue = this.getQueueInSameChannel(ctx);

    if (!queue.isPlaying()) {
      return ctx.interaction.reply({ content: 'Nothing is playing', ephemeral: true });
    }

    const currenctTrack = queue.currentTrack;
    if (!currenctTrack) {
      return ctx.interaction.reply({ content: 'Nothing is playing', ephemeral: true });
    }
    const progress = queue.node.createProgressBar();

    console.log('[NowPlaying]', currenctTrack.title, currenctTrack?.id);
    return ctx.interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(currenctTrack.title)
          .setURL(currenctTrack.url)
          .setThumbnail(currenctTrack.thumbnail)
          .setAuthor({ name: currenctTrack.author })
          .setFields([{ name: '‎', value: progress || '' }]),
      ],
    });
  }
}
