import { QueryType, Queue, Track } from 'discord-player';
import { ChatInputCommandInteraction, EmbedBuilder, InteractionReplyOptions, SlashCommandBuilder, Colors } from 'discord.js';

import { Command, interactionContext } from './command';

export class Play extends Command {
  public description = 'Plays a song.';

  protected getSlackCommandBuilder() {
    const builder = super.getSlackCommandBuilder() as SlashCommandBuilder;
    return builder.addStringOption((option) => option.setName('query').setDescription('search query').setRequired(true));
  }

  public async handleInteraction(ctx: interactionContext) {
    const { interaction, player } = ctx;
    const userVoiceChannel = this.getInteractionMember(interaction).voice.channel;
    if (!userVoiceChannel) {
      throw new Error('You are not connected to a voice channel.');
    }

    const guild = this.getInteractionGuild(interaction);
    const queue = player.getQueue(guild, interaction.channel!);

    if (!queue.connection) {
      await queue.connect(userVoiceChannel);
    } else {
      if (queue.connection.channel.id !== userVoiceChannel.id) {
        throw new Error('You are not in the same voice channel as me.');
      }
    }

    await interaction.deferReply();

    const response = await this.handleSearchCommand({ interaction, player }, queue);
    await interaction.followUp(response);

    if (!queue.playing) await queue.play();
  }

  private async handleSearchCommand({ interaction, player }: interactionContext, queue: Queue): Promise<InteractionReplyOptions> {
    const songUrl = interaction.options.getString('query', true);

    const searchResult = await player.player.search(songUrl, {
      requestedBy: interaction.user,
      searchEngine: QueryType.AUTO,
    });

    if (!searchResult || searchResult.tracks.length === 0) {
      return { content: `❌ | no results found!` };
    }

    const track = searchResult.tracks[0];
    queue.addTrack(track);
    console.log('[Play] played: ', track.id, track.title);

    return this.getTrackEmbed(track);
  }

  private getTrackEmbed(track: Track) {
    const embed = new EmbedBuilder()
      .setTitle(track.title)
      .setURL(track.url)
      .setDescription(`Added by <@${track.requestedBy.id}>`)
      .setImage(track.thumbnail)
      .setFooter({ text: `Duration: ${track.duration}` })
      .setColor(Colors.DarkGreen)
      .setTimestamp(Date.now());

    return { embeds: [embed] };
  }
}
