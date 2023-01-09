import { QueryType } from 'discord-player';

import { Command, interactionContext } from './command';

const AAAH_URL = 'https://www.youtube.com/watch?v=CelgqNnv0wU';

export class Aaaah extends Command {
  public description = 'AAAAH';

  public async handleInteraction(ctx: interactionContext) {
    const { interaction, player } = ctx;
    const userVoiceChannel = this.getMemberVoiceChannel(ctx);

    const guild = this.getInteractionGuild(ctx);
    const queue = player.getQueue(guild, interaction.channel!);

    if (!queue.connection) {
      await queue.connect(userVoiceChannel);
    } else if (queue.connection.channel.id !== userVoiceChannel.id) {
      throw Error(`Ysta t3ala **${queue.connection.channel.name}**`);
    }

    await interaction.deferReply({ ephemeral: true });
    const result = await player.player.search(AAAH_URL, {
      requestedBy: interaction.user,
      searchEngine: QueryType.YOUTUBE_VIDEO,
    });

    if (!result || result.tracks.length !== 1) {
      throw Error('AAAAAAAH!');
    }
    queue.addTrack(result.tracks[0]);
    await interaction.followUp('AAAAH!');

    if (!queue.playing) await queue.play();
  }
}
