import { EmbedBuilder } from 'discord.js';
import { Command, interactionContext } from './command';

export class Queue extends Command {
  public description = 'Displays the queue.';

  public async handleInteraction(ctx: interactionContext) {
    const { interaction, player } = ctx;
    const userVoiceChannel = this.getInteractionMember(interaction).voice.channel;
    if (!userVoiceChannel) {
      throw new Error('You are not connected to a voice channel.');
    }

    const guild = this.getInteractionGuild(interaction);
    if (!player.isPlaying(guild, interaction.channel!)) {
      return interaction.reply('Queue is empty.');
    }

    const queueTracks = player.getQueue(guild, interaction.channel!).tracks;
    const currenctTrack = player.getQueue(guild, interaction.channel!).current;

    const queueTracksString = queueTracks
      .slice(0, 10)
      .map((track, i) => {
        return `${i + 1}) [${track.duration}] ${track.title} - <@${track.requestedBy.id}>`;
      })
      .join('\n');

    console.log('[Queue] queue: ', queueTracks.length);

    return interaction.reply({
      embeds: [
        new EmbedBuilder().setDescription(
          `**Currently Playing:**\n ${currenctTrack.title} - <@${currenctTrack.requestedBy.id}>\n\n**Queue:**\n${queueTracksString}`,
        ),
      ],
    });
  }
}
